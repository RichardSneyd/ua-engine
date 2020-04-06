import ControlContainer from './Dep/ControlContainer'
import Game from './Game/Core/Game';
import MainLevel from './Game/Core/Levels/MainLevel';

let control = new ControlContainer();
let game: Game = control.getMain();

game.sayHi();