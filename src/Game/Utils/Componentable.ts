import BaseComponent from "./BaseComponent";

abstract class Componentable {
    components: {};

    removeComponent(name: string){
        delete this.components[name];
    }

    addComponent(component: BaseComponent) {
        this.components[component.name] = component;
    }

    updateComponents() {
        for (let name of Object.keys(this.components)) {
            this.components[name].requestUpdate();
        }
    }
}

export default Componentable;