import Game from './Game/Core/Game';
//@ts-ignore
import ControlContainer from './Dep/ControlContainer';

let control = new ControlContainer();
let game: Game = control.getMain();

/*
game.startGame('./config.json').then((status: any) => {
  let ml = new MainLevel();
  game.loadLevel(ml);
});

*/
game.sayHi();