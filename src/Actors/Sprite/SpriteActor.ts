import Actor from "../Actor";
import Mixin from "../../Utils/Mixins";

/**
 * @description the sprite actor class extends Phaser Sprite, with the abstract Actor base-class mixed in.
 */
class SpriteActor extends Phaser.GameObjects.Sprite {

}

Mixin.applyMixins(SpriteActor, [Actor]);
interface SpriteActor extends Actor {}

export default SpriteActor;