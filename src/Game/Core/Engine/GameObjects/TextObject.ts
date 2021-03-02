import Events from "../Events";  // don't remove this import - it's needed
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import Screen from "../../../Services/Screen";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from "./Components/ScaleHandler";
import Point from "../../Geom/Point";
import TweenComponent from "./Components/TweenComponent";
import Debug from "../Debug";
import BaseGameObject from "./BaseGameObject";
import ExtractComponent from "./Components/ExtractComponent";

/**
 * @description A text game object class. Converts text to sprite object under the hood.
 */
class TextObject extends BaseGameObject {

    private _letters: string;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: Screen, input: InputHandler,
        scaleHandler: ScaleHandler, tweenComponent: TweenComponent, extract: ExtractComponent) {
        super(objectCore, pcHandler, screen, input, scaleHandler, tweenComponent, extract);
        this._letters = '$$$$____$$$$'; //default uninitialized string
    }

    public init(x: number, y: number, text: string, style: any = {}, parent: IParentChild | null = null): void {
        this._letters = text;
        this.data = this._screen.createText(x, y, text, style);
        this._core.init(this, x, y, '', this._update);
        super.init();
        this._pcHandler.init(this, this._core, parent);
    }

    public createNew(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null): TextObject {
        let textObj = this.createEmpty();
        textObj.init(x, y, textureName, frame, parent);
        return textObj;
    }

    public createEmpty(): TextObject {
        let textObj = new TextObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this._scaleHandler.createNew(), this._tweenComponent.createNew(), this._extract.createEmpty());
        return textObj;
    }

    set text(lett: string) {
        if (this._letters == '$$$$____$$$$') {
            Debug.error("this is not a text ObjectCore, can't change letters!");
        } else {
            this._letters = lett;
        }
    }

    setStyle(style: any) {
        this._core._objectHandler.setStyle(this._core.data, style);
    }

    setTextColor(color: string) {
        this._core._objectHandler.setTextColor(this._core.data, color);
    }

    get text(): string {
        if (this._letters == '$$$$____$$$$') {
            Debug.error("this is not a text ObjectCore, can't change letters!");
            return '';
        } else {
            return this._letters;
        }
    }

    destroy(){
        super.destroy();
    }
}

export default TextObject;