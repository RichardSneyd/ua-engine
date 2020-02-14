import BaseComponent from "../../Components/BaseComponent";
import Actor from "../Actor";

/**
 * @description the abstract actor component classes forms the foundation for all actor components. 
 * Inherit from this if you are creating one.
 */
abstract class ActorComponent extends BaseComponent {
    public abstract name: string;
    private actor: Actor;

    public remove(){
        this.actor.removeComponent(this.name);
    }

    public abstract update();
}

export default ActorComponent;