import Actor from "../Actor";
import Mixin from "../../Utils/Mixins";

class SpriteActor extends Phaser.GameObjects.Sprite {

}

Mixin.applyMixins(SpriteActor, [Actor]);
interface SpriteActor extends Actor {}

export default SpriteActor;