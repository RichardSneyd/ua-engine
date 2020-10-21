import IGameObject from "./IGameObject";

/**
 * @description an interface for GameObjects that use an IAnimationManager
 */
interface IAnimatedGameObject extends IGameObject {
    animations: IAnimationManager;
}

export default IAnimatedGameObject;