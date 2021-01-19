import AudioManager from "./AudioManager";
import Events from "./Events";
import Utils from "./Utils/Utils";
import ScriptHandler from "./ScriptHandler";
import InputManager from './InputManager';
import Game from '../Game';
import GOFactory from "./GameObjects/GOFactory";
import ILevel from "./Activities/ILevel";

class LevelManager {
    private _level: ILevel;
    private _audio: AudioManager;
    private _globalEvents: Events;
    private _script: ScriptHandler;
    private _utils: Utils;
    private _input: InputManager;
    private _goFactory: GOFactory;

    constructor(audioManager: AudioManager, script: ScriptHandler, utils: Utils, input: InputManager, goFactory: GOFactory, events: Events) {
        this._audio = audioManager;
        this._globalEvents = events;
        this._script = script;
        this._utils = utils;
        this._input = input;
        this._goFactory = goFactory;
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
    init(level: ILevel, scriptName: string, scriptRaw: any[], parseCols: string[], objectifyCols: string[], processText?: string[]) {
        this._level = level;
        this._script.init(scriptName, scriptRaw, parseCols, objectifyCols, processText);
    }

    /**
     * @description the attached level
     */
    get level(){
        return this._level;
    }

    get globalEvents(): Events {
        return this._globalEvents;
    }
    
    /** 
     * @description Passes on the Level file content to the Level Manager.
     * @param content Level file content
     */
    setLevelFile(content: any) {
        this._script.levelFile = content;
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

    get input(): InputManager {
        return this._input;
    }

    get goFactory(): GOFactory {
        return this._goFactory;
    }


}

export default LevelManager;