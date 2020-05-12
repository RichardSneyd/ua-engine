import IParentChild from "../IParentChild";
import IGameObject from '../IGameObject';
import ObjectCore from './ObjectCore';
import TextObject from "../TextObject";

class ParentChildHandler implements IParentChild {
    private _parent: IParentChild | null = null;
    _children: IParentChild[];
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

    set parent(parent: IParentChild | null) {
        this._parent = parent;
        this._go.scaleHandler.onResize();
    }

    get children() {
        return this._children;
    }

    get core() {
        return this._core;
    }

    init(go: IGameObject, parent: IParentChild | null = null) {
        this._core = go.core;
        this._go = go;
        this._children = [];
        this._parent = null;

        if (parent !== null) {
            parent.addChild(this);
        }
    }

    addChild(object: IParentChild): boolean {
        if (!this.hasChild(object)) {
            this._children.push(object);
            object.parent = this;

            // added this condition because text objects hold their Px data 1 level deeper, due to custom PxText class
            let child;
            if (object.core.data.data) {
                child = object.core.data.data;
            }
            else {
                child = object.core.data;
            }

            this.core.data.addChild(child);

            return true;
        }
        console.warn('that is already a child of this object, and cannot be added again');
        return false;
    }

    removeChild(object: IParentChild): void {
        if (this.hasChild(object)) {
            if(object instanceof TextObject){
                this.core.data.removeChild(object.core.data.data);
            }
            else {
                this.core.data.removeChid(object.core.data);
            }
            object.parent = null;
            this._children.splice(this._children.indexOf(object), 1);
        }
        console.warn('could not remove, no such entity found in children array');
    }

    hasChild(object: IParentChild): boolean {
        if (this._children.indexOf(object) !== -1) {
            return true;
        }
        return false;
    }
}

export default ParentChildHandler;