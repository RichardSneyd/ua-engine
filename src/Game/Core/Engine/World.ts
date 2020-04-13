import Entity from '../Engine/Entity';
import IScreen from '../../Services/IScreen';
import ILevel from '../Engine/ILevel';
import LevelManager from './LevelManager';
import Events from './Events';

class World {
  private _width: number;
  private _height: number;

  private _initialized: boolean;

  private _currentLevel: ILevel | null;

  private _entity: Entity; _screen: IScreen;
  private _events: Events;

  constructor(entity: Entity, screen: IScreen, events: Events) {
    this._width = 0;
    this._height = 0;

    this._initialized = false;

    this._entity = entity;
    this._screen = screen;

    this._events = events;
    
    this._currentLevel = null;
  }
  
  /**
   * @description initialize the game world. This generates an empty screen
   * @param w The width value to initialize the world with. Defines the width of the game screen.
   * @param h The height value to initialze the world with. Defintes the height of the game screen.
   */
  public init(w: number, h: number): void {
    let elmId: string = this._getElementName();
    
    this._width = w;
    this._height = h;
    
    this._createScreen(w, h, elmId);
    this._events.on('debugscreen', this.debugScreen, this);
  }

  /**
   * @description launches the specified level. Will automatically shutdown the currentLevel, if there is one.
   * @param level the level object to launch. 
   */
  public startLevel(level: ILevel, scriptName: string) {
    if (this._currentLevel != null) {
      this._currentLevel.shutdown();
    }

    this._screen.clearScreen();

    this._currentLevel = level;
    this._currentLevel.init(scriptName);
  }

  /**
   * @description resize the game screen
   * @param width the new width of the game screen
   * @param height the new height of the game screen
   */
  public resize(width: number, height: number) {
    this._screen.resize(width, height);
  }

  public debugScreen(){
    this._screen.debugScreen();
  }

  public width(): number{
    return <number>this._screen.width();
  }

  public height(): number {
    return <number>this._screen.height();
  }

  private _getElementName(): string {
    return 'gameBox';
  }

  //Foreign Dependencies
  private _createScreen(w: number, h: number, elmId: string): void {
    this._screen.createScreen(w, h, elmId);
  }


}

export default World;