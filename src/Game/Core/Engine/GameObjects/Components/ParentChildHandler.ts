import IParentChild from "../IParentChild";
import IGameObject from '../IGameObject';
import ObjectCore from './ObjectCore';
import TextObject from "../TextObject";
import Debug from "../../Debug";

/**
 * @description Handles all parent-child relationships of the attached IGameObject.
 */
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
        if(parent !== null) {
            parent.addChild(this._go);
            this._parent = parent;
        }
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
            if(object.parent && object.parent !== this._go) {
                object.parent.removeChild(object);
            }
            this._children.push(object);
            Debug.info('%csuccessfully added child', Debug.STYLES.GOOD);
            object.parent = this._go;

            // added this condition because text objects hold their Px data 1 level deeper, due to custom PxText class
            let child: IGameObject = object.data.data ? object.data.data : object.data;

            this.core.data.addChild(child);
            this._go.setOrigin(this._go.origin.x, this._go.origin.y); // needed to manually update origin calculation
            return true;
        }
      //  Debug.info('that is already a child of this object, skipping...');
        return false;
    }

    removeChild(object: IGameObject): void {
        if (this.hasChild(object)) {
            if(object.data.data){
                // Debug.info('removing child TextObject, deal with it appropriately...')
                this.core.data.removeChild(object.data.data);
            }
            else {
                this.core.data.removeChild(object.data);
            }
            if(object.parent !== null) object.parent = null;
            this._children.splice(this._children.indexOf(object), 1);
            Debug.info('%csuccessfully removed child', Debug.STYLES.NOTEWORTHY);
            return;
        }
        Debug.warn('could not remove, no such entity found in children array');
    }

    destroyChild(child: IGameObject){
       // this.removeChild(child);
        child.destroy();
    }

    destroyChildren(){
        for(let c = this._children.length - 1; c >= 0; c--){
            this.destroyChild(this._children[c]);
        }
    }

    hasChild(object: IGameObject): boolean {
        if (this._children.indexOf(object) !== -1) {
            return true;
        }
        return false;
    }

    public setChildIndex(child: IGameObject, index: number){
        child.zIndex = index;
    }

    /**
     * @description swap the z index (draw order) of 2 children
     */
    public swapZ(child1: IGameObject, child2: IGameObject){
        if(this._children.indexOf(child1) == -1) Debug.error('child1 is not in the children array');
        if(this._children.indexOf(child2) == -1) Debug.error('child2 is not in the children array');
        let child1Index = child1.zIndex; let child2Index = child2.zIndex;
        child1.zIndex = child2Index; child2.zIndex = child1Index;
    }

    /**
     * @description sorts zOrder by 'bottom' value unless a different property is specified
     * @param property The property to sort by. defaults to 'bottom'. 
     * @param desc Sorted in ascending order by default. Set this to force descending order.
     */
    public sort(property: string = 'bottom', desc: boolean = false){
        let children = <any>this._children.slice(0); // slice(0) effectively clones the array

        if(desc){
            children.sort((a: any, b: any)=> (a[property] > b[property]) ? 1 : -1);
        }
        else {
            children.sort((a: any, b: any)=> (a[property] < b[property]) ? 1 : -1);
        }

        for(let c = 0; c < children.length; c++){
            let child = this._children[c];
            child.zIndex = c;
        }
    }

    
}

export default ParentChildHandler;