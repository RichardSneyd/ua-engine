
interface ISndLoader {
    loadSounds(sounds: string[], onProgress: Function, onComplete: Function, context: any): void;
    _baseURL: string;
}

export default ISndLoader;