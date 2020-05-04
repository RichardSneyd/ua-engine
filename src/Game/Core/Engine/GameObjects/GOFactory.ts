import ObjectCore from "./Components/ObjectCore";
import SpriteObject from './SpriteObject';
import SliceObject from './SliceObject';
import SpineObject from './SpineObject';
import TextObject from './TextObject';
import ContainerObject from './ContainerObject';
import IParentChild from "./IParentChild";
import ScaleManager from '../ScaleManager';


class GOFactory {
    private _core: ObjectCore;
    private _sprite: SpriteObject;
    private _slice: SliceObject;
    private _spine: SpineObject;
    private _text: TextObject;
    private _container: ContainerObject;
    private _scaleManager: ScaleManager;

    constructor(core: ObjectCore, sprite: SpriteObject, slice: SliceObject, spine: SpineObject, text: TextObject, 
        container: ContainerObject, scaleManager: ScaleManager) {
        this._core = core; this._slice = slice; this._spine = spine; this._text = text; this._container = container;
        this._sprite = sprite; this._scaleManager = scaleManager;
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
    public sprite(x?: number, y?: number, textureName?: string, frame: string | null = null, parent: IParentChild | null = null): SpriteObject{
        if (x != null && y != null && textureName != null) {
          //  let pos = this._scaleManager.getXY(x, y);
          //  console.log('pos: ', pos);
            return this._sprite.createNew(x, y, textureName, frame, parent);
        } else {
            return this._sprite.createEmpty();
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
}

export default GOFactory;