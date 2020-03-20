import World from './Engine/World';
import MainLevel from './Levels/MainLevel';
import SndTestLevel from './Levels/SndTestLevel';

class Game {
  private _world: World; _mainLevel: MainLevel; _sndTestLevel: SndTestLevel;

  constructor(world: World, mainLevel: MainLevel, sndTestLevel: SndTestLevel) {
    this._world = world;
    this._mainLevel = mainLevel;
    this._sndTestLevel = sndTestLevel;
  }

  public startGame() {
    this._world.init(800, 800);

    //this._world.startLevel(this._mainLevel);
    this._world.startLevel(this._sndTestLevel);
    
  }
}

export default Game;