import IGameObject from "./IGameObject";
import IScreen from "../../../Services/IScreen";
import ObjectCore from "./Components/ObjectCore";
import InputHandler from "./Components/InputHandler";
import ParentChildHandler from "./Components/ParentChildHandler";
import ScaleHandler from "./Components/ScaleHandler";
import TweenManager from "./Components/TweenManager";
import IParentChild from "./IParentChild";
import GameConfig from '../GameConfig';



class VideoObject implements IGameObject {
    private _screen: IScreen;
    private _core: ObjectCore;
    private _input: InputHandler;
    private _pcHandler: ParentChildHandler;
    private _scaleHandler: ScaleHandler;
    private _tweenManager: TweenManager;
    private _gameConfig: GameConfig;
    private _vidElement: HTMLVideoElement;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: IScreen, input: InputHandler,
        scaleHandler: ScaleHandler, tweenManager: TweenManager, gameConfig: GameConfig) {
        this._core = objectCore; this._pcHandler = pcHandler; this._screen = screen; this._input = input;
        this._scaleHandler = scaleHandler; this._tweenManager = tweenManager; this._gameConfig = gameConfig;
    }

    public init(x: number, y: number, videoName: string, parent: IParentChild | null = null): void {
        this.data = this._screen.createVideo(x, y, videoName);
        
        this._core.init(this, x, y, videoName, this._update);
        this._input.init(this);
        this._scaleHandler.init(this);
        this._pcHandler.init(this, parent);
        
     //   let sprite = <PIXI.Sprite>this.data;
        //@ts-ignore
        this._vidElement = this.data.texture.baseTexture.resource.source;
        this._vidElement.addEventListener('canplay', ()=>{
         //   console.log('new width: ', this._vidElement.videoWidth);
         //   console.log('new height: ', this._vidElement.videoHeight);
            this.core.width = this._vidElement.videoWidth;
            this.core.height = this._vidElement.videoHeight;
        });

        this.core.setOrigin(0.5);
        this.input.enableInput();
        this.input.addInputListener('pointerdown', this._togglePause, this);
    }

    private _togglePause(){
        if(this._vidElement.paused){
            this._vidElement.play();
        }
        else {
            this._vidElement.pause();
        }
    }

    public createNew(x: number, y: number, videoName: string, parent: IParentChild | null = null): VideoObject {
        let sprite = this.createEmpty();
        sprite.init(x, y, videoName, parent);
        return sprite;
    }

    public createEmpty(): VideoObject {
        return new VideoObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this._scaleHandler.createNew(), this._tweenManager.createNew(), this._gameConfig);
    }

    public changeTexture(textureName: string) {
        this._core.changeTexture(textureName);
    }
    
    get tweens(){
        return this._tweenManager;
    }

    get input(): InputHandler {
        return this._input;
    }

    get scaleHandler(){
        return this._scaleHandler;
    }

    get pcHandler(){
        return this._pcHandler;
    }

    get data() {
        return this._core.data;
    }

    set data(data: any) {
        this._core.data = data;
    }

    get textureName() {
        return this._core.textureName;
    }

    get atlas() {
        return this.core.atlas;
    }

    set atlas(textureName: any) {
        this.core.atlas = textureName;
    }

    get x() {
        return this._core.x;
    }

    set x(x: number) {
        this._core.x = x;
    }

    get core() {
        return this._core;
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

    get alpha(){
        return this._core.alpha;
    }

    set alpha(alpha: number){
        this._core.alpha = alpha;
    }

    get width() {
        return this._core.width;
    }

    set width(width: number) {
        this._core.width = width;
    }

    get height() {
        return this._core.height;
    }

    set height(height: number) {
        this._core.height = height;
    }

    get parent() {
        return this._pcHandler.parent;
    }

    set parent(parent: IParentChild | null) {
        this._pcHandler.parent = parent;
    }

    get children() {
        return this._pcHandler.children;
    }

    addChild(child: IParentChild): void {
        this._pcHandler.addChild(child);
    }

    removeChild(child: IParentChild): void {
        this._pcHandler.removeChild(child);
    }
    
    hasChild(child: IParentChild): boolean {
        return this._pcHandler.hasChild(child);
    }

    destroy(): void {
        this.input.removeInputListener('pointerdown', this._togglePause);
       this.core.destroy();
    }
    
    private _update(time: number){
        this._tweenManager.update(time);
    }

}

export default VideoObject;