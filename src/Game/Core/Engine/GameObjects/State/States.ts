import IGameObject from "../IGameObject";
import GOState from "./GOState";
import GOStateMachine from "./GOStateMachine";
import IGOState from "./IGOState";

class States {
    private _goStateFact: GOState;
    private _goStateMachineFact: GOStateMachine;
    
    constructor(goStateFact: GOState, goStateMachineFact: GOStateMachine){
        this._goStateFact = goStateFact;
        this._goStateMachineFact = goStateMachineFact;
    }

       /**
     * @description create a GOState object. Mainly for use with GOStateMachine to create FSMs.
     * @param go The gameObject this state is associated with. All method calls will apply to that gameObject in future, unless another gameObject reference is specifically provided
     * @param state (optional) specifies the property values of the state. If not provided, the current properties of the gameObject will be stored instead, via capture() method.
     */
    state(go: IGameObject, stateData: IGOState){
        return this._goStateFact.createNew(go, stateData);
    }

    stateMachine(go: IGameObject): GOStateMachine{
        return this._goStateMachineFact.createNew(go);
    }

    get IGOState(): IGOState { return this.IGOState }

}

export default States;