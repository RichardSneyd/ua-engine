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
import IPoint from "../../Geom/IPoint";

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
    protected _colorMap: Uint8Array | Uint8ClampedArray; // 1D array of 8 bit (1 byte) unsigned (0 or positive) integers, in format RGBA

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
       /*  this._extract.toPixels().then((pixels)=>{
            this._pixels = pixels;
        }) */
    }

    /**
     * @description a 1D array of RGBA pixel values. This is set on creation of the gameObject, and when changeTexture is called. 
     */
    get colorMap() {
        return this._colorMap;
    }

    /**
     * @description updates the colorMap based on a scrape of the Texture displayed in the current frame 
     */
    public updateColorMap(){
        this._colorMap = this._extract.pixels();
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
        let scaleX = this.scaleHandler.x;
        let scaleY = this.scaleHandler.y;
        this._core.changeTexture(textureName);
        this.scaleHandler.x = scaleX;
        this.scaleHandler.y = scaleY;
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

    get data(): any {
        return this._core.data;
    }

    set data(data:  any) {
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
     //   if(this.parent) this.parent.sort();
    }

    /**
     * @description sort children
     */
    sort(){
        this._core.sortChildren();
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

    /**
   * @description returns the leftmost point, which is 0 by default for a container. If there are children, the left value of the furthest left child will be returned.
   */
    get left(): number {
        let leftest = this._core.left > this.globalChildrenLeft ? this.globalChildrenLeft : this._core.left;
        return leftest;
    }

    get right(): number {
        let rightest = this._core.right < this.globalChildrenRight ? this.globalChildrenRight : this._core.right;
        return rightest;
    }

    get top(): number {
        let heighest = this._core.top > this.globalChildrenTop ? this.globalChildrenTop : this._core.top;
        return heighest;
    }

    get bottom(): number {
        let bottom = this._core.bottom < this.globalChildrenBottom ? this.globalChildrenBottom : this._core.bottom;
        return bottom;
    }

    set left(left: number) {
        let diff = left - this.left;
        this.x += diff;
    }

    set right(right: number) {
        let diff = right - this.right;
        this.x += diff;
    }

    set top(top: number) {
        let diff = top - this.top;
        this.y += diff;
    }

    set bottom(bottom: number) {
        let diff = bottom - this.bottom;
        this.y += diff;
    }

    /**
     * @description the leftmost position, disregarding the positions of any children gameObjects
     */
    get childlessLeft(): number {
        return this._core.left;
    }

    /**
     * @description the rightmost position, disregarding the positions of any children gameObjects
     */
    get childlessRight(): number {
        return this._core.right;
    }

    /**
     * @description the heighest position, disregarding the positions of any children gameObjects
     */
    get childlessTop(): number {
        return this._core.top;
    }

    /**
     * @description the lowest position, disregarding the positions of any children gameObjects
     */
    get childlessBottom(): number {
        return this._core.bottom;
    }

    /**
     * @description the greatest left value of any child object
     */
    get childrenLeft(): number {
        return this._childrenLeft();
    }

    /**
    * @description the greatest right value of any child object
    */
    get childrenRight(): number {
        return this._childrenRight();
    }

    /**
   * @description the greatest top value of any child object
   */
    get childrenTop(): number {
        return this._childrenTop();
    }

    /**
      * @description the greatest bottom value of any child object
      */
    get childrenBottom(): number {
        return this._childrenBottom();
    }

    /**
     * @description the local center of all children
     */
    get childrenCenter(): IPoint {
        return { x: this._childrenWidth() / 2, y: this._childrenHeight() / 2 }
    }

    /**
     * @description the global center of all children
     */
    get globalChildrenCenter(): IPoint {
        let localCenter = this.childrenCenter;
        return { x: this.x + localCenter.x, y: this.y + localCenter.y }
    }

    /**
    * @description the greatest left value of any child object, in global space   
    */
    get globalChildrenLeft(): number {
        return this.x + this.childrenLeft;
    }
    /**
      * @description the greatest right value of any child object, in global space
      */
    get globalChildrenRight(): number {
        return this.x + this.childrenRight;
    }

    /**
  * @description the greatest top value of any child object, in global space
  */
    get globalChildrenTop(): number {
        return this.y + this.childrenTop;
    }
    /**
      * @description the greatest bottom value of any child object, in global space
      */
    get globalChildrenBottom(): number {
        return this.y + this.childrenBottom;
    }

    /**
  * @description returns the calculated 'bounds' of the GameObject as an object literal, in game-units
  */
    get bounds(): { x: number, y: number, width: number, height: number } {
        return { x: this.left, y: this.top, width: this.width, height: this.height }
    }

    /**
  * @description returns the calculated 'bounds' of the GameObject as an object literal, in game-units
  */
    get childlessBounds(): { x: number, y: number, width: number, height: number } {
        return { x: this.childlessLeft, y: this.childlessTop, width: this.childlessWidth, height: this.childlessHeight }
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
        let width = this._childrenWidth() > this._core.width ? this._childrenWidth() : this._core.width;
        return width;
    }

    /**
     * @description the width, without regard for child objects
     */
    get childlessWidth() {
        return this._core.width;
    }

    /**
     * @description for resizing sprite-based objects graphically. Has no effect on the calculated height of an object being used as a container, which is based on the positions 
     * of the children
     */
    set width(width: number) {
        this._core.width = width;
    }

    get height() {
        let height = this._childrenHeight() > this._core.height ? this._childrenHeight() : this._core.height;
        return height;
    }

    /**
     * @description the height, without regard for child objects
     */
    get childlessHeight() {
        return this._core.height;
    }

    /**
     * @description for resizing sprite-based objects graphically. Has no effect on the calculated width of an object being used as a container, which is based on the positions 
     * of the children
     */
    set height(height: number) {
        this._core.height = height;
    }

    /**
     * @description calculates the width of the game object as a 'container', meaning based on the positions of its children
     */
    get containerWidth(): number {
        return this._childrenWidth();
    }

    /**
    * @description calculates the height of the game object as a 'container', meaning based on the positions of its children
    */
    get containerHeight(): number {
        return this._childrenHeight();
    }

    /**
    * @description look at (angle towards) an object on screen. Any object with an x and y parameter is acceptible
    * @param object the object (must have x and y properties) to angle towards 
    * @param offset an optional offset value, in degrees
    */
    public lookAt(object: { x: number, y: number }, offset: number = 0) {
        this._core.lookAt(object, offset);
    }

    /**
     * @description also recursively destroys all children
     */
    destroy() {
       // if (this._pcHandler.parent !== null) this._pcHandler.parent.removeChild(this);
        this.destroyChildren();
        this._core.destroy();
    }

    /**
     * @description destroys all children in the children array and removes them from it
     */
    destroyChildren(){
        this._pcHandler.destroyChildren();
    }

    /**
     * @description destroys the child and removes it from the children array
     * @param child the child to remove. Must be an IGameObject
     */
    destroyChild(child: IGameObject){
        this._pcHandler.destroyChild(child);
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

    set opacity(value: number){
        this._core.alpha = value;
    }

    get opacity(){
        return this._core.alpha;
    }

    // ALWAYS listen for core.update in events, never this one directly, as it is called from core.update.
    protected _update(time: number) {
        // this._TweenComponent.update(time);
        if (this._animationManager && this.data) this._animationManager.update();
    }

    protected _childrenWidth(): number {
        return this._childrenRight() - this._childrenLeft();
    }

    protected _childrenHeight(): number {
        return this._childrenBottom() - this._childrenTop();
    }

    protected _childrenBottom(): number {
        // Debug.info('in BaseGameObject._chilrenBottom')
        let bottom = 0;
        let children = this.pcHandler._children;
        for (let c = 0; c < children.length; c++) {
            //    Debug.info('looping child ', c);
            let child = children[c];
            if (c == 0) bottom = child.bottom;
            if (child.bottom > bottom) bottom = child.bottom;
        }

        return bottom;
    }

    protected _childrenTop() {
        let top = 0;
        let children = this.pcHandler.children;
        for (let c = 0; c < children.length; c++) {
            let child = children[c];
            if (c == 0) top = child.top;
            if (child.top < top) top = child.top;
        }

        return top;
    }

    protected _childrenRight() {
        let right = 0;
        let children = this._pcHandler.children;
        for (let c = 0; c < children.length; c++) {
            let child = children[c];
            if (c == 0) right = child.right;
            if (child.right > right) right = child.right;
        }

        return right;
    }

    protected _childrenLeft() {
        let left = 0;
        let children = this._pcHandler.children;
        for (let c = 0; c < children.length; c++) {
            let child = children[c];
            if (c == 0) left = child.left;
            if (child.left < left) left = child.left;
        }

        return left;
    }
}

export default BaseGameObject;