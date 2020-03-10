import ControlContainer from './Dep/ControlContainer'
import Game from './Game/Core/Game';

let control = new ControlContainer();
let game: Game = control.getMain();

game.startGame();