import Debug from "../Debug";
import ILevel from '../Activities/ILevel';

import LevelManager from "../LevelManager";
import GOFactory from "../GameObjects/GOFactory";
import Loader from "../Loader";
import UIAccordion from "./UIAccordion";
import ExportData from './ExportData';
import Loop from "../Loop";
import SpriteObject from "../GameObjects/SpriteObject";
import SpineObject from "../GameObjects/SpineObject";
import PxGame from "../../../Services/Pixi/PxGame";
import Inspector from "./Inspector";

// build the visual of the editor here, like an activity level....

class EditorScene implements ILevel {
    private _loader: Loader;
    private _manager: LevelManager;
    private _goFactory: GOFactory;
    private _accordion: UIAccordion;
    private _exportData: ExportData;
    private _loop: Loop;
    protected _pxGame: PxGame;
    protected _inspector: Inspector;

    public bgdName: string;
    protected _bgd: SpriteObject;
    protected imgList: any[] = [];
    protected spineList: string[] = [];
    protected _imgGameObjects: SpriteObject[] = [];
    protected _spineGameObjects: SpineObject[] = [];
    protected _downloadData: any;

    protected selectedGO: SpriteObject | SpineObject;
    protected xOffset: number = 0;
    protected yOffset: number = 0;
    protected dragging: boolean = false;
    protected selectedGOBorder: PIXI.Graphics;

    constructor(loader: Loader, manager: LevelManager, loop: Loop, goFactory: GOFactory,
        pxGame: PxGame, accordion: UIAccordion, exportData: ExportData, inspector: Inspector) {
        this._loader = loader;
        this._manager = manager;
        this._goFactory = goFactory;
        this._pxGame = pxGame;
        this._loop = loop;
        this._accordion = accordion;
        this._exportData = exportData;
        this._inspector = inspector;
    }

    init(): void {
        Debug.info('Editor.init');

        this._loop.addFunction(this.update, this);
        this._loop.start();

        this._manager.events.on('gameobj_clicked', this._panelImageClicked, this);
        this._manager.events.on('input_changed', this._inputChanged, this);

        this.preload();
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

        /* Download Button */
        this._exportData.createDownloadButton();

        /* Inspector UI */
        this._inspector.createInspector();
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
        //Debug.info('type: ', type);

        let gameobj: any;
        if (type === "image") {
            gameobj = this._goFactory.sprite(500, 500, src);
            gameobj.setOrigin(.5);

            this._imgGameObjects.push(gameobj);
        }
        else if (type === "spine") {
            gameobj = this._goFactory.spine(500, 500, name);
            gameobj.animations.play("idle", true);

            this._spineGameObjects.push(gameobj);
        }

        gameobj.input.enableInput();
        gameobj.input.addInputListener('pointerdown', () => {
            this.xOffset = gameobj.x - this._manager.input.pointer.x;
            this.yOffset = gameobj.y - this._manager.input.pointer.y;
            this.selectedGO = gameobj;
            this.addGameObjSelectionBorder(gameobj.x, gameobj.y, gameobj.width, gameobj.height);
            this.dragging = true;
        }, this);
        gameobj.input.addInputListener('pointerup', () => {
            this.dragging = false;
        }, this);


        this.addDataDownloadLink();
    }


    _inputChanged({ prop, val }: { prop: string, val: number }) {
        Debug.info(`prop: ${prop} val: ${val}`);

        if (prop === "name") {
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

    }

    addDataDownloadLink(): void {
        let gameObjectData = {
            sprites: [{}],
            spines: [{}],
            dropzones: [{}]
        };

        this._imgGameObjects.forEach((obj) => {
            gameObjectData.sprites.push({ name: obj.textureName, x: obj.x, y: obj.y, originX: obj.origin.x, originY: obj.origin.y, angle: obj.angle, hitShape: "" });
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
            this._pxGame.toImgElement(spinePixels[i]).then(res => {
                spineResults.push({ src: res.src, name: spineListFiltered[i].basename });

                if (i === spinePixels.length - 1) {
                    this._accordion.addRow('Spines', 'spine', ...spineResults);
                    this._accordion.removeAllSelections();
                    this._accordion.uncollapseAll();
                }
            });

        }
    }

    update(_time: number): void {
        if (this.dragging) {
            this.selectedGO.moveToMouse(this.xOffset, this.yOffset);
            this.selectedGOBorder.x = this.selectedGO.x;
            this.selectedGOBorder.y = this.selectedGO.y;

            Debug.warn(`selected x: ${this.selectedGO.x} selected y: ${this.selectedGO.y}`);

            this._inspector.setInputValue('x', this.selectedGO.x);
            this._inspector.setInputValue('y', this.selectedGO.y);
            this._inspector.setInputValue('origin x', this.selectedGO.origin.x);
            this._inspector.setInputValue('origin y', this.selectedGO.origin.y);

            this._inspector.setInputValue('scale x', this.selectedGO.scaleHandler.x);
            this._inspector.setInputValue('scale y', this.selectedGO.scaleHandler.y);

            this._inspector.setInputValue('angle', this.selectedGO.angle);
        }

        if (this.selectedGO) {
            this.selectedGOBorder.x = this.selectedGO.x;
            this.selectedGOBorder.y = this.selectedGO.y;

            this.selectedGO.scaleHandler.setScale(this._inspector.getInputValue('scale x'), this._inspector.getInputValue('scale y'));

            this.selectedGOBorder.width = this.selectedGO.scaleHandler.x * this.selectedGO.width;
            this.selectedGOBorder.height = this.selectedGO.scaleHandler.y * this.selectedGO.height;

            this._inspector.setInputValue("name", this.selectedGO.textureName);
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