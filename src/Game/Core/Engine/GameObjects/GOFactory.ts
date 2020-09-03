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
import IScreen from "../../../Services/IScreen";
import Camera from "./Camera";

class GOFactory {
    private _core: ObjectCore;
    private _sprite: SpriteObject;
    private _slice: SliceObject;
    private _spine: SpineObject;
    private _text: TextObject;
    private _button: Button;
    private _container: ContainerObject;
    private _scaleManager: ScaleManager;
    private _video: VideoObject;
    private _screen: IScreen;
    private _camera: Camera;

    constructor(core: ObjectCore, sprite: SpriteObject, slice: SliceObject, spine: SpineObject, text: TextObject,
        container: ContainerObject, scaleManager: ScaleManager, button: Button, video: VideoObject, screen: IScreen, camera: Camera) {
        this._core = core; this._slice = slice; this._spine = spine; this._text = text; this._container = container;
        this._sprite = sprite; this._scaleManager = scaleManager; this._button = button; this._video = video; this._screen = screen;
        this._camera = camera;
    }

    /**
     * @description creates and returns a text object
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
     * @description returns a Sprite object
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     * @param textureName the name of the texture to initialize the sprite with
     * @param frame the default frame for the Sprite. Optional. Provide this if working with an atlas animation
     */
    public sprite(x?: number, y?: number, textureName?: string, frame: string | null = null, parent: IParentChild | null = null): SpriteObject {
        if (x != null && y != null && textureName != null) {
            //  let pos = this._scaleManager.getXY(x, y);
            //  console.log('pos: ', pos);
            return this._sprite.createNew(x, y, textureName, frame, parent);
        } else {
            return this._sprite.createEmpty();
        }
    }

    /**
     * @description create a sprite object with a texture generated from the provided IGameObject (especially useful for containers)
     * @param x the starting x coordinate
     * @param y the starting y coordinate
     * @param generateFrom the IGameObject to generate the texture from
     * @param parent the parent (if any) to this object as a child to
     */
    public spriteFromObject(x: number, y: number, generateFrom: IGameObject, parent: IParentChild): SpriteObject {
        let sprite = this._sprite.createEmpty();
        sprite.init(x, y, '', null, parent);
        sprite.changeTexture(this._screen.toTexture(generateFrom.data));
        return sprite;
    }

    /**
     * 
     * @param x the x position of the video sprite
     * @param y the y position of the video sprite
     * @param videoName the name of the video sprite, including the file extension. The path will be read from config.json.
     */
    public video(x: number, y: number, videoName: string): VideoObject {
        return this._video.createNew(x, y, videoName);
    }

    /**
     * @description returns a button object, with autoGenerated up, down, over and out anims based on provided anim base names. 
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
     */
    public button(x?: number, y?: number, atlas?: string, frame?: string, anims?: { up: string, down: string, over: string, out: string }, onDown?: Function, context?: any, onUp?: Function, parent?: IParentChild): Button {
        if (x != null && y != null && atlas != null && frame && onDown) {
            //  let pos = this._scaleManager.getXY(x, y);
            //  console.log('pos: ', pos);
            return this._button.createNew(x, y, atlas, frame, anims, onDown, context, onUp, parent);
        } else {
            return this._button.createEmpty();
        }
    }

    /**
     * @description returns a nineSlice object
     * @param x the x coordinate to initialze with
     * @param y the y coordinate to initialize with
     * @param textureName the name of the loaded texture to initiaze the object with
     * @param leftWidth The number of pixels to come in on the left before you reach the mid section of the slice. This part will never stretch
     * @param topHeight The number of pixels to come in from the top before you reach the repeating section of the slice. This part will never stretch
     * @param rightWidth The number of pixels to come in from the right before you reach the repeating section of the slice. This part will never stretch
     * @param bottomHeight The number of pixels to come in from the bottom before you reach the repeating section of the slice. This part will never stretch
     */
    public nineSlice(x?: number, y?: number, textureName?: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number, parent: IParentChild | null = null): SliceObject {
        if (x != null && y != null && textureName != null) {
            //   let pos = this._scaleManager.getXY(x, y);
            return this._slice.createNew(x, y, textureName, leftWidth, topHeight, rightWidth, bottomHeight, parent);
        } else {
            return this._slice.createEmpty();
        }
    }

    /**
     * @description creates and returns an empty 'container', analogous to PIXI.Container
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     */
    public container(x?: number, y?: number, parent: IParentChild | null = null): ContainerObject {

        if (x != null && y != null) {
            // let pos = this._scaleManager.getXY(x, y);
            return this._container.createNew(x, y, parent);
        } else {
            return this._container.createEmpty();
        }
    }

    /**
     * @description creates and returns a Spine object
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     * @param spineName the name of the spine file to initialize with
     */
    public spine(x: number | null, y?: number, spineName?: string, parent: IParentChild | null = null): SpineObject {
        if (x != null && y != null && spineName != null) {
            // let pos = this._scaleManager.getXY(x, y);
            return this._spine.createNew(x, y, spineName, null, parent);
        } else {
            return this._spine.createEmpty();
        }
    }

    /**
  * @description create a new camera object
  * @param container the container to pair the camera with
  */
    public camera(container: ContainerObject) {
        return this._camera.createNew(container);
    }
}

export default GOFactory;