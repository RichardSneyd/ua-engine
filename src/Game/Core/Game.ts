import World from './Engine/World';
import Events from './Engine/Events';
import ScaleManager from './Engine/ScaleManager';
import Expose from './Engine/Expose';
import Entity from './Engine/Entity';
import Loop from './Engine/Loop';
import Loader from './Engine/Loader';
import GameConfig from './Engine/GameConfig';
import LevelManager from './Engine/LevelManager';
import ILevel from './Engine/ILevel';

class Game {
  private _world: World; _events: Events;
  private _scaleManager: ScaleManager; _expose: Expose;
  private _entity: Entity; _loop: Loop; _loader: Loader; _gameConfig: GameConfig; _levelManager: LevelManager;

  constructor(world: World, entity: Entity, loop: Loop, loader: Loader,
              events: Events, scaleManager: ScaleManager, expose: Expose, gameConfig: GameConfig,
              levelManager: LevelManager) {
    this._world = world;
    this._events = events;
    console.log("TARGET: ", events);
    this._scaleManager = scaleManager;
    this._expose = expose;

    this._entity = entity;
    this._loop = loop;
    this._loader = loader;
    this._gameConfig = gameConfig;
    this._levelManager = levelManager;
  }

  public startGame(configPath: string) {
    return new Promise((resolve, reject) => {

      this._gameConfig.loadConfig(configPath).then((data: any) => {
        this._initScaleManager();

        this._world.init(this._gameConfig.data.DISPLAY.WIDTH, this._gameConfig.data.DISPLAY.HEIGHT);
        

        this._addListeners();
        this._onResize();

        this._exposeGlobal();

        resolve({status: 'sucess'});
        
      });
    })
  }

  public loadLevel(level: ILevel) {
    this._world.startLevel(level);
  }

  private _onResize() {
    let target = this._scaleManager.getXY(this._gameWidth(), this._gameHeight());

    this._world.resize(target.x, target.y);
  }

  private _exposeGlobal() {
    this._expose.init();

    this._expose.add('world', this._world);
    this._expose.add('entity', this._entity);
    this._expose.add('loop', this._loop);
    this._expose.add('loader', this._loader);
    this._expose.add('events', this._events);
    this._expose.add('levelManager', this._levelManager);
  }

  private _addListeners(): void {
    this._events.addListener('resize', this._onResize, this);

    window.addEventListener('resize', () => {
      this._events.fire('resize');
    });
  }

  private _initScaleManager(): void {
    this._scaleManager.init();
  }

  private _gameWidth(): number {
    return this._gameConfig.data.DISPLAY.WIDTH;
  }

  private _gameHeight(): number {
    return this._gameConfig.data.DISPLAY.HEIGHT;
  }
}

export default Game;