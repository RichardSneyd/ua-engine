import Events from "../Events"; // don't remove this import - it's needed
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import Screen from "../../../Services/Screen";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from "./Components/ScaleHandler";
import AnimationManager from "./Components/FrameAnimationManager";
import SpineAnimationManager from './Components/SpineAnimationManager';
import Point from "../../Geom/Point";
import TweenComponent from "./Components/TweenComponent";
import Debug from "../Debug";
import BaseGameObject from "./BaseGameObject";
import ExtractComponent from "./Components/ExtractComponent";

/**
 * @description A spine game object class. 
 */
class SpineObject extends BaseGameObject {
    protected _animationManager: SpineAnimationManager;
    

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: Screen, input: InputHandler,
        scaleHandler: ScaleHandler, animationManager: SpineAnimationManager, tweenComponent: TweenComponent, extract: ExtractComponent) {
        super(objectCore, pcHandler, screen, input, scaleHandler, tweenComponent, extract);
        this._animationManager = animationManager;
    }

    public init(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null = null): void {
        this.data = this._screen.createSpine(textureName);
        if (frame != null) this._core.atlas = textureName;
        this._core.init(this, x, y, textureName, this._update);
        super.init();
        this._animationManager.init(this, this._core);
        this._pcHandler.init(this, this._core, parent);
    }

    public createNew(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null = null): SpineObject {
        let sprite = this.createEmpty();
        sprite.init(x, y, textureName, frame, parent);
        return sprite;
    }

    public createEmpty(): SpineObject {
        let sprite = new SpineObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this._scaleHandler.createNew(), this.animations.createNew(), this._tweenComponent.createNew(),  this._extract.createEmpty());
        return sprite;
    }

    get animations() : SpineAnimationManager {
        return this._animationManager;
    }

}

export default SpineObject;