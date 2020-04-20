import Entity from "./Components/Entity";

interface IParentChild {
    entity: Entity;
    parent: IParentChild;
    init(...args: any[]): void;
    children: IParentChild[];
    addChild(child: IParentChild): void;
    removeChild(child: IParentChild): void;
}

export default IParentChild;