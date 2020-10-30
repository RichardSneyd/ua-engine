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

  private _scaleX: number;
  private _scaleY: number;

  constructor(scaleManager: ScaleManager) {
    this._scaleManager = scaleManager;
    this._scaleX = 1;
    this._scaleY = 1;

    // Debug.info("{debug3} scale manager allocated!");
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

  get scaleX(): number {
    return this._scaleX;
  }

  get scaleFactor(): number {
    return this._scaleManager.scaleFactor();
  }

  get scaleY(): number {
    return this._scaleY;
  }

  set scaleX(xVal: number) {
    this._scaleX = xVal;

    this.updateScale();
  }

  set scaleY(yVal: number) {
    this._scaleY = yVal;

    this.updateScale();
  }

  /**
   * @description set the scale for both the x and y axis
   */
  set scale(scale: number){
    this._scaleX = scale; this._scaleY = scale;
    this.updateScale();
  }

  /**
   * @ method for setting scale. If only 1 value is provided, it will be used for both scaleX and scaleY
   * @param x 
   * @param y 
   */
  setScale(x: number, y?: number){
    if(!y) y = x;
    this._scaleX = x;
    this._scaleY = y;
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

  public getScale(currentScale: number) {
    return this._scaleManager.getScale(currentScale);
  }

  private _updateScale() {
    let scaleX = this._scaleX;
    let scaleY = this._scaleY;

   /*  if (this._go.pcHandler.parent == null || this._go.pcHandler.parent == undefined) {
      scaleX = this._scaleManager.getScale(this._scaleX);
      scaleY = this._scaleManager.getScale(this._scaleY);
    } else {

    } */

    this._core.objectHandler.setScale(this._core.data, scaleX, scaleY);
  }

  private _addListeners() {
    this._events.addListener('resize', this._onResize, this);
  }

  private _onResize() {
    // Debug.info("{debug3} scale manager resize!", this._scaleManager.getScale(this._scaleX), this._scaleManager.getScale(this._scaleY), this._go);
    
    if (this._go instanceof ContainerObject) {
      
    } else {
    }
    
   // this._updateScale();

    if (this._go.pcHandler.parent == null || this._go.pcHandler.parent == undefined) {
    }
    //   this._core.updateXY();
  this._core.updateOrigin();
  this._core.scaleMask();


    /*
    if (this._go.pcHandler.parent == null || this._go instanceof ContainerObject) {
      this._updateScale();
      this._core.updateXY();
      this._core.updateOrigin();
    }
    */
  }

  shutdown(){
    this._events.off('resize', this._onResize, this);
  }

}

export default ScaleHandler;