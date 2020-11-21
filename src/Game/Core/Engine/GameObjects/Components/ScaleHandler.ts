import GameConfig from '../../GameConfig';
import ContainerObject from '../ContainerObject';
import IGameObject from '../IGameObject';
import Events from '../../../Engine/Events';
import ScaleManager from '../../ScaleManager';
import ObjectCore from './ObjectCore';

/**
 * @description Handles the scale of the attached IGameObject.
 */
class ScaleHandler {
  private _go: IGameObject;
  private _core: ObjectCore;
  private _events: Events;
  private _scaleManager: ScaleManager;

  private _x: number;
  private _y: number;

  constructor(scaleManager: ScaleManager) {
    this._scaleManager = scaleManager;
    this._x = 1;
    this._y = 1;

  }

  public init(go: IGameObject, core: ObjectCore) {
    this._go = go;
    this._core = core;
    this._events = this._go.events;
    this._scaleManager.init();

    this.onResize();
    this._addListeners();
    // Debug.info("smanager w(%s) h(%s)", this._width, this._height);
  }

  get x(): number {
    return this._x;
  }

  get scaleFactor(): number {
    return this._scaleManager.scaleFactor();
  }

  get y(): number {
    return this._y;
  }

  set x(xVal: number) {
    this._x = xVal;

    this.updateScale();
  }

  set y(yVal: number) {
    this._y = yVal;

    this.updateScale();
  }

  /**
   * @description set the scale for both the x and y axis
   */
  set scale(scale: number){
    this._x = scale; this._y = scale;
    this.updateScale();
  }

  /**
   * @ method for setting scale. If only 1 value is provided, it will be used for both scaleX and scaleY
   * @param x 
   * @param y 
   */
  setScale(x: number, y?: number){
    if(!y) y = x;
    this._x = x;
    this._y = y;
    this.updateScale();
  }

  public createNew(): ScaleHandler {
    let handler = new ScaleHandler(this._scaleManager);
    return handler;
  }

  public onResize() {
    this._onResize();
  }

  public updateScale() {
    this._updateScale();
  }

  public getWidthHeight(x: number, y: number) {
    return this._scaleManager.getWidthHeight(x, y);
  }

   /**
   * @description Multiplies the local scale by the scaleFactor (for the screen), to provide the true scale
   * @param localScale 
   */
  public getTrueScale(localScale: number) {
    return this._scaleManager.getTrueScale(localScale);
  }

  private _updateScale() {
    let scaleX = this._x;
    let scaleY = this._y;

    this._core.objectHandler.setScale(this._core.data, scaleX, scaleY);
  }

  private _addListeners() {
    this._events.addListener('resize', this._onResize, this);
  }

  private _onResize() {    
   // this._updateScale();
  this._core.updateOrigin();
  this._core.scaleMask();
  }

  shutdown(){
    this._events.off('resize', this._onResize, this);
  }

}

export default ScaleHandler;