import { stringify, StringifyOptions } from "querystring";
import Debug from "../../Debug";
import IGameObject from "../IGameObject";
import GOState from "./GOState";
import IGOState from "./IGOState";

class GOStateMachine {
    protected _go: IGameObject;
    protected _initialized: boolean;
    protected _active: GOState | undefined;
    protected _activeName: string;
    protected _states: Map<string, GOState>;
    protected _history: Array<string>;
    protected _goStateFact: GOState;

    constructor(goStateFact: GOState) {
        this._initialized = false;
        this._goStateFact = goStateFact;
    }

    /**
     * @description a map of all 'state' objects, in key->value format
     */
    get states() {
        return this._states;
    }

    /**
     * @description converts the values in the states map to an array and returns it
     */
    get stateObjects() {
        return Array.from(this._states.values());
    }

    /**
     * @description an string array of all state names. Generate from the states.keys() iterator.
     */
    get stateNames() {
        // return Object.keys(this._states);
        return Array.from(this.states.keys());
    }

    createNew(go: IGameObject): GOStateMachine {
        return new GOStateMachine(this._goStateFact).init(go);
    }

    init(go: IGameObject): GOStateMachine {
        this._go = go;
        this._states = new Map<string, GOState>();
        this._history = [];
        this._initialized = true;
        return this;
    }

    /**
   * @description create a new state in this FSM. IF no stateData object is provide, the state will automatically inherit the current properties of the associated gameObject
   * @param stateName The name to assign to the state
   * @param stateData (optional) The property values of the state. If left blank, the state will inherit the current property values of the associated gameObject
   */
    createState(stateName: string, stateData?: IGOState) {
        let state = this._goStateFact.createNew(this._go, stateData);
        this._addState(stateName, state);
        if (this.stateObjects.length == 1) { this.changeState(state) }
    }

    /**
     * @description 'install' a new (existing) GoState object in the FSM, and assign a name (key) to it
     * @param stateName  the name of the new state
     * @param goState the GOState itself
     */
    protected _addState(stateName: string, goState: GOState) {
        if (this._states.has(stateName)) Debug.warn('state ', stateName, ' already exists; will be overridden');
        this._states.set(stateName, goState);
    }

    /*   public addState(stateName: string, goState: GOState){
          if(this._states.has(stateName)) Debug.warn('state ', stateName, ' already exists; will be overridden');
          this._states.set(stateName, goState);
      } */

    /**
     * @description remove a specified state from this FSM
     * @param stateName the name of the state to remove
     */
    removeState(stateName: string): boolean {
        if (this._states.has(stateName)) {
            this._states.delete(stateName);
            return true;
        }
        Debug.warn('cannot remove ', stateName, ' as it does not exist');
        return false;
    }

    /**
     * @description the active state object
     */
    get active() {
        return this._active;
    }

    /**
     * @description the name of the active state
     */
    get activeName() {
        return this._activeName;
    }

    changeState(state: string | GOState) {
        // if(!this.stateNames.includes(name)) Debug.error('no state with name ' + name + ' found');
        if (typeof state == 'string') {
            if (this._states.has(state)) {
                let stateObj = this._states.get(state);
                //this._active = this._states.get(state);
                if (stateObj) {
                    this._apply(stateObj);
                    if (this._active) this._history.push(this._activeName);
                }
                else {
                    Debug.error('cannot set undefined state');
                }
            }
            else {
                Debug.error('no state with name ' + state + ' found');
            }
            return;
        }
        this._apply(state);   
        if (this._active) this._history.push(this._activeName);
    }

    /**
     * @description the state history
     */
    get history() {
        return this._history;
    }

    /**
     * @description revert to previous state, and pop last element from this._history(). Kind of like pressing CTRL-Z
     */
    revert() {
        this._history.pop();
        let state = this._states.get(this._history[this._history.length - 1]);
        if (state) {
            this._apply(state);
        }
        else {
            Debug.error('no state with name ' + name + ' found');
        }
        // this.changeState();
    }

    /**
     * @description make a state the active state
     * @param state the state to apply
     */
    private _apply(state: GOState) {
        this._active = state;
        this._activeName = this.getKeyByState(state);
        this._active?.apply();
        //  if(this._active) this._history.push(this._activeName);
    }

    /**
     * @description get key value associated with state object. Inverts this.states(), so you can find a key via its value, instead of the other way around
     * @param state the state to find a key for
     */
    getKeyByState(state: GOState): string {
        for (let key of this._states.keys()) {
            if (this._states.get(key) == state) {
                return key;
            }
        }
        Debug.error('no key for that state in states() map');
        return '';
    }
}

export default GOStateMachine;