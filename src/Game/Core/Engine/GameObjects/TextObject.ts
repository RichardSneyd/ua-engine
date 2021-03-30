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

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: Screen, input: InputHandler,
        scaleHandler: ScaleHandler, tweenComponent: TweenComponent, extract: ExtractComponent) {
        super(objectCore, pcHandler, screen, input, scaleHandler, tweenComponent, extract);
    }

    public init(x: number, y: number, text: string, style: any = {}, parent: IParentChild | null = null): void {
        if (!style.fontFamily) style.fontFamily = 'gothic';
        this.data = this._screen.createText(x, y, text, style);
        this._core.init(this, x, y, '', this._update);
        super.init();
        this._pcHandler.init(this, this._core, parent);
    }

    /*   protected _updateSize() {
          this._objectHandler.setSize(this._data, this._width * this._go.scaleHandler.x, this._height * this._go.scaleHandler.y);
          //   this._objectHandler.setSize(this._data, this._width * scaleX, this._height * scaleY);
      }
   */
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
        this.core.data.text = lett;
        // this.core.data.
    }

    get text() {
        return this.core.data.text;
    }

    set style(style: any) {
        this._core.data.style = style;
    }

    get style(): any {
        return this._core.data.style;
    }

    get width(): number {
        this._core.importSize();
        return this._core.width;
    }

    get height(): number {
        this._core.importSize();
        return this._core.height;
    }


    setStyle(style: any) {
        this._core._objectHandler.setStyle(this._core.data, style);
    }

    setTextColor(color: string) {
        Debug.info(this.core.data);
        this.core.data.style.fill = color;
    }

    destroy() {
        super.destroy();
    }
}

export default TextObject;