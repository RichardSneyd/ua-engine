import IComponent from "./IComponent";

interface IComponentable {
    components: {};

    removeComponent(name: string): void;

    addComponent(component: IComponent): void;

    updateComponents(): void;
}

export default IComponentable;