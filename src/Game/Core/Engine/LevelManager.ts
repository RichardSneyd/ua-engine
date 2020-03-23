import AudioManager from "./AudioManager";
import Events from "./Events";
import Utils from "./Utils/Utils";
import ScriptHandler from "./ScriptHandler";


class LevelManager {
    private _audio: AudioManager;
    private _events: Events;
    private _script: ScriptHandler;
    private _utils: Utils;

    constructor(audioManager: AudioManager, events: Events, script: ScriptHandler, utils: Utils){
        this._audio = audioManager;
        this._events = events;
        this._script = script;
        this._utils = utils;
    }

    init(scriptName: string, scriptRaw: any[], parseCols: string[], objectifyCols: string[]){
        this._script.init(scriptName, scriptRaw, parseCols, objectifyCols);
    }

    get events(): Events{
        return this._events;
    }

    get audio(): AudioManager {
        return this._audio;
    }

    get script(): ScriptHandler {
        return this._script;
    }

    get utils(): Utils {
        return this._utils;
    }


}

export default LevelManager;