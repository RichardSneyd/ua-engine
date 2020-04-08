import AudioManager from "./AudioManager";
import Events from "./Events";
import Utils from "./Utils/Utils";
import ScriptHandler from "./ScriptHandler";
import InputHandler from './InputHandler';


class LevelManager {
    private _audio: AudioManager;
    private _events: Events;
    private _script: ScriptHandler;
    private _utils: Utils;
    private _input: InputHandler;

    constructor(audioManager: AudioManager, events: Events, script: ScriptHandler, utils: Utils, input: InputHandler){
        this._audio = audioManager;
        this._events = events;
        this._script = script;
        this._utils = utils;
        this._input = input;
    }

    /**
     * @description initialize the level manager.
     * @param scriptName the name of the script to initialize the script handler with
     * @param scriptRaw the raw script data for the script handler
     * @param parseCols the names of the columns to be parsed into arrays of names (i.e 'horse,dog,cat' => [horse, dog, cat])
     * @param objectifyCols the names of the columns to be converted into objects with key-value pairs. For example:
     * 'bgd: bgd_1\noverlay: overlay_1'
     * => {bgd: 'bgd_1', overlay: 'overlay_1'}
     * @param processText (optional) the column names to convert into lines and words of text. Mainly useful in passage (reading) types.
     */
    init(scriptName: string, scriptRaw: any[], parseCols: string[], objectifyCols: string[], processText?: string[]){
        this._script.init(scriptName, scriptRaw, parseCols, objectifyCols, processText);
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

    get input(): InputHandler {
        return this._input;
    }


}

export default LevelManager;