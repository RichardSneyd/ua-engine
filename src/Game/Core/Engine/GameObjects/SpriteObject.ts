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
import BaseGameObject from "./BaseGameObject";
import ExtractComponent from "./Components/ExtractComponent";

/**
 * @description A sprite game object class. 
 */
class SpriteObject extends BaseGameObject {
    protected _animationManager: FrameAnimationManager;
    protected _name: string;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: Screen, input: InputHandler,
        scaleHandler: ScaleHandler, animationManager: FrameAnimationManager, tweenComponent: TweenComponent, extract: ExtractComponent) {
        super(objectCore, pcHandler, screen, input, scaleHandler, tweenComponent, extract);
        this._animationManager = animationManager;
    }

    public init(x: number, y: number, texture: string | PIXI.Texture, frame: string | null = null, parent: IParentChild | null = null): void {
        this.data = this._screen.createSprite(x, y, texture, frame);
        if(typeof texture == 'string') this._name = texture;
        if (frame != null) this._core.atlas = texture;
        this._core.init(this, x, y, texture, this._update);
        super.init();
        this._pcHandler.init(this, this._core, parent);
        this._animationManager.init(this, this._core);
    }

    public createNew(x: number, y: number, texture: string | PIXI.Texture, frame: string | null = null, parent: IParentChild | null = null): SpriteObject {
        let sprite = this.createEmpty();
        sprite.init(x, y, texture, frame, parent);
        return sprite;
    }

    public createEmpty(): SpriteObject {
        return new SpriteObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this._scaleHandler.createNew(), this._animationManager.createNew(), this._tweenComponent.createNew(),  this._extract.createEmpty());
    }

    get animations(): FrameAnimationManager {
        return this._animationManager;
    }

}

export default SpriteObject;