import { Application, Sprite, DisplayObject, Texture, RenderTexture } from 'pixi.js-legacy';
import Debug from '../Core/Engine/Debug';
import ContainerObject from '../Core/Engine/GameObjects/ContainerObject';

//import Screen from '../Services/Screen';
import PxGame from '../Services/Pixi/PxGame';

class Screen {
  private _pxGame: PxGame;
  protected _overlayCont: ContainerObject;

  constructor(pxGame: PxGame) {
    this._pxGame = pxGame;

    Debug.info("a screen has been createed!");
  }

  get renderer() {
    return this._pxGame.renderer;
  }

  /**
   * @description this is a container that overlays the 'activityCont', to be used for HUD elements such as toolbars, transitions etc, that exist seperate, and on top of, the
   * levels/scenes.
   */
  get overlay() {
    return this._pxGame.overlayCont;
  }

  public createScreen(width: number, height: number, elementId: string): void {
    this._pxGame.init(width, height, elementId);
  }

  public createContainer(x: number, y: number): any {
    return this._pxGame.addContainer(x, y);
  }

  public createSprite(x: number, y: number, texture: string | any, frame: string | null): any {
    return this._pxGame.addSprite(x, y, texture, frame);
  }

  public createVideo(x: number, y: number, videoName: string) {
    return this._pxGame.addVideo(x, y, videoName);
  }

  public createNineSlice(x: number, y: number, name: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): any {
    return this._pxGame.addNineSlice(x, y, name, leftWidth, topHeight, rightWidth, bottomHeight);
  }

  public createSpine(name: string): any {
    return this._pxGame.addSpine(name);
  }

  public createGraphics(x: number, y: number, width: number, height: number): any {
    return this._pxGame.addGraphic(x, y, width, height);
  }

 /*  public addHitMap(obj: any, threshold: number = 127): boolean {
    // requires baseTexture -- generate from 'screengrab'??
    // let texture = this._pxGame.toTexture(obj);
    // Debug.info(texture);
    // try to generate ImageBitmap
    // if (texture == null) return false;

    this._pxGame.genHitmap(obj.texture.baseTexture, obj, threshold);
    return true;
  } */

  /* public addHitMap(obj: Sprite, threshold: number = 127) {
    this._pxGame.genHitmap(obj.texture.baseTexture, threshold);
  } */

  /**
    * @description enable mouse/pointer input for the specified object
    * @param sprite the object to enable input for
    */
  public enableInput(sprite: any) {
    this._pxGame.enableInput(sprite);
  }

  public disableInput(sprite: any) {
    this._pxGame.disableInput(sprite);
  }

  public addListener(event: string, sprite: any, callback: Function, context: any) {
    this._pxGame.addListener(event, sprite, callback, context);
  }

  public removeListener(event: string, sprite: any, callback: Function) {
    this._pxGame.removeListener(event, sprite, callback);
  }

  /*  public addHitMap(obj: Sprite, threshold: number = 127) {    
     this._pxGame.genHitmap(obj.texture.baseTexture, threshold);
   } */
  /* public removeDownListener(sprite: any) {
    this._pxGame.removeDownListeners(sprite);
  }

  public removeUpListener(sprite: any){
    this._pxGame.removeUpListeners;
  } */

  public createText(x: number, y: number, text: string, style: any = undefined): any {
    return this._pxGame.addText(x, y, text, style);
  }

  public changeTexture(sprite: Sprite, texture: string | any, frame: string | null = null): void {
    this._pxGame.updateTexture(sprite, texture, frame);
  }

  public clearScreen(): void {
    this._pxGame.clearScreen();
  }

  public resize(width: number, height: number): void {
    this._pxGame.resize(width, height);
  }

  public debugScreen() {
    this._pxGame.debugScreen();
  }

  public width(): number | null {
    return this._pxGame.width();
  }

  public height(): number | null {
    return this._pxGame.height();
  }

  public newLevel() {
    this._pxGame.newLevel();
  }

   /**
   * @description syncronously generates an image element from the object/container
   * @param container the object/container to generate an img element from
   */
  public toImgElement(container: PIXI.Container): HTMLImageElement { 
      return this._pxGame.toImgElement(container);
  }

  /**
  * @description returns a 1D UintArray of pixels, asynch (Promise), for the image. This is achieved by creating an imgEl with base64 src, and drawing it to an invisible canvas. 
  * img.onload must be used to avoid drawing the img before it is loaded, hence the Promise. Use pixels() instead if possible - it's synchronous, but faster.
  * @param container the Container/GameObject to get pixels for
  * @param x the x value to start at on the canvas
  * @param y the y value to start at on the canvas
  * @param width the width of the section to return data for
  * @param height the height of the section to return data for
  */
  public toPixels(container: PIXI.Container, x: number = 0, y: number = 0, width?: number, height?: number): Promise<Uint8Array | Uint8ClampedArray> {
    return this._pxGame.toPixels(container, x, y, width, height);
  }

  /**
   * @description an experimental pixel retrieval method using PIXI RenderTexture to circumvent PIXI extract issues
   * @param container the Container/DisplayObject to retrieve pixels for
   */
  public pixels(container: PIXI.Container): Uint8Array | Uint8ClampedArray {
    return this._pxGame.pixels(container);
  }

  /**
   * @description Generate a base64 version of the image synchronously, using PIXI extract
   * @param container The contaienr to generate a base64 string for
   */
  public toBase64(container: PIXI.Container): string {
    return this._pxGame.toBase64(container);
  }

  /**
   * @description Generate a new texture with base64 src from existing gameObject/container
   * @param object The object/container to generate the texture (and corresponding base64) from
   */
  public toTexture(object: DisplayObject): RenderTexture {
    return this._pxGame.toTexture(object);
  }

 /**
   * @description generates a canvas element asyncronously for the object/container
   * @param container the container to generate a canvas from
   */
   public toCanvas(container: PIXI.Container): Promise<HTMLCanvasElement> {
    return this._pxGame.toCanvas(container);
   }

    /**
   * @description generate canvas syncronously via PIXI renderTexture and extract
   */
  public canvas(container: PIXI.Container): HTMLCanvasElement{
    return this._pxGame.canvas(container);
  }

}

export default Screen;