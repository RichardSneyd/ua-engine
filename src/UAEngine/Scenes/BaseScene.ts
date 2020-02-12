import SceneComponent from "./Behaviors/SceneComponent";
import Componentable from "../Componentable";
import Mixin from "../Mixin";

abstract class BaseScene extends Phaser.Scene{
   
}

Mixin.applyMixins(BaseScene, [Componentable]);
interface BaseScene extends Componentable {}

/* class MyScene extends BaseScene {

}

let scene: Componentable = new MyScene({}); */

export default BaseScene;

