import Events from "../Events";
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import IScreen from "../../../Services/IScreen";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from './Components/ScaleHandler';
import TweenManager from './Components/TweenManager';
import Point from "../../Geom/Point";

class ContainerObject implements IGameObject {
    private _screen: IScreen;
    private _core: ObjectCore;
    private _input: InputHandler;
    private _scaleHandler: ScaleHandler;
    private _pcHandler: ParentChildHandler;
    private _tweenManager: TweenManager;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: IScreen, input: InputHandler, 
        scaleHandler: ScaleHandler, tweenManager: TweenManager) {
        this._core = objectCore; this._pcHandler = pcHandler; this._screen = screen; this._input = input;
        this._scaleHandler = scaleHandler; this._tweenManager = tweenManager;
    }

    public init(x: number, y: number, parent: IParentChild | null): void {
        this.data = this._screen.createContainer(x, y);
        this._core.init(this, x, y, undefined, this._update);
        this._input.init(this, this._core);
        this._scaleHandler.init(this, this._core);
        this._pcHandler.init(this, this._core, parent);
    }

    // only to be called by ObjectCore
    private _update(time: any){
      this._tweenManager.update(time);
    }

    public createNew(x: number, y: number, parent: IParentChild | null): ContainerObject {
        let cont = this.createEmpty();
        cont.init(x, y, parent);
        return cont;
    }

    public createEmpty(): ContainerObject {
        return new ContainerObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this.scaleHandler.createNew(), this._tweenManager.createNew());
    }

    public changeTexture(textureName: string) {
        this._core.changeTexture(textureName);
    }

    get tweens() {
        return this._tweenManager;
    }

    get input() {
        return this._input;
    }

    get scaleHandler() {
        return this._scaleHandler;
    }

    get pcHandler() {
        return this._pcHandler;
    }

    get data() {
        return this._core.data;
    }

    set data(data: any) {
        this._core.data = data;
    }

    get textureName() {
        return this._core.textureName;
    }

    /**
  * @description READ-ONLY.
  */
    get atlas() {
        return this._core.atlas;
    }

    get x() {
        return this._core.x;
    }

    set x(x: number) {
        this._core.x = x;
    }

    get alpha() {
        return this._core.alpha;
    }

    set alpha(alpha: number) {
        this._core.alpha = alpha;
    }

    /*  get core() {
         return this._core;
     } */

    get events() {
        return this._core.events;
    }

    get y() {
        return this._core.y;
    }

    set y(y: number) {
        this._core.y = y;
    }

    get visible() {
        return this._core.visible;
    }

    set visible(visible: boolean) {
        this._core.visible = visible;
    }

    get setOrigin(): (x: number, y?: number) => void {
        return this._core.setOrigin.bind(this._core);
    }

    get origin(): Point {
        return this._core.origin;
    }

    get relativeMove() : (xDiff: number, yDiff: number) => void {
        return this._core.relativeMove.bind(this._core);
    }

    get enableMask() : (x: number, y: number, width: number, height: number) => void {
        return this._core.enableMask.bind(this._core);
    }

    get width() {
        return this._core.width;
    }

    set width(width: number) {
        this._core.width = width;
    }

    get height() {
        return this._core.height;
    }

    set height(height: number) {
        this._core.height = height;
    }

    // parent/child proxy methods
    addChild(child: IGameObject): void {
        this._pcHandler.addChild(child);
    }

    removeChild(child: IGameObject): void {
        this._pcHandler.removeChild(child);
    }

    hasChild(child: IGameObject): boolean {
        return this._pcHandler.hasChild(child);
    }

    get parent() {
        return this._pcHandler.parent;
    }

    set parent(parent: IGameObject | null) {
        this._pcHandler.parent = parent;
    }

    get children() {
        return this._pcHandler.children;
    }

    destroy() {
        if (this._pcHandler.parent !== null) this._pcHandler.parent.removeChild(this);
        this._core.destroy();
    }
}

export default ContainerObject;