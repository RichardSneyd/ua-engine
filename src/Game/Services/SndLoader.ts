import ISndLoader from './ISndLoader';
import HwLoader from './Howler/HwLoader';

class SndLoader implements ISndLoader {
    private _loader: HwLoader;
    private _baseURL: string;

    constructor(loader: HwLoader, baseURL: string) {
        this._loader = loader;
        this._baseURL = baseURL;
    }

    loadSounds(urls: string[], extensions: string[], onProgress: Function, onComplete: Function, context: any): void {
        this._loader.loadSounds(

        );
    }


    get baseURL(): string {
        return this._baseURL;
    }

    download() {
        
    }

}

export default SndLoader;