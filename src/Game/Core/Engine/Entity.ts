import IScreen from '../../Services/IScreen';
import IObjectHandler from '../../Services/IObjectHandler';

class Entity {
  private _x: number;
  private _y: number;
  private _sprite: string;
  private _initialized: boolean;

  private _screen: IScreen; _objectHandler: IObjectHandler;
  private _data: any;

  constructor(screen: IScreen, objectHandler: IObjectHandler) {
    this._screen = screen;
    this._objectHandler = objectHandler;

    this._x = 0;
    this._y = 0;
    this._sprite = '';

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

  init(x: number, y: number, sprite: string): void {
    this._x = x;
    this._y = y;
    this._sprite = sprite;

    this._data = this._screen.createSprite(x, y, sprite);
  }

  createNew(): Entity {
    return new Entity(this._screen, this._objectHandler);
  }


}

export default Entity;