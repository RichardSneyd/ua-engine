import Componentable from '../../Componentable';
import Mixin from '../../Mixin';
import Actor from '../Actor';

class SpineActor extends Actor {

}

interface SpineActor extends SpineGameObject {}
Mixin.applyMixins(SpineActor, [SpineGameObject]);


export default SpineActor;