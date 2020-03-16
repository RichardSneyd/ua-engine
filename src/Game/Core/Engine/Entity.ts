import AnimationManger from './AnimationManager';
import IScreen from '../../Services/IScreen';
import IObjectHandler from '../../Services/IObjectHandler';

class Entity {
  private _x: number;
  private _y: number;
  private _sprite: string;
  private _initialized: boolean;
  private _atlas: string | null;

  private _screen: IScreen; _animationManager: AnimationManger; _objectHandler: IObjectHandler;
  private _data: any;

  constructor(screen: IScreen, animationManager: AnimationManger, objectHandler: IObjectHandler) {
    this._screen = screen;
    this._animationManager = animationManager;
    this._objectHandler = objectHandler;

    this._x = 0;
    this._y = 0;
    this._sprite = '';
    this._atlas = null;

    this._initialized = false;
  }

  set x(xVal: number) {
    this._x = xVal;

    this._objectHandler.setXy(this._data, this._x, this._y);
  }

  set y(yVal: number) {
    this._y = yVal;

    this._objectHandler.setXy(this._data, this._x, this._y);
  }

  public init(x: number, y: number, sprite: string, frame: string | null = null): void {
    this._x = x;
    this._y = y;
    this._sprite = sprite;

    this._data = this._screen.createSprite(x, y, sprite, frame);

    if (frame != null) this._atlas = sprite;

    
    this._initialized = true;
  }

  public addAnimation(name: string, base: string, max: number, fps: number, data: any): void {
    this._animationManager.addAnimation(name, base, max, fps, data);
  }

  public playAnimation(name: string) {
    this._animationManager.play(name);
  }

  public createNew(): Entity {
    let am = this._animationManager.createNew();

    return new Entity(this._screen, am, this._objectHandler);
  }

  public update() {
    if (!this._initialized) return;

    let updatedFrame = this._animationManager.getUpdatedFrame();

    if (updatedFrame != null) {
      if (this._atlas != null) {
        this._screen.changeTexture(this._data, this._atlas, updatedFrame);
      } else {
        this._screen.changeTexture(this._data, updatedFrame);
      }
    }
  }


}

export default Entity;