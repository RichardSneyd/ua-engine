import IObjectHandler from '../../../Services/IObjectHandler';
import Screen from '../../../Services/Screen';
import Debug from '../Debug';

/**
 * @description A mask (needs refactoring and redign)
 */
class Mask {
  private _objectHandler: IObjectHandler; _screen: Screen;

  private _x: number; _y: number; _width: number; _height: number;
  private _data: any; _initialized: boolean;

  constructor(objectHandler: IObjectHandler, screen: Screen) {
    this._objectHandler = objectHandler;
    this._screen = screen;

    this._x = 0;
    this._y = 0;
    this._width = 0;
    this._height = 0;
    this._initialized = false;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  set x(xVal: number) {
    this._x = xVal;
    this._objectHandler.setX(this._data, this._x);
  }

  set y(yVal: number) {
    this._y = yVal;
    this._objectHandler.setY(this._data, this._y);
  }

  set width(wSize: number) {
    this._width = wSize;
    this._objectHandler.setWidth(this._data, this._width);
  }

  set height(hSize: number) {
    this._height = hSize;
    this._objectHandler.setHeight(this._data, this._height);
  }

  get data(): any {
    return this._data;
  }

  public init(x: number, y: number, width: number, height: number) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;

    Debug.info("addin mask ", x, y, width, height);

    this._data = this._screen.createGraphics(x, y, width, height);
    this._initialized = true;
  }

  public createNew(): Mask {
    return new Mask(this._objectHandler, this._screen);
  }

  public scale(x: number, scaleY: number) {
    this._objectHandler.setXy(this._data, this._x * x, this._y * scaleY);
    this._objectHandler.setWidth(this._data, this._width * x);
    this._objectHandler.setHeight(this._data, this._height * scaleY);
  }

  private _updateScale() {
    /*
    this._objectHandler.setXy(this._data, this._x * this._x, this._y * this._scaleY);
    this._objectHandler.setWidth(this._data, this._width * this._x);
    this._objectHandler.setHeight(this._data, this._height * this._scaleY);
    */
  }
}

export default Mask;