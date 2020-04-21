import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import IScreen from "../../../Services/IScreen";
import InputHandler from "./Components/InputHandler";
import ScaleManager from "./Components/ScaleHandler";

class SpineObject implements IGameObject, IParentChild {
    private _screen: IScreen;
    private _core: ObjectCore;
    private _input: InputHandler;
    private _pcHandler: ParentChildHandler;
    private _scaleManager: ScaleManager;

    constructor(objectCore: ObjectCore, ParentChildHandler: ParentChildHandler, screen: IScreen, input: InputHandler) {
        this._core = objectCore; this._pcHandler = ParentChildHandler; this._screen = screen; this._input = input;
    }

    public init(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null = null): void {
        this.data = this._screen.createSprite(x, y, textureName, frame);
        this.width = this.data.width;
        this.height = this.data.height;

        if (frame != null) this.atlas = textureName;

        this._core.init(this, x, y, textureName);
        this._input.init(this);
        this._pcHandler.init(this._core, parent);

    }

    createNew(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null = null): SpineObject {
        let sprite = new SpineObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew());
        sprite.init(x, y, textureName, frame, parent);
        return sprite;
    }

    public changeTexture(textureName: string) {
        this._core.changeTexture(textureName);
    }

    get input(){
        return this._input;
    }

    get scaleManager(){
        return this._scaleManager;
    }

    get pcHandler(){
        return this._pcHandler;
    }

    get data(){
        return this._core.data;
    }

    set data(data: any){
        this._core.data = data;
    }

    get parent(){
        return this._pcHandler.parent;
    }

    get children(){
        return this._pcHandler.children;
    }

    get textureName() {
        return this._core.textureName;
    }

    get atlas() {
        return this._core.atlas;
    }

    set atlas(textureName: any) {
        this._core.atlas = textureName;
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

    set width(width: number){
        this.data.width = width;
    }

    get height() {
        return this._core.height;
    }

    set height(height: number){
        this.data.height = height;
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

export default SpineObject;