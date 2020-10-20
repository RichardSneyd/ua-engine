import Game from "../../Game";
import Events from "../Events";
import IActivity from 'UAE/Core/Engine/IActivity';
import EditorScene from './EditorScene';


class Editor implements IActivity {
    private _name: string;
    private _code: string;
    private _events: Events;
    private _game: Game;
    private _scene: EditorScene;

    constructor(events: Events, game: Game, scene: EditorScene){
        this._name = 'editor';
        this._code = 'editor';
        this._events = events;
        this._game = game;
        this._scene = scene;

        this._game.addActivity(this); // register the editor as an 'activity' that can be called by the engine
    }

    get name(){
        return this._name;
    }

    get code() {
        return this._code;
    }
    
    startActivity(scriptName: string): void {
        this._game.loadLevel(this._scene, 'placeholder_text');
    }

    public launch(){
        // launch editor...
        this._game.startActivity(this, null); // call the activity (engine will call Editor.startActivity in return, which will call game.loadLevel)
    }
}

export default Editor;