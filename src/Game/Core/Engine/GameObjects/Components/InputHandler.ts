import Entity from "./Entity";
import InputManager from '../../InputManager';

class InputHandler {
    private _inputManager: InputManager;
    private _entity: Entity;

    constructor(inputManager: InputManager){
        this._inputManager = inputManager;
    }

    init(entity: Entity){
        this._entity = entity;
    }

    get data(){
        return this._entity.data;
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
        if (this._entity.data.data) {
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
    
    createNew(): InputHandler{
      let input =  new InputHandler(this._inputManager);
      return input;
    }
}

export default InputHandler;