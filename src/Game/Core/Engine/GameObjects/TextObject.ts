import IGameObject from "./IGameObject";
import Entity from "./Components/Entity";
import IParentChild from "./IParentChild";
import ChildHandler from "./Components/ChildHandler";
import IScreen from "../../../Services/IScreen";
import InputHandler from "./Components/InputHandler";

class TextObject implements IGameObject, IParentChild {
    private _screen: IScreen;
    private _entity: Entity;
    private _input: InputHandler;
    private _childHandler: ChildHandler;
    private _letters: string;

    constructor(entity: Entity, childHandler: ChildHandler, screen: IScreen, input: InputHandler) {
        this._entity = entity; this._childHandler = childHandler; this._screen = screen;
        this._letters = '$$$$____$$$$'; //default uninitialized string
    }

    public init(x: number, y: number, text: string, style: any = undefined, parent: IParentChild | null = null): void {

        this._letters = text;

        this.data = this._screen.createText(x, y, text, style);
        this.width = this.data.width;
        this.height = this.data.height;
        this._entity.init(x, y);
        this._input.init(this._entity);
        this._childHandler.init(this._entity, parent);
    }

    createNew(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null): TextObject {
        let textObj = new TextObject(this._entity.createNew(), this._childHandler.createNew(), this._screen, this._input.createNew());
        textObj.init(x, y, textureName, frame, parent);
        return textObj;
    }

    get input(): InputHandler {
        return this._input;
    }

    set text(lett: string) {
        if (this._letters == '$$$$____$$$$') {
            console.error("this is not a text entity, can't change letters!");
        } else {
            this._letters = lett;
        }
    }


    setStyle(style: any) {
        this.entity._objectHandler.setStyle(this.entity.data, style);
    }

    setTextColor(color: string) {
        this.entity._objectHandler.setTextColor(this.entity.data, color);
    }

    get text(): string {
        if (this._letters == '$$$$____$$$$') {
            console.error("this is not a text entity, can't change letters!");
            return '';
        } else {
            return this._letters;
        }
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

    get children() {
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

    set x(x: number){
        this._entity.x = x;
    }

    get entity() {
        return this._entity;
    }

    get y() {
        return this._entity.y;
    }

    set y(y: number) {
        this._entity.y = y;
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

    set width(width: number) {
        this.data.width = width;
    }

    get height() {
        return this.entity.height;
    }

    set height(height: number) {
        this.data.height = height;
    }

    public changeTexture(textureName: string) {
        this.entity.changeTexture(textureName);
    }

    addChild(child: IParentChild): void {
        this._childHandler.addChild(child);
    }

    removeChild(child: IParentChild): void {
        this._childHandler.removeChild(child);
    }

    destroy() {
        this._entity.destroy();
    }
}

export default TextObject;