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
import { emit } from "process";

/**
 * @description A sprite game object class. 
 */
abstract class BaseGameObject implements IGameObject {
    protected _name: string;
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
    protected _hitMap: Uint8Array | Uint8ClampedArray;

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

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    /**
     * @description a 1D array of RGBA pixel values. This is set on creation of the gameObject, and when changeTexture is called. 
     */
    get colorMap() {
        return this._colorMap;
    }


    /**
     * @description a 1D array of just alpha pixel values (1 per pixel). This is set on creation of the gameObject, and when changeTexture is called. 
     */
    get hitMap() {
        return this._hitMap;
    }

    /**
     * @description updates the colorMap based on a scrape of the Texture displayed in the current frame 
     */
    public updateColorMap() {
        this._colorMap = this._extract.pixels();
    }

    public updateHitmap() {
        this.updateColorMap();
        let hitPixels = [];
        for (let i = 3; i < this._colorMap.length; i += 4) {
            hitPixels.push(this._colorMap[i]);
        }
        this._hitMap = new Uint8Array(hitPixels);
        //  this._core.data.hitMap = this._hitMap;
        //  Debug.info(this.name + ' hMap length: ', this._hitMap.length, ', number pixels: ', this.childlessWidth * this.childlessHeight);
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

    get core() {
        return this._core;
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
        //   if(this.parent) this.parent.sort();
    }

    /**
     * @description sort children
     */
    sort() {
        this._core.sortChildren();
    }

    /**
     * @description set the origin of the display object
     * @param x the origin value for the x axis. A value between 0 and 1.
     * @param y the origin value for the y axis. A value between 0 and 1. 
     */
    public setOrigin(x: number, y?: number): void {
        this._core.setOrigin.bind(this._core)(x, y);
    }

    /**
     * @description Change the origin without moving the object on-screen
     * @param x the new x origin to set
     * @param y the new y origin to set. If not provided, the x value will be used in both cases instead
     */
    shiftOrigin(x: number, y?: number) {
        if (!y) y = x;
        let xOrigDiff = x - this._core.origin.x;
        let yOrigDiff = y - this._core.origin.y;
        let xDiff = this.childlessWidth * xOrigDiff;
        let yDiff = this.childlessHeight * yOrigDiff;
        this._core.moveBy(xDiff, yDiff);
        this._core.setOrigin(x, y);
    }

    /**
     * @description checks if the global point is within the screen bounds of the object
     * @param point the global point to check 
     */
    inBounds(point: IPoint): boolean {
        if (point.x > this.globalLeft && point.x < this.globalLeft + this.childlessWidth) {
            if (point.y > this.globalTop && point.y < this.globalTop + this.childlessHeight) {
                return true;
            }
        }
        return false;
    }

    get globalLeft() {
        return this.globalX - (this.childlessWidth * this.origin.x);
    }

    get globalTop() {
        return this.globalY - (this.childlessHeight * this.origin.y);
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
        return this.child();
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

       /**
     * @description the width of the gameObject/container, also factoring in positions and dimensions of its child objects
     */
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

      /**
     * @description the height of the gameObject/container, also factoring in positions and dimensions of its child objects
     */
    get height() {
        let height = this._childrenHeight() > this._core.height ? this._childrenHeight() : this._core.height;
        return height;
    } 

    get center() {
        return {x: this.left + this.width / 2, y: this.top + this.height / 2};
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
     * @description the distance between the the left extremity of the furthest-left child, and the right-extremity of the  
     * the furthest-right child of this container/gameObject
     * @returns a local x coordinate
     */
     protected _childrenWidth(): number {
        return this._childrenRight() - this.child();
    }

     /**
     * @description the distance between the the lowest extremity of the furthest-down child, and the highest-extremity of the  
     * the furthest-up child of this container/gameObject
     * @returns a local y coordinate
     */
    protected _childrenHeight(): number {
        return this._childrenBottom() - this._childrenTop();
    }

      /**
     * @description the lowest point of any child of this gameObject, in local space
     * @returns a local y coordinate
     */
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

      /**
     * @description the highest point of any child of this gameObject, in local space
     * @returns a local y coordinate
     */
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

      /**
     * @description the furthest right position of any child of this gameObject, in local space
     * @returns a local x coordinate
     */
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
       // Debug.info('in baseGameObject.destroy for  ', this.name);

        // if (this._pcHandler.parent !== null) this._pcHandler.parent.removeChild(this);
        //   Debug.info('children destroyed, now call core.destroy for...  ', this.name);
        this.events.emit('removeForObjects', [this.origin, this.scaleHandler, this]); // remove for 'this' last, or the components tweens get reference errors when it's gone
        this._core.events.emit('removeBody', {go: this}); // remove physics body from Physics class if there is one for this gameObject
        // slight delay required to avoid reference errors in the tweens for some reason...
    //   this._core.events.timer(()=>{
            this.destroyChildren();
            this._core.destroy();

    //    }, 40, this);
    }

    /**
     * @description destroys all children in the children array and removes them from it
     */
    destroyChildren() {
        this._pcHandler.destroyChildren();
    }

    /**
     * @description destroys the child and removes it from the children array
     * @param child the child to remove. Must be an IGameObject
     */
    destroyChild(child: IGameObject) {
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

    set opacity(value: number) {
        this._core.alpha = value;
    }

    get opacity() {
        return this._core.alpha;
    }

    // ALWAYS listen for core.update in events, never this one directly, as it is called from core.update.
    protected _update(time: number) {
        // this._TweenComponent.update(time);
        if (this._animationManager && this.data) this._animationManager.update();
    }


      /**
     * @description the furthest left position of any child of this gameObject, in local space
     * @returns a local x coordinate
     */
    protected child() {
        let left = 0;
        let children = this._pcHandler.children;
        for (let c = 0; c < children.length; c++) {
            let child = children[c];
            if (c == 0) left = child.left;
            if (child.left < left) left = child.left;
        }

        return left;
    }

    get globalX() {
        if (this.parent) {
            return this.x + this.parent.globalX;
        }
        else {
            return this.x;
        }
    }

    get globalY() {
        if (this.parent) {
            return this.y + this.parent.globalY;
        }
        else {
            return this.y;
        }
    }

    /**
     * 
     * @param val converts a global x coordinate to a local x coordinate
     * @returns a local x coordinate
     */
    toLocalX(val: number) : number{
        return val - this.globalX;
    }
    
     /**
     * 
     * @param val converts a global y coordinate to a local y coordinate
     * @returns a local x coordinate
     */
    toLocalY(val: number) : number{
        return val - this.globalY;
    }

     /**
     * 
     * @param val converts a local x coordinate to a global x coordinate
     * @returns a global x coordinate
     */
    toGlobalX(val: number) : number{
        return val + this.globalX;
    }

      /**
     * 
     * @param val converts a local y coordinate to a global y coordinate
     * @returns a global y coordinate
     */
    toGlobalY(val: number) : number{
        return val + this.globalY;
    }

      /**
     * 
     * @param val converts a global point to a global point
     * @returns a local point
     */
    toLocal(point: IPoint): IPoint{
        return {x: this.toLocalX(point.x), y: this.toLocalY(point.y)}
    }

    /**
     * 
     * @param point converts a local point to a global point
     * @returns a global point
     */
    toGlobal(point: IPoint): IPoint{
        return {x: this.toGlobalX(point.x), y: this.toGlobalY(point.y)}
    }
}

export default BaseGameObject;