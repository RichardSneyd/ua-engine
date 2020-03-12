
interface ISndLoader {
    loadSounds(sounds: string[], onProgress: Function, onComplete: Function, context: any): void;
    download(): void;
    baseURL: string;
}

export default ISndLoader;