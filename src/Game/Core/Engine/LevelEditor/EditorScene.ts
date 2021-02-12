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
import TextObject from "../GameObjects/TextObject";
import ImportData from "./ImportData";
import SliceObject from "../GameObjects/SliceObject";


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
    protected _math: MathUtils;
    protected _importData: ImportData;


    public bgdName: string;
    protected _bgd: SpriteObject;
    protected _foregroundContainer: ContainerObject;
    protected _zoneContainer: ContainerObject;
    protected _playgroundContainer: ContainerObject;
    protected imgList: any[] = [];
    protected spineList: string[] = [];
    protected _imgGameObjects: any[] = [];
    protected _spineGameObjects: any[] = [];
    protected _atlasGameObjects: any[] = [];
    protected _dropzoneGameObjects: any[] = [];
    protected _hotspotGameObjects: any[] = [];
    protected _downloadData: any;

    protected selectedGO: any;
    protected xOffset: number = 0;
    protected yOffset: number = 0;
    protected dragging: boolean = false;
    protected selectedGOBorder: SliceObject;

    protected _resize: boolean = false;
    protected _resizeOffsetX: number = 0;
    protected _resizeOffsetY: number = 0;
    protected _fontStyle: any = {
        fontFamily: 'gothic',
        fill: 'white',
        fontSize: '30px',
        fontWeight: 'bold'
    };

    constructor(loader: Loader, manager: LevelManager, loop: Loop, goFactory: GOFactory,
        pxGame: PxGame, accordion: UIAccordion, exportData: ExportData, inspector: Inspector, events: SceneEvents, math: MathUtils, importData: ImportData) {
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
        this._importData = importData;
    }

    init(): void {
        Debug.info('Editor.init');

        this._loop.addFunction(this.update, this);
        this._loop.start();

        this._manager.globalEvents.on('gameobj_clicked', this._panelImageClicked, this);
        this._manager.globalEvents.on('input_changed', this._inputChanged, this);
        this._manager.globalEvents.on('data_imported', this._dataImported, this);

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
        this._addImagesRow();
        this._addSpinesRow();
        this._addAtlasesRow();
        this._addDropzonesRow();
        this._addHotspotsRow();

        /* Download & Import Buttons */
        this._exportData.createDownloadButton();
        this._importData.createImportButton();

        /* Inspector UI */
        this._inspector.createInspector();

        /* Handle Inputs */
        this._addInputManager();

        /* Containers */
        this._foregroundContainer = this._goFactory.container(0, 0);
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

    protected _tryName(arr: any[], prefix: string, index: number): string {
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
            if (!unique) return this._tryName(arr, prefix, index + 1);

            return (`${prefix}_${index}`);
        }
        else {
            return `${prefix}`;
        }
    }

    protected _orderName(arr: any[], prefix: string, index: number): string {
        let unique: boolean = true;

        for (let t = 0; t < arr.length; t++) {
            if (arr[t].name == `${prefix}${index}`) {
                unique = false;
                break;
            };
        }

        if (!unique) return this._orderName(arr, prefix, index + 1);
        return (`${prefix}${index}`);
    }

    _panelImageClicked({ src, type, name }: { src: string, type: string, name: string }) {
        this._addGameObject(src, type, name);
    }

    protected _addGameObject(src: string, type: string, name: string, options: any = { x: 660, y: 240, width: 300, height: 200, angle: 0, originX: 0, originY: 0, scaleX: 1, scaleY: 1 }) {
        //Debug.warn("x y: ", name, options?.x, options?.y, options?.angle, options?.originX, options?.originY);
        let gameobj: any;
        if (type === "image") {
            gameobj = this._goFactory.sprite(options.x, options.y, src, null, this._playgroundContainer);
            gameobj.scaleHandler.setScale(options?.scaleX, options?.scaleY);
            gameobj.setOrigin(options?.originX, options?.originY);
            gameobj.angle = options.angle;
            gameobj.objType = `${type}`;
            let uniqName = this._tryName(this._imgGameObjects, `${name}`, 2);
            gameobj.uniqName = uniqName;

            this._imgGameObjects.push({ name: gameobj.uniqName, filename: name, gameObj: gameobj, type: type });
            gameobj.objID = this._imgGameObjects.length - 1;

            this._inspector.setInputReadOnly('width', true);
            this._inspector.setInputReadOnly('height', true);
        }
        else if (type === "spine") {
            gameobj = this._goFactory.spine(options.x, options.y, name, this._playgroundContainer);
            gameobj.scaleHandler.setScale(options?.scaleX, options?.scaleY);
            gameobj.objType = `${type}`;
            let uniqName = this._tryName(this._spineGameObjects, `${name}`, 2);
            gameobj.uniqName = uniqName;
            let defaultAnimState = gameobj.animations.animationNames[0];
            gameobj.animations.play(`${defaultAnimState}`, true);

            this._spineGameObjects.push({ name: gameobj.uniqName, filename: name, gameObj: gameobj, type: type });
            gameobj.objID = this._spineGameObjects.length - 1;

            this._inspector.setInputReadOnly('width', true);
            this._inspector.setInputReadOnly('height', true);
        }
        else if (type === "atlas") {
            gameobj = this._goFactory.sprite(options.x, options.y, `${name}`, '', this._playgroundContainer);
            gameobj.scaleHandler.setScale(options?.scaleX, options?.scaleY);
            gameobj.setOrigin(options?.originX, options?.originY);

            gameobj.objType = `${type}`;
            let uniqName = this._tryName(this._atlasGameObjects, `${name}`, 2);
            gameobj.uniqName = uniqName;
            gameobj.animations.importAnimations(); // this will automatically parse the frames in the json file and create animations based on the prefixes
            gameobj.animations.play(gameobj.animations.animationNames[0], true);

            this._atlasGameObjects.push({ name: gameobj.uniqName, filename: name, gameObj: gameobj, type: type });
            gameobj.objID = this._atlasGameObjects.length - 1;

            this._inspector.setInputReadOnly('width', true);
            this._inspector.setInputReadOnly('height', true);
        }
        else if (type === "dropzone") {
            gameobj = this._goFactory.nineSlice(options.x, options.y, 'dropzone', 4, 4, 4, 4, options.width, options.height, this._zoneContainer);
            gameobj.objType = `${type}`;
            let uniqName = this._orderName(this._dropzoneGameObjects, `${name.charAt(0)}`, 1);
            gameobj.uniqName = uniqName;

            let followText: TextObject = this._goFactory.text(gameobj.x / 2 - gameobj.width / 2, gameobj.y / 2 - gameobj.height / 2 + 40, gameobj.uniqName, this._fontStyle, gameobj);
            followText.setOrigin(1);
            gameobj.followText = followText;
            gameobj.followText.x = 30 + gameobj.width / 2;
            gameobj.followText.y = 30 + gameobj.height / 2;

            this._dropzoneGameObjects.push({ name: gameobj.uniqName, gameObj: gameobj, type: type });
            gameobj.objID = this._dropzoneGameObjects.length - 1;

            this._inspector.setInputReadOnly('width', false);
            this._inspector.setInputReadOnly('height', false);
        }
        else if (type === "hotspot") {
            gameobj = this._goFactory.nineSlice(options.x, options.y, 'hotspot', 4, 4, 4, 4, options.width, options.height, this._zoneContainer);
            gameobj.objType = `${type}`;
            let uniqName = this._orderName(this._hotspotGameObjects, `${name.charAt(0)}`, 1);
            gameobj.uniqName = uniqName;

            let followText: TextObject = this._goFactory.text(gameobj.x / 2 - gameobj.width / 2, gameobj.y / 2 - gameobj.height / 2 + 40, gameobj.uniqName, this._fontStyle, gameobj);
            followText.setOrigin(1);
            gameobj.followText = followText;
            gameobj.followText.x = 30 + gameobj.width / 2;
            gameobj.followText.y = 30 + gameobj.height / 2;

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
            this._inspector.setInputValue("zIndex", this.selectedGO.zIndex);
            this._inspector.setInputValue("x origin", this.selectedGO.origin.x);
            this._inspector.setInputValue("y origin", this.selectedGO.origin.y);

            if (gameobj.objType === 'image' || gameobj.objType === 'spine' || gameobj.objType === 'atlas') {
                this.xOffset = gameobj.x - this._manager.input.pointer.x;
                this.yOffset = gameobj.y - this._manager.input.pointer.y;

                this.addGameObjSelectionBorder(gameobj.x, gameobj.y, gameobj.width, gameobj.height);
                this.dragging = true;

                this._inspector.setInputReadOnly('width', true);
                this._inspector.setInputReadOnly('height', true);
            }

            if (gameobj.objType === 'dropzone' || gameobj.objType === 'hotspot') {
                //Debug.info("selectBorder:", this.selectedGOBorder);
                if (this.selectedGOBorder) { this.selectedGOBorder.alpha = 0; }

                let mouseX = this._manager.input.pointer.x;
                let mouseY = this._manager.input.pointer.y;

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
            }

            this._inspector.setInputValue('width', this.selectedGO.width);
            this._inspector.setInputValue('height', this.selectedGO.height);

        }, this);
        gameobj.input.addInputListener('pointerup', () => {
            this.dragging = false;
            this._resize = false;

            if ((this.selectedGO.followText !== undefined) && (gameobj.objType === 'dropzone' || gameobj.objType === 'hotspot')) {
                this.selectedGO.followText.x = 30 + this.selectedGO.width / 2;
            }
        }, this);
    }


    _inputChanged({ prop, val }: { prop: string, val: number }) {
        Debug.info(`prop: ${prop} val: ${val}`);

        if (prop === "name") {
            this.selectedGO.uniqName = `${val}`;
            if (this.selectedGO.objType === "image") {
                this._imgGameObjects[this.selectedGO.objID].name = `${val}`;
            }
            else if (this.selectedGO.objType === "spine") {
                this._spineGameObjects[this.selectedGO.objID].name = `${val}`;
            }
            else if (this.selectedGO.objType === "atlas") {
                this._atlasGameObjects[this.selectedGO.objID].name = `${val}`;
            }
            else if (this.selectedGO.objType === "dropzone") {
                this._dropzoneGameObjects[this.selectedGO.objID].name = `${val}`;
            }
            else if (this.selectedGO.objType === "hotspot") {
                this._hotspotGameObjects[this.selectedGO.objID].name = `${val}`;
            }
        }
        else if (prop === "x") {
            this.selectedGO.x = Number(val);
        }
        else if (prop === "y") {
            this.selectedGO.y = Number(val);
        }
        else if (prop === "angle") {
            this.selectedGO.angle = Number(val);
        }
        else if (prop === "zIndex") {
            this.selectedGO.zIndex = Number(val);
        }
        else if (prop === "x origin") {
            this.selectedGO.setOrigin(Number(val), Number(this.selectedGO.origin.y));
            this.selectedGOBorder.setOrigin(Number(val), Number(this.selectedGO.origin.y));
        }
        else if (prop === "y origin") {
            this.selectedGO.setOrigin(Number(this.selectedGO.origin.x), Number(val));
            this.selectedGOBorder.setOrigin(Number(this.selectedGO.origin.x), Number(val));
        }
        else if (prop === "width") {
            this.selectedGO.width = Number(val);
            this.selectedGO.followText.x = 30 + this.selectedGO.width / 2;
        }
        else if (prop === "height") {
            this.selectedGO.height = Number(val);
            this.selectedGO.followText.x = 30 + this.selectedGO.width / 2;
        }
    }

    protected _dataImported({ data }: { data: any }): void {
        //Debug.info("IMPORTED_DATA: ", data);
        this._resetData();
        this._addImportedGameObjects(data);
    }

    protected _addImportedGameObjects(data: any): void {
        if (data.sprites.length > 0) {
            data.sprites.forEach((val: any, i: number) => {
                this._addGameObject(val.filename, 'image', val.name, { x: val.x, y: val.y, angle: val.angle, originX: val.originX, originY: val.originY, scaleX: Number(val.scaleX), scaleY: Number(val.scaleY) });
            });
        }
        if (data.spines.length > 0) {
            data.spines.forEach((val: any, i: number) => {
                this._addGameObject(val.filename, 'spine', val.name, { x: val.x, y: val.y, angle: val.angle, originX: val.originX, originY: val.originY, scaleX: Number(val.scaleX), scaleY: Number(val.scaleY) });
            });
        }
        if (data.atlases.length > 0) {
            data.atlases.forEach((val: any, i: number) => {
                this._addGameObject(val.filename, 'atlas', val.name, { x: val.x, y: val.y, angle: val.angle, originX: val.originX, originY: val.originY, scaleX: Number(val.scaleX), scaleY: Number(val.scaleY) });
            });
        }
        if (data.dropzones.length > 0) {
            data.dropzones.forEach((val: any, i: number) => {
                this._addGameObject(val.name, 'dropzone', val.name, { x: val.x, y: val.y, width: val.width, height: val.height });
            });
        }
        if (data.hotspots.length > 0) {
            data.hotspots.forEach((val: any, i: number) => {
                this._addGameObject(val.name, 'hotspot', val.name, { x: val.x, y: val.y, width: val.width, height: val.height });
            });
        }
    }

    /**
     * @description Removes if there is any game object on the scene and related data
     */
    protected _resetData() {
        if (this.selectedGOBorder) { this.selectedGOBorder.alpha = 0; }
        // Destroy all the game objects inside of the scene
        this._playgroundContainer.destroyChildren();
        this._zoneContainer.destroyChildren();

        this._imgGameObjects = [];
        this._spineGameObjects = [];
        this._atlasGameObjects = [];
        this._dropzoneGameObjects = [];
        this._hotspotGameObjects = [];
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
                    if (this.selectedGOBorder) {
                        this.selectedGOBorder.alpha = 0;
                        this.selectedGOBorder.visible = false;
                    }
                    if (this.selectedGO.objType === 'image') {
                        this._imgGameObjects.splice(this.selectedGO.objID, 1);
                        //Debug.info('IMAGES:', this._imgGameObjects);
                    }
                    if (this.selectedGO.objType === 'spine') {
                        this._spineGameObjects.splice(this.selectedGO.objID, 1);
                        //Debug.info('SPINES:', this._spineGameObjects);
                    }
                    if (this.selectedGO.objType === 'atlas') {
                        this._spineGameObjects.splice(this.selectedGO.objID, 1);
                        //Debug.info('ATLASES:', this._atlasGameObjects);
                    }
                    if (this.selectedGO.objType === 'dropzone') {
                        this._dropzoneGameObjects.splice(this.selectedGO.objID, 1);
                        //Debug.info('DROPZONES:', this._dropzoneGameObjects);
                    }
                    if (this.selectedGO.objType === 'hotspot') {
                        this._hotspotGameObjects.splice(this.selectedGO.objID, 1);
                        //Debug.info('HOTSPOTS:', this._hotspotGameObjects);
                    }
                }
            }, false);
    }

    protected _addDataDownloadLink(): void {
        let gameObjectData: any = {
            sprites: [],
            spines: [],
            atlases: [],
            dropzones: [],
            hotspots: []
        };

        this._imgGameObjects.forEach((obj) => {
            gameObjectData.sprites.push({
                name: obj.name, filename: obj.filename, x: obj.gameObj.x, y: obj.gameObj.y,
                originX: obj.gameObj.origin.x, originY: obj.gameObj.origin.y, scaleX: Number(obj.gameObj.scaleHandler.x), scaleY: Number(obj.gameObj.scaleHandler.y),
                angle: obj.gameObj.angle, zIndex: Number(obj.gameObj.zIndex), hitShape: ""
            });
        });

        this._spineGameObjects.forEach((obj) => {
            gameObjectData.spines.push({
                name: obj.name, filename: obj.filename, x: obj.gameObj.x, y: obj.gameObj.y,
                originX: obj.gameObj.origin.x, originY: obj.gameObj.origin.y, scaleX: Number(obj.gameObj.scaleHandler.x), scaleY: Number(obj.gameObj.scaleHandler.y),
                angle: obj.gameObj.angle, zIndex: Number(obj.gameObj.zIndex), hitShape: ""
            });
        });

        this._atlasGameObjects.forEach((obj) => {
            gameObjectData.atlases.push({
                name: obj.name, filename: obj.filename, x: obj.gameObj.x, y: obj.gameObj.y,
                originX: obj.gameObj.origin.x, originY: obj.gameObj.origin.y, scaleX: Number(obj.gameObj.scaleHandler.x), scaleY: Number(obj.gameObj.scaleHandler.y),
                angle: obj.gameObj.angle, zIndex: Number(obj.gameObj.zIndex)
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
            this.selectedGOBorder = this._goFactory.nineSlice(x, y, 'active_object', 4, 4, 4, 4, width, height, this._foregroundContainer);
            this.selectedGOBorder.setOrigin(Number(this.selectedGO.origin.x), Number(this.selectedGO.origin.y));
        }
        else {
            this.selectedGOBorder.setOrigin(Number(this.selectedGO.origin.x), Number(this.selectedGO.origin.y));
            this.selectedGOBorder.alpha = 1;
            this.selectedGOBorder.visible = true;
        }
    }

    protected _addImagesRow(): void {
        let imgListFiltered = this._loader.resList.filter(res => res.type === 'img' && res.ext === 'png');
        imgListFiltered.forEach(val => this.imgList.push({ src: val.url, name: val.basename }));

        this._accordion.addRow('Images', 'image', ...this.imgList);
    }

    protected _addSpinesRow(): void {
        let spineListFiltered = this._loader.resList.filter(res => res.type === 'spn');
        spineListFiltered.forEach(val => this.spineList.push(val.url));

        Debug.warn("FilteredSpines:", spineListFiltered);

        let spinePixels: any = [];
        let spineResults: any[] = [];
        spineListFiltered.forEach((val) => {
            let spnSrc = this._goFactory.spine(-500, -500, `${val.basename}`);
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

    protected _addAtlasesRow(): void {
        let atlasList: any[] = [];
        (<any>window).electronAtlasList.forEach((val: any) => {
            if (val.indexOf('.png') != -1) {
                atlasList.push({ src: `assets/atlas/${val}`, name: val.replace(/\.[^/.]+$/, "") });
            }
        });

        let atlasPixels: any = [];
        let atlasResults: any[] = [];
        atlasList.forEach((val) => {
            let atlasSrc = this._goFactory.sprite(-500, -500, `${val.name.replace(/\.[^/.]+$/, "")}`, '');
            setTimeout(() => atlasSrc.alpha = 0, 50); // we don't want to show not active spine objects, this trick did the work
            atlasPixels.push(atlasSrc.data);
        });

        for (let i = 0; i < atlasPixels.length; i++) {
            let res = this._pxGame.toImgElement(atlasPixels[i]);

            atlasResults.push({ src: res.src, name: atlasList[i].name });

            if (i === atlasPixels.length - 1) {
                this._accordion.addRow('Atlases', 'atlas', ...atlasResults);
            }

        }
    }

    protected _addDropzonesRow(): void {
        this._loader.addImage('../editor/dropzone.png', true);
        let dropzoneList: any[] = [{ src: 'assets/editor/dropzone.png', name: 'dropzone' }];
        this._accordion.addRow('Dropzones', 'dropzone', ...dropzoneList);
        //Debug.info("dropzoneList: ", dropzoneList);
    }

    protected _addHotspotsRow(): void {
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

            if ((this.selectedGO.objType === 'image' || this.selectedGO.objType === 'spine' || this.selectedGO.objType === 'atlas')) {
                this.selectedGOBorder.x = this.selectedGO.x;
                this.selectedGOBorder.y = this.selectedGO.y;
            }

            this._inspector.setInputValue('x', this.selectedGO.x);
            this._inspector.setInputValue('y', this.selectedGO.y);
            /* this._inspector.setInputValue('origin x', this.selectedGO.origin.x);
            this._inspector.setInputValue('origin y', this.selectedGO.origin.y); */
            this._inspector.setInputValue('scale x', this.selectedGO.scaleHandler.x);
            this._inspector.setInputValue('scale y', this.selectedGO.scaleHandler.y);
            this._inspector.setInputValue('angle', this.selectedGO.angle);
            this._inspector.setInputValue('zIndex', this.selectedGO.zIndex);
        }

        if (this._resize && (this.selectedGO.objType === 'dropzone' || this.selectedGO.objType === 'hotspot')) {
            let xDiff = this._manager.input.pointer.x - this.selectedGO.right;
            let yDiff = this._manager.input.pointer.y - this.selectedGO.bottom;
            this.selectedGO.width = this.selectedGO.width + this._resizeOffsetX + xDiff;
            this.selectedGO.height = this.selectedGO.height + this._resizeOffsetY + yDiff;

            //Debug.info(`${this.selectedGO.width} -  ${this.selectedGO.width}`);
            this._inspector.setInputValue('width', parseInt(this.selectedGO.width));
            this._inspector.setInputValue('height', parseInt(this.selectedGO.height));
        }

        if (this.selectedGO && this.selectedGO.alpha !== 0) {
            this.selectedGO.scaleHandler.setScale(this._inspector.getInputValue('scale x'), this._inspector.getInputValue('scale y'));

            if ((this.selectedGO.objType === 'image' || this.selectedGO.objType === 'spine' || this.selectedGO.objType === 'atlas')) {
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