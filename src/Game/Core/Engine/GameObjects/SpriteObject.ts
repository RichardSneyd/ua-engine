import Events from "../Events";
import AnimationManager from "./Components/FrameAnimationManager";
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import IScreen from "../../../Services/IScreen";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from "./Components/ScaleHandler";
import IFramedGameObject from "./IFrameAnimatedGameObject";
import FrameAnimationManager from './Components/FrameAnimationManager';
import TweenManager from "./Components/TweenManager";

class SpriteObject implements IFramedGameObject, IParentChild {
    private _screen: IScreen;
    private _core: ObjectCore;
    private _input: InputHandler;
    private _pcHandler: ParentChildHandler;
    private _scaleHandler: ScaleHandler;
    private _animationManager: FrameAnimationManager;
    private _tweenManager: TweenManager;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: IScreen, input: InputHandler,
        scaleHandler: ScaleHandler, animationManager: FrameAnimationManager, tweenManager: TweenManager) {
        this._core = objectCore; this._pcHandler = pcHandler; this._screen = screen; this._input = input;
        this._scaleHandler = scaleHandler; this._animationManager = animationManager; this._tweenManager = tweenManager;
    }

    public init(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null = null): void {
        this.data = this._screen.createSprite(x, y, textureName, frame);

        if (frame != null) this.core.atlas = textureName;

        this._core.init(this, x, y, textureName);
        this._input.init(this);
        this._pcHandler.init(this, parent);
        this._scaleHandler.init(this);
    }

    public createNew(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null = null): SpriteObject {
        let sprite = this.createEmpty();
        sprite.init(x, y, textureName, frame, parent);
        return sprite;
    }

    public createEmpty(): SpriteObject {
        return new SpriteObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this._scaleHandler.createNew(), this._animationManager.createNew(), this._tweenManager.createNew());
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

    get animations() {
        return this._animationManager;
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

    get atlas() {
        return this.core.atlas;
    }

    set atlas(textureName: any) {
        this.core.atlas = textureName;
    }

    get x() {
        return this._core.x;
    }

    set x(x: number) {
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

    get visible() {
        return this._core.visible;
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

    get parent() {
        return this._pcHandler.parent;
    }

    set parent(parent: IParentChild | null) {
        this._pcHandler.parent = parent;
    }

    get children() {
        return this._pcHandler.children;
    }

    addChild(child: IParentChild): void {
        this._pcHandler.addChild(child);
    }

    removeChild(child: IParentChild): void {
        this._pcHandler.removeChild(child);
    }

    update(time: number) {
        this._core.update(time);
    }


    destroy() {
        if (this._pcHandler.parent !== null) this._pcHandler.parent.removeChild(this);
        this._core.destroy();
    }
}

export default SpriteObject;