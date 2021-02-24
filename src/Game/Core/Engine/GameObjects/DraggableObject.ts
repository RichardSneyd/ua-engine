import Point from "../../Geom/Point";
import Debug from "../Debug";
import Events from "../Events";
import InputManager from "../InputManager";
import Loop from "../Loop";
import BaseGameObject from "./BaseGameObject";
import Easing from "./Components/Easing";
import ExtractComponent from "./Components/ExtractComponent";
import InputHandler from "./Components/InputHandler";
import ParentChildHandler from "./Components/ParentChildHandler";
import ScaleHandler from "./Components/ScaleHandler";
import TweenComponent from "./Components/TweenComponent";
import Dropzone from "./Dropzone";
import IGameObject from "./IGameObject";
import IParentChild from "./IParentChild";
import SliceObject from "./SliceObject";
import SpineObject from "./SpineObject";
import SpriteObject from "./SpriteObject";
import TextObject from "./TextObject";

/**
 * @description A wrapper to stack other GOs and drag&drop them as one. 
 */
class DraggableObject implements IGameObject {
    private _slice: SliceObject; private _spine: SpineObject; private _sprite: SpriteObject; private _text: TextObject;
    private _loop: Loop; private _dropzone: Dropzone; private _point: Point; private _events: Events; private _input: InputManager;
    private _layers: BaseGameObject[];
    private _background: BaseGameObject;
    private _dropzones: Dropzone[];
    private _enabled: boolean;
    private _beingDragged: boolean;
    private _xOffset: number;
    private _yOffset: number;
    private _doBeforeDragging: Function;
    private _doAfterDropping: Function;
    private _initialPosition: Point;
    private _currentDropzone: Dropzone | null;
    private _id: string;

    constructor(slice: SliceObject, spine: SpineObject, sprite: SpriteObject, text: TextObject,
        loop: Loop, dropzone: Dropzone, point: Point, events: Events, input: InputManager) {
        this._slice = slice; this._spine = spine; this._sprite = sprite; this._text = text;
        this._loop = loop; this._dropzone = dropzone; this._point = point; this._events = events; this._input = input;
        this._layers = [];
        this._dropzones = [];
        this._enabled = true;
        this._beingDragged = false;
        this._doBeforeDragging = () => { };
        this._doAfterDropping = () => { };
        this._currentDropzone = null;

        this._loop.addFunction(this._update, this);
        this._loop.start();
    }

    init(x: number, y: number, texture: string | PIXI.Texture, frame: string | null = null, parent: IParentChild | null = null): void {
        this.addSprite(x, y, texture, frame, parent);
    }

    createNew(x: number, y: number, texture: string | PIXI.Texture, frame: string | null = null, parent: IParentChild | null = null): DraggableObject {
        let draggable = this.createEmpty();
        draggable.init(x, y, texture, frame, parent);
        return draggable;
    }

    createEmpty(): DraggableObject {
        return new DraggableObject(this._slice.createEmpty(), this._spine.createEmpty(), this._sprite.createEmpty(), this._text.createEmpty(), this._loop, this._dropzone.createEmpty(), this._point, this._events, this._input);
    }

    /**
     * @description Creates a SliceObject and adds it to this DraggableObject
     * @param x X coordinate. Only used for the first GO added, ignored for the rest
     * @param y Y coordinate. Only used for the first GO added, ignored for the rest
     * @param textureName Name of the image to be sliced
     * @param leftWidth Optional left margin that won't be copied to extend the slice
     * @param topHeight Optional top margin that won't be copied to extend the slice
     * @param rightWidth Optional right margin that won't be copied to extend the slice
     * @param bottomHeight Optional bottom margin that won't be copied to extend the slice
     * @param width Optional width for the sliced image
     * @param height Optional width for the sliced image
     * @param parent Optional parent for the Draggable. Only used for the first GO added, ignored for the rest
     * @param scale Optional scale for the slice
     */
    addSlice(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number, width?: number, height?: number, parent: IParentChild | null = null, scale: number = 1): SliceObject {
        let finalPosition = this._determinePosition(x, y);
        let slice = this._slice.createNew(finalPosition.x, finalPosition.y, textureName, leftWidth, topHeight, rightWidth, bottomHeight, parent);
        if (width !== undefined) slice.width = width;
        if (height !== undefined) slice.height = height;
        this._addGO(slice, scale);
        this.id = textureName;
        return slice;
    }

    /**
     * @description Creates a SpineObject and adds it to this DraggableObject
     * @param x X coordinate. Only used for the first GO added, ignored for the rest
     * @param y Y coordinate. Only used for the first GO added, ignored for the rest
     * @param textureName Name of the spine
     * @param frame Optional string
     * @param parent Optional parent for the Draggable. Only used for the first GO added, ignored for the rest
     * @param scale Optional scale for the spine
     */
    addSpine(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null = null, scale: number = 1): SpineObject {
        let finalPosition = this._determinePosition(x, y);
        let spine = this._spine.createNew(finalPosition.x, finalPosition.y, textureName, frame, parent);
        this._addGO(spine, scale);
        this.id = textureName;
        return spine;
    }

    /**
     * @description Creates a SpriteObject and adds it to this DraggableObject
     * @param x X coordinate. Only used for the first GO added, ignored for the rest
     * @param y Y coordinate. Only used for the first GO added, ignored for the rest
     * @param texture Name of the sprite
     * @param frame Optional frame the sprite will be set to
     * @param parent Optional parent for the Draggable. Only used for the first GO added, ignored for the rest
     * @param scale Optional scale for the sprite
     */
    addSprite(x: number, y: number, texture: string | PIXI.Texture, frame: string | null = null, parent: IParentChild | null = null, scale: number = 1): SpriteObject {
        let finalPosition = this._determinePosition(x, y);
        let sprite = this._sprite.createNew(finalPosition.x, finalPosition.y, texture, frame, parent);
        this._addGO(sprite, scale);
        if (typeof texture == 'string') {
            this.id = texture;
        }
        return sprite;
    }

    /**
     * @description Creates a TextObject and adds it to this DraggableObject
     * @param x X coordinate. Only used for the first GO added, ignored for the rest
     * @param y Y coordinate. Only used for the first GO added, ignored for the rest
     * @param text String text to be created
     * @param style Optional object with the style to apply to the text
     * @param parent Optional parent for the Draggable. Only used for the first GO added, ignored for the rest
     * @param scale Optional scale for the text
     */
    addText(x: number, y: number, text: string, style: any = undefined, parent: IParentChild | null = null, scale: number = 1): TextObject {
        let finalPosition = this._determinePosition(x, y);
        let textObject = this._text.createNew(finalPosition.x, finalPosition.y, text, style, parent);
        this._addGO(textObject, scale);
        this.id = text;
        return textObject;
    }

    /**
     * @description Adds a Dropzone internal object the draggable can be dropped to. Equivalent method `addZone()` receives coordinates and returns a Dropzone. This method can be used to avoid creating a Dropzone too many times
     * @param dropzone Dropzone object created using `addZone()`
     */
    addDropzone(dropzone: Dropzone) {
        this._dropzones.push(dropzone);
    }

    /**
     * @description Adds a named dropzone where the draggable can be dropped. Internally it will create a Dropzone object
     * @param name dropzone name. It doesn't need to be unique, but `getZone()` searchs by name
     * @param zone x1, y1: top left corner; x2, y2: bottom right corner; x3, y3: Optional center of the zone, calculated if missing.
     */
    addZone(name: string, zone: { x1: number, y1: number, x2: number, y2: number, x3?: number, y3?: number }): Dropzone {
        let dropzone = this._dropzone.createNew(name, zone);
        this._dropzones.push(dropzone);
        return dropzone;
    }

    /**
     * @description Returns the first zone with provided name
     * @param name Name of the zone
     */
    getZone(name: string): Dropzone | null {
        for (let dropzone of this._dropzones) {
            if (dropzone.name == name) {
                return dropzone;
            }
        }
        return null;
    }

    /**
     * @description Returns all zones the go can be dropped into
     */
    getZones(): Dropzone[] {
        return this._dropzones;
    }

    /**
     * @description Adds a child to the first GO in the draggable
     * @param child GO to add
     */
    addChild(child: IGameObject): void {
        this._isInitialized();
        this._background.addChild(child);
    }

    /**
     * @description Removes a previously added child to the first GO in the draggable
     * @param child GO to remove
     */
    removeChild(child: IGameObject): void {
        this._isInitialized();
        this._background.removeChild(child);
    }

    /**
     * @description Checks if a GO is already child of the draggable
     * @param child GO being searched
     */
    hasChild(child: IGameObject): boolean {
        this._isInitialized();
        return this._background.hasChild(child);
    }

    /**
     * @description Gets the string representation of the draggable, its id
     */
    toString(): string {
        return this.id;
    }

    // added this to avoid IGameObject implementation error
    get hitShape() {
        return null;
    }

    /**
     * @description Returns the first slice added to the draggable if there is one
     */
    get firstSlice(): SliceObject | undefined {
        for (let go of [this._background].concat(this._layers)) {
            if (go instanceof SliceObject) return go;
        }
    }

    /**
     * @description Returns the first spine added to the draggable if there is one
     */
    get firstSpine(): SpineObject | undefined {
        for (let go of [this._background].concat(this._layers)) {
            if (go instanceof SpineObject) return go;
        }
    }

    /**
     * @description Returns the first sprite added to the draggable if there is one
     */
    get firstSprite(): SpriteObject | undefined {
        for (let go of [this._background].concat(this._layers)) {
            if (go instanceof SpriteObject) return go;
        }
    }

    /**
     * @description Returns the first text added to the draggable if there is one
     */
    get firstText(): TextObject | undefined {
        for (let go of [this._background].concat(this._layers)) {
            if (go instanceof TextObject) return go;
        }
    }

    private _determinePosition(x: number, y: number): Point {
        if (this._background) {
            return this._point.createNew(this._background.width / 2, this._background.height / 2);
        }
        return this._point.createNew(x, y);
    }

    private _addGO(go: BaseGameObject, scale: number = 1) {
        if (!this._background) {
            this._background = go;

            this._initialPosition = this._point.createNew(go.x, go.y);
            this._initListeners();
        } else {
            this._background.addChild(go);
            this._layers.push(go);
        }
        go.setOrigin(.5);
        go.scaleHandler.scale = scale;
    }

    private _initListeners() {
        this._background.input.enableInput();
        this._background.input.addInputListener('pointerup', () => { if (this._enabled) this._drop() }, this);
        this._background.input.addInputListener('pointerdown', () => { if (this._enabled) this._startDragging() }, this);
    }

    private _update() {
        if (this._beingDragged && this._background) {
            this._background.moveToMouse(this._xOffset, this._yOffset);
        }

        if (this._beingDragged && !this._input.pointerDown) this._drop();
    }

    private _startDragging() {
        if (this._background) {
            this._beingDragged = true;
            this._xOffset = this._background.x - this._input.pointer.x;
            this._yOffset = this._background.y - this._input.pointer.y;
            this._doBeforeDragging();
        }
    }

    private _drop() {
        if (this._background && this._beingDragged) {
            this._beingDragged = false;

            if (this._dropzones.length > 0) {
                let moveTo;
                for (let dropzone of this._dropzones) {
                    if (this.isInside(dropzone)) {
                        this._currentDropzone = dropzone;
                        moveTo = dropzone.center;
                        this.moveTo(moveTo);
                        break;
                    }
                }
                if (!moveTo) {
                    this.moveTo(this._initialPosition);
                    this._currentDropzone = null;
                }
            }
            this._events.emit('draggable_dropped', { draggable: this });
            this._doAfterDropping();
        }
    }

    /**
     * @description If the draggable is inside a given Dropzone
     * @param dropzone Object created when adding a zone with `addZone()`
     */
    isInside(dropzone: Dropzone): boolean {
        return (this.x >= dropzone.topLeft.x && this.x <= dropzone.bottomRight.x
            && this.y >= dropzone.topLeft.y && this.y <= dropzone.bottomRight.y);
    }

    /**
     * @description Moves the draggable to a specific coordinate
     * @param point Point to move to
     * @param easing Optional easing method. Use Easing enum
     * @param time Optional time for the animation
     */
    moveTo(point: Point, easing: string = Easing.Elastic.InOut, time: number = 600) {
        this._background?.tweens.add(easing)
            .to({ x: point.x, y: point.y }, time)
            .start();
    }

    /**
     * @description Executes a function just when the draggable is tapped
     * @param doThis Function with the action
     */
    doBeforeDragging(doThis: Function): void {
        this._doBeforeDragging = doThis;
    }

    /**
     * @description Executes a function just after the draggable is dropped
     * @param doThis Function with the action
     */
    doAfterDropping(doThis: Function): void {
        this._doAfterDropping = doThis;
    }

    private _isInitialized(): boolean {
        if (!this._background) {
            throw new Error('Draggable not initialized. At least one Game Object needs to be added.');
        }
        return true;
    }

    /**
     * @description Sets the origin to the first GO of this draggable
     * @param x X coordinate
     * @param y Y coordinate
     */
    setOrigin(x: number, y?: number): void {
        if (this._isInitialized()) {
            this._background.setOrigin(x, y);
        }
    }

    /**
     * @description Destroys all GO that make up this draggable
     */
    destroy(): void {
        for (let object of this._layers) object.destroy();
        this._background.destroy();
        this._loop.removeFunction(this._update, this);
    }

    /**
     * @description Changes the texture of the first GO of this draggable
     * @param textureName New texture name
     */
    changeTexture(textureName: string): void {
        if (this._isInitialized()) {
            this._background.changeTexture(textureName);
        }
    }

    /**
     * @description Returns the first position the draggable was set to
     */
    get initialPosition(): Point {
        return this._initialPosition;
    }

    /**
     * @description Returns all Dropzones added
     */
    get dropzones(): Dropzone[] {
        return this._dropzones;
    }

    /**
     * @description Dropzone this draggable is in, if any
     */
    get inDropzone(): Dropzone | null {
        return this._currentDropzone;
    }

    get x(): number {
        this._isInitialized();
        return this._background.x;
    }

    get y(): number {
        this._isInitialized();
        return this._background.y;
    }

    get width(): number {
        this._isInitialized();
        return this._background.width;
    }

    get height(): number {
        this._isInitialized();
        return this._background.height;
    }

    get visible(): boolean {
        this._isInitialized();
        return this._background.visible;
    }

    get alpha(): number {
        this._isInitialized();
        return this._background.alpha;
    }

    /**
     * @description Texture name of the first GO added
     */
    get textureName(): string {
        this._isInitialized();
        return this._background.textureName;
    }

    /**
     * @description Draggable's Id, the last GO texture name or text by default
     */
    get id(): string {
        this._isInitialized();
        return this._id;
    }

    /**
     * @description Firt GO's extract
     */
    get extract(): ExtractComponent {
        this._isInitialized();
        return this._background.extract;
    }

    get angle() {
        this._isInitialized();
        return this._background.angle;
    }

    get tweens(): TweenComponent {
        this._isInitialized();
        return this._background.tweens;
    }

    get input(): InputHandler {
        this._isInitialized();
        return this._background.input;
    }

    get scaleHandler(): ScaleHandler {
        this._isInitialized();
        return this._background.scaleHandler;
    }

    get pcHandler(): ParentChildHandler {
        this._isInitialized();
        return this._background.pcHandler;
    }

    get data() {
        this._isInitialized();
        return this._background.data;
    }

    get atlas() {
        this._isInitialized();
        return this._background.atlas;
    }

    get events() {
        this._isInitialized();
        return this._background.events;
    }

    get zIndex() {
        this._isInitialized();
        return this._background.zIndex;
    }

    get origin(): Point {
        this._isInitialized();
        return this._background.origin;
    }

    get left(): number {
        this._isInitialized();
        return this._background.left;
    }

    get right(): number {
        this._isInitialized();
        return this._background.right;
    }

    get top(): number {
        this._isInitialized();
        return this._background.top;
    }

    get bottom(): number {
        this._isInitialized();
        return this._background.bottom;
    }

    get parent() {
        this._isInitialized();
        return this._background.parent;
    }

    get children() {
        this._isInitialized();
        return this._background.children;
    }

    /**
     * @description Gets if this draggable can be moved
     */
    get enabled(): boolean {
        return this._enabled;
    }

    set x(x: number) {
        this._isInitialized();
        this._background.x = x;
    }

    set y(y: number) {
        this._isInitialized();
        this._background.y = y;
    }

    set visible(visible: boolean) {
        this._isInitialized();
        this._background.visible = visible;
    }

    set alpha(alpha: number) {
        this._isInitialized();
        this._background.alpha = alpha;
    }

    set width(width: number) {
        this._isInitialized();
        this._background.width = width;
    }

    set height(height: number) {
        this._isInitialized();
        this._background.height = height;
    }

    /**
     * @description Changes the id, that by default is the latest GO's texture name or text
     */
    set id(id: string) {
        this._isInitialized();
        this._id = id;
    }

    set angle(angle: number) {
        this._isInitialized();
        this._background.angle = angle;
    }

    set data(data: any) {
        this._isInitialized();
        this._background.data = data;
    }

    set zIndex(index: number) {
        this._isInitialized();
        this._background.zIndex = index;
    }

    set parent(parent: IGameObject | null) {
        this._isInitialized();
        this._background.parent = parent;
    }

    /**
     * @description Sets if this draggable can be moved
     */
    set enabled(enabled: boolean) {
        this._enabled = enabled;
    }

    sort() {
        Debug.warn('sort not yet implement for DraggableObject...');
    }
}

export default DraggableObject;