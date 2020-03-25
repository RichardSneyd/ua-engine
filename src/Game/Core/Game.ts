import World from './Engine/World';
import MainLevel from './Levels/MainLevel';
import SndTestLevel from './Levels/SndTestLevel';
import Events from './Engine/Events';
import ScaleManager from './Engine/ScaleManager';

import config from './config';

class Game {
  private _world: World; _mainLevel: MainLevel; _sndTestLevel: SndTestLevel; _events: Events;
  private _scaleManager: ScaleManager;

  constructor(world: World, mainLevel: MainLevel, sndTestLevel: SndTestLevel,
              events: Events, scaleManager: ScaleManager) {
    this._world = world;
    this._mainLevel = mainLevel;
    this._sndTestLevel = sndTestLevel;
    this._events = events;
    console.log("TARGET: ", events);
    this._scaleManager = scaleManager;
  }

  public startGame() {
    this._world.init(config.DISPLAY.WIDTH, config.DISPLAY.HEIGHT);

    //this._world.startLevel(this._mainLevel);
    this._world.startLevel(this._mainLevel);

    this._addListeners();
    this._onResize();
  }

  public _onResize() {
    let target = this._scaleManager.getXY(config.DISPLAY.WIDTH, config.DISPLAY.HEIGHT);

    console.log("TARGET: ", target);

    this._world.resize(target.x, target.y);
  }

  private _addListeners(): void {
    this._events.addListener('resize', this._onResize, this);

    window.addEventListener('resize', () => {
      this._events.fire('resize');
    });
  }
}

export default Game;