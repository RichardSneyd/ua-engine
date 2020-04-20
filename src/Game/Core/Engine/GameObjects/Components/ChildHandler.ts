import Entity from "./Entity";
import IParentChild from "../IParentChild";
import IGameObject from '../IGameObject';

class ChildHandler implements IParentChild {
    parent: IParentChild;
    _children: IParentChild[];
    private _entity: Entity;

    constructor() {

    }

    createNew() {
        return new ChildHandler();
    }

    get children() {
        return this._children;
    }

    get entity() {
        return this._entity;
    }

    init(entity: Entity, parent: IParentChild | null) {
        this._entity = entity;
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
            if (object.entity.data.data) {
                console.log('trying to add data 1 level deeper for text...');
                child = object.entity.data.data;
            }
            else {
                child = object.entity.data;
            }

            this.entity.data.addChild(child);

            return true;
        }
        console.warn('that is already a child of this object, and cannot be added again');
        return false;
    }

    removeChild(object: IParentChild): void {
        if (this.hasChild(object)) {
            this._children.splice(this._children.indexOf(object), 1);
            this.entity.data.removeChild(object.entity.data);
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

export default ChildHandler;