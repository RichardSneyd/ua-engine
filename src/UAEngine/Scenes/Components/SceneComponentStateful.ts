import BaseScene from "../BaseScene";
import State from './State';
import SceneComponent from "./SceneComponent";

export default abstract class SceneComponentStateful extends SceneComponent {
    public abstract name: string;

    state: State;

    public abstract update();
    
}