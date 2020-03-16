import AudioManager from "./AudioManager";

class LevelManager {
    private _audio: AudioManager;

    constructor(audioManager: AudioManager){
        this._audio = audioManager;
    }

    get audio(): AudioManager {
        return this._audio;
    }


}

export default LevelManager;