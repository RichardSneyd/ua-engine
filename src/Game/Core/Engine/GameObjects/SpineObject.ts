import Events from "../Events";
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import IScreen from "../../../Services/IScreen";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from "./Components/ScaleHandler";
import AnimationManager from "./Components/FrameAnimationManager";
import SpineAnimationManager from './Components/SpineAnimationManager';
import TweenManager from "./Components/TweenManager";

class SpineObject implements IGameObject, IParentChild {
    private _screen: IScreen;
    private _core: ObjectCore;
    private _input: InputHandler;
    private _pcHandler: ParentChildHandler;
    private _scaleHandler: ScaleHandler;
    private _animations: SpineAnimationManager;
    private _tweenManager: TweenManager;

    constructor(objectCore: ObjectCore, ParentChildHandler: ParentChildHandler, screen: IScreen, input: InputHandler, 
        scaleHandler: ScaleHandler, animationManager: SpineAnimationManager, tweenManager: TweenManager) {
        this._core = objectCore; this._pcHandler = ParentChildHandler; this._screen = screen; this._input = input;
        this._scaleHandler = scaleHandler; this._animations = animationManager; this._tweenManager = tweenManager;
    }

    public init(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null = null): void {
        this.data = this._screen.createSprite(x, y, textureName, frame);

        if (frame != null) this._core.atlas = textureName;

        this._core.init(this, x, y, textureName);
        this._input.init(this);
        this._pcHandler.init(this._core, parent);

    }

    public update(time: any){
      //  this.animations.update(time);
    }

    public createNew(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null = null): SpineObject {
        let sprite = this.createEmpty();
        sprite.init(x, y, textureName, frame, parent);
        return sprite;
    }

    public createEmpty(): SpineObject {
        let sprite = new SpineObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this._scaleHandler.createNew(), this.animations.createNew(), this._tweenManager.createNew());
        return sprite;
    }

    public changeTexture(textureName: string) {
        this._core.changeTexture(textureName);
    }

    get tweens(){
        return this._tweenManager;
    }

    get input(){
        return this._input;
    }

    get scaleHandler(){
        return this._scaleHandler;
    }
    
    get animations(){
        return this._animations;
    }

    get pcHandler(){
        return this._pcHandler;
    }

    get data(): PIXI.spine.Spine{
        return this._core.data;
    }

    set data(data: PIXI.spine.Spine) {
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

    set height(height: number){
        this._core.height = height;
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