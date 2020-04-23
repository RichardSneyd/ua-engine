import IObjectHandler from '../../../Services/IObjectHandler';
import IScreen from '../../../Services/IScreen';


class Mask {
  private _objectHandler: IObjectHandler; _screen: IScreen;

  private _x: number; _y: number; _width: number; _height: number; _scaleX: number; _scaleY: number;
  private _data: any;

  constructor(objectHandler: IObjectHandler) {
    this._objectHandler = objectHandler;
    this._x = 0;
    this._y = 0;
    this._width = 0;
    this._height = 0;

    this._scaleX = 1;
    this._scaleY = 1;
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

  get scaleX(): number {
    return this._scaleX;
  }

  get scaleY(): number {
    return this._scaleY;
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

  set scaleX(sX: number) {
    this._scaleX = sX;
    this._updateScale();
  }

  set scaleY(sY: number) {
    this._scaleY = sY;
    this._updateScale();
  }

  get data(): any {
    return this._data;
  }

  public init(x: number, y: number, width: number, height: number) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._data = this._screen.createGraphics(x, y, width, height);
  }

  public createNew(): Mask {
    return new Mask(this._objectHandler);
  }

  private _updateScale() {
    this._objectHandler.setXy(this._data, this._x * this._scaleX, this._y * this._scaleY);
    this._objectHandler.setWidth(this._data, this._width * this._scaleX);
    this._objectHandler.setHeight(this._data, this._height * this._scaleY);
  }
}

export default Mask;