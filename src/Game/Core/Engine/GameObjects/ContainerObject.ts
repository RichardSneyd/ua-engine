import Events from "../Events"; // don't remove this import - it's needed
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import Screen from "../../../Services/Screen";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from './Components/ScaleHandler';
import Point from "../../Geom/Point";
import TweenComponent from "./Components/TweenComponent";
import BaseGameObject from "./BaseGameObject";
import ExtractComponent from "./Components/ExtractComponent";
import { runInThisContext } from "vm";

/**
 * @description A container object. Useful for grouping other GameObjects.
 */
class ContainerObject extends BaseGameObject {
    private _pointFactory: Point;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: Screen, input: InputHandler,
        scaleHandler: ScaleHandler, tweenComponent: TweenComponent, point: Point, extract: ExtractComponent) {
        super(objectCore, pcHandler, screen, input, scaleHandler, tweenComponent, extract);
        this._pointFactory = point;
    }

    public init(x: number, y: number, parent: IParentChild | null): void {
        this.data = this._screen.createContainer(x, y);
        this._core.init(this, x, y, '', this._update);
        super.init();
        this._pcHandler.init(this, this._core, parent);
    }

    public createNew(x: number, y: number, parent: IParentChild | null): ContainerObject {
        let cont = this.createEmpty();
        cont.init(x, y, parent);
        return cont;
    }

    public createEmpty(): ContainerObject {
        return new ContainerObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this.scaleHandler.createNew(), this._tweenComponent.createNew(), this._pointFactory, this._extract.createEmpty());
    }

    public changeTexture(textureName: string) {
        this._core.changeTexture(textureName);
    }

    get left(): number {
        let leftest = this.x > this.childrenLeft ? this.childrenLeft : this.x;
        return leftest;
    }

    get right(): number {
        return this.y;
    }

    get top(): number {
        let heighest = this.y > this.childrenTop ? this.childrenTop : this.y;
        return heighest;
    }

    get bottom(): number {
        return this._childrenBottom();
    }

    
}

export default ContainerObject;