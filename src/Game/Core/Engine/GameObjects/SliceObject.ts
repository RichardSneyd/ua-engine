import IGameObject from "./IGameObject";
import Entity from "./Components/Entity";
import IParentChild from "./IParentChild";
import ChildHandler from "./Components/ChildHandler";
import IScreen from "../../../Services/IScreen";
import InputHandler from "./Components/InputHandler";

class SliceObject implements IGameObject, IParentChild {
    private _screen: IScreen;
    private _entity: Entity;
    private _input: InputHandler;
    private _childHandler: ChildHandler;

    constructor(entity: Entity, childHandler: ChildHandler, screen: IScreen, inputHandler: InputHandler) {
        this._entity = entity; this._childHandler = childHandler; this._screen = screen; this._input = inputHandler;
    }

    public init(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): void {
        this.data = this._screen.createNineSlice(x, y, textureName, leftWidth, topHeight, rightWidth, bottomHeight);
        this.data.x = x;
        this.data.y = y;
        //  console.log('boudns before calc', this._data.getBounds());
        this.data.calculateBounds();
        
        this.width = this.data.width;
        this.height = this.data.height;
       
      //  this.setOrigin(0.5);
    }

    createNew(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number, parent: any = null): SliceObject{
    
        let slice = new SliceObject(this._entity.createNew(), this._childHandler.createNew(), this._screen, this.input.createNew());
        slice.init(x, y, textureName, leftWidth, topHeight, rightWidth, bottomHeight);

        if(parent!==null){
            parent.addChild(slice);
        }

        return slice;
    }

    public changeTexture(textureName: string) {
        this.entity.changeTexture(textureName);
    }

    get input(){
        return this._input;
    }

    get data(){
        return this._entity.data;
    }

    set data(data: any){
        this._entity.data = data;
    }

    get parent(){
        return this._childHandler.parent;
    }

    get children(){
        return this._childHandler.children;
    }

    get textureName() {
        return this.entity.textureName;
    }

    get atlas() {
        return this._entity.atlas;
    }

    set atlas(textureName: any) {
        this._entity.atlas = textureName;
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

    set width(width: number){
        this.data.width = width;
    }

    get height() {
        return this.entity.height;
    }

    set height(height: number){
        this.data.height = height;
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

export default SliceObject;