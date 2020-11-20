
import { Application, Sprite, Renderer, Container, DisplayObject, NineSlicePlane, BaseTexture, Graphics, RenderTexture } from 'pixi.js-legacy';
import PxText from './PxText';
import PxFactory from './PxFactory';
import Loader from '../../Core/Engine/Loader';
import 'pixi-spine';
import Events from '../../Core/Engine/Events';
import GameConfig from '../../Core/Engine/GameConfig';
import Debug from '../../Core/Engine/Debug';

class PxGame {
  private _pxFactory: PxFactory; _loader: Loader; _events: Events;
  private _game: Application | null; private _levelCont: Container; private _lastLevelCont: Container;
  private _gameConfig: GameConfig;

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

  get renderer(){
    return this._game?.renderer;
  }
  

  public init(w: number, h: number, container: string) {
    let elm = document.getElementById(container);

    this._game = this._createGame(w, h, container);
    this._game.renderer.backgroundColor = 0xfafad2;


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
  public toImgElement(container: PIXI.Container): Promise<HTMLImageElement> {
    let imgEl: HTMLImageElement | null;
    return new Promise((resolve: Function, reject: Function) => {
      if(this.renderer){
        this.renderer.extract.canvas(container).toBlob((blob) => {
          Debug.info('blob: ', blob);
          imgEl = document.createElement('img');
          Debug.info('imgEl: ', imgEl)
          var objectURL = URL.createObjectURL(blob);
          imgEl.src = objectURL;
          Debug.info('imgEl with src: ', imgEl);
          resolve(imgEl);
         // return imgEl;
        }); 
      }
      });

     // return null;

}

  public newLevel() {
    if (this._game !== null) {
      if (this.levelCont !== null && this.levelCont !== undefined) {
        this._lastLevelCont = this.levelCont;
        this._lastLevelCont.destroy();
      }
      this._levelCont = this._pxFactory.createContainer();
      this._game.stage.addChild(this._levelCont);
      this.levelCont.x = 0; this.levelCont.y = 0;
    }
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

      this._game.stage.addChild(txt.data);

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

  private _addChild(child: DisplayObject) {
    if (this._game != null && this.levelCont !== null && this.levelCont !== undefined) {
      //this._game.stage.addChild(child);
      this.levelCont.addChild(child);
    } else {
      Debug.error("Can not add sprite before initializing the game!");
    }
  }

  public toTexture(object: any): PIXI.RenderTexture | null {
    if (this._game !== null) {
      let texture = this._game.renderer.generateTexture(object, PIXI.SCALE_MODES.LINEAR, 1);
      Debug.info(texture);
    //  Debug.breakpoint();
      return texture;
    }
    return null;
  }

  /**
   * 
   * @param baseTex the texture.baseTexture to generate the hitmap data from (does not have to be connected to the target object)
   * @param object the target object of the hitmap
   * @param threshold 
   */
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
  }
  /* 
    public genHitmap(baseTex: any, threshold: number) {
      if (!baseTex.resource) {
        //renderTexture
        return false;
      }
      // resource = <ImageResource>baseTex.resource;
  
      const imgSource = baseTex.resource.source;
      Debug.info(imgSource);
      let canvas = null;
      if (!imgSource) {
        Debug.warn('no imgSource for resource: ', baseTex.resource)
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
      let hitmap = baseTex.hitmap = new Uint32Array(Math.ceil(w * h / 32));
      for (let i = 0; i < w * h; i++) {
        let ind1 = i % 32;
        let ind2 = i / 32 | 0;
        if (imageData.data[i * 4 + 3] >= threshold) {
          hitmap[ind2] = hitmap[ind2] | (1 << ind1);
        }
      }
      Debug.info('hitmap is: ', hitmap);
      Debug.info('baseTex.hitmap is: ', baseTex.hitmap);
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

  public updateTexture(sprite: Sprite, texture: string | any, frame: string | null = null): void {
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