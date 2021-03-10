import ObjectCore from "./ObjectCore";
import InputManager from '../../InputManager';
import IGameObject from "../IGameObject";
import Screen from "../../../../Services/Screen";
import Point from "../../../Geom/Point";
import BaseGameObject from "../BaseGameObject";
import Debug from "../../Debug";

/**
 * @description handles mouse and touch input for the attached IGameObject.
 */
class InputHandler {
  private _inputManager: InputManager;
  private _go: BaseGameObject; private _core: ObjectCore;
  private _screen: Screen;
  private _pixelPerfect: boolean = false;
  private _pixelPerfectThreshold = 127;

  get pixelPerfect(): boolean {
    return this._pixelPerfect;
  }

  get manager() {
    return this._inputManager;
  }

  constructor(inputManager: InputManager) {
    this._inputManager = inputManager;
  }

  init(go: BaseGameObject, core: ObjectCore) {
    this._go = go;
    this._core = core;
    this._screen = this._core.screen;
  }

  // this method will likely be deprecated soon, as it only works for static sprites properly
  /*  public makePixelPerfect(threshold: number = 127): boolean {
     this._screen.addHitMap(this._core.data, threshold);
     this._pixelPerfect = true;
     return true;
   } */

  public makePixelPerfect(threshold: number = 127): boolean {
    // this._screen.addHitMap(this._core.data, threshold);
    this._pixelPerfect = true;
    this._pixelPerfectThreshold = threshold;
    this._go.width = Math.round(this._go.childlessWidth);
    this._go.height = Math.round(this._go.childlessHeight);
    this._go.updateHitmap();
    return true;
  }

  get data() {
    return this._core.data;
  }

  /**
    * @description enable mouse/pointer input for the attached GameObject
    */
  public enableInput() {
    if (this._core.data.data) {
      this._inputManager.enable(this._core.data.data);
    }
    else {
      this._inputManager.enable(this._core.data);
    }
  }

  public disableInput() {
    if (this.data.data) {
      this._inputManager.disable(this.data.data);
    }
    else {
      this._inputManager.disable(this.data);
    }
  }

  public addInputListener(event: string, callback: Function, context: any, once: boolean = false) {
    this._inputManager.addListener(event, callback, this._go, context)
  }

  public removeInputListener(event: string, callback: Function) {
    this._inputManager.removeListener(event, callback, this._go);
  }

  public pixelHit(point: Point): boolean {
    // get pixel index formula: (x + y * width )* 4
    let x = Math.round(point.x - this._go.childlessLeft);
    let y = Math.round(point.y - this._go.childlessTop);
    let index: number = Math.round(x + (y * this._go.childlessWidth));
    Debug.info('x: ', x, 'y: ', y, 'width: ', this._go.childlessWidth);
    Debug.info('RGBA index: ', index, ', val: ', this._go.hitMap[index]);

    if (this._go.hitMap[index] > this._pixelPerfectThreshold) return true;
    return false;
  }

  createNew(): InputHandler {
    let input = new InputHandler(this._inputManager);
    return input;
  }
}

export default InputHandler;