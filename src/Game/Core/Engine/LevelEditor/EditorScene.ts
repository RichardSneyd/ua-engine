import Debug from "../Debug";
import ILevel from '../Activities/ILevel';

import MathUtils from '../Utils/MathUtils';
import LevelManager from "../LevelManager";
import GOFactory from "../GameObjects/GOFactory";
import Loader from "../Loader";
import UIAccordion from "./UIAccordion";
import ExportData from './ExportData';
import Loop from "../Loop";
import SpriteObject from "../GameObjects/SpriteObject";
import PxGame from "../../../Services/Pixi/PxGame";
import Inspector from "./Inspector";
import SceneEvents from "../Activities/SceneEvents";
import ContainerObject from "../GameObjects/ContainerObject";


// build the visual of the editor here, like an activity level....
class EditorScene implements ILevel {
    private _loader: Loader;
    private _manager: LevelManager;
    private _goFactory: GOFactory;
    private _events: SceneEvents;
    private _accordion: UIAccordion;
    private _exportData: ExportData;
    private _loop: Loop;
    protected _pxGame: PxGame;
    protected _inspector: Inspector;
    _math: MathUtils;

    public bgdName: string;
    protected _bgd: SpriteObject;
    protected _zoneContainer: ContainerObject;
    protected _playgroundContainer: ContainerObject;
    protected imgList: any[] = [];
    protected spineList: string[] = [];
    protected _imgGameObjects: any[] = [];
    protected _spineGameObjects: any[] = [];
    protected _dropzoneGameObjects: any[] = [];
    protected _hotspotGameObjects: any[] = [];
    protected _downloadData: any;

    protected selectedGO: any;
    protected xOffset: number = 0;
    protected yOffset: number = 0;
    protected dragging: boolean = false;
    protected selectedGOBorder: PIXI.Graphics;

    protected _resize: boolean = false;
    protected _resizeOffsetX: number = 0;
    protected _resizeOffsetY: number = 0;

    constructor(loader: Loader, manager: LevelManager, loop: Loop, goFactory: GOFactory,
        pxGame: PxGame, accordion: UIAccordion, exportData: ExportData, inspector: Inspector, events: SceneEvents, math: MathUtils) {
        this._loader = loader;
        this._manager = manager;
        this._goFactory = goFactory;
        this._events = events;
        this._pxGame = pxGame;
        this._loop = loop;
        this._math = math;
        this._accordion = accordion;
        this._exportData = exportData;
        this._inspector = inspector;
    }

    init(): void {
        Debug.info('Editor.init');

        this._loop.addFunction(this.update, this);
        this._loop.start();

        this._manager.globalEvents.on('gameobj_clicked', this._panelImageClicked, this);
        this._manager.globalEvents.on('input_changed', this._inputChanged, this);

        this.preload();
    }

    get events() {
        return this._events;
    }

    preload(): void {
        Debug.info('Editor.preload');

        this.start();
    }

    start(): void {
        Debug.info('Editor.start');
        this._waitForFirstInput();

        // TODO: build editor UI and populate GameObject panels
        this._createBackground();

        /* UI Accordion */
        this._accordion.createContainer();

        // Create rows here
        this.addImagesRow();
        this.addSpinesRow();
        this._addDropzonesRow();
        this._addHotspotsRow();

        /* Download Button */
        this._exportData.createDownloadButton();

        /* Inspector UI */
        this._inspector.createInspector();

        /* Handle Inputs */
        this._addInputManager();

        this._playgroundContainer = this._goFactory.container(0, 0);
        this._zoneContainer = this._goFactory.container(0, 0);
    }

    _createBackground() {
        Debug.warn("bgName:", this.bgdName);
        if (this.bgdName !== null || this.bgdName !== undefined || this.bgdName !== "") {
            this._bgd = this._goFactory.sprite(0, 0, this.bgdName);
            this._bgd.setOrigin(0);
        }

        this._enableBackgroundDnd();
    }

    _enableBackgroundDnd() {
        let canvas = document.getElementsByTagName("canvas");

        canvas[0]!.addEventListener("dragover", (event) => event.preventDefault(), true);
        canvas[0]!.addEventListener("drop", (event) => {
            event.preventDefault();

            if (event.dataTransfer!.items) {
                for (let i = 0; i < event.dataTransfer!.items.length; i++) {
                    if (event.dataTransfer!.items[i].kind === 'file') {
                        let file = event.dataTransfer!.items[i].getAsFile();
                        let reader = new FileReader();
                        reader.readAsDataURL(file!);
                        reader.onloadend = () => {
                            //Debug.warn("bgd base64: ", reader.result);
                            this._loader.addImage(`${reader.result}`, true, file!.name);
                            this._loader.download().then(() => {
                                let texture = this._loader.getTexture(`${reader.result}`, null, false);
                                this._bgd.changeTexture(texture);
                            });
                        }
                    }
                }
            }
        }, true);
    }

    _panelImageClicked({ src, type, name }: { src: string, type: string, name: string }) {
        let _tryName = (arr: any[], prefix: string, index: number): string => {
            if (arr.length > 0) {
                let count: number = 0;
                arr.forEach((val) => {
                    if (val.name == prefix) {
                        ++count;
                    }
                })

                let unique: boolean = true;
                for (let t = 0; t < arr.length; t++) {

                    if (count === 0) {
                        return prefix;
                    }
                    else {
                        if (arr[t].name == `${prefix}_${index}`) {
                            unique = false;
                            break;
                        }
                    }
                }
                if (!unique) return _tryName(arr, prefix, index + 1);

                return (`${prefix}_${index}`);
            }
            else {
                return `${prefix}`;
            }
        };

        let _orderName = (arr: any[], prefix: string, index: number): string => {
            let unique: boolean = true;

            for (let t = 0; t < arr.length; t++) {
                if (arr[t].name == `${prefix}${index}`) {
                    unique = false;
                    break;
                };
            }

            if (!unique) return _orderName(arr, prefix, index + 1);
            return (`${prefix}${index}`);
        }

        let gameobj: any;
        if (type === "image") {
            gameobj = this._goFactory.sprite(500, 500, src);
            this._playgroundContainer.addChild(gameobj);
            gameobj.setOrigin(.5);
            gameobj.objType = `${type}`;
            let uniqName = _tryName(this._imgGameObjects, `${name}`, 2);
            gameobj.uniqName = uniqName;

            this._imgGameObjects.push({ name: gameobj.uniqName, filename: name, gameObj: gameobj, type: type });
            gameobj.objID = this._imgGameObjects.length - 1;

            this._inspector.setInputReadOnly('width', true);
            this._inspector.setInputReadOnly('height', true);
        }
        else if (type === "spine") {
            gameobj = this._goFactory.spine(500, 500, name);
            this._playgroundContainer.addChild(gameobj);
            gameobj.objType = `${type}`;
            let uniqName = _tryName(this._spineGameObjects, `${name}`, 2);
            gameobj.uniqName = uniqName;
            let defaultAnimState = gameobj.animations.animationNames[0];
            gameobj.animations.play(`${defaultAnimState}`, true);

            this._spineGameObjects.push({ name: gameobj.uniqName, filename: name, gameObj: gameobj, type: type });
            gameobj.objID = this._spineGameObjects.length - 1;

            this._inspector.setInputReadOnly('width', true);
            this._inspector.setInputReadOnly('height', true);
        }
        else if (type === "dropzone") {
            gameobj = this._goFactory.nineSlice(660, 240, name, 4, 4, 4, 4, 300, 200);
            this._zoneContainer.addChild(gameobj);
            gameobj.objType = `${type}`;
            let uniqName = _orderName(this._dropzoneGameObjects, `${name.charAt(0)}`, 1);
            gameobj.uniqName = uniqName;

            this._dropzoneGameObjects.push({ name: gameobj.uniqName, gameObj: gameobj, type: type });
            gameobj.objID = this._dropzoneGameObjects.length - 1;

            this._inspector.setInputReadOnly('width', false);
            this._inspector.setInputReadOnly('height', false);
        }
        else if (type === "hotspot") {
            gameobj = this._goFactory.nineSlice(660, 240, name, 4, 4, 4, 4, 300, 200);
            this._zoneContainer.addChild(gameobj);
            gameobj.objType = `${type}`;
            let uniqName = _orderName(this._hotspotGameObjects, `${name.charAt(0)}`, 1);
            gameobj.uniqName = uniqName;

            this._hotspotGameObjects.push({ name: gameobj.uniqName, gameObj: gameobj, type: type });
            gameobj.objID = this._hotspotGameObjects.length - 1;

            this._inspector.setInputReadOnly('width', false);
            this._inspector.setInputReadOnly('height', false);
        }

        gameobj.input.enableInput();
        gameobj.input.addInputListener('pointerdown', () => {
            this.selectedGO = gameobj;
            this.selectedGO.uniqName = gameobj.uniqName;
            this._inspector.setInputValue("name", this.selectedGO.uniqName);

            if (gameobj.objType === 'image' || gameobj.objType === 'spine') {
                this.xOffset = gameobj.x - this._manager.input.pointer.x;
                this.yOffset = gameobj.y - this._manager.input.pointer.y;

                this.addGameObjSelectionBorder(gameobj.x, gameobj.y, gameobj.width, gameobj.height);
                this.dragging = true;

                this._inspector.setInputReadOnly('width', true);
                this._inspector.setInputReadOnly('height', true);
            }

            if (gameobj.objType === 'dropzone' || gameobj.objType === 'hotspot') {
                Debug.info("selectBorder:", this.selectedGOBorder);
                if (this.selectedGOBorder) { this.selectedGOBorder.alpha = 0; }

                let mouseX = this._manager.input.pointer.x;
                let mouseY = this._manager.input.pointer.y;

                Debug.info("distance between: ", this._math.distanceBetween(gameobj.right, gameobj.bottom, mouseX, mouseY));
                Debug.info('RIGHT: ', gameobj.right);
                Debug.info('BOTTOM: ', gameobj.bottom);
                if (this._math.distanceBetween(gameobj.right, gameobj.bottom, mouseX, mouseY) < 70) {
                    this._resizeOffsetX = gameobj.right - this._manager.input.pointer.x;
                    this._resizeOffsetY = gameobj.bottom - this._manager.input.pointer.y;
                    this._resize = true;
                }
                else {
                    this.dragging = true;
                    this.xOffset = gameobj.x - this._manager.input.pointer.x;
                    this.yOffset = gameobj.y - this._manager.input.pointer.y;
                }

                this._inspector.setInputReadOnly('width', false);
                this._inspector.setInputReadOnly('height', false);

                /* this._inspector.setInputValue('width', this.selectedGO.width);
                this._inspector.setInputValue('height', this.selectedGO.height); */
            }

        }, this);
        gameobj.input.addInputListener('pointerup', () => {
            this.dragging = false;
            this._resize = false;
        }, this);
    }


    _inputChanged({ prop, val }: { prop: string, val: number }) {
        Debug.info(`prop: ${prop} val: ${val}`);

        if (prop === "name") {
            Debug.warn("objType:", this.selectedGO.objType);
            Debug.warn("objID:", this.selectedGO.objID);
            //this.selectedGO.textureName = val;
        }
        else if (prop === "x") {
            this.selectedGO.x = val;
        }
        else if (prop === "y") {
            this.selectedGO.y = val;
        }
        else if (prop === "angle") {
            this.selectedGO.angle = val;
        }
        else if (prop === "origin x") {
            this.selectedGO.origin.x = val;
        }
        else if (prop === "origin y") {
            this.selectedGO.origin.y = val;
        }
        else if (prop === "width") {
            this.selectedGO.width = val;
        }
        else if (prop === "height") {
            this.selectedGO.height = val;
        }
    }

    private _addInputManager() {
        this._exportData.downloadBtn.addEventListener('click', (event) => {
            this._addDataDownloadLink();
        });

        window.addEventListener(
            "keydown", (input) => {
                let moveUnit: number = 5;
                Debug.info('key: ', input.key);
                if (this.selectedGO !== null || this.selectedGO !== undefined) {
                    if (input.key === "ArrowUp") {
                        this.selectedGO.y -= moveUnit;
                        this._inspector.setInputValue('y', this.selectedGO.y);
                    }
                    else if (input.key === "ArrowDown") {
                        this.selectedGO.y += moveUnit;
                        this._inspector.setInputValue('y', this.selectedGO.y);
                    }
                    else if (input.key === "ArrowLeft") {
                        this.selectedGO.x -= moveUnit;
                        this._inspector.setInputValue('x', this.selectedGO.x);
                    }
                    else if (input.key === "ArrowRight") {
                        this.selectedGO.x += moveUnit;
                        this._inspector.setInputValue('x', this.selectedGO.x);
                    }
                }
            }, false
        );
        window.addEventListener(
            "keyup", (input) => {
                if (input.key === "Delete") {
                    this.selectedGO.visible = false;
                    this.selectedGO.alpha = 0;
                    this.selectedGOBorder.alpha = 0;
                    this.selectedGOBorder.visible = false;
                    // TODO: remove specific selected gameobject from spine or image list for the download data
                    if (this.selectedGO.objType === 'image') {
                        this._imgGameObjects.splice(this.selectedGO.objID, 1);
                        //Debug.info('IMAGES:', this._imgGameObjects);
                    }
                    if (this.selectedGO.objType === 'spine') {
                        this._spineGameObjects.splice(this.selectedGO.objID, 1);
                        //Debug.info('SPINES:', this._spineGameObjects);
                    }
                    if (this.selectedGO.objType === 'dropzone') {
                        this._dropzoneGameObjects.splice(this.selectedGO.objID, 1);
                        //Debug.info('DROPZONES:', this._spineGameObjects);
                    }
                    if (this.selectedGO.objType === 'hotspot') {
                        this._hotspotGameObjects.splice(this.selectedGO.objID, 1);
                        //Debug.info('HOTSPOTS:', this._spineGameObjects);
                    }
                }
            }, false);
    }

    protected _addDataDownloadLink(): void {
        let gameObjectData: any = {
            sprites: [],
            spines: [],
            dropzones: [],
            hotspots: []
        };

        this._imgGameObjects.forEach((obj) => {
            gameObjectData.sprites.push({
                name: obj.name, filename: obj.filename, x: obj.gameObj.x, y: obj.gameObj.y,
                originX: obj.gameObj.origin.x, originY: obj.gameObj.origin.y, scaleX: obj.gameObj.scaleHandler.x, scaleY: obj.gameObj.scaleHandler.y,
                angle: obj.gameObj.angle, hitShape: ""
            });
        });

        this._spineGameObjects.forEach((obj) => {
            gameObjectData.spines.push({
                name: obj.name, filename: obj.filename, x: obj.gameObj.x, y: obj.gameObj.y,
                originX: obj.gameObj.origin.x, originY: obj.gameObj.origin.y, scaleX: obj.gameObj.scaleHandler.x, scaleY: obj.gameObj.scaleHandler.y,
                angle: obj.gameObj.angle, hitShape: ""
            });
        });

        this._dropzoneGameObjects.forEach((obj) => {
            gameObjectData.dropzones.push({
                type: 'rect',// make this dynamic once other shapes are in
                name: obj.name, x: obj.gameObj.x, y: obj.gameObj.y,
                width: obj.gameObj.width, height: obj.gameObj.height,
            });
        });

        this._hotspotGameObjects.forEach((obj) => {
            gameObjectData.hotspots.push({
                type: 'rect',// make this dynamic once other shapes are in
                name: obj.name, x: obj.gameObj.x, y: obj.gameObj.y,
                width: obj.gameObj.width, height: obj.gameObj.height,
            });
        });

        this._exportData.downloadData = gameObjectData;
        Debug.info("GameObjData: ", gameObjectData);
        this._exportData.exportJSONData();
    }

    addGameObjSelectionBorder(x: number, y: number, width: number, height: number): void {
        if (this.selectedGOBorder === null || this.selectedGOBorder === undefined) {
            this.selectedGOBorder = this._pxGame.addRectangle(
                x,
                y,
                width,
                height,
                0xCF19B9,
                0,
                2,
                0x77FE79,
                1
            );
            this.selectedGOBorder.pivot.set(this.selectedGO.x + (this.selectedGO.width / 2), this.selectedGO.y + (this.selectedGO.height / 2));
        }
        else {
            this.selectedGOBorder.alpha = 1;
            this.selectedGOBorder.visible = true;
        }
    }

    addImagesRow(): void {
        let imgListFiltered = this._loader.resList.filter(res => res.type === 'img' && res.ext === 'png');
        imgListFiltered.forEach(val => this.imgList.push({ src: val.url, name: val.basename }));

        this._accordion.addRow('Images', 'image', ...this.imgList);
    }

    addSpinesRow(): void {
        let spineListFiltered = this._loader.resList.filter(res => res.type === 'spn');
        spineListFiltered.forEach(val => this.spineList.push(val.url));

        Debug.warn("FilteredSpines:", spineListFiltered);

        let spinePixels: any = [];
        let spineResults: any[] = [];
        spineListFiltered.forEach((val) => {
            let spnSrc = this._goFactory.spine(500, 500, `${val.basename}`);
            spnSrc.scaleHandler.setScale(.5);
            setTimeout(() => spnSrc.alpha = 0, 50); // we don't want to show not active spine objects, this trick did the work
            spinePixels.push(spnSrc.data);
        });

        for (let i = 0; i < spinePixels.length; i++) {
            let res = this._pxGame.toImgElement(spinePixels[i]);

            spineResults.push({ src: res.src, name: spineListFiltered[i].basename });

            if (i === spinePixels.length - 1) {
                this._accordion.addRow('Spines', 'spine', ...spineResults);
            }

        }
    }

    _addDropzonesRow(): void {
        this._loader.addImage('../editor/dropzone.png', true);
        let dropzoneList: any[] = [{ src: 'assets/editor/dropzone.png', name: 'dropzone' }];
        this._accordion.addRow('Dropzones', 'dropzone', ...dropzoneList);
        //Debug.info("dropzoneList: ", dropzoneList);
    }

    _addHotspotsRow(): void {
        this._loader.addImage('../editor/hotspot.png', true);
        this._loader.download().then(() => {
            this._accordion.removeAllSelections();
            this._accordion.uncollapseAll();
        });

        let hotspotList: any[] = [{ src: 'assets/editor/hotspot.png', name: 'hotspot' }];
        this._accordion.addRow('Hotspots', 'hotspot', ...hotspotList);
        //Debug.info("hotspotList: ", hotspotList);
    }

    update(_time: number): void {

        if (this.dragging) {
            this.selectedGO.moveToMouse(this.xOffset, this.yOffset);

            if ((this.selectedGO.objType === 'image' || this.selectedGO.objType === 'spine')) {
                this.selectedGOBorder.x = this.selectedGO.x;
                this.selectedGOBorder.y = this.selectedGO.y;
            }

            this._inspector.setInputValue('x', this.selectedGO.x);
            this._inspector.setInputValue('y', this.selectedGO.y);
            this._inspector.setInputValue('origin x', this.selectedGO.origin.x);
            this._inspector.setInputValue('origin y', this.selectedGO.origin.y);
            this._inspector.setInputValue('scale x', this.selectedGO.scaleHandler.x);
            this._inspector.setInputValue('scale y', this.selectedGO.scaleHandler.y);
            this._inspector.setInputValue('angle', this.selectedGO.angle);
        }

        if (this._resize && (this.selectedGO.objType === 'dropzone' || this.selectedGO.objType === 'hotspot')) {
            let xDiff = this._manager.input.pointer.x - this.selectedGO.right;
            let yDiff = this._manager.input.pointer.y - this.selectedGO.bottom;
            this.selectedGO.width = this.selectedGO.width + this._resizeOffsetX + xDiff;
            this.selectedGO.height = this.selectedGO.height + this._resizeOffsetY + yDiff;

            Debug.info(`${this.selectedGO.width} -  ${this.selectedGO.width}`);

            this._inspector.setInputValue('width', this.selectedGO.width);
            this._inspector.setInputValue('height', this.selectedGO.height);
        }



        if (this.selectedGO && this.selectedGO.alpha !== 0) {
            this.selectedGO.scaleHandler.setScale(this._inspector.getInputValue('scale x'), this._inspector.getInputValue('scale y'));

            if ((this.selectedGO.objType === 'image' || this.selectedGO.objType === 'spine')) {
                this.selectedGOBorder.x = this.selectedGO.x;
                this.selectedGOBorder.y = this.selectedGO.y;
                this.selectedGOBorder.width = this.selectedGO.scaleHandler.x * this.selectedGO.width;
                this.selectedGOBorder.height = this.selectedGO.scaleHandler.y * this.selectedGO.height;
            }

            this.selectedGO.uniqName = this._inspector.getInputValue('name');
        }
    }

    shutdown(): void {
        Debug.info('Editor.shutdown');
    }

    // added to comply with ILevel - but probably not needed
    onNewRow(): void {
        Debug.info('Editor.onNewRow');
    }

    // added to comply with ILevel - but probably not needed
    loadConfig(): void {
        Debug.info('Editor.loadConfig');
    }

    // added to comply with ILevel - but probably not needed
    _waitForFirstInput(): void {
        Debug.info('Editor.waitForFirstInput');
    }
}

export default EditorScene;