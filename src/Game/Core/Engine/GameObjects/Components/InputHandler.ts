import ObjectCore from "./ObjectCore";
import InputManager from '../../InputManager';
import IGameObject from "../IGameObject";
import Screen from "../../../../Services/Screen";

/**
 * @description handles mouse and touch input for the attached IGameObject.
 */
class InputHandler {
  private _inputManager: InputManager;
  private _go: IGameObject; private _core: ObjectCore;
  private _screen: Screen;
  private _pixelPerfect: boolean = false;

  get pixelPerfect(): boolean {
    return this._pixelPerfect;
  }

  get manager(){
    return this._inputManager;
  }

  constructor(inputManager: InputManager) {
    this._inputManager = inputManager;
  }

  init(go: IGameObject, core: ObjectCore) {
    this._go = go;
    this._core = core;
    this._screen = this._core.screen;
  }

  public makePixelPerfect(threshold: number = 127): boolean {

    /*  if(this._data.type !== ResType.IMG){
       return false;
     } */
    this._screen.addHitMap(this._core.data, threshold);
    this._pixelPerfect = true;
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
    if (this._core.data.data) {
      this._inputManager.addListener(event, callback, this.data.data, context);
    }
    else {
      this._inputManager.addListener(event, callback, this.data, context);
    }
  }

  public removeInputListener(event: string, callback: Function) {
    if (this.data.data) {
      this._inputManager.removeListener(event, callback, this.data.data);
    }
    else {
      this._inputManager.removeListener(event, callback, this.data);
    }
  }

  createNew(): InputHandler {
    let input = new InputHandler(this._inputManager);
    return input;
  }
}

export default InputHandler;