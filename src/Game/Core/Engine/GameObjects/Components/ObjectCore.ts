import AnimationManager from '../../AnimationManager';
import Events from '../../Events';
import ScaleManager from './ScaleHandler';
import IScreen from '../../../../Services/IScreen';
import IObjectHandler from '../../../../Services/IObjectHandler';
import InputHandler from './InputHandler';
import Utils from '../../Utils/Utils';
import MathUtils from '../../Utils/MathUtils';
import Point from '../../../Geom/Point';
import ResType from '../../../Data/ResType';
import IGameObject from '../IGameObject';
import ContainerObject from '../ContainerObject';


class ObjectCore {
  private _x: number;
  private _y: number;
  private _origin: Point; // should always be between 0 and 1.
  private _width: number;
  private _height: number;
  private _scaleX: number;
  private _scaleY: number;
  private _textureName: string;
  private _initialized: boolean;
  private _atlas: string | null;

  private _screen: IScreen; _animationManager: AnimationManager; _objectHandler: IObjectHandler;
  private _input: InputHandler; _math: MathUtils;
  private _data: any;
  private _events: Events; _scaleHandler: ScaleManager; protected _pointFactory: Point;
  private _letters: string;
  private _pixelPerfect: boolean = false;

  private _go: IGameObject;

  constructor(screen: IScreen, animationManager: AnimationManager, objectHandler: IObjectHandler, input: InputHandler, math: MathUtils, events: Events, pointFactory: Point) {
    this._screen = screen;
    this._animationManager = animationManager;
    this._objectHandler = objectHandler;
    this._input = input;
    this._math = math;
    this._events = events;
    this._pointFactory = pointFactory;


    this._x = 0;
    this._y = 0;
    this._origin = this._pointFactory.createNew(0.5, 0.5);
    this._width = 0;
    this._height = 0;
    this._scaleX = 1;
    this._scaleY = 1;
    this._textureName = '';
    this._atlas = null;

    this._initialized = false;
    this._pixelPerfect = false;
  }

  // keep this one for GENERIC initializations 
  public init(go: IGameObject, x: number, y: number, textureName: string = '') {
    this._go = go;
    this._scaleHandler = go.scaleManager;
    this._x = x;
    this._y = y;
    this._textureName = textureName;
    this._data.x = x;
    this._data.y = y;
    this._initialized = true;
  }

  get objectHandler() {
    return this._objectHandler;
  }

  get textureName() {
    return this._textureName;
  }

  set textureName(name: string) {
    this._textureName = name;
  }

  set x(xVal: number) {
    this._x = xVal;
    if (this._go.pcHandler.parent == null || this._go.pcHandler.parent instanceof ContainerObject) {
      this._updateXY();
    }
    else {
      this._objectHandler.setXy(this._data, xVal, this._y);
      this._objectHandler.setPivot(this._data, this._origin);
    }
  }

  set y(yVal: number) {
    this._y = yVal;
    if (this._go.pcHandler.parent == null || this._go.pcHandler.parent instanceof ContainerObject) {
      this._updateXY();
    }
    else {
      this._objectHandler.setPivot(this._data, this._origin);
      this._objectHandler.setXy(this._data, this._x, yVal);
    }
  }

  set width(width: number) {
    this._width = width;

    this._objectHandler.setPivot(this._data, this._origin);
    this._objectHandler.setSize(this._data, this._width, this._height);
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get events() {
    return this._events;
  }

  set origin(origin: Point) {
    this._origin.x = origin.x;
    this._origin.y = origin.y;
    this._objectHandler.setPivot(this._data, this._origin);
    this._objectHandler.setXy(this._data, this._x, this._y);
  }

  get origin() {
    return this._origin;
  }

  set height(height: number) {
    this._height = height;

    this._objectHandler.setSize(this._data, this._width, height);
  }

  setSize(width: number, height: number) {
    this._width = width;
    this._height = height;
    this._objectHandler.setSize(this._data, this._width, this._height);
    this._updateXY();
  }



  set scaleX(xVal: number) {
    this._scaleX = xVal;

    this._scaleHandler.updateScale();
  }

  set scaleY(yVal: number) {
    this._scaleY = yVal;

    this._scaleHandler.updateScale();
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get visible(): boolean {
    return this.data.visible;
  }

  set visible(visible: boolean) {
    this.data.visible = visible;
  }

  get input(): InputHandler {
    return this._input;
  }

  get scaleX(): number {
    return this._scaleX;
  }

  get scaleY(): number {
    return this._scaleY;
  }

  get atlas() {
    return this._atlas;
  }

  set atlas(atlas: any) {
    this._atlas = atlas;
  }

  get pixelPerfect(): boolean {
    return this._pixelPerfect;
  }

  public destroy() {
    // remember to ALWAYS remove event listeners when destroying a GameObject
    this._events.off('resize', this._go.scaleManager.onResize);
    this._objectHandler.destroy(this._data);
  }

  public makePixelPerfect(threshold: number = 127): boolean {

    /*  if(this._data.type !== ResType.IMG){
       return false;
     } */
    this._screen.addHitMap(this._data, threshold);
    this._pixelPerfect = true;
    return true;
  }

  get data(): any {
    return this._data;
  }

  set data(data: any) {
    this._data = data;
  }
  public relativeMove(xDiff: number, yDiff: number) {
    let scaleX = this._scaleHandler.getScale(this._scaleX);
    let scaleY = this._scaleHandler.getScale(this._scaleY);

    this.x += (xDiff / scaleX);
    this.y += (yDiff / scaleY);
  }

  public moveBy(x: number, y: number) {
    let xVal = this.x + x;
    let yVal = this.y + y;
    this.x = xVal;
    this.y = yVal;
  }

  public moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public setOrigin(x: number, y?: number) {
    let yVal: number;
    if (y) {
      yVal = y;
    }
    else {
      yVal = x;
    }

    this.origin = this._pointFactory.createNew(x, yVal);
  }

  public anim() {
    return this._animationManager;
  }

  public enableInput() {
    this._input.enableInput();
  }

  public createNew(): ObjectCore {
    let am = this._animationManager.createNew();
    //  console.log('new am: ', am);
    return new ObjectCore(this._screen, am, this._objectHandler, this._input, this._math, this._events, this._pointFactory);
  }

  public changeTexture(textureName: string) {
    if (this._atlas != null) {
      this._screen.changeTexture(this._data, this._atlas, textureName);
    } else {
      this._screen.changeTexture(this._data, textureName);
    }
  }

  public update(time: number) {
    if (!this._initialized) return;

    let updatedFrame = this._animationManager.getUpdatedFrame();

    if (updatedFrame != null) {
      if (this._atlas != null) {
        this._screen.changeTexture(this._data, this._atlas, updatedFrame);
      } else {
        this._screen.changeTexture(this._data, updatedFrame);
      }
    }

    this._animationManager.update(time);
  }

  updateXY() {
    this._updateXY();
  }

  private _updateXY() {
    let target = this._scaleHandler.getXY(this._x, this._y);

    this._objectHandler.setXy(this._data, target.x, target.y);
  }


}

export default ObjectCore;