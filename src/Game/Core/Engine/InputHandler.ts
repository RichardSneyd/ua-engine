import Events from "./Events";
import Loader from "./Loader";
//import Screen from "../../Services/Screen";
import ITappable from './ITappable';
import Point from "../Geom/Point";
import Entity from "./Entity";
import IScreen from "../../Services/IScreen";
import EventNames from "./EventNames";


class InputHandler {
    private _eventNames: EventNames;
    private _events: Events; private _loader: Loader; private _screen: IScreen;
    private _pointer: Point; // the mouse/pointer x, y
    private _pointerMovement: Point; // the number of pixels the mouse x and y have moved since the last mousemove/pointermove event

    constructor(events: Events, loader: Loader, screen: IScreen, eventNames: EventNames) {
        this._events = events; this._loader = loader; this._screen = screen;this._eventNames = eventNames;
        // this._onDown = [];
        //  this._onUp = [];
        this._pointer = new Point(0, 0);
        this._pointerMovement = new Point(0, 0);

        // catch Sprite from inputdown event (mousedown and touchstart)
        //   this._events.on('inputdown', this._onInputDown, this);
        //    this._events.on('inputup', this._onInputUp, this);
        this._events.on('pointermove', this._onPointerMove, this);
    }

    /**
     * @description get the pointer position as a Point object (x, y)
     */
    get pointer() {
        return this._pointer;
    }

    /**
     * @description enable input for the specified object
     * @param displayObject the object to enable input for
     */
    public enable(displayObject: any) {
        this._screen.enableInput(displayObject);
    }

    /**
     * @description disable input for the specified object
     * @param displayObject the object to disable input for
     */
    public disable(displayObject: any) {
        this._screen.disableInput(displayObject);
    }

    /**
     * @description add listener for specified input event to specific sprite
     * @param event the event to add the listener to; must be a valid input event
     * @param callback the callback method to register
     * @param sprite the sprite this event lisener is being associated with
     * @param context the context of the callback
     */
    public addListener(event: string, callback: Function, sprite: any, context: any) {
        this._screen.addListener(event, sprite, (evt: any) => {
          /*   if (once == true) {
                
            } */
            callback.bind(context)(evt);
        }, context);
    }

    /**
     * @description remove listener from input event
     * @param event 
     * 
     * @param callback 
     * @param sprite 
     */
    public removeListener(event: string, callback: Function, sprite: any) {
        this._screen.removeListener(event, sprite, callback);
    }

    private _onPointerMove(data: any) { 
        this._pointer = data.mouseX;
        this._pointer = data.mouseY;
        this._pointerMovement.x = data.moveX;
        this._pointerMovement.y = data.moveY;
    }

    private _call(data: any, arr: any[]) {
        let obj = this._find(data, arr);
        let evt = data.evt;
        obj.callback.bind(obj.context)(evt);
    }

    private _find(data: any, arr: any[]): any {
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