import ISndLoader from './ISndLoader';
import HwLoader from './Howler/HwLoader';

class SndLoader implements ISndLoader {
    private _loader: HwLoader;
    private _baseURL: string;

    constructor(loader: HwLoader) {
        this._loader = loader;
        this._baseURL = '';
    }

    loadSounds(urls: string[], extensions: string[], onProgress: Function, onDone: Function, context: any): void {
        this._loader.loadSounds(urls, extensions, onProgress, onDone, context);
    }


    get baseURL(): string {
        return this._baseURL;
    }

}

export default SndLoader;