import Componentable from '../../Components/Componentable';
import Mixin from '../../Utils/Mixins';
import Actor from '../Actor';

/**
 * @description the spine actor class, with SpineGameObject mixed in
 */
class SpineActor extends Actor {

}

interface SpineActor extends SpineGameObject {}
Mixin.applyMixins(SpineActor, [SpineGameObject]);


export default SpineActor;