import ObjectCore from "./ObjectCore";
import InputManager from '../../InputManager';
import IGameObject from "../IGameObject";
import Screen from "../../../../Services/Screen";
import Point from "../../../Geom/Point";
import BaseGameObject from "../BaseGameObject";
import Debug from "../../Debug";
import IPoint from "../../../Geom/IPoint";

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

  public makePixelPerfect(threshold: number = 127) {
    // this._screen.addHitMap(this._core.data, threshold);
    this._pixelPerfect = true;
    this._pixelPerfectThreshold = threshold;
    this._go.width = Math.round(this._go.childlessWidth);
    this._go.height = Math.round(this._go.childlessHeight);
    this._go.updateHitmap.bind(this._go)();

    if (!this._go.data.containsPoint) {
     /*  this._go.data.children.forEach((c: any) => {
        c.children.forEach((c2: any) => {
          // console.log('add containsPoint for child level 2', c2);
          c2.containsPoint = () => {
            return false;
          }
        });
      }); */

      // turns out this also works:
      this._go.data.interactiveChildren = false;
    }

    this._go.data.containsPoint = (point: IPoint) => {
      // Debug.info('containsPoint called for ', this._go.name);
      let factor = this._go.scaleHandler.scaleFactor;
      let _point = { x: point.x / factor, y: point.y / factor }
      if (this.inBounds(_point)) {
        //  Debug.info('in bounds for ', this._go.name, ' at ', new Date());
        // return true; // returning bounds slightly down and to the rigth?
        return this.pixelHit(_point);
      }
      return false;
    };
    //  return true;
  }

  public inBounds(point: IPoint): boolean {
    return this._go.inBounds.bind(this._go)(point);
  }

  public pixelHit(point: IPoint): boolean {
    // get pixel index formula: (x + y * width )* 4
    let x = Math.round(point.x - this._go.globalLeft);
    let y = Math.round(point.y - this._go.globalTop);
    let index: number = Math.round(x + (y * this._go.childlessWidth));
    //  Debug.info('x: ', x, 'y: ', y, 'width: ', this._go.childlessWidth);
    //   Debug.info('RGBA index: ', index, ', val: ', this._go.hitMap[index]);

    if (this._go.hitMap[index] > this._pixelPerfectThreshold) {
      return true;
    }
    return false;
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

  public removeInputListener(event: string, callback: Function, context: any) {
    this._inputManager.removeListener(event, callback, this._go, context);
  }

  createNew(): InputHandler {
    let input = new InputHandler(this._inputManager);
    return input;
  }
}

export default InputHandler;