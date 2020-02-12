import Actor from "../Actor";
import Mixin from "../../Mixin";

class SpriteActor extends Phaser.GameObjects.Sprite {

}

Mixin.applyMixins(SpriteActor, [Actor]);
interface SpriteActor extends Actor {}

export default SpriteActor;