/**
 * @author       Richard Sneyd <richardsneyd@hotmail.com>
 * @copyright    2020 Highwood Educational Consulting and Development.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Components from "./Components";
import Spine from "./Spine";
import Sprite from "./Sprite";
import Actor from './Actor';

/**
 * @namespace UAEngine.Actors
 * @description the Actors module houses all classes and modules related to actors of all kinds
 */
const Actors = {
    Components: Components,
    Spine: Spine,
    Sprite: Sprite,
    Actor: Actor
}

export default Actors;