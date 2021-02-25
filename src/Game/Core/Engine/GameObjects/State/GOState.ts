import Debug from "../../Debug";
import IGameObject from "../IGameObject";
import IGOState from "./IGOState";

class GOState implements IGOState {
    protected _go: IGameObject;
    protected _x: number;
    protected _y: number;
    protected _scaleX: number;
    protected _scaleY: number;
    protected _angle: number;
    protected _visible: boolean;
    protected _alpha: number;
    protected _children: GOState[];
    protected _parentGOState: GOState;

    get go() {
        return this._go;
    }
    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get scaleX() {
        return this._scaleX;
    }

    get scaleY() {
        return this._scaleY;
    }

    get angle() {
        return this._angle;
    }

    get visible() {
        return this._visible;
    }

    get alpha() {
        return this._alpha;
    }

    get children() {
        return this._children;
    }

    get parentGOState() {
        return this._parentGOState;
    }

         /**
     * @description create a GOState object. Mainly for use with GOStateMachine to create FSMs.
     * @param go The gameObject this state is associated with. All method calls will apply to that gameObject in future, unless another gameObject reference is specifically provided
     * @param state (optional) specifies the property values of the state. If not provided, the current properties of the gameObject will be stored instead, via capture() method.
     */
    createNew(go: IGameObject, state?: IGOState): GOState {
        return new GOState().init(go, state);
    }

     /**
     * @description Initialize the GOState object. Mainly for use with GOStateMachine to create FSMs.
     * @param go The gameObject this state is associated with. All method calls will apply to that gameObject in future, unless another gameObject reference is specifically provided
     * @param state (optional) specifies the property values of the state. If not provided, the current properties of the gameObject will be stored instead, via capture() method.
     */ /**
     * 
     * @param go The gameObject this state is associated with. All method calls will apply to that gameObject in future, unless another gameObject reference is specifically provided
     * @param state (optional) specifies the property values of the state. If not provided, the current properties of the gameObject will be stored instead, via capture() method.
     */
    init(go: IGameObject, state?: IGOState): GOState {
        this._go = go;
        if (state) { this.set(state); }
        else { this.capture(); }
        return this;
    }

    /**
     * @description capture all state properties from gameObject and store. If you don't want to record all properties, use set() instead.
     * @param children recursively record and return/set state for children as well?
     */
    capture(children: boolean = true) {
        if (!this._go) Debug.error('no go object provided, and this._go is undefined.');
        let state: IGOState = { x: this._go.x, y: this._go.y }
        this._x = this._go.x;
        this._y = this._go.y;
        this._scaleX = this._go.scaleHandler.x;
        this._scaleY = this._go.scaleHandler.y;
        this._angle = this._go.angle;
        this._visible = this._go.visible;
        this._alpha = this._go.alpha;
        this.set(state);
        if (children) {
            this._children = [];
            this._captureChildren();
        }
    }

    protected _captureChildren() {
        this._go.children.forEach((child) => {
            this.children.push(this.createNew(child));
        });
    }

    setChildren(names: string[], states: IGOState[]) {
        names.forEach((name, index) => {
            this.setChild(name, states[index]);
        })
    }

    setChild(name: string, state: IGOState): boolean {
        this._children.forEach((child) => {
            if (child.go.name == name) { child.set(state) }
            return true;
        })

        return false;
    }

    public getChild(name: string): IGOState | null {
        this._children.forEach((child) => {
            if (child.go.name == name) { return child }
        })

        return null;
    }

    protected _applyChildren() {
        this._children.forEach((child) => {
            child.apply();
        })
    }

    set(state: IGOState) {
        this._x = state.x;
        this._y = state.y;
        if (state.scaleX) this._scaleX = state.x;
        if (state.scaleY) this._scaleY = state.y;
        if (state.angle) this._angle = state.angle;
        if (state.visible) this._visible = state.visible;
        if (state.alpha) this._alpha = state.alpha;
    }

    /**
     * @description apply state to attached gameObject
     * @param children apply children states recursively? True by default
     */
    apply(children: boolean = true) {
        if (!this._go) Debug.error('cannot apply an uninitialized state');
        this._go.x = this._x;
        this._go.y = this._y;
        this._go.scaleHandler.x = this._scaleX;
        this._go.scaleHandler.y = this._scaleY;
        this._go.angle = this._angle;
        this._go.visible = this._visible;
        this._go.alpha = this._alpha;
        if (children) this._applyChildren();
    }
}

export default GOState;