import Debug from "../Debug";
import ILevel from "../ILevel";
import LevelManager from "../LevelManager";
import GOFactory from "../GameObjects/GOFactory";
import Loader from "../Loader";
import UIAccordion from "./UIAccordion";

// build the visual of the editor here, like an activity level....

class EditorScene implements ILevel {
    private _loader: Loader;
    private _manager: LevelManager;
    private _goFactory: GOFactory;
    private _accordion: UIAccordion;

    protected imgList: string[] = [];
    protected spineList: string[] = [];

    constructor(loader: Loader, manager: LevelManager, goFactory: GOFactory, accordion: UIAccordion) {
        this._loader = loader;
        this._manager = manager;
        this._goFactory = goFactory;
        this._accordion = accordion;
    }

    init(): void {
        Debug.info('Editor.init');

        this.preload();
    }

    preload(): void {
        Debug.info('Editor.preload');

        /*  this._loader.download().then(
             () => { this.start() }
         ) */
        this.start();
    }

    start(): void {
        Debug.info('Editor.start');
        this._waitForFirstInput();

        // TODO: build editor UI and populate GameObject panels
        let go = this._goFactory.sprite(200, 200, 'cat');
        go.setOrigin(.5);
        go.input.enableInput();

        this._accordion.createContainer();

        // Create rows here
        this.addImagesRow();
        this.addSpinesRow();

        // This is needed for the first time creation of panels
        this._accordion.removeAllSelections();
        this._accordion.uncollapseAll();
    }

    addImagesRow(): void {
        let imgListFiltered = this._loader.resList.filter(res => res.type === 'img');
        imgListFiltered.forEach(val => this.imgList.push(val.url));

        this._accordion.addRow('Images', ...this.imgList);
    }

    addSpinesRow(): void {
        let spineListFiltered = this._loader.resList.filter(res => res.type === 'spn');
        spineListFiltered.forEach(val => this.spineList.push(val.url));

        this._accordion.addRow('Spines', ...[
            `${this._loader.resList[37].url}`
        ]);
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