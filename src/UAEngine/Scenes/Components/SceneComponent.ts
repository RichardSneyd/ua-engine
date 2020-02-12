import BaseScene from "../BaseScene";
import SceneBehaviorState from './State';
import BaseComponent from "../../BaseComponent";

abstract class SceneComponent extends BaseComponent {
    public abstract name: string;
    public  scene: BaseScene;

    public remove(){
        this.scene.removeComponent(this.name);
    }

    public abstract update();
}

export default SceneComponent;