import Debug from "../Debug";
import ILevel from '../Activities/ILevel';

import LevelManager from "../LevelManager";
import GOFactory from "../GameObjects/GOFactory";
import Loader from "../Loader";
import UIAccordion from "./UIAccordion";
import Loop from "../Loop";
import SpriteObject from "../GameObjects/SpriteObject";
import SpineObject from "../GameObjects/SpineObject";
import PxGame from "../../../Services/Pixi/PxGame";

// build the visual of the editor here, like an activity level....

class EditorScene implements ILevel {
    private _loader: Loader;
    private _manager: LevelManager;
    private _goFactory: GOFactory;
    private _accordion: UIAccordion;
    private _loop: Loop;
    protected _pxGame: PxGame;

    protected imgList: string[] = [];
    protected spineList: string[] = [];
    protected imgGameObjects: SpriteObject[] = [];

    protected selectedGO: SpriteObject | SpineObject;
    protected xOffset: number = 0;
    protected yOffset: number = 0;
    protected dragging: boolean = false;
    protected selectedGOBorder: PIXI.Graphics;

    constructor(loader: Loader, manager: LevelManager, loop: Loop, goFactory: GOFactory, pxGame: PxGame, accordion: UIAccordion) {
        this._loader = loader;
        this._manager = manager;
        this._goFactory = goFactory;
        this._pxGame = pxGame;
        this._loop = loop;
        this._accordion = accordion;
    }

    init(): void {
        Debug.info('Editor.init');

        this._loop.addFunction(this.update, this);
        this._loop.start();

        this._manager.events.on('gameobj_clicked', this._panelImageClicked, this);

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
        //this.addSelectedGameObject();

        this._accordion.createContainer();

        // Create rows here
        this.addImagesRow();
        this.addSpinesRow();

    }

    _panelImageClicked({ src }: { src: string }) {
        let gameobj = this._goFactory.sprite(500, 500, src);
        gameobj.setOrigin(.5);

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

        this.imgGameObjects.push(gameobj);
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
            this.selectedGOBorder.width = width;
            this.selectedGOBorder.height = height;
        }
    }


    addImagesRow(): void {
        let imgListFiltered = this._loader.resList.filter(res => res.type === 'img');
        imgListFiltered.forEach(val => this.imgList.push(val.url));

        this._accordion.addRow('Images', ...this.imgList);
    }

    addSpinesRow(): void {
        let spineListFiltered = this._loader.resList.filter(res => res.type === 'spn');
        spineListFiltered.forEach(val => this.spineList.push(val.url));

        Debug.warn("FilteredSpines:", spineListFiltered);

        let spnSrc = this._goFactory.spine(500, 500, 'parrot');
        spnSrc.alpha = 0;

        let result: string = "";

        let pixelData = this._pxGame.toPixels(spnSrc.data);
        Debug.info("pixelData:", pixelData);

        this._pxGame.toImgElement(spnSrc.data).then(res => {
            Debug.warn("TOIMG:", res.src);

            result = res.src;

            this._accordion.addRow('Spines', ...[
                `${result}`
            ]);

            this._accordion.removeAllSelections();
            this._accordion.uncollapseAll();
        });

    }

    update(_time: number): void {
        if (this.dragging) {
            this.selectedGO.moveToMouse(this.xOffset, this.yOffset);
            this.selectedGOBorder.x = this.selectedGO.x;
            this.selectedGOBorder.y = this.selectedGO.y;
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