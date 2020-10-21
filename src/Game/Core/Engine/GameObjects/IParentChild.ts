import ObjectCore from "./Components/ObjectCore";
import IGameObject from "./IGameObject";

/**
 * @description a key interface for handling parent-child relationships
 */
interface IParentChild {
  //  core: ObjectCore;
    parent: IGameObject | null;
    init(...args: any[]): void;
    children: IGameObject[];
    addChild(child: IGameObject): void;
    removeChild(child: IGameObject): void;
    hasChild(child:IGameObject): boolean;
    data: any;
}

export default IParentChild;