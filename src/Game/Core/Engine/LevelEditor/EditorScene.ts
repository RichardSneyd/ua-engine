
import Debug from "../Debug";
import ILevel from "../ILevel";
import IScene from "../IScene";
import LevelManager from "../LevelManager";
import Loader from "../Loader";

// build the visual of the editor here, like an activity level....

class EditorScene implements ILevel {
    private _loader: Loader;
    private _manager: LevelManager;

    constructor(loader: Loader, manager: LevelManager) {
        this._loader = loader;
        this._manager = manager;
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
        // Todo - build editor UI and populate GameObject panels
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