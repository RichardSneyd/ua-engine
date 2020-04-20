import IGameObject from "./IGameObject";
import Entity from "./Components/Entity";
import IParentChild from "./IParentChild";
import ChildHandler from "./Components/ChildHandler";
import IScreen from "../../../Services/IScreen";
import InputHandler from "./Components/InputHandler";

class ContainerObject implements IGameObject, IParentChild {
    private _screen: IScreen;
    private _entity: Entity;
    private _input: InputHandler;
    private _childHandler: ChildHandler;

    constructor(entity: Entity, childHandler: ChildHandler, screen: IScreen, input: InputHandler) {
        this._entity = entity; this._childHandler = childHandler; this._screen = screen; this._input = input;
    }

    public init(x: number, y: number, parent: IParentChild | null): void {
        this.data = this._screen.createContainer(x, y);
        this._entity.init(x, y);
        this._input.init(this._entity);
        this._childHandler.init(this._entity, parent);
    }

    createNew(x: number, y: number, parent: IParentChild | null): ContainerObject {
        let cont = new ContainerObject(this._entity.createNew(), this._childHandler.createNew(), this._screen, this._input.createNew());
        cont.init(x, y, parent);
        return cont;
    }

    public changeTexture(textureName: string) {
        this.entity.changeTexture(textureName);
    }

    get input(){
        return this._input;
    }

    get data() {
        return this._entity.data;
    }

    set data(data: any) {
        this._entity.data = data;
    }

    get parent() {
        return this._childHandler.parent;
    }

    set parent(parent: IParentChild){
        this._childHandler.parent = parent;
    }

    get children() {
        return this._childHandler.children;
    }

    get x() {
        return this._entity.x;
    }

    get entity() {
        return this._entity;
    }

    get y() {
        return this._entity.y;
    }

    get scaleX() {
        return this.entity.scaleX;
    }

    get scaleY() {
        return this.entity.scaleY;
    }

    get visible() {
        return this.entity.visible;
    }

    get width() {
        return this.entity.width;
    }

    get height() {
        return this.entity.height;
    }


    addChild(child: IParentChild): void {
        this._childHandler.addChild(child);
    }

    removeChild(child: IParentChild): void {
        this._childHandler.removeChild(child);
    }

    destroy(){
        this._entity.destroy();
    }
}

export default ContainerObject;