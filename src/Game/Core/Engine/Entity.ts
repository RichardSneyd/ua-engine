import AnimationManager from './AnimationManager';
import Events from './Events';
import ScaleManager from './ScaleManager';
import IScreen from '../../Services/IScreen';
import IObjectHandler from '../../Services/IObjectHandler';

class Entity {
  private _x: number;
  private _y: number;
  private _scaleX: number;
  private _scaleY: number;
  private _sprite: string;
  private _initialized: boolean;
  private _atlas: string | null;

  private _screen: IScreen; _animationManager: AnimationManager; _objectHandler: IObjectHandler;
  private _events: Events; _scaleManager: ScaleManager;
  private _data: any;

  private _letters: string;

  constructor(screen: IScreen, animationManager: AnimationManager, objectHandler: IObjectHandler,
              events: Events, scaleManager: ScaleManager) {
    this._screen = screen;
    this._animationManager = animationManager;
    this._objectHandler = objectHandler;
    this._events = events;
    this._scaleManager = scaleManager;

    this._x = 0;
    this._y = 0;
    this._scaleX = 1;
    this._scaleY = 1;
    this._sprite = '';
    this._atlas = null;

    this._initialized = false;
    this._letters = '$$$$____$$$$'; //default uninitialized string
  }

  set text(lett: string) {
    if (this._letters == '$$$$____$$$$') {
      console.error("this is not a text entity, can't change letters!");
    } else {
      this._letters = lett;
    }
  }

  set x(xVal: number) {
    this._x = xVal;

    this._updateXY();
  }

  set y(yVal: number) {
    this._y = yVal;

    this._updateXY();
  }

  set scaleX(xVal: number) {
    this._scaleX = xVal;

    this._updateScale();
  }

  set scaleY(yVal: number) {
    this._scaleY = yVal;

    this._updateScale();
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get scaleX(): number {
    return this._scaleX;
  }

  get scaleY(): number {
    return this._scaleY;
  }

  get text(): string {
    if (this._letters == '$$$$____$$$$') {
      console.error("this is not a text entity, can't change letters!");
      return '';
    } else {
      return this._letters;
    }
  }

  public initSpine(x: number, y: number, spine: string): void {
    this._x = x;
    this._y = y;
    this._data = this._screen.createSpine(spine);
    this._data.x = x;
    this._data.y = y;
    this._onResize();

    this._initialized = true;

    this._addListeners();
  }

  public init(x: number, y: number, sprite: string, frame: string | null = null): void {
    this._x = x;
    this._y = y;
    this._sprite = sprite;

    this._data = this._screen.createSprite(x, y, sprite, frame);

    if (frame != null) this._atlas = sprite;
    this._onResize();

    this._initialized = true;

    this._addListeners();
  }

  public initText(x: number, y: number, text: string, style: any = undefined) {
    this._x = x;
    this._y = y;

    this._letters = text;

    this._data = this._screen.createText(x, y, text, style);
    this._onResize();

    this._initialized = true;

    this._addListeners();
  }

  public addTween(name: string, easing: string) {
    this._animationManager.addTween(name, easing, this);
  }

  public playTween(name: string, toObject: any, time: number, updateFunction: Function = ()=>{}) {
    this._animationManager.playTween(name, toObject, time, () =>{

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

  public createNew(): Entity {
    let am = this._animationManager.createNew();

    return new Entity(this._screen, am, this._objectHandler, this._events, this._scaleManager.createNew());
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

  private _updateScale() {
    let scaleX = this._scaleManager.getScale(this._scaleX);
    let scaleY = this._scaleManager.getScale(this._scaleY);

    this._objectHandler.setScaleXY(this._data, scaleX, scaleX);
  }

  private _updateXY() {
    let target = this._scaleManager.getXY(this._x, this._y);

    this._objectHandler.setXy(this._data, target.x, target.y);
  }

  private _addListeners() {
    this._events.addListener('resize', this._onResize, this);
  }

  private _onResize() {
    this._updateScale();
    this._updateXY();
  }


}

export default Entity;