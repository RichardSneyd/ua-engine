import World from './Engine/World';
import MainLevel from './Levels/MainLevel';

class Game {
  private _world: World; _mainLevel: MainLevel;

  constructor(world: World, mainLevel: MainLevel) {
    this._world = world;
    this._mainLevel = mainLevel;
  }

  public startGame() {
    this._world.init(800, 800);

    this._world.startLevel(this._mainLevel);
    
  }
}

export default Game;