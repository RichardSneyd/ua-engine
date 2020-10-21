import FrameAnimationManager from './Components/FrameAnimationManager';
import IAnimatedGameObject from './IAnimatedGameObject';


/**
 * @description to be implemented by gameObjects that use a FrameAnimationManager
 */
interface IFrameAnimatedGameObject extends IAnimatedGameObject{
    animations: FrameAnimationManager;
}

export default IFrameAnimatedGameObject;