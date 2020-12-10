import Events from "../Events";  // don't remove this import - it's needed
import AnimationManager from "./Components/FrameAnimationManager";
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import Screen from "../../../Services/Screen";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from "./Components/ScaleHandler";
import IFramedGameObject from "./IFrameAnimatedGameObject";
import FrameAnimationManager from './Components/FrameAnimationManager';
import Point from "../../Geom/Point";
import TweenComponent from "./Components/TweenComponent";
import Debug from "../Debug";
import ExtractComponent from './Components/ExtractComponent';
import { RenderTexture } from "pixi.js-legacy";
import IHitShape from "./Components/HitShapes/IHitShape";

/**
 * @description A sprite game object class. 
 */
abstract class BaseGameObject implements IGameObject {
    protected _screen: Screen;
    protected _core: ObjectCore;
    protected _input: InputHandler;
    protected _pcHandler: ParentChildHandler;
    protected _scaleHandler: ScaleHandler;
    protected _animationManager: IAnimationManager;
    protected _tweenComponent: TweenComponent;
    protected _extract: ExtractComponent;
    protected _hitShape: IHitShape | null;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: Screen, input: InputHandler,
        scaleHandler: ScaleHandler, tweenComponent: TweenComponent, extract: ExtractComponent) {
        this._core = objectCore; this._pcHandler = pcHandler; this._screen = screen; this._input = input; this._extract = extract;
        this._scaleHandler = scaleHandler; this._tweenComponent = tweenComponent;
        this._hitShape = null;
    }

    public init(...args: any[]): void {
        //  this.data = this._screen.createSprite(x, y, textureName, frame);
        this._scaleHandler.init(this, this._core);
        this._input.init(this, this._core);
        this._tweenComponent.init(this);
        this._extract.init(this);
    }

    //public createNew(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null = null): any {
    public createNew(...args: any[]): any {
        // override, but use similar pattern
        /*  let sprite = this.createEmpty();
         sprite.init(x, y, textureName, frame, parent);
         return sprite; */
    }

    public createEmpty(): any {
        // return new BaseGameObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this._scaleHandler.createNew(), this._animationManager.createNew(), this._tweenComponent.createNew());
    }

    public get extract(): ExtractComponent {
        return this._extract;
    }

    public changeTexture(textureName: string | PIXI.Texture) {
        this._core.changeTexture(textureName);
    }

    get hitShape(): IHitShape | null {
        return this._hitShape;
    }

    set hitShape(val: IHitShape | null) {
        this._hitShape = val;
    }

    get angle() {
        return this._core.angle;
    }

    set angle(angle: number) {
        this._core.angle = angle;
    }

    get tweens() {
        return this._tweenComponent;
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

    // override this
    get animations(): any {
        //  return this._animationManager;
        Debug.warn('animationManager not implemented on this GameObject');
        return;
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
        return this._core.atlas;
    }

    get x() {
        return this._core.x;
    }

    set x(x: number) {
        this._core.x = x;
    }

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

    get zIndex() {
        return this._core.zIndex;
    }

    set zIndex(index: number) {
        this._core.zIndex = index;
    }

    /**
     * @description set the origin of the display object
     * @param x the origin value for the x axis. A value between 0 and 1.
     * @param y the origin value for the y axis. A value between 0 and 1. 
     */
    get setOrigin(): (x: number, y?: number) => void {
        return this._core.setOrigin.bind(this._core);
    }

    get origin(): Point {
        return this._core.origin;
    }

    get left(): number {
        return this._core.left;
    }

    get right(): number {
        return this._core.right;
    }

    get top(): number {
        return this._core.top;
    }

    get bottom(): number {
        return this._core.bottom;
    }

    /**
  * @description returns the calculated 'bounds' of the GameObject as an object literal, in game-units
  */
    get bounds(): { x: number, y: number, width: number, height: number } {
        return { x: this.left, y: this.top, width: this.width, height: this.height }
    }

    get moveBy(): (x: number, y: number) => void {
        return this._core.moveBy.bind(this._core);
    }

    get moveTo(): (x: number, y: number) => void {
        return this._core.moveTo.bind(this._core);
    }

    get moveToMouse() {
        return this._core.moveToMouse.bind(this._core);
    }

    get enableMask(): (x: number, y: number, width: number, height: number) => void {
        return this._core.enableMask.bind(this._core);
    }

    get alpha() {
        return this._core.alpha;
    }

    set alpha(alpha: number) {
        this._core.alpha = alpha;
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

    /**
     * @description calculates the width of the game object as a 'container', meaning based on the positions of its children
     */
    get containerWidth(): number {
        return this._containerWidth();
    }

    /**
    * @description calculates the height of the game object as a 'container', meaning based on the positions of its children
    */
    get containerHeight(): number {
        return this._containerHeight();
    }

    /**
    * @description look at (angle towards) an object on screen. Any object with an x and y parameter is acceptible
    * @param object the object (must have x and y properties) to angle towards 
    * @param offset an optional offset value, in degrees
    */
    public lookAt(object: { x: number, y: number }, offset: number = 0) {
        this._core.lookAt(object, offset);
    }

    destroy() {
        if (this._pcHandler.parent !== null) this._pcHandler.parent.removeChild(this);
        this._core.destroy();
    }

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

    // ALWAYS listen for core.update in events, never this one directly, as it is called from core.update.
    protected _update(time: number) {
        // this._TweenComponent.update(time);
        if (this._animationManager) this._animationManager.update();
    }

    protected _containerWidth(): number {
        let right = 0;
        let children = this.pcHandler.children;
        for (let c = 0; c < children.length; c++) {
            let child = children[c];
            if (child.right > right) right = child.right;
        }

        return right;
    }

    protected _containerHeight(): number {
        let bottom = 0;
        let children = this.pcHandler.children;
        for (let c = 0; c < children.length; c++) {
            let child = children[c];
            if (child.bottom > bottom) bottom = child.bottom;
        }

        return bottom;
    }
}

export default BaseGameObject;