import Events from "./Events";
import Loader from "./Loader";
//import Screen from "../../Services/Screen";
import ITappable from './ITappable';
import Point from "../Data/Point";
import Entity from "./Entity";
import IScreen from "../../Services/IScreen";

class InputHandler {
    _events: Events; _loader: Loader; _screen: IScreen;
    enabled: any[] = []; // a list of the enabled display objects
   // _listeners: any = {};
   // _onUp: any[] = [];
    _pointer: Point; // the mouse/pointer x, y
    _pointerMovement: Point; // the number of pixels the mouse x and y have moved since the last mousemove/pointermove event

    constructor(events: Events, loader: Loader, screen: IScreen) {
        this._events = events; this._loader = loader; this._screen = screen;
       // this._onDown = [];
      //  this._onUp = [];
        this._pointer = new Point(0, 0);
        this._pointerMovement = new Point(0, 0);

        // catch Sprite from inputdown event (mousedown and touchstart)
     //   this._events.on('inputdown', this._onInputDown, this);
    //    this._events.on('inputup', this._onInputUp, this);
        this._events.on('pointermove', this._onPointerMove, this);
    }

    get pointer() {
        return this._pointer;
    }

    private _onPointerMove(data: any) { // data should contain x nd y vals for mouse or pointer position on stage
      //  console.warn('pointermove in inputHandler: ', data.mouseX, data.mouseY);
        this._pointer = data.mouseX;
        this._pointer = data.mouseY;
        this._pointerMovement.x = data.moveX;
        this._pointerMovement.y = data.moveY;
    }

    enable(displayObject: any) {
        this._screen.enableInput(displayObject);
    }

    disable(displayObject: any) {
        this._screen.disableInput(displayObject);
    }

    /* addDownListener(callback: Function, sprite: any, context: any, once: boolean = false) {
        this._screen.addDownListener(sprite, callback, context);
       // this._onDown.push({ callback: callback, sprite: sprite, context: context, once: once })
    }
 */
    addListener(event: string, callback: Function, sprite: any, context: any, once: boolean = false) {
        this._screen.addListener(event, sprite, (evt: any)=>{
            if(once == true){

            }
            callback.bind(context)(evt);
        }, context);
     //   this._onUp.push({ callback: callback, sprite: sprite, context: context, once: once })
    }

    removeListener(event: string, callback: Function, sprite: any) {
        this._screen.removeListener(event, sprite, callback);
    }

    private _call(data: any, arr: any[]){
        let obj = this._find(data, arr);
        let evt = data.evt;
        obj.callback.bind(obj.context)(evt);
    }

    private _find(data: any, arr: any[]) : any{
        let sprite = data.sprite;

        for (let x = 0; x < arr.length; x++) {
            let obj = arr[x];
            if (sprite.name == obj.sprite.name) {
                return obj;
            }
        }

        console.error('%s has no listener', data.sprite);
        return null;
    }
}

export default InputHandler;