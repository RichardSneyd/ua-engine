import ObjectCore from "./ObjectCore";
import InputManager from '../../InputManager';
import IGameObject from "../IGameObject";

class InputHandler {
  private _inputManager: InputManager;
  private _go: IGameObject;
  private _core: ObjectCore;

  constructor(inputManager: InputManager) {
    this._inputManager = inputManager;
  }

  init(go: IGameObject) {
    this._go = go;
    this._core = go.core;
  }

  get data() {
    return this._core.data;
  }

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