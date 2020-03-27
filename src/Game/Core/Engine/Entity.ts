import AnimationManger from './AnimationManager';
import IScreen from '../../Services/IScreen';
import IObjectHandler from '../../Services/IObjectHandler';
import InputHandler from './InputHandler';
import Utils from './Utils/Utils';
import MathUtils from './Utils/MathUtils';
import Point from '../Data/Point';

class Entity {
  private _x: number;
  private _y: number;
  private _origin: Point; // should always be between 0 and 1.
  private _width: number;
  private _height: number;
  private _sprite: string;
  private _initialized: boolean;
  private _atlas: string | null;

  private _screen: IScreen; _animationManager: AnimationManger; _objectHandler: IObjectHandler;
  private _input: InputHandler; _math: MathUtils;
  private _data: any;

  constructor(screen: IScreen, animationManager: AnimationManger, objectHandler: IObjectHandler, input: InputHandler, math: MathUtils) {
    this._screen = screen;
    this._animationManager = animationManager;
    this._objectHandler = objectHandler;
    this._input = input;
    this._math = math;

    this._x = 0;
    this._y = 0;
    this._origin = new Point(0.5, 0.5);
    this._width = 0;
    this._height = 0;
    this._sprite = '';
    this._atlas = null;

    this._initialized = false;
  }

  set x(xVal: number) {
    this._x = xVal;
    this._objectHandler.setXy(this._data, xVal, this._y);
  }

  set y(yVal: number) {
    this._y = yVal;
    this._objectHandler.setXy(this._data, this._x, yVal);
  }

  set width(width: number) {
    this._width = width;

    this._objectHandler.setSize(this._data, this._width, this._height);
    this._objectHandler.setPivot(this._data, this._origin);
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  set origin(origin: Point) {
    this._origin.x = this._math.clamp(origin.x, 0, 1);
    this._origin.y = this._math.clamp(origin.y, 0, 1);
    this._objectHandler.setPivot(this._data, this._origin);
  }

  get origin(){
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
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get input(): InputHandler {
    return this._input;
  }

  public initSpine(x: number, y: number, spine: string): void {
    this._x = x;
    this._y = y;
    this._data = this._screen.createSpine(spine);
    this._data.x = x;
    this._data.y = y;

    this._initialized = true;
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

  public setOrigin(x: number, y?: number){
    let yVal: number;
    if(y == undefined){
      yVal = x;
    }
    else {
      yVal = y;
    }

    this.origin = new Point(x, yVal);
  }

  public initNineSlice(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): void {
    this._x = x;
    this._y = y;
    this._data = this._screen.createNineSlice(x, y, textureName, leftWidth, topHeight, rightWidth, bottomHeight);
    this._data.x = x;
    this._data.y = y;
    //  console.log('boudns before calc', this._data.getBounds());
    this._data.calculateBounds();
    console.log(this._data);
    this._width = this._data.width;
    this._height = this._data.height;
    console.log('_data: ', this._data);
    this.setOrigin(0.5);
   // debugger;

    //  console.log('bounds after calc: ', this._data.getBounds());
    this._initialized = true;
    //  debugger;
  }

  public init(x: number, y: number, sprite: string, frame: string | null = null): void {
    this._x = x;
    this._y = y;
    this._sprite = sprite;

    this._data = this._screen.createSprite(x, y, sprite, frame);

    if (frame != null) this._atlas = sprite;

    this._initialized = true;
  }

  public addTween(name: string, easing: string) {
    this._animationManager.addTween(name, easing, this);
  }

  public playTween(name: string, toObject: any, time: number, updateFunction: Function = () => { }) {
    this._animationManager.playTween(name, toObject, time, () => {

      updateFunction();
    });
  }

  public pauseTween(name: string) {
    this._animationManager.pauseTween(name);
  }

  public resumeTween(name: string) {
    this._animationManager.resumeTween(name);
  }

  public pauseAnimation(name: string) {
    this._animationManager.pause(name);
  }

  public resumeAnimation(name: string) {
    this._animationManager.resume(name);
  }

  public addAnimation(name: string, base: string, max: number, fps: number, data: any): void {
    this._animationManager.addAnimation(name, base, max, fps, data);
  }

  public addSpineAnimation(name: string, fps: number) {
    this._animationManager.addSpineAnimation(name, fps, this._data);
  }

  public playAnimation(name: string) {
    this._animationManager.play(name);
  }

  public playSpineAnimation(name: string) {
    this._animationManager.playSpine(name);
  }

  public enableInput() {
    this._input.enable(this._data);
  }

  public disableInput() {
    this._input.disable(this._data);
  }

  public addInputListener(event: string, callback: Function, context: any, once: boolean = false) {
    this._input.addListener(event, callback, this._data, context);
  }

  public removeInputListener(event: string, callback: Function) {
    this._input.removeListener(event, callback, this._data);
  }


  public createNew(): Entity {
    let am = this._animationManager.createNew();
    console.log('new am: ', am);
    return new Entity(this._screen, am, this._objectHandler, this._input, this._math);
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


}

export default Entity;