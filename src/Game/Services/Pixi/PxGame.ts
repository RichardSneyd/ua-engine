
import * as PIXI from 'pixi.js-legacy';
(<any>window).PIXI = PIXI;
require('pixi-spine'); // import is pre-executed, causing an error (No PIXI object on global yet). Use require instead.
import { Application, Sprite, Renderer, Container, DisplayObject, NineSlicePlane, BaseTexture, Graphics, RenderTexture } from 'pixi.js-legacy';
import PxText from './PxText';
import PxFactory from './PxFactory';
import Loader from '../../Core/Engine/Loader';
import Events from '../../Core/Engine/Events';
import GameConfig from '../../Core/Engine/GameConfig';
import Debug from '../../Core/Engine/Debug';
import ContainerObject from '../../Core/Engine/GameObjects/ContainerObject';

class PxGame {
  private _pxFactory: PxFactory; _loader: Loader; _events: Events;
  private _game: Application | null; private _levelCont: Container; private _lastLevelCont: Container;
  private _gameConfig: GameConfig;
  private _activityCont: Container;
  private _overlayCont: Container;

  constructor(pxFactory: PxFactory, loader: Loader, events: Events, gameConfig: GameConfig) {
    this._pxFactory = pxFactory;
    this._loader = loader;
    this._events = events;
    this._game = null;
    this._gameConfig = gameConfig;
  }

  /**
   * @description the container in which the active level sits
   */
  get levelCont() {
    return this._levelCont;
  }

  /**
   * @description this is the container to which activities are added and removed at scene load and shutdown
   */
  get activityCont() {
    return this._activityCont;
  }

  /**
   * @description this is a container that overlays the 'activityCont', to be used for HUD elements such as toolbars, transitions etc.
   */
  get overlayCont() {
    return this._overlayCont;
  }

  get renderer() {
    return this._game?.renderer;
  }


  public init(w: number, h: number, container: string) {
    let elm = document.getElementById(container);

    this._game = this._createGame(w, h, container);
    Debug.exposeGlobal(this._game.stage, 'stage');
    this._game.renderer.backgroundColor = 0xfafad2;
    this._activityCont = this._createContainer();
    this._overlayCont = this._createContainer();
    this.newLevel();
    //  activityCont.data = this._activityCont; // pass the pixi objects back into the data properties of the UAE gameObjects
    //  overlayCont.data = this._overlayCont;  // pass the pixi objects back into the data properties of the UAE gameObjects
    this._game.stage.addChild(this._activityCont);
    this._game.stage.addChild(this._overlayCont);


    if (elm != null) {
      elm.appendChild(this._game.view);
      //  this._game.view.addEventListener('mousemove', this._onMouseMove.bind(this));
      this._game.view.addEventListener('pointermove', this._onMouseMove.bind(this));
    } else {
      Debug.warn("No element by id: '%s', appending to the body.", container);
      document.body.appendChild(this._game.view);
    }

    this._pxFactory.init(); // init factory to apply hitmap hacks
    Debug.exposeGlobal(this._game, 'game');
  }

  public newLevel() {
    if (this._game !== null) {
      if (this.levelCont !== null && this.levelCont !== undefined) {
        this._lastLevelCont = this.levelCont;
        this._lastLevelCont.destroy();
      }
      this._levelCont = this._pxFactory.createContainer();
      this._activityCont.addChild(this._levelCont);
      this.levelCont.x = 0; this.levelCont.y = 0;
    }
  }

  /**
   * @description syncronously generates an image element from the object/container
   * @param container the object/container to generate an img element from
   */
  public toImgElement(container: PIXI.Container): HTMLImageElement {
    let img: HTMLImageElement = document.createElement('img');
    img.width = container.width;
    img.height = container.height;
    img.src = this.toBase64(container);

    return img;
  }

  /**
   * @description returns a 1D array of pixels for the image. This is achieved by creating an imgEl with base64 src, and drawing it to an invisible canvas. 
   * img.onload must be used to avoid drawing the img before it is loaded, hence the Promise.
   * @param container the Container/GameObject to get pixels for
   * @param x the x value to start at on the canvas
   * @param y the y value to start at on the canvas
   * @param width the width of the section to return data for
   * @param height the height of the section to return data for
   */
  public toPixels(container: PIXI.Container, x: number = 0, y: number = 0, width?: number, height?: number): Promise<Uint8Array | Uint8ClampedArray> {
    let pixels: Uint8Array | Uint8ClampedArray;
    return new Promise((resolve: Function, reject: Function) => {

      this.toCanvas(container).then((canvas) => {
        let ctx = canvas.getContext('2d');
        if (ctx) {
          if (width && height) {
            pixels = ctx.getImageData(x, y, width, height).data;
          }
          else {
            pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          }
          resolve(pixels);
        }
        else {
          Debug.error('context is null');
        }
      });
    });
  }

  // a fully syncronous pixel extraction method
  public pixels(container: Container): Uint8Array | Uint8ClampedArray {
    let oldX = container.x;
    let oldY = container.y;
    container.x = 0;
    container.y = 0;
    const renderTexture = PIXI.RenderTexture.create({ width: container.width, height: container.height }); // enter your size , maybe from app.screen
    this.renderer?.render(container, renderTexture);
    let pixels: Uint8Array | Uint8ClampedArray | undefined = this.renderer?.extract.pixels(renderTexture);
    renderTexture.destroy();
    container.x = oldX;
    container.y = oldY;
    if (pixels && pixels.length > 0) {
      return pixels;
    }
    else {
      throw Error('failed to generate pixel array');
    }
  }
  /**
   * @description Generate a base64 version of the image synchronously, using PIXI extract
   * @param container The contaienr to generate a base64 string for
   */
  public toBase64(container: PIXI.Container): string {
    if (this.renderer) return this.renderer.extract.base64(container);
    Debug.error('renderer is undefined: ', this.renderer);
    return 'error';
  }

  /**
   * @description Generate a new texture with base64 src from existing gameObject/container
   * @param object The object/container to generate the texture (and corresponding base64) from
   */
  public toTexture(object: any): PIXI.RenderTexture {
    if (this._game !== null) {
      let texture = this._game.renderer.generateTexture(object, PIXI.SCALE_MODES.LINEAR, 1);
      Debug.info(texture);
      //  Debug.breakpoint();
      return texture;
    }
    Debug.error('renderer is null: ', this.renderer);
    return new PIXI.RenderTexture(new PIXI.BaseRenderTexture()); // dummy to get around null issue
  }


  /**
   * @description generates a canvas element asyncronously for the object/container
   * @param container the container to generate a canvas from
   */
  public toCanvas(container: PIXI.Container): Promise<HTMLCanvasElement> {
    let img = this.toImgElement(container);

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    return new Promise((resolve: Function, reject: Function) => {
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        resolve(canvas);
      }
      img.onerror = (err) => {
        Debug.error(err);
      }
    })
  }

  /**
   * @description generate canvas syncronously via PIXI renderTexture and extract
   */
  public canvas(container: Container): HTMLCanvasElement {
    const renderTexture = PIXI.RenderTexture.create({ width: container.width, height: container.height }); // enter your size , maybe from app.screen
    let oldX = container.x;
    let oldY = container.y;
    container.x = 0;
    container.y = 0;
    this.renderer?.render(container, renderTexture);
    let canvas = this.renderer?.extract.canvas(renderTexture);
    renderTexture.destroy();
    container.x = oldX;
    container.y = oldY;
    if (canvas) return canvas;
    throw Error('failed to gen canvas with extract of renderTexture');
  }

  _onMouseMove(evt: any) {
    let canvas = document.getElementsByTagName('canvas')[0];
    let rect = canvas.getBoundingClientRect();
    let args: any = {}
    args.mouseX = evt.clientX - rect.left;
    args.mouseY = evt.clientY - rect.top;
    args.moveX = evt.movementX;
    args.moveY = evt.movementY;
    // Debug.warn(evt);
    this._events.fire('pointermove', args);

  }

  public resize(width: number, height: number) {
    if (this._game != null) {
      this._game.renderer.resize(width, height)
      // Debug.warn('width provided: ', width);
      let scale = (width / this._gameConfig.data.DISPLAY.WIDTH);
      // Debug.warn('scale::: ', scale);
      this._game.stage.scale.set(scale);
    }

  }

  public addText(x: number, y: number, text: string, style: any = undefined): PxText {
    if (this._game != null) {
      let txt = this._pxFactory.createText(text, this._game.renderer, style);

      txt.x = x;
      txt.y = y;

      this._addChild(txt.data);

      return txt;
    } else {
      Debug.error("Can't add text before starting game!");

      let t: any;

      return <PxText>t;
    }
  }

  public addGraphic(x: number, y: number, width: number, height: number): Graphics {
    let gfx = new Graphics();
    gfx.x = x;
    gfx.y = y;

    gfx.beginFill();
    gfx.drawRect(x, y, width, height);
    gfx.endFill();

    this._addChild(gfx);

    return gfx;
  }

  public addRectangle(x: number, y: number, width: number, height: number, rectColor: number, rectAlpha: number, lineWidth: number, lineColor: number, lineAlpha: number): Graphics {
    let gfx = new Graphics();
    gfx.x = x;
    gfx.y = y;

    gfx.lineStyle(lineWidth, lineColor, lineAlpha);
    gfx.beginFill(rectColor, rectAlpha);
    gfx.drawRect(x, y, width, height);
    gfx.endFill();

    this._addChild(gfx);

    return gfx;
  }

  public addContainer(x: number, y: number): Container {
    let cont = this._createContainer();
    cont.x = x;
    cont.y = y;
    this._addChild(cont);
    return cont;
  }

  public addSprite(x: number, y: number, texture: string, frame: string | null): Sprite {
    //  let texture = this._loader.getTexture(sprName);
    let sprite;

    sprite = this._createSprite(x, y, texture, frame);

    sprite.x = x;
    sprite.y = y;

    this._addChild(sprite);

    // this._enableInputEvents(sprite);

    return sprite;
  }

  public addSpine(name: string): PIXI.spine.Spine | null {
    let spineResource = this._loader.getResource(name, true);
    let spine = null;

    if (spineResource != null) {
      spine = new PIXI.spine.Spine(spineResource.data.spineData);

      // spine.spineData.imagesPath;
      this._addChild(spine);
    } else {
      Debug.warn('spine resource named "%s" not found', name);
    }

    return spine;
  }

  public addVideo(x: number, y: number, videoName: string): Sprite {
    let video = this._createVideo(x, y, videoName);

    this._addChild(video);
    return video;
  }

  public addNineSlice(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): NineSlicePlane {

    let slice = this._createNineSlice(textureName, leftWidth, topHeight, rightWidth, bottomHeight);
    slice.x = x;
    slice.y = y;
    Debug.warn('slice object: ', slice);

    this._addChild(slice);
    if (this._game) {
      Debug.info(this._game.stage.children);
    }
    // debugger;
    return slice;
  }

  public debugScreen() {
    if (this._game) {
      Debug.info(this._game.stage.children);
    }
  }

  private _addChild(child: DisplayObject, parent: Container = this._levelCont) {
    if (this._game != null && parent !== null && parent !== undefined) {
      //this._game.stage.addChild(child);
      parent.addChild(child);
    } else {
      Debug.warn("Can not add sprite before initializing the game!");
    }
  }

  /*  
    public genHitmap(baseTex: BaseTexture, object: any, threshold: number) {
      let resource: any = baseTex.resource;
      if (!baseTex.hasOwnProperty('resource')) console.error('cannot generate hitmap for %s, no baseTexture.resource property', object);
      if (resource.source == undefined) console.error('cannot generate hitmap for %s, no baseTexture.resource.source property', object);
      // resource = <ImageResource>baseTex.resource;
  
      const imgSource = resource.source;
      Debug.info('hitmap image resourc.source: ', imgSource);
      // Debug.breakpoint();
      let canvas = null;
      if (!imgSource) {
        Debug.warn('no imgSource for resource: ', resource)
        return false;
      }
      let context = null;
      if (imgSource.getContext) {
        canvas = imgSource;
        context = canvas.getContext('2d');
        Debug.info(context);
      }
      else if (imgSource instanceof Image) {
        canvas = document.createElement('canvas');
        canvas.width = imgSource.width;
        canvas.height = imgSource.height;
        context = canvas.getContext('2d');
        if (context) {
          // accepts an ImageBitmap object also -- try to generate and pass, so it works for all GameObject types
          context.drawImage(imgSource, 0, 0);
        }
      }
      else {
        //unknown source;
        return false;
      }
  
      const w = canvas.width, h = canvas.height;
      let imageData = context.getImageData(0, 0, w, h);
  
      Debug.warn('building hitmap from context.getImageData, which yields: ', imageData);
      let hitmap = new Uint32Array(Math.ceil(w * h / 32));
      for (let i = 0; i < w * h; i++) {
        let ind1 = i % 32;
        let ind2 = i / 32 | 0;
        if (imageData.data[i * 4 + 3] >= threshold) {
          hitmap[ind2] = hitmap[ind2] | (1 << ind1);
        }
      }
      Debug.info('hitmap is: ', hitmap);
      if (object.hasOwnProperty('skeleton')) {
        object.hitmap = hitmap; // Spine object have no texture or baseTexture property, so hitmap must be stored on the spine object itself
      }
      else {
        object.texture.baseTexure.hitmap = hitmap;
      }
      // debugger;
      return true;
    } */

  /**
    * @description enable mouse/pointer input for the specified object
    * @param displayObject the object to enable input for
    */
  public enableInput(sprite: DisplayObject) {
    sprite.interactive = true;
  }

  public disableInput(sprite: DisplayObject) {
    sprite.interactive = false;
  }

  public removeListener(event: string, sprite: DisplayObject, callback: Function) {
    // sprite.removeAllListeners('mouseup');
    sprite.removeListener(event, callback);
  }

  public addListener(event: string, sprite: DisplayObject, callback: Function, context: any) {
    sprite.on(event, callback, context);
    //  sprite.on('touchend', callback, context);
  }

  public updateTexture(sprite: Sprite, texture: string | RenderTexture, frame: string | null = null): void {
    if (typeof texture == 'string') {
      let tex = this._loader.getTexture(texture, frame);

      sprite.texture = tex;
      return;
    }
    // if texture is not a string, it must be a Texture object; assign directly
    sprite.texture = texture;
  }

  public clearScreen() {
    Debug.info('clearing screen (todo)');
  }

  public width(): number | null {
    if (this._game) return this._game.stage.width; return null;
  }

  public height(): number | null {
    if (this._game) return this._game.stage.height; return null;
  }

  private _createSprite(x: number, y: number, texture: string | any, frame: string | null = null) {
    let textureObj = texture;
    /* if(frame == 'default') {
      frame = this._loader.
    } */
    if (typeof texture == 'string') { textureObj = this._loader.getTexture(texture, frame); }

    let sprite = this._pxFactory.createSprite(textureObj);
    sprite.x = x;
    sprite.y = y;

    return sprite;
  }

  private _createVideo(x: number, y: number, videoName: string): Sprite {
    let vSprite = this._pxFactory.createVideo(this._gameConfig.data.PATHS.VIDEO + videoName);
    vSprite.x = x;
    vSprite.y = y;

    return vSprite;
  }

  private _createNineSlice(textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): NineSlicePlane {
    let texture = this._loader.getTexture(textureName);
    let slice = this._pxFactory.createNineSlice(texture, leftWidth, topHeight, rightWidth, bottomHeight);
    slice.width = texture.width;
    slice.height = texture.height;

    return slice;
  }

  //Foreign Elements
  private _createGame(w: number, h: number, container: string): Application {
    return this._pxFactory.createGame(w, h, container);
  }

  private _createContainer(): Container {
    return this._pxFactory.createContainer();
  }
}

export default PxGame;