import ControlContainer from './Dep/ControlContainer'
import Game from './Game/Core/Game';
import MainLevel from './Game/Core/Levels/MainLevel';

let control = new ControlContainer();
let game: Game = control.getMain();

/*
game.startGame('./config.json').then((status: any) => {
  let ml = new MainLevel();
  game.loadLevel(ml);
});

*/
game.sayHi();