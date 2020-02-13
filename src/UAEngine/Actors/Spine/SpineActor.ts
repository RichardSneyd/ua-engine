import Componentable from '../../Components/Componentable';
import Mixin from '../../Utils/Mixins';
import Actor from '../Actor';

class SpineActor extends Actor {

}

interface SpineActor extends SpineGameObject {}
Mixin.applyMixins(SpineActor, [SpineGameObject]);


export default SpineActor;