import Point from "../../Geom/Point";
import Events from "../Events";
import Loop from "../Loop";
import BaseGameObject from "./BaseGameObject";
import Easing from "./Components/Easing";
import Dropzone from "./Dropzone";
import IParentChild from "./IParentChild";
import SliceObject from "./SliceObject";
import SpineObject from "./SpineObject";
import SpriteObject from "./SpriteObject";
import TextObject from "./TextObject";

/**
 * @description A wrapper to stack other GOs and drag&drop them as one. 
 */
class DraggableObject {
    private _slice: SliceObject; private _spine: SpineObject; private _sprite: SpriteObject; private _text: TextObject;
    private _loop: Loop; private _dropzone: Dropzone; private _point: Point; private _events: Events;
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
                loop: Loop, dropzone: Dropzone, point: Point, events: Events) {
        this._slice = slice; this._spine = spine; this._sprite = sprite; this._text = text;
        this._loop = loop; this._dropzone = dropzone; this._point = point; this._events = events;
        this._layers = [];
        this._dropzones = [];
        this._enabled = true;
        this._beingDragged = false;
        this._doBeforeDragging = () => {};
        this._doAfterDropping = () => {};
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
        return new DraggableObject(this._slice.createEmpty(), this._spine.createEmpty(), this._sprite.createEmpty(), this._text.createEmpty(), this._loop, this._dropzone.createEmpty(), this._point, this._events);
    }

    addSlice(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number, width?: number, height?: number, parent: IParentChild | null = null, scale: number = 1): SliceObject {
        let finalPosition = this._determinePosition(x, y);
        let slice = this._slice.createNew(finalPosition.x, finalPosition.y, textureName, leftWidth, topHeight, rightWidth, bottomHeight, parent);
        if (width !== undefined) slice.width = width;
        if (height !== undefined) slice.height = height;
        this._addGO(slice, scale);
        this.id = textureName;
        return slice;
    }

    addSpine(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null = null, scale: number = 1): SpineObject {
        let finalPosition = this._determinePosition(x, y);
        let spine = this._spine.createNew(finalPosition.x, finalPosition.y, textureName, frame, parent);
        this._addGO(spine, scale);
        this.id = textureName;
        return spine;
    }

    addSprite(x: number, y: number, texture: string | PIXI.Texture, frame: string | null = null, parent: IParentChild | null = null, scale: number = 1): SpriteObject {
        let finalPosition = this._determinePosition(x, y);
        let sprite = this._sprite.createNew(finalPosition.x, finalPosition.y, texture, frame, parent);
        this._addGO(sprite, scale);
        if(typeof texture == 'string') this.id = texture;
        return sprite;
    }

    addText(x: number, y: number, text: string, style: any = undefined, parent: IParentChild | null = null, scale: number = 1): TextObject {
        let finalPosition = this._determinePosition(x, y);
        let textObject = this._text.createNew(finalPosition.x, finalPosition.y, text, style, parent);
        this._addGO(textObject, scale);
        this.id = text;
        return textObject;
    }

    addDropzone(dropzone: Dropzone) {
        this._dropzones.push(dropzone);
    }

    addZone(name: string, zone: { x1: number, y1: number, x2: number, y2: number, x3?: number, y3?: number }): Dropzone {
        let dropzone = this._dropzone.createNew(name, zone);
        this._dropzones.push(dropzone);
        return dropzone;
    }

    getZone(name: string): Dropzone | null {
        for (let dropzone of this._dropzones) {
            if (dropzone.name == name) {
                return dropzone;
            }
        }
        return null;
    }

    get dropzones(): Dropzone[] {
        return this._dropzones;
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
    }

    private _startDragging() {
        if (this._background) {
            this._beingDragged = true;
            this._xOffset = this._background.x - this._background.input.manager.pointer.x;
            this._yOffset = this._background.y - this._background.input.manager.pointer.y;
            this._doBeforeDragging();
        }
    }

    private _drop() {
        if (this._background) {
            this._beingDragged = false;
            
            if(this._dropzones.length > 0) {
                let moveTo;
                for (let dropzone of this._dropzones) {
                    if (this.isInside(dropzone)) {
                        this._currentDropzone = dropzone;
                        moveTo = dropzone.center;
                        this.moveTo(moveTo);
                        break;
                    }
                }
                if(!moveTo) {
                    this.moveTo(this._initialPosition);
                    this._currentDropzone = null;
                }

                this._events.emit('draggable_dropped', {draggable: this});
            }
            this._doAfterDropping();
        }
    }

    isInside(dropzone: Dropzone): boolean {
        return (this.x >= dropzone.topLeft.x && this.x <= dropzone.bottomRight.x
            && this.y >= dropzone.topLeft.y && this.y <= dropzone.bottomRight.y);
    }

    moveTo(point: Point, time: number = 600) {
        this._background?.tweens.add(Easing.Elastic.InOut)
            .to({x: point.x, y: point.y}, time)
            .start();
    }

    doBeforeDragging(doThis: Function): void {
        this._doBeforeDragging = doThis;
    }

    doAfterDropping(doThis: Function): void {
        this._doAfterDropping = doThis;
    }

    private _isInitialized(): boolean {
        if (!this._background) {
            throw new Error('Draggable not initialized. At least one Game Object needs to be added.');
        }
        return true;
    }

    setOrigin(x: number, y?: number): void {
        if (this._isInitialized()) this._background.setOrigin(x, y);
    }

    destroy(): void {
        for (let object of this._layers) object.destroy();
        this._background.destroy();
        this._loop.removeFunction(this._update, this);
    }

    changeTexture(textureName: string): void {
        if (this._isInitialized()) this._background.changeTexture(textureName);
    }

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

    get origin(): Point {
        this._isInitialized();
        return this._background.origin;
    }

    get textureName(): string {
        this._isInitialized();
        return this._background.textureName;
    }

    get id(): string {
        this._isInitialized();
        return this._id;
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

    set id(id: string) {
        this._isInitialized();
        this._id = id;
    }
}

export default DraggableObject;