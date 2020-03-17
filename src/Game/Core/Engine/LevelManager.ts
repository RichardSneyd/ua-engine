import AudioManager from "../../Services/AudioManager";
import Events from "./Events";

class LevelManager {
    private _audio: AudioManager;
    private _events: Events;

    constructor(audioManager: AudioManager, events: Events){
        this._audio = audioManager;
        this._events = events;
    }

    get events(): Events{
        return this._events;
    }

    get audio(): AudioManager {
        return this._audio;
    }


}

export default LevelManager;