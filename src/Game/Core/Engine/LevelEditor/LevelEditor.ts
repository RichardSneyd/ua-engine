import Game from "../../Game";
import Debug from "../Debug";
import Events from "../Events";
import IActivity from "../Activities/IActivity";
import EditorScene from './EditorScene';

class LevelEditor implements IActivity {
    protected _name: string;
    protected _code: string;
    protected _events: Events;
    protected _game: Game;
    protected _scene: EditorScene;
    protected _initialized: boolean;

    constructor(events: Events, scene: EditorScene) {
        this._name = 'editor';
        this._code = 'editor';
        this._events = events;
        this._scene = scene;
        this._initialized = false;
    }

    init(game: Game) {
        this._game = game;
        this._game.addActivity(this); // register the editor as an 'activity' that can be called by the engine
        this._initialized = true;
    }

    /*createNew() {
        return new Editor(this._events, this._game, this._scene);
    } */

    get name() {
        return this._name;
    }

    get code() {
        return this._code;
    }

    startActivity(scriptName: string): void {
        if (this._initialized) {
            Debug.info('Editor.startActivity()');
            this._game.loadLevel(this._scene, scriptName);
            return;
        }
        Debug.error('LevelEditor not initialized, so cant call startActivity because _game is undefined');
    }

    /**
     * @description will simultaneously initialize the the editor, and launch it
     * @param game must provide a reference to the current game object, accessed from UAE.game in the API
     */
    public launch(game: Game) {
        // launch editor...
        Debug.info('Editor.launch()');
        this.init(game);
        Debug.info('Editor initialized');
        this._game.startActivity(this._name, this._name); // call the activity (engine will call Editor.startActivity in return, which will call game.loadLevel)
    }
}

export default LevelEditor;