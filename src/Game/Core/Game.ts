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
import IActivity from './Engine/IActivity';
import GOFactory from './Engine/GOFactory';
import Geom from './Geom/Geom';

class Game {
  private _world: World; _events: Events;
  private _scaleManager: ScaleManager; _expose: Expose;

  private _entity: Entity; _loop: Loop; _loader: Loader; _gameConfig: GameConfig; _levelManager: LevelManager; 
  private _goFactory: GOFactory; _geom: Geom;

  constructor(world: World, entity: Entity, loop: Loop, loader: Loader,
              events: Events, scaleManager: ScaleManager, expose: Expose, gameConfig: GameConfig,
              levelManager: LevelManager, goFactory: GOFactory, geom: Geom) {

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
    this._goFactory = goFactory;

    this._geom = geom;

    this._exposeGlobal();
  }

  /**
   * @description adds an activity to the engine, as a plugin (todo)
   * @param act the act object to add.
   */
  public addActivity(act: IActivity) {
    
  }

  /**
   * @description say hi!
   */
  public sayHi() {
    console.log("Hi from UA-Engine");
  }

  /**
   * @description start the game. Calls game.init internally, to create the game screen.
   * @param configPath the path to the config.json file, which specified Display widht, height, file paths etc
   */
  public startGame(configPath: string) {
    return new Promise((resolve, reject) => {

      this._gameConfig.loadConfig(configPath).then((data: any) => {
        this._initScaleManager();

        this._world.init(this._gameConfig.data.DISPLAY.WIDTH, this._gameConfig.data.DISPLAY.HEIGHT);
        

        this._addListeners();
        this._onResize();

        resolve({status: 'sucess'});
        
      });
    })
  }

  /**
   * @description load a level (via world.loadLevel). 
   * @param level the level to load
   */
  public loadLevel(level: ILevel, scriptName: string) {
    this._world.startLevel(level, scriptName);
  }

  private _onResize() {
    let target = this._scaleManager.getXY(this._gameWidth(), this._gameHeight());

    this._world.resize(target.x, target.y);
  }

  private _exposeGlobal() {
    this._expose.init();

    this._expose.add('game', this);
    this._expose.add('world', this._world);
    this._expose.add('entity', this._entity);
    this._expose.add('loop', this._loop);
    this._expose.add('loader', this._loader);
    this._expose.add('events', this._events);
    this._expose.add('levelManager', this._levelManager);
    this._expose.add('gameConfig', this._gameConfig);
    this._expose.add('goFactory', this._goFactory);
    this._expose.add('geom', this._geom);
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