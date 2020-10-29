import IScene from "./IScene";

/**
 * @description defines the basic methods of a Level. Also inherets the from IScene.
 */
interface ILevel extends IScene {
    onNewRow(): void;
    loadConfig(): void;
    _waitForFirstInput(): void;
}

export default ILevel;