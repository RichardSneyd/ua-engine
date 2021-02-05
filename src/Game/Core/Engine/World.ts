//import ObjectCore from './GameObjects/Components/ObjectCore';
import Screen from '../../Services/Screen';
import IScene from './Activities/IScene';
import LevelManager from './LevelManager';
import Events from './Events';

/**
 * @description the world class
 */
class World {
  private _width: number;
  private _height: number;

  private _screen: Screen;

  private _initialized: boolean;

  private _currentLevel: IScene | null;

  //private _objectCore: ObjectCore; _screen: Screen;
  private _events: Events;

  constructor(screen: Screen, events: Events) {
    this._width = 0;
    this._height = 0;

    this._initialized = false;

    // this._objectCore;
    this._screen = screen;

    this._events = events;

    this._currentLevel = null;
  }

  get initialized(): boolean {
    return this._initialized;
  }

    /**
   * @description this is the PIXI container to which activities are added and removed at scene load and shutdown
   */
  get activityCont(){
    return this._screen.activityCont;
  }

  /**
   * @description this is the PIXI container that overlays the 'activityCont', to be used for HUD elements such as toolbars, transitions etc, that exist seperate, and on top of, the
   * levels/scenes.
   */
  get overlay() {
    return this._screen.overlay;
  }

  /**
   * @description Initialize the game world. This generates an empty screen
   * @param w The width value to initialize the world with. Defines the width of the game screen.
   * @param h The height value to initialze the world with. Defintes the height of the game screen.
   */
  public init(w: number, h: number): void {
    let elmId: string = this._getElementName();

    this._width = w;
    this._height = h;

    this._createScreen(w, h, elmId);
    this._events.on('debugscreen', this.debugScreen, this);
    this._initialized = true;
  }

  /**
   * @description Launches the specified level/scene (could be an activity or a menu). Will automatically shutdown the currentLevel, if there is one.
   * @param level the scene/level object to launch. 
   */
  public startScene(level: IScene, scriptName: string) {
    if (this._currentLevel != null) {
      this._currentLevel.shutdown();
    }

    // this._screen.clearScreen();
    this._screen.newLevel();
    this._currentLevel = level;
    this._currentLevel.init(scriptName);
  }

  /**
   * @description Resize the game screen
   * @param width the new width of the game screen
   * @param height the new height of the game screen
   */
  public resize(width: number, height: number) {
    this._screen.resize(width, height);
  }

  public debugScreen() {
    this._screen.debugScreen();
  }

  /**
   * @description Returns literal width value from PxGame. NOT suitable for positioning objects on screen; use game.width instead.
   */
  public pixelWidth(): number {
    return <number>this._screen.width();
  }

  /**
   * @description Returns literal height value from PxGame. NOT suitable for positioning objects on screen; use game.height instead.
   */
  public pixelHeight(): number {
    return <number>this._screen.height();
  }

  private _getElementName(): string {
    return 'gameBox';
  }

  /**
   * @description Foreign Dependencies
   * @param w 
   * @param h 
   * @param elmId 
   */
  private _createScreen(w: number, h: number, elmId: string): void {
    this._screen.createScreen(w, h, elmId);
  }


}

export default World;