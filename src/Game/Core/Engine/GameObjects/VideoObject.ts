import IGameObject from "./IGameObject";
import Screen from "../../../Services/Screen";
import ObjectCore from "./Components/ObjectCore";
import InputHandler from "./Components/InputHandler";
import ParentChildHandler from "./Components/ParentChildHandler";
import ScaleHandler from "./Components/ScaleHandler";
import TweenManager from "../TweenManager";
import IParentChild from "./IParentChild";
import GameConfig from '../GameConfig';
import Events from '../Events'; // don't remove this import - it's needed
import Point from "../../Geom/Point";
import TweenComponent from "./Components/TweenComponent";
import BaseGameObject from "./BaseGameObject";
import ExtractComponent from "./Components/ExtractComponent";

/**
 * @description A video game object class. 
 */
class VideoObject extends BaseGameObject {
    private _gameConfig: GameConfig;
    private _vidElement: HTMLVideoElement;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: Screen, input: InputHandler,
        scaleHandler: ScaleHandler, tweenComponent: TweenComponent, gameConfig: GameConfig, extract: ExtractComponent) {
            super(objectCore, pcHandler, screen, input, scaleHandler, tweenComponent, extract);
            this._gameConfig = gameConfig;
    }

    public init(x: number, y: number, videoName: string, frame: string | null = null, parent: IParentChild | null = null): void {
        this.data = this._screen.createVideo(x, y, videoName);
        this._core.atlas = videoName;
        this._core.init(this, x, y, videoName, this._update);
        super.init();
        this._pcHandler.init(this, this._core, parent);

        //@ts-ignore
        this._vidElement = this.data.texture.baseTexture.resource.source;
        this._vidElement.addEventListener('canplay', () => {
            // Debug.info('new width: ', this._vidElement.videoWidth);
            // Debug.info('new height: ', this._vidElement.videoHeight);
            this._core.width = this._vidElement.videoWidth;
            this._core.height = this._vidElement.videoHeight;
            this._vidElement.pause();
        });

        this._core.setOrigin(0.5);
        this.input.enableInput();
        this.input.addInputListener('pointerdown', this._togglePause, this);
    }

    private _togglePause() {
        if (this._vidElement.paused) {
            this._vidElement.play();
        }
        else {
            this._vidElement.pause();
        }
    }

    public createNew(x: number, y: number, videoName: string, parent: IParentChild | null = null): VideoObject {
        let sprite = this.createEmpty();
        sprite.init(x, y, videoName, null, parent);
        return sprite;
    }

    public createEmpty(): VideoObject {
        return new VideoObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this._scaleHandler.createNew(), this._tweenComponent.createNew(), this._gameConfig, this._extract.createEmpty());
    }

    destroy(): void {
        this.input.removeInputListener('pointerdown', this._togglePause);
        super.destroy();
    }

}

export default VideoObject;