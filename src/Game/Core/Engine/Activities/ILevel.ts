import IScene from "./IScene";
import SceneEvents from "./SceneEvents";

/**
 * @description defines the basic methods of a Level. Also inherets the from IScene.
 */
interface ILevel extends IScene {
    onNewRow(): void;
    loadConfig(): void;
    events: SceneEvents;
    _waitForFirstInput(): void;
}

export default ILevel;