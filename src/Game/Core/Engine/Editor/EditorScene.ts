import ILevel from "../ILevel";
import IScene from "../IScene";

// build the visual of the editor here, like an activity level....

class EditorScene implements ILevel {

    init(): void {
        throw new Error("Method not implemented.");
    }
    preload(): void {
        throw new Error("Method not implemented.");
    }
    start(): void {
        throw new Error("Method not implemented.");
    }
    shutdown(): void {
        throw new Error("Method not implemented.");
    }

    onNewRow(): void {
        throw new Error("Method not implemented.");
    }
    loadConfig(): void {
        throw new Error("Method not implemented.");
    }
    _waitForFirstInput(): void {
        throw new Error("Method not implemented.");
    }
    
}

export default EditorScene;