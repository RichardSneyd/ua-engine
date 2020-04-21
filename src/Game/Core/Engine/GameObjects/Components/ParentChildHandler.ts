import IParentChild from "../IParentChild";
import IGameObject from '../IGameObject';
import ObjectCore from './ObjectCore';

class ParentChildHandler implements IParentChild {
    parent: IParentChild;
    _children: IParentChild[];
    private _core: ObjectCore;

    constructor() {

    }

    createNew() {
        return new ParentChildHandler();
    }

    get children() {
        return this._children;
    }

    get core() {
        return this._core;
    }

    init(entity: ObjectCore, parent: IParentChild | null) {
        this._core = entity;
        this._children = [];

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
                console.log('trying to add data 1 level deeper for text...');
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
            this._children.splice(this._children.indexOf(object), 1);
            this.core.data.removeChild(object.core.data);
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