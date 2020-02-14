/**
 * @author       Richard Sneyd <richardsneyd@hotmail.com>
 * @copyright    2020 Highwood Educational Consulting and Development.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import 'phaser/plugins/spine/dist/SpinePlugin';

import Components from "./Components";
import Scenes from "./Scenes";
import Utils from "./Utils";
import Actors from "./Actors";
import GUI from './GUI/index';
import Audio from './Audio';
import Game from './Game';

/**
 * @namespace UAEngine
 * @description an engine for building audio-driven, animated and gamified language learning activities
 */
let UAEngine = {
    Actors: Actors,
    Audio: Audio,
    Components: Components,
    Game: Game,
    GUI: GUI,
    Scenes: Scenes,
    Utils: Utils
}

export default UAEngine;