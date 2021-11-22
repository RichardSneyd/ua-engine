import World from './Engine/World';
import Events from './Engine/Events';
import ScaleManager from './Engine/ScaleManager';
import Expose from './Engine/Expose';
import Loop from './Engine/Loop';
import Loader from './Engine/Loader';
import GameConfig from './Engine/GameConfig';
import LevelManager from './Engine/LevelManager';
import IActivity from './Engine/Activities/IActivity';
import BaseLevel from './Engine/Activities/BaseLevel';
import GOFactory from './Engine/GameObjects/GOFactory';
import Geom from './Geom/Geom';
import Utils from './Engine/Utils/Utils';
import IScene from './Engine/Activities/IScene';
import ILevel from './Engine/Activities/ILevel';
import Transitions from '../Core/Engine/Transitions';
import TweenManager from './Engine/TweenManager';
import Debug from './Engine/Debug';
import LevelEditor from './Engine/LevelEditor/LevelEditor';
import Activities from './Engine/Activities/Activities';
import AbstractAppMain from './Engine/Activities/AbstractAppMain';
import Physics from './Engine/Activities/Physics';
import { isNumber } from 'lodash';

/**
 * @description the game class. There should only ever be one of these.
 */
class Game {
  private _world: World; _events: Events;
  private _scaleManager: ScaleManager; _expose: Expose;

  private _loop: Loop; _loader: Loader; _gameConfig: GameConfig; _levelManager: LevelManager;
  private _goFactory: GOFactory; _geom: Geom; _utils: Utils; private _activityClasses: Activities;

  protected _product: AbstractAppMain;
  protected _activities: IActivity[];
  protected _activeActivity: IActivity;
  protected _currentActivity: IActivity;
  protected _gameStarted: boolean = false;
  protected _transitions = Transitions;
  protected _tween: TweenManager;
  protected _debug: Debug;
  protected _editor: LevelEditor;
  protected _scene: IScene;
  protected _gestureRecieved: boolean;
  protected _physics: Physics;

  constructor(world: World, loop: Loop, loader: Loader,
    events: Events, scaleManager: ScaleManager, expose: Expose, gameConfig: GameConfig,
    levelManager: LevelManager, goFactory: GOFactory, geom: Geom, utils: Utils, tween: TweenManager,
    debug: Debug, editor: LevelEditor, activityClasses: Activities, physics: Physics) {

    this._events = events;
    this._loop = loop;
    loop.init(this._events); // pass the global events object through init (can't add to constructor because of circular reference error)
    events.init();
    this._world = world;
    // Debug.info("TARGET: ", events);
    this._scaleManager = scaleManager;
    this._expose = expose;
    this._loader = loader;
    this._gameConfig = gameConfig;
    //  this._gameConfig.loadConfig('./config.json');
    this._levelManager = levelManager;
    this._goFactory = goFactory;
    this._activityClasses = activityClasses;

    this._geom = geom;
    this._utils = utils;
    this._tween = tween;
    this._debug = debug;
    this._editor = editor;

    this._activities = [];
    this._gameStarted = false;
    this._gestureRecieved = false;
    this._physics = physics;
    this._exposeGlobal();
    Debug.exposeGlobal(this.startActivity.bind(this), 'goto'); //type goto('script_name') in console to jump to any activity
    (<any>window).isSerializable = this._utils.coll.isSerializable.bind(this._utils.coll);
  }

  get gestureRecieved() {
    return this._gestureRecieved;
  }

  /**
   * @description a method which waits for the first user gesture, then signals we're good to go (to get around audio playback issue in Chrome etc)
   */
  protected _waitForFirstInput(): void {
    //  if (!this.ready) {
    let canvas = document.getElementsByTagName('canvas')[0];
    canvas.addEventListener('pointerdown', () => {
      //  canvas.removeEventListener('pointerdown', this._onFirstInput);
      // this._onFirstInput();

      this._events.emit('gesture_received');
      this._gestureRecieved = true;
    }, { once: true });
    //  }
  }

  /**
   * @description Returns a list of all installed activity plugins
   */
  public get activities(): IActivity[] {
    return this._activities;
  }

  /*  public get transitions() {
     return this._transitions;
   } */

  /**
  * @description has the game already started (screen initialized on webpage)? 
  */
  public get gameStarted(): boolean {
    return this._gameStarted;
  }

  /**
   * @description returns a reference to the active scene/level. Useful, for example, to access the local SceneEvents emitter object from outside the MainLevel class
   */
  public get scene(): IScene {
    return this._scene;
  }

  /**
  * @description Finds and returns an activity type by its code
  * @param name find the activity type by this code
  */
  public get getActivityByName(): Function {
    return this._getActByName;
  }

  public get getActivityByCode(): Function {
    return this._getActByCode;
  }

  /**
   * @description Adds an activity to the game/engine, as a plugin
   * @param act the activity type (object) to add.
   */
  public addActivity(act: IActivity) {
    this.activities.push(act);
  }

  public setProduct(product: AbstractAppMain) {
    this._product = product;
  }

  /**
   * @description The main product object. There can only be one of these per product. They extend AbstractProductMain.
   */
  get product() {
    return this._product;
  }

  get world() {
    return this._world;
  }

  /**
   * @description Removes an activity from the game/engine
   * @param act The activity type (object) to remove.
   */
  public removeActivity(act: IActivity): boolean {
    if (this.activities.indexOf(act) != -1) {
      this.activities.splice(this.activities.indexOf(act), 1);
      return true;
    }
    Debug.warn('cannot remove an activity that has not been installed: ', act.name);
    return false;
  }

  /**
   * @description Starts the specified activity. Calls 'shutdown' event first.
   * @param scriptName the activity to start. Takes the object itself, or it's name in the form of a string
   * @param act optional. The specific activity to call (actual object or name of)
   */
  public startActivity(scriptName: string, act: IActivity | string | null = null) {
    if (scriptName.includes('menu')) { act = this.product.menuSystem }
    else if (act == null) act = this.getActivityByCode(this.extractCode(scriptName));

    if (typeof act !== 'string' && act !== null) {
      this._startActivity(act, scriptName);
    }
    else if (typeof act == 'string') {
      let name = act;
      let activity: IActivity | undefined;
      activity = this._getActByName(name);
      if (activity == undefined) {
        Debug.error('no activity found by name: ', name);
      }
      else {
        this._startActivity(activity, scriptName);
      }
    }
  }

  /**
   * @description extract activity code. i.e 'i11', 'i3' etc, from scriptName
   */
  public extractCode(scriptName: string): string {
    let scriptCodeParts = scriptName.split('_');
    let code = scriptCodeParts[scriptCodeParts.length - 1];

    return code;
  }

  public loadLevel(level: IScene, scriptName: string) {
    this.loadScene(level, scriptName);
  }

  private _startActivity(act: IActivity, scriptName: string) {
    // start the new activity, with the assumption that the shutdown has been handled
    this._activeActivity = act;
    act.startActivity(scriptName);
  }

  /**
  * @description say hi!
  */
  public sayHi() {
    Debug.info("Hi from UA-Engine");
  }

  /**
  * @description Start the game. Calls world.init internally, to create the game screen.
  * @param configPath the path to the config.json file, which specified Display widht, height, file paths etc
  */
  public startGame(configPath: string = './config.json') {
    return new Promise((resolve, reject) => {

      this._gameConfig.loadConfig(configPath).then((data: any) => {
        if (this._gameConfig.data.DEBUG_LEVEL !== undefined) this._debug.setLevel(this._gameConfig.data.DEBUG_LEVEL);
        this._initScaleManager();

        this._world.init(this._gameConfig.data.DISPLAY.WIDTH, this._gameConfig.data.DISPLAY.HEIGHT);

        this._addListeners();
        this._onResize();
        this._gameStarted = true;
        this._events.emit('world_initialized');
        resolve({ status: 'sucess' });

      });
    })
  }

  /**
   * @description load and start a level (via world.loadLevel). 
   * @param level the level to load
   */
  public loadScene(scene: IScene, scriptName: string) {
    this._events.emit('shutdown');
    this._scene = scene;
    this._world.startScene(scene, scriptName);
  }

  /**
   * @description Returns the preset width of the game, as specified in config.json. Suitable for positioning objects relative 
   * to the screen.
   */
  public width() {
    return this._gameWidth();
  }

  /**
   * @description Returns the preset height value of the game, as specified in config.json. Suitable for positioning objects relative
   * to the screen.
   */
  public height() {
    return this._gameHeight();
  }

  /**
   * @description Finds and returns an activity type by its code
   * @param name find the activity type by this code
   */
  private _getActByName(name: string): IActivity | undefined {
    return this._getActByProperty('name', name);
  }

  /**
  * @description Finds and returns an activity type by its name
  * @param code find the activity type by this name
  */
  private _getActByCode(code: string): IActivity | undefined {
    return this._getActByProperty('code', code);
  }

  private _getActByProperty(property: string, value: string): any | undefined {
    let acts: any[] = this._activities;
    for (let i = 0; i < this._activities.length; i++) {
      if (acts[i][property] == value) {
        return this._activities[i];
      }
    }

    Debug.warn('could not find an installed activity with %s: %s', property, value);
    return undefined;
  }

  private _onResize() {
    let target = this._scaleManager.getWidthHeight(this._gameWidth(), this._gameHeight());

    this._world.resize(target.x, target.y);
  }

  private _exposeGlobal() {
    this._expose.init();

    this._expose.add('game', this);
    this._expose.add('world', this._world);
    this._expose.add('loop', this._loop);
    this._expose.add('loader', this._loader);
    this._expose.add('events', this._events);
    this._expose.add('levelManager', this._levelManager);
    this._expose.add('gameConfig', this._gameConfig);
    this._expose.add('goFactory', this._goFactory);
    this._expose.add('geom', this._geom);
    this._expose.add('utils', this._utils);
    this._expose.add('transitions', this._transitions);
    this._expose.add('tween', this._tween);
    this._expose.add('debug', this._debug);
    this._expose.add('editor', this._editor);
    this._expose.add('activities', this._activityClasses);
    this._expose.add('physics', this._physics);
  }

  private _addListeners(): void {
    this._events.addListener('resize', this._onResize, this);

    window.addEventListener('blur', () => {
      this._events.emit('pause')
    });
    window.addEventListener('focus', () => {
      this._events.emit('resume');
    });

    window.addEventListener('resize', () => {
      this._events.fire('resize');
    });

    this._waitForFirstInput();
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