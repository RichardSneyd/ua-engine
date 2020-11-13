import Events from "../Events";  // don't remove this import - it's needed
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import IScreen from "../../../Services/IScreen";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from "./Components/ScaleHandler";
import Point from "../../Geom/Point";
import TweenComponent from "./Components/TweenComponent";
import Debug from "../Debug";
import BaseGameObject from "./BaseGameObject";

/**
 * @description A text game object class. Converts text to sprite object under the hood.
 */
class TextObject extends BaseGameObject {

    private _letters: string;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: IScreen, input: InputHandler,
        scaleHandler: ScaleHandler, tweenComponent: TweenComponent) {
        super(objectCore, pcHandler, screen, input, scaleHandler, tweenComponent);
        this._letters = '$$$$____$$$$'; //default uninitialized string
    }

    public init(x: number, y: number, text: string, style: any = undefined, parent: IParentChild | null = null): void {
        this._letters = text;
        this.data = this._screen.createText(x, y, text, style);
        this._core.init(this, x, y, '', this._update);
        this._pcHandler.init(this, this._core, parent);
        super.init();
    }

    public createNew(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null): TextObject {
        let textObj = this.createEmpty();
        textObj.init(x, y, textureName, frame, parent);
        return textObj;
    }

    public createEmpty(): TextObject {
        let textObj = new TextObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this._scaleHandler.createNew(), this._tweenComponent.createNew());
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
}

export default TextObject;