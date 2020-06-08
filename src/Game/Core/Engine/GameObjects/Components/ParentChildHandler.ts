import IParentChild from "../IParentChild";
import IGameObject from '../IGameObject';
import ObjectCore from './ObjectCore';
import TextObject from "../TextObject";

class ParentChildHandler implements IParentChild{
    private _parent: IGameObject | null = null;
    _children: IGameObject[];
    private _core: ObjectCore;
    private _go: IGameObject;

    constructor() {

    }

    createNew() {
        return new ParentChildHandler();
    }

    get parent() {
        return this._parent;
    }

    get data(){
        return this._go.data;
    }

    set parent(parent: IGameObject | null) {
        this._parent = parent;
      //  this._go.scaleHandler.onResize();
    }

    get children() {
        return this._children;
    }

    get core() {
        return this._core;
    }

    init(go: IGameObject, core: ObjectCore, parent: IParentChild | null = null) {
        this._core = core;
        this._go = go;
        this._children = [];
        this._parent = null;

        if (parent !== null) {
            parent.addChild(this._go);
        }
    }

    addChild(object: IGameObject): boolean {
        if (!this.hasChild(object)) {
            this._children.push(object);
            object.parent = this._go;

            // added this condition because text objects hold their Px data 1 level deeper, due to custom PxText class
            let child;
            if (object.data.data) {
                child = object.data.data;
            }
            else {
                child = object.data;
            }

            this.core.data.addChild(child);

            return true;
        }
        console.warn('that is already a child of this object, and cannot be added again');
        return false;
    }

    removeChild(object: IGameObject): void {
        if (this.hasChild(object)) {
            if(object.data.data){
             //   console.log('removing child TextObject, deal with it appropriately...')
                this.core.data.removeChild(object.data.data);
            }
            else {
                this.core.data.removeChid(object.data);
            }
            object.parent = null;
            this._children.splice(this._children.indexOf(object), 1);
            return;
        }
        console.warn('could not remove, no such entity found in children array');
    }

    hasChild(object: IGameObject): boolean {
        if (this._children.indexOf(object) !== -1) {
            return true;
        }
        return false;
    }
}

export default ParentChildHandler;