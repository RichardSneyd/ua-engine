
import * as PIXI from 'pixi.js-legacy';
(<any> window).PIXI = PIXI;
require('pixi-spine');

import Game from './Game/Core/Game';
import ControlContainer from './Dep/ControlContainer';
import Debug from './Game/Core/Engine/Debug';

let control = new ControlContainer();
let game: Game = control.getMain();

game.sayHi();