import IComponent from "./Component";
import IComponentable from "./IComponentable";

abstract class Componentable implements IComponentable {
    components: any;

    constructor(){
        this.components = {};
    }

    removeComponent(name: string){
        delete this.components[name];
    }

    addComponent(component: IComponent) {
        this.components[component.name] = component;
    }

    updateComponents() {
        for (let name of Object.keys(this.components)) {
            this.components[name].requestUpdate();
        }
    }
}

export default Componentable;