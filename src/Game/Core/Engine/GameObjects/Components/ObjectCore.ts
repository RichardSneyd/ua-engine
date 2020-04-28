import AnimationManager from './AnimationManager';
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
import Mask from '../Mask';


class ObjectCore {
  private _x: number;
  private _y: number;
  private _origin: Point; // should always be between 0 and 1.
  private _width: number;
  private _height: number;
  private _textureName: string;
  private _initialized: boolean;
  private _atlas: string | null;

  private _screen: IScreen; _animationManager: AnimationManager; _objectHandler: IObjectHandler;
  private _input: InputHandler; _math: MathUtils;
  private _data: any;
  private _events: Events; _scaleHandler: ScaleManager; protected _pointFactory: Point;
  private _letters: string;

  private _go: IGameObject;
  private _mask: Mask;

  constructor(screen: IScreen, animationManager: AnimationManager, mask: Mask, objectHandler: IObjectHandler, input: InputHandler, math: MathUtils, events: Events, pointFactory: Point) {
    this._screen = screen;
    this._animationManager = animationManager;
    this._objectHandler = objectHandler;
    this._input = input;
    this._math = math;
    this._events = events;
    this._pointFactory = pointFactory;
    this._x = 0;
    this._y = 0;
    this._origin = this._pointFactory.createNew(0, 0);
    this._width = 0;
    this._height = 0;
    this._textureName = '';
    this._atlas = null;
    this._mask = mask;

    this._initialized = false;
  }

  // keep this one for GENERIC initializations 
  public init(go: IGameObject, x: number, y: number, textureName: string = '') {
    this._go = go;
    this._scaleHandler = go.scaleHandler;
    this._x = x;
    this._y = y;
    this._textureName = textureName;
    this._data.x = x;
    this._data.y = y;
    this._initialized = true;

    this._importSize();
  }

  get objectHandler() {
    return this._objectHandler;
  }

  get screen(){
    return this._screen;
  }

  get textureName() {
    return this._textureName;
  }

  set textureName(name: string) {
    this._textureName = name;
  }

  set x(xVal: number) {
    this._x = xVal;
    this._updateXY();
    this.updateOrigin();
  }

  set y(yVal: number) {
    this._y = yVal;
    this._updateXY();
    this.updateOrigin();
  }

  set width(width: number) {
    this._width = width;

    this._updateSize();
    this.updateOrigin();
  }

  set height(height: number) {
    this._height = height;

    this._updateSize();
    this.updateOrigin();
  }

  get animations(){
    return this._animationManager;
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
    this.updateOrigin()
    this._objectHandler.setXy(this._data, this._x, this._y);
  }

  get origin() {
    return this._origin;
  }

  setSize(width: number, height: number) {
    this._width = width;
    this._height = height;
    this._updateSize();
    this._updateXY();
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

  get atlas() {
    return this._atlas;
  }

  set atlas(atlas: any) {
    this._atlas = atlas;
  }

  get pixelPerfect(): boolean {
    return this._input.pixelPerfect;
  }

  public enableMask(x: number, y: number, width: number, height: number) {
    this._mask.init(x, y, width, height);

    this._objectHandler.setMask(this._data, this._mask.data);
  }

  public disableMask() {
    this._objectHandler.setMask(this._data, null);
  }

  public destroy() {
    // remember to ALWAYS remove event listeners when destroying a GameObject
    this._events.off('resize', this._go.scaleHandler.onResize);
    this._objectHandler.destroy(this._data);
  }

  get data(): any {
    return this._data;
  }

  set data(data: any) {
    this._data = data;
  }
  public relativeMove(xDiff: number, yDiff: number) {
    let scaleX = this._scaleHandler.getScale(this._go.scaleHandler.scaleX);
    let scaleY = this._scaleHandler.getScale(this._go.scaleHandler.scaleY);

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
    let xVal = x;
    if (y) {
      yVal = y;
    }
    else {
      yVal = xVal;
    }

    this.origin = this._pointFactory.createNew(xVal, yVal);
  }

  updateOrigin(){
    let scaleX = this._scaleHandler.getScale(this._scaleHandler.scaleX);
    let scaleY = this._scaleHandler.getScale(this._scaleHandler.scaleY);

    let p = this._pointFactory.createNew(this._origin.x * scaleX, this._origin.y * scaleY);
    this._objectHandler.setPivot(this._data, p);
  }

  public anim() {
    return this._animationManager;
  }

  public enableInput() {
    this._input.enableInput();
  }

  public makePixelPerfect(threshold?: number) {
    this._go.input.makePixelPerfect(threshold);
  }

  public createNew(): ObjectCore {
    let am = this._animationManager.createNew();
    //  console.log('new am: ', am);
    return new ObjectCore(this._screen, am, this._mask.createNew(), this._objectHandler, this._input, this._math, this._events, this._pointFactory);
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

  public updateXY() {
    this._updateXY();
  }

  public scaleMask() {
    if (this._mask.initialized) {
      let scaleX = this._scaleHandler.getScale(this._go.scaleHandler.scaleX);
      let scaleY = this._scaleHandler.getScale(this._go.scaleHandler.scaleY);

      this._mask.scale(scaleX, scaleY);
    }
  }

  private _updateXY() {
    let target = this._scaleHandler.getXY(this._x, this._y);

    this._objectHandler.setXy(this._data, target.x, target.y);
  }

  private _importSize() {
    let scaleX = this._scaleHandler.getScale(this._go.scaleHandler.scaleX);
    let scaleY = this._scaleHandler.getScale(this._go.scaleHandler.scaleY);

    this._width = this._objectHandler.getSize(this._data).width / scaleX;
    this._height = this._objectHandler.getSize(this._data).height / scaleY;
  }

  private _updateSize() {
    let scaleX = this._scaleHandler.getScale(this._go.scaleHandler.scaleX);
    let scaleY = this._scaleHandler.getScale(this._go.scaleHandler.scaleY);

    this._objectHandler.setSize(this._data, this._width * scaleX, this._height * scaleY);
  }


}

export default ObjectCore;