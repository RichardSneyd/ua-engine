import BaseScene from "../BaseScene";
import State from './State';
import SceneComponent from "./SceneComponent";

abstract class SceneComponentStateful extends SceneComponent {
    public abstract name: string;

    state: State;

    public abstract update();
    
}

export default SceneComponentStateful;