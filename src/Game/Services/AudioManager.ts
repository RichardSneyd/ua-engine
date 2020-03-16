import Loader from '../Core/Engine/Loader';
import HwPlayer from './Howler/HwPlayer';

class AudioManager {
    private _loader: Loader; _hwPlayer: HwPlayer;

    constructor(loader: Loader, hwLoader: HwPlayer){
        this._loader = loader;
        this._hwPlayer = hwLoader;
    }

    play(name: string, onStop: Function, loop: boolean = false) {
        this._hwPlayer.play(name, onStop, loop);
    }

    
}

export default AudioManager;