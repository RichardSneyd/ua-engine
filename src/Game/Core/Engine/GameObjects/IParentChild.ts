import ObjectCore from "./Components/ObjectCore";

interface IParentChild {
    core: ObjectCore;
    parent: IParentChild | null;
    init(...args: any[]): void;
    children: IParentChild[];
    addChild(child: IParentChild): void;
    removeChild(child: IParentChild): void;
}

export default IParentChild;