import ObjectCore from "./Components/ObjectCore";
import SpriteObject from './SpriteObject';
import SliceObject from './SliceObject';
import SpineObject from './SpineObject';
import TextObject from './TextObject';
import Button from './Button';
import ContainerObject from './ContainerObject';
import IParentChild from "./IParentChild";
import ScaleManager from '../ScaleManager';
import VideoObject from "./VideoObject";
import IGameObject from "./IGameObject";
import Screen from "../../../Services/Screen";
import Camera from "./Camera";
import { Texture } from "pixi.js-legacy";
import HitShapes from "./Components/HitShapes/HitShapes";
import DraggableObject from "./DraggableObject";
import Debug from "../Debug";
import MenuBar from "./MenuBar";
import ScriptHandler from "../ScriptHandler";
import BaseGameObject from "./BaseGameObject";
import States from "./State/States";
import TextSpriteObject from "./TextSpriteObject";

/**
 * @description A factory for creating game objects of various types
 */
class GOFactory {
    private _core: ObjectCore;
    private _sprite: SpriteObject;
    private _slice: SliceObject;
    private _spine: SpineObject;
    private _text: TextObject;
    private _textSprite: TextSpriteObject;
    private _draggable: DraggableObject;
    private _button: Button;
    private _container: ContainerObject;
    private _scaleManager: ScaleManager;
    private _video: VideoObject;
    private _screen: Screen;
    private _camera: Camera;
    private _hitShapes: HitShapes;
    private _menuBar: MenuBar;
    private _script: ScriptHandler;
    private _states: States;

    constructor(core: ObjectCore, script: ScriptHandler, sprite: SpriteObject, slice: SliceObject, spine: SpineObject, text: TextObject, textSprite: TextSpriteObject, 
        draggable: DraggableObject, container: ContainerObject, menuBar: MenuBar, scaleManager: ScaleManager, button: Button, video: VideoObject, screen: Screen, 
        camera: Camera, hitShapes: HitShapes, states: States) {
        this._core = core; this._script = script; this._slice = slice; this._spine = spine; this._text = text; this._container = container; this._menuBar = menuBar;
        this._sprite = sprite; this._scaleManager = scaleManager; this._button = button; this._video = video; this._screen = screen; this._textSprite = textSprite;
        this._camera = camera; this._hitShapes = hitShapes; this._draggable = draggable; this._states = states;
        Debug.exposeGlobal(this, 'goFactory');
    }

    get hitShapes() {
        return this._hitShapes;
    }

    /**
     * @description Creates and returns a text object
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     * @param text the text value to initialize with
     * @param style a css style object to apply to the text
     */
    public text(x?: number, y?: number, text?: string, style?: any, parent: IParentChild | null = null): TextObject {
        if (x != null && y != null && text != null && style != null) {
            //  let pos = this._scaleManager.getXY(x, y);
            return this._text.createNew(x, y, text, style, parent);
        } else {
            return this._text.createEmpty();
        }
    }

     /**
     * @description Creates and returns a text object
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     * @param text the text value to initialize with
     * @param style a css style object to apply to the text
     */
      public textSprite(x?: number, y?: number, text?: string, style?: any, parent: IParentChild | null = null): TextSpriteObject {
        if (x != null && y != null && text != null && style != null) {
            //  let pos = this._scaleManager.getXY(x, y);
            return this._textSprite.createNew(x, y, text, style, parent);
        } else {
            return this._textSprite.createEmpty();
        }
    }

    /**
     * @description Returns a Sprite object
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     * @param textureName the name of the texture to initialize the sprite with
     * @param frame the default frame for the Sprite. Optional. Provide this if working with an atlas animation
     * @param lFile levelFile object? If true, the 'texture' will be the 'filename' property of the respective levelFile data object. Will be 'transformed' automatically.
     */
    public sprite(x?: number, y?: number, texture?: string | PIXI.Texture, frame: string | null = null, parent: IParentChild | null = null, lFile: boolean = false): SpriteObject {
        let lfObj: any;
        if (lFile && typeof texture == 'string') {
            let root = (frame == null) ? 'sprites' : 'atlases';
            lfObj = this._script.getLevelFileObject(root, texture, 'name');
          //  Debug.info('lfObj: ', lfObj);
            texture = lfObj.filename;
        }
        if (x != null && y != null && texture != null) {
            //  let pos = this._scaleManager.getXY(x, y);
            //  Debug.info('pos: ', pos);
            let go = this._sprite.createNew(x, y, texture, frame, parent);
            if(lfObj && lFile) this._transformLevelFileObject(go, lfObj);
            return go;
        } else {
            return this._sprite.createEmpty();
        }
    }

    /**
     * @description Create a sprite object from a container or gameObject
     * @param x the starting x coordinate
     * @param y the starting y coordinate
     * @param generateFrom a gameObject or container to generate a texture from
     * @param parent the parent (if any) to this object as a child to
     */
    public spriteFromContainer(x: number, y: number, container: IGameObject, parent: IParentChild): SpriteObject {
        let sprite = this._sprite.createEmpty();
        sprite.init(x, y, '', null, parent);
        sprite.changeTexture(container.extract.toTexture());
        return sprite;
    }

    /**
     * @description Returns a Draggable Object. Parameters will create a composed SpriteObject
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     * @param textureName the name of the texture to initialize the sprite with
     * @param frame the default frame for the Sprite. Optional. Provide this if working with an atlas animation
     * @param parent the container it should be a child of. Optional
     * @param lFile levelFile object? If true, the 'texture' will be the 'filename' property of the respective levelFile data object. Will be 'transformed' automatically.
     */
    public draggable(x?: number, y?: number, texture?: string | PIXI.Texture, frame: string | null = null, parent: IParentChild | null = null, lFile: boolean = false): DraggableObject {
        let lfObj: any;
        if (lFile && typeof texture == 'string') {
            let root = (frame == null) ? 'sprites' : 'atlases';
            lfObj = this._script.getLevelFileObject(root, texture, 'name');
            texture = lfObj.filename;
        }
        if (x != null && y != null && texture != null) {
            let go = this._draggable.createNew((lfObj) ? lfObj.x : x, (lfObj) ? lfObj.y : y, texture, frame, parent);
            if (lfObj) this._transformLevelFileObject(go, lfObj);
            return go;
        } else {
            return this._draggable.createEmpty();
        }
    }

    /**
     * @description Creates a new VideObject and returns it
     * @param x the x position of the video sprite
     * @param y the y position of the video sprite
     * @param videoName the name of the video sprite, including the file extension. The path will be read from config.json.
     */
    public video(x: number, y: number, videoName: string): VideoObject {
        return this._video.createNew(x, y, videoName);
    }

    /**
     * @description Returns a button object, with autoGenerated up, down, over and out anims based on provided anim base names. 
     * @param x the x position of the object
     * @param y they y position of the object
     * @param atlas the name of the atas file to load from
     * @param frame the starting frame
     * @param anims an object containing up, down, over, and out properties for the base names of the animations (frames are pulled from
     * the json based on these)
     * @param onDown an onDown callback
     * @param context the context for callbacks
     * @param onUp (optional) an onUp callback
     * @param parent (optional) a parent to add this object to
     * @param lFile levelFile object? If true, the 'texture' will be the 'filename' property of the respective levelFile data object. Will be 'transformed' automatically.
     */
    public button(x?: number, y?: number, texture?: string, frame?: string, anims?: { up: string, down: string, over: string, out: string }, onDown?: Function,
        context?: any, onUp?: Function, onOver?: Function, parent?: IParentChild, lFile: boolean = false): Button {
        let lfObj: any;
        if (lFile && typeof texture == 'string') {
            let root = (frame == null) ? 'sprites' : 'atlases';
            lfObj = this._script.getLevelFileObject(root, texture, 'name');
            texture = lfObj.filename;
        }
        if (x != null && y != null && texture != null && frame && onDown) {
            // let pos = this._scaleManager.getXY(x, y);
            // Debug.info('pos: ', pos);
            let go = this._button.createNew(x, y, texture, frame, anims, onDown, context, onUp, onOver, parent);
            if (lFile) {this._transformLevelFileObject(go.sprite, lfObj)};
            return go;
        } else {
            return this._button.createEmpty();
        }
    }

    /**
     * @description Returns a nineSlice object
     * @param x the x coordinate to initialze with
     * @param y the y coordinate to initialize with
     * @param textureName the name of the loaded texture to initiaze the object with
     * @param leftWidth The number of pixels to come in on the left before you reach the mid section of the slice. This part will never stretch
     * @param topHeight The number of pixels to come in from the top before you reach the repeating section of the slice. This part will never stretch
     * @param rightWidth The number of pixels to come in from the right before you reach the repeating section of the slice. This part will never stretch
     * @param bottomHeight The number of pixels to come in from the bottom before you reach the repeating section of the slice. This part will never stretch
     * @param width optionally set a total width value
     * @param height optionally set a total height value
     * @param parent optionally specify a parent object for this SliceObject
     */
    public nineSlice(x?: number, y?: number, textureName?: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number, width?: number, height?: number, parent: IParentChild | null = null): SliceObject {
        if (x != null && y != null && textureName != null) {
            //   let pos = this._scaleManager.getXY(x, y);
            let slice = this._slice.createNew(x, y, textureName, leftWidth, topHeight, rightWidth, bottomHeight, parent);
            if (width !== undefined) slice.width = width;
            if (height !== undefined) slice.height = height;
            return slice;
        } else {
            return this._slice.createEmpty();
        }
    }

    /**
     * @description Creates and returns an empty 'container', analogous to PIXI.Container. If no x or y are provided, defaults to 0,0
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     */
    public container(x: number = 0, y: number = 0, parent: IParentChild | null = null): ContainerObject {

        if (x != null && y != null) {
            // let pos = this._scaleManager.getXY(x, y);
            return this._container.createNew(x, y, parent);
        } else {
            return this._container.createEmpty();
        }
    }

    /**
     * @description Creates and returns a Spine object
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     * @param spineName the name of the spine file to initialize with
     * @param lFile levelFile object? If true, the 'texture' will be the 'filename' property of the respective levelFile data object. Will be 'transformed' automatically.
     */
    public spine(x: number | null, y?: number, spineName?: string, parent: IParentChild | null = null, lFile: boolean = false): SpineObject {
        let lfObj: any;
        if (lFile && spineName) {
            let root = 'spines';
            lfObj = this._script.getLevelFileObject(root, spineName, 'name');
            spineName = lfObj.filename;
        }
        if (x != null && y != null && spineName != null) {
            // let pos = this._scaleManager.getXY(x, y);
            let go = this._spine.createNew(x, y, spineName, null, parent);
            if (lfObj) this._transformLevelFileObject(go, lfObj);
            return go;
        } else {
            return this._spine.createEmpty();
        }
    }

    /**
  * @description Create a new camera object
  * @param container the container to pair the camera with
  */
    public camera(container: ContainerObject) {
        return this._camera.createNew(container);
    }

    /**
     * @description A menu bar with a background sprite, which houses atlas based buttons. Useful mainly for UI purposes at App level.
     * @param x the x coordinate
     * @param y the y coordinate
     * @param texture the texture to use
     * @param parent the parent object/container
     */
    public menu(x: number, y: number, texture: string, parent: IParentChild | null, lFile: boolean = false) {
        return this._menuBar.createNew(x, y, texture, parent);
    }

    /**
* @description adds all objects from the level file to screen, and also returns them in an obj with 2 arrays (sprites and spines). Useful for debugging purposes etc
* @param parent an optional default parent. Otherwise, goes in 'global' container
*/
addLevelFileObjects(parent: IParentChild | null = null) : {sprites: SpriteObject[], spines: SpineObject[]} {
    let goArrays:  {sprites: SpriteObject[], spines: SpineObject[]} = {'sprites': [], 'spines': []}
    let lFile = this._script.levelFile;
    if(!lFile) Debug.error('script.levelFile is undefined');

        for (let x = 0; x < lFile.sprites.length; x++) {
            let lfObj = lFile.sprites[x];
            Debug.info('lfObj: ', lfObj);
            let go = this.sprite(lfObj.x, lfObj.y, lfObj.filename, null, parent);
            goArrays.sprites.push(go);
            this._transformLevelFileObject(go, lfObj);
        }

        for (let x = 0; x < lFile.atlases.length; x++) {
            let lfObj = lFile.atlases[x];
            Debug.info('lfObj: ', lfObj);
            let go = this.sprite(lfObj.x, lfObj.y, lfObj.filename, '', parent);
            goArrays.sprites.push(go);
            this._transformLevelFileObject(go, lfObj);
        }

        for (let x = 0; x < lFile.spines.length; x++) {
            let lfObj = lFile.spines[x];
            Debug.info('lfObj: ', lfObj);
            let go = this.spine(lfObj.x, lfObj.y, lfObj.filename, parent);
            goArrays.spines.push(go);
            this._transformLevelFileObject(go, lfObj);
        }

        return goArrays;
    }

    /**
    * @description Assigns all transform etc properties to the object, as read from the levelFile
    * @param gameObject the object to transform
    * @param lfObject The js data 'object' plucked from the levelFile, which provides the properties and values to adjust
    */
    protected _transformLevelFileObject(gameObject: IGameObject, lfObject: any) {
        gameObject.setOrigin(lfObject.originX, lfObject.originY);
        gameObject.name = lfObject.name;
        gameObject.x = lfObject.x;
        gameObject.y = lfObject.y;
        gameObject.angle = lfObject.angle;
        gameObject.zIndex = lfObject.zIndex;
        gameObject.scaleHandler.x = lfObject.scaleX;
        gameObject.scaleHandler.y = lfObject.scaleY;
    }

    get states(){
        return this._states;
    }
}

export default GOFactory;