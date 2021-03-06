import Events from "./Events";
import Loader from "./Loader";
import Point from "../Geom/Point";
import Screen from "../../Services/Screen";
import EventNames from "./EventNames";
import ScaleManager from "./ScaleManager";
import KeyCodes from './Keys';
import KeyListener from "./KeyListener";
import Debug from "./Debug";
import IGameObject from "./GameObjects/IGameObject";

/**
 * @description The InputManager is responsible for all keyboard and mouse event handling
 */
class InputManager {
    protected _pointFactory: Point;
    private _eventNames: EventNames;
    private _events: Events; private _loader: Loader; private _screen: Screen; private _scaleManager: ScaleManager;
    private _pointer: Point; // the mouse/pointer x, y
    private _pointerMovement: Point; // the number of pixels the mouse x and y have moved since the last mousemove/pointermove event
    private _pointerDown: boolean;
    private _keyDownListeners: KeyListener[];
    private _keyUpListeners: KeyListener[];
    private _keyPressListeners: KeyListener[];
    private _keyListener: KeyListener;
    public keys = KeyCodes;

    constructor(events: Events, loader: Loader, screen: Screen, eventNames: EventNames, pointFactory: Point, scaleManager: ScaleManager, keyListener: KeyListener) {
        this._events = events; this._loader = loader; this._screen = screen; this._eventNames = eventNames; this._scaleManager = scaleManager;
        this._pointFactory = pointFactory; this._keyListener = keyListener;

        this._pointer = this._pointFactory.createNew(0, 0);
        this._pointerMovement = this._pointFactory.createNew(0, 0);
        this._events.on('pointermove', this._onPointerMove, this);

        this._pointerDown = false;
        document.addEventListener('pointerdown', (event) => {
            this._pointerDown = true;
        });
        document.addEventListener('pointerup', (event) => {
            this._pointerDown = false;
        });

        this._keyDownListeners = [];
        this._keyUpListeners = [];
        this._keyPressListeners = [];

        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
        window.addEventListener('keypress', this._onKeyPress.bind(this));
        Debug.exposeGlobal(this._pointer, 'mouse');
    }

    public onKeyDown(keyCode: number, callback: Function, context: any) {
        this._keyDownListeners.push(this._keyListener.createNew(callback, context, keyCode))
    }

    public onKeyUp(keyCode: number, callback: Function, context: any) {
        this._keyUpListeners.push(this._keyListener.createNew(callback, context, keyCode))
    }

    public onKeyPress(keyCode: number, callback: Function, context: any) {
        this._keyPressListeners.push(this._keyListener.createNew(callback, context, keyCode))
    }

    public offKeyDown(keyCode: number, callback: Function, context: any) {
      //  this._keyDownListeners.push(this._keyListener.createNew(callback, context, keyCode))
      let listener 
    }

    public offKeyUp(keyCode: number, callback: Function, context: any) {
      //  this._keyUpListeners.push(this._keyListener.createNew(callback, context, keyCode))
    }

    public offKeyPress(keyCode: number, callback: Function, context: any) {
       // this._keyPressListeners.push(this._keyListener.createNew(callback, context, keyCode))
    }

    protected _findKeyListener(arr: KeyListener[], keyCode: number, callback: Function, context: any): KeyListener | null{
        for(let x = 0; x < arr.length; x++){
            if(arr[x].context == context && arr[x].callback == callback && arr[x].keyCode == keyCode){
                return arr[x];
            }
        }
        Debug.warn('no KeyListener found for key ' + keyCode + ' with context ' + context + ' and callback: ', callback);
        return null;
    }

    protected _removeKeyListener(arr: KeyListener[], keyCode: number, callback: Function, context: any){
        let listener = this._findKeyListener(arr, keyCode, callback, context);
        if(listener !== null){
            arr.splice(arr.indexOf(listener));
            return;
        }
        Debug.error('cannot remove a null KeyListener');
    }



    private _onKeyDown(evt: any) {
        this._callKeyListenersForAll(this._keyDownListeners, { evt: evt });
    }

    private _onKeyUp(evt: any) {
        this._callKeyListenersForAll(this._keyUpListeners, { evt: evt });
    }

    private _onKeyPress(evt: any) {
        this._callKeyListenersForAll(this._keyPressListeners, { evt: evt });
    }

    private _callKeyListenersForAll(listeners: KeyListener[], data: { evt: any }) {
        // Debug.info('evt: ', data.evt);
        for (let l = 0; l < listeners.length; l++) {
            listeners[l].callIfMatch(data);
        }
    }

    /**
     * @description Get the pointer position as a Point object (x, y). In game-units (auto-corrected for scale)
     */
    get pointer() {
        return this._pointer;
    }

    /**
     * @description is the pointer/mouse down?
     */
    get pointerDown(): boolean {
        return this._pointerDown;
    }

    /**
    * @description Get the amount the pointer moved since the last tick as a Point object (x, y). In game-units (auto-corrected for scale)
    */
    get pointerMovement() {
        return this._pointerMovement;
    }

    /**
     * @description Enable input for the specified object
     * @param displayObject the object to enable input for
     */
    public enable(displayObject: any) {
        this._screen.enableInput(displayObject);
    }

    /**
     * @description Disable input for the specified object
     * @param displayObject the object to disable input for
     */
    public disable(displayObject: any) {
        this._screen.disableInput(displayObject);
    }

    /**
     * @description Add listener for specified input event to specific GameObject
     * @param event the event to add the listener to; must be a valid input event
     * @param callback the callback method to register
     * @param sprite the sprite this event lisener is being associated with
     * @param context the context of the callback
     */
    public addListener(event: string, callback: Function, go: IGameObject, context: any) {
        let pixiData: any = this._getData(go);

        this._screen.addListener(event, pixiData, (evt: any) => {
            if (go.hitShape == null) {
                if (go.input.pixelPerfect) {
                    if (go.input.pixelHit(this._pointer)) callback.bind(context)(evt);
                    // callback.bind(context)(evt);
                }
                else callback.bind(context)(evt);
            }
            else if (go.hitShape.containsPoint(this._pointer)) callback.bind(context)(evt);
        }, context);
    }

    /**
     * @description Remove listener from input event
     * @param event event to remove listener from
     * @param callback the callback on the listener
     * @param sprite 
     */
    public removeListener(event: string, callback: Function, go: IGameObject) {
        let data = this._getData(go);
        this._screen.removeListener(event, data, callback);
    }

    private _getData(go: IGameObject): any {
        if (go.data.data) {
            return go.data.data;
        }
        return go.data;
    }

    private _onPointerMove(data: any) {
        //  Debug.info('this: ', this);
        let scaleF = this._scaleManager.scaleFactor();
        this._pointer.x = data.mouseX / scaleF;
        this._pointer.y = data.mouseY / scaleF;
        this._pointerMovement.x = data.moveX / scaleF;
        this._pointerMovement.y = data.moveY / scaleF;
        //   Debug.info('pointer moved: ', this._pointer);
        //  Debug.info('data: ', data);
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

        Debug.error('%s has no listener', data.sprite);
        return null;
    }
}

export default InputManager;