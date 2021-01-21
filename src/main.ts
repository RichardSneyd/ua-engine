import Game from './Game/Core/Game';
import ControlContainer from './Dep/ControlContainer';

let control = new ControlContainer();
let game: Game = control.getMain();

game.sayHi();