import IComponent from "./IComponent";

interface IComponentable {
    components: {};

    removeComponent(name: string);

    addComponent(component: IComponent);

    updateComponents();
}

export default IComponentable;