import AnimationManager from '../AnimationManager';
import Events from '../Events';
import ScaleManager from '../ScaleManager';
import IScreen from '../../../Services/IScreen';
import IObjectHandler from '../../../Services/IObjectHandler';
import InputHandler from '../InputManager';
import Utils from '../Utils/Utils';
import MathUtils from '../Utils/MathUtils';
import Point from '../../Geom/Point';
import ResType from '../../Data/ResType';


class Entity {
  private _x: number;
  private _y: number;
  private _origin: Point; // should always be between 0 and 1.
  private _width: number;
  private _height: number;
  private _scaleX: number;
  private _scaleY: number;
  private _sprite: string;
  private _initialized: boolean;
  private _atlas: string | null;
  private _type: string = '';

  private _screen: IScreen; _animationManager: AnimationManager; _objectHandler: IObjectHandler;
  private _input: InputHandler; _math: MathUtils;
  private _data: any;
  private _events: Events; _scaleManager: ScaleManager; protected _pointFactory: Point;
  private _letters: string;
  private _pixelPerfect: boolean = false;

  private _children: Entity[];
  private _parent: Entity | null;

  constructor(screen: IScreen, animationManager: AnimationManager, objectHandler: IObjectHandler, input: InputHandler, math: MathUtils, events: Events, scaleManager: ScaleManager, pointFactory: Point) {
    this._screen = screen;
    this._animationManager = animationManager;
    this._objectHandler = objectHandler;
    this._input = input;
    this._math = math;
    this._events = events;
    this._scaleManager = scaleManager;
    this._pointFactory = pointFactory;


    this._x = 0;
    this._y = 0;
    this._origin = this._pointFactory.createNew(0.5, 0.5);
    this._width = 0;
    this._height = 0;
    this._scaleX = 1;
    this._scaleY = 1;
    this._sprite = '';
    this._atlas = null;

    this._initialized = false;
    this._letters = '$$$$____$$$$'; //default uninitialized string
    this._pixelPerfect = false;

    this._children = [];
    this._parent = null;
  }

  get type() {
    return this._type;
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
    if (this.parent == null || this.parent.type == 'container') {
      this._updateXY();
    }
    else {
      this._objectHandler.setXy(this._data, xVal, this._y);
      this._objectHandler.setPivot(this._data, this._origin);
    }
  }

  set y(yVal: number) {
    this._y = yVal;
    if (this.parent == null || this.parent.type == 'container') {
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

  get visible(): boolean {
    return this.data.visible;
  }

  set visible(visible: boolean){
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

  get text(): string {
    if (this._letters == '$$$$____$$$$') {
      console.error("this is not a text entity, can't change letters!");
      return '';
    } else {
      return this._letters;
    }
  }

  get pixelPerfect(): boolean {
    return this._pixelPerfect;
  }

  setStyle(style: any) {
    this._objectHandler.setStyle(this._data, style);
  }

  setTextColor(color: string) {
    this._objectHandler.setTextColor(this._data, color);
  }

  public destroy() {
    // remember to ALWAYS remove event listeners when destroying a GameObject
    this._events.off('resize', this._onResize);
    if(this.parent !== null) this.parent.removeChild(this);
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

  get children(): Entity[] {
    return this._children;
  }

  get parent(): Entity | null {
    return this._parent;
  }

  set parent(parent: Entity | null) {
    if (this._parent !== null) {
      this._parent.removeChild(this);
    }
    this._parent = parent;
    this._objectHandler.setXy(this.data, this._x, this._y);
    this._objectHandler.setScaleXY(this.data, 1, 1);
  }

  get data(): any {
    return this._data;
  }

  addChild(entity: Entity): boolean {
    if (!this.hasChild(entity)) {
      this._children.push(entity);
      entity.parent = this;

      // added this condition because text objects hold their Px data 1 level deeper, due to custom PxText class
      let child;
      if (entity.data.data) {
        console.log('trying to add data 1 level deeper for text...');
        child = entity.data.data;
      }
      else {
        child = entity.data;
      }
      this._data.addChild(child);

      return true;
    }
    console.warn('that is already a child of this object, and cannot be added again');
    return false;
  }

  removeChild(entity: Entity): boolean {
    if (this.hasChild(entity)) {
      this._children.splice(this._children.indexOf(entity), 1);
      this._data.removeChild(entity.data);
      return true;
    }
    console.warn('could not remove, no such entity found in children array');
    return false;
  }

  hasChild(entity: Entity): boolean {
    if (this._children.indexOf(entity) !== -1) {
      return true;
    }
    return false;
  }

  public relativeMove(xDiff: number, yDiff: number) {
    let scaleX = this._scaleManager.getScale(this._scaleX);
    let scaleY = this._scaleManager.getScale(this._scaleY);

    this.x += (xDiff / scaleX);
    this.y += (yDiff / scaleY);
  }

  public initSpine(x: number, y: number, spine: string): void {
    this._initScaleManager();
    this._type = 'spine';
    this._x = x;
    this._y = y;
    this._data = this._screen.createSpine(spine);
    this._data.x = x;
    this._data.y = y;
    this._onResize();

    this._initialized = true;

    this._addListeners();
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

  public initNineSlice(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): void {
    this._x = x;
    this._y = y;
    this._type = 'slice';
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
    this._initScaleManager();
    this._type = 'sprite';
    this._x = x;
    this._y = y;
    this._sprite = sprite;

    this._data = this._screen.createSprite(x, y, sprite, frame);
    this._width = this._data.width;
    this._height = this._data.height;
    if (frame != null) this._atlas = sprite;
    this._onResize();

    this._initialized = true;

    this._addListeners();
  }

  public initContainer(x: number, y: number): void {
    this._initScaleManager();
    this._type = 'container';
    this._x = x;
    this._y = y;
    this._data = this._screen.createContainer(x, x);
    this._initialized = true;
    this._width = this._data.width;
    this._height = this._data.height;
  }

  public initText(x: number, y: number, text: string, style: any = undefined) {
    this._initScaleManager();
    this._type = 'text';
    this._x = x;
    this._y = y;

    this._letters = text;

    this._data = this._screen.createText(x, y, text, style);
    this._width = this._data.width;
    this._height = this._data.height;
    this._onResize();

    this._initialized = true;

    this._addListeners();
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

  public playAnimation(name: string, loop: boolean = false) {
    this._animationManager.play(name, loop);
  }

  public playSpineAnimation(name: string) {
    this._animationManager.playSpine(name);
  }

  public enableInput() {
    if (this._data.data) {
      this._input.enable(this._data.data);
    }
    else {
      this._input.enable(this._data);
    }
  }

  public disableInput() {
    if (this._data.data) {
      this._input.disable(this._data.data);
    }
    else {
      this._input.disable(this._data);
    }
  }

  public addInputListener(event: string, callback: Function, context: any, once: boolean = false) {
    if (this._data.data) {
      this._input.addListener(event, callback, this._data.data, context);
    }
    else {
      this._input.addListener(event, callback, this._data, context);
    }
  }

  public removeInputListener(event: string, callback: Function) {
    if (this._data.data) {
      this._input.removeListener(event, callback, this._data.data);
    }
    else {
      this._input.removeListener(event, callback, this._data);
    }
  }


  public createNew(): Entity {
    let am = this._animationManager.createNew();
    //  console.log('new am: ', am);
    return new Entity(this._screen, am, this._objectHandler, this._input, this._math, this._events, this._scaleManager.createNew(), this._pointFactory);
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
    if (this.parent == null || this.parent.type == 'container') {
      this._updateScale();
      this._updateXY();
    }
  }

  private _initScaleManager(): void {
    this._scaleManager.init();
  }


}

export default Entity;