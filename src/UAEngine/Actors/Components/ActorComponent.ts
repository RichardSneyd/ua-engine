import BaseComponent from "../../Components/BaseComponent";
import Actor from "../Actor";

abstract class ActorComponent extends BaseComponent {
    public abstract name: string;
    private actor: Actor;

    public remove(){
        this.actor.removeComponent(this.name);
    }

    public abstract update();
}

export default ActorComponent;