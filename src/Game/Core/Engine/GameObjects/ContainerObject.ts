import Events from "../Events";
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import IScreen from "../../../Services/IScreen";
import InputHandler from "./Components/InputHandler";
import ScaleManager from './Components/ScaleHandler';

class ContainerObject implements IGameObject, IParentChild {
    private _screen: IScreen;
    private _core: ObjectCore;
    private _input: InputHandler;
    private _scaleManager: ScaleManager;
    private _pcHandler: ParentChildHandler;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: IScreen, input: InputHandler, scaleManager: ScaleManager) {
        this._core = objectCore; this._pcHandler = pcHandler; this._screen = screen; this._input = input;
        this._scaleManager = scaleManager;
    }

    public init(x: number, y: number, parent: IParentChild | null): void {
        this.data = this._screen.createContainer(x, y);
        this._core.init(this, x, y);
        this._input.init(this);
        this._pcHandler.init(this._core, parent);
        this._scaleManager.init(this);
    }

    createNew(x: number, y: number, parent: IParentChild | null): ContainerObject {
        let cont = new ContainerObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this.scaleManager.createNew());
        cont.init(x, y, parent);
        return cont;
    }

    public changeTexture(textureName: string) {
        this._core.changeTexture(textureName);
    }

    get events(){
        return this._core.events;
    }

    get pcHandler(){
        return this._pcHandler;
    }

    get input(){
        return this._input;
    }

    get scaleManager(){
        return this._scaleManager;
    }

    get data() {
        return this._core.data;
    }

    set data(data: any) {
        this._core.data = data;
    }

    get parent() {
        return this._pcHandler.parent;
    }

    set parent(parent: IParentChild){
        this._pcHandler.parent = parent;
    }

    get children() {
        return this._pcHandler.children;
    }

    get x() {
        return this._core.x;
    }
    
    set x(x: number){
        this._core.x = x;
    }

    get core() {
        return this._core;
    }

    get y() {
        return this._core.y;
    }

    set y(y: number) {
        this._core.y = y;
    }

    get scaleX() {
        return this._core.scaleX;
    }

    get scaleY() {
        return this._core.scaleY;
    }

    get visible() {
        return this._core.visible;
    }

    get width() {
        return this._core.width;
    }

    get height() {
        return this._core.height;
    }


    addChild(child: IParentChild): void {
        this._pcHandler.addChild(child);
    }

    removeChild(child: IParentChild): void {
        this._pcHandler.removeChild(child);
    }

    destroy(){
        if(this.parent !== null) this._pcHandler.removeChild(this);
        this._core.destroy();
    }
}

export default ContainerObject;