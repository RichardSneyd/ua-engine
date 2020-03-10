import Entity from '../Engine/Entity';
import IScreen from '../../Services/IScreen';
import ILevel from '../Engine/ILevel';

class World {
  private _width: number;
  private _height: number;

  private _initialized: boolean;

  private _currentLevel: ILevel | null;

  private _entity: Entity; _screen: IScreen;
  constructor(entity: Entity, screen: IScreen) {
    this._width = 0;
    this._height = 0;

    this._initialized = false;

    this._entity = entity;
    this._screen = screen;

    this._currentLevel = null;
  }

  public init(w: number, h: number): void {
    let elmId: string = this._getElementName();

    this._width = w;
    this._height = h;

    this._createScreen(w, h, elmId);
  }

  public startLevel(level: ILevel) {
    if(this._currentLevel != null) {
      this._currentLevel.shutdown();
    }

    this._screen.clearScreen();

    this._currentLevel = level;
    this._currentLevel.init();
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