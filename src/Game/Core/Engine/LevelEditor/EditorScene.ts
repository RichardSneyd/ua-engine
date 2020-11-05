import Debug from "../Debug";
import ILevel from "../ILevel";
import LevelManager from "../LevelManager";
import Loader from "../Loader";
import UIAccordion from "./UIAccordion";

// build the visual of the editor here, like an activity level....

class EditorScene implements ILevel {
    private _loader: Loader;
    private _manager: LevelManager;
    private _accordion: UIAccordion;

    constructor(loader: Loader, manager: LevelManager, accordion: UIAccordion) {
        this._loader = loader;
        this._manager = manager;
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
        this._accordion.createContainer();
        // Create rows here
        this._accordion.addRow('Images', ...[
            `${this._loader.resList[37].url}`,
            `${this._loader.resList[38].url}`,
            `${this._loader.resList[39].url}`
        ]);

        this._accordion.addRow('Spines', ...[
            `${this._loader.resList[37].url}`
        ]);

        // This is needed for the first time creation of panels
        this._accordion.removeAllSelections();
        this._accordion.uncollapseAll();
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