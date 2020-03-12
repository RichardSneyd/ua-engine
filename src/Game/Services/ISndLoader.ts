
interface ISndLoader {
    loadSounds(urls: string[], extensions: string[], onProgress: Function, onComplete: Function, context: any): void;
    download(): void;
    baseURL: string;
}

export default ISndLoader;