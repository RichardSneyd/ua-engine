import BaseComponent from "../../BaseComponent";
import Actor from "../Actor";

export default abstract class ActorComponent extends BaseComponent {
    public abstract name: string;
    private actor: Actor;

    public remove(){
        this.actor.removeComponent(this.name);
    }

    public abstract update();
}