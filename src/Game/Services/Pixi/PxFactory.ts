import { Application, Loader, Sprite, Renderer, Container, NineSlicePlane, Point, Texture, RenderTexture, DisplayObject } from 'pixi.js-legacy';
import * as PIXI from 'pixi.js-legacy';
import PxText from './PxText';
import Debug from '../../Core/Engine/Debug';

class PxFactory {
  private _initialized: boolean;
  private _pxText: PxText;

  constructor(pxText: PxText) {
    this._pxText = pxText;
    this._initialized = false;
    Debug.exposeGlobal(this, 'pxFactory');
  }

  init(){
 //   setTimeout(() => {   
      this._applyHacks();
      this._initialized = true;
  //  }, 500);
  }

  get initialized(){
    return this._initialized;
  }

  public createGame(w: number, h: number, container: string, renderer: string = "null"): Application {
    let _renderer = PIXI.autoDetectRenderer();
    let app = new Application({
      width: w,
      height: h,
    });
    app.renderer = _renderer;
    return app;
  }

  public createSprite(texture: any): Sprite {

    return new Sprite(texture);
  }

  public createVideo(url: string): Sprite {
    return new Sprite(Texture.from(url));
  }

  public createNineSlice(texture: PIXI.Texture, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): NineSlicePlane {
    return new NineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight);
  }

  public createText(text: string, renderer: any, style: any = undefined): PxText {
    let pxt = this._pxText.createNew();
    pxt.init(text, renderer, style);

    return pxt;
  }

  public createLoader(): Loader {
    return new Loader();
  }


  private _applyHacks() {
    this._hitmapHack();
  //  this._spineHitmapHack();
  }

  private _hitmapHack() {
    Debug.info('applying hitmap hack...');
    //  debugger;
    const tempPoint = new PIXI.Point();
    /* Sprite.prototype.containsPoint = function (point: Point) : boolean {
      Debug.info('containsPoint hack');
      return false;
    } */
    Sprite.prototype.containsPoint = function (point: Point): boolean {
      // Debug.info('in overridden containsPoint hack method...');
      //  debugger;
      this.worldTransform.applyInverse(point, tempPoint);
      const width = this.texture.orig.width;
      const height = this.texture.orig.height;
      const x1 = -width * this.anchor.x;
      let y1 = 0;

      let flag = false;

      if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
        y1 = -height * this.anchor.y;

        if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
          flag = true;
        }
      }

      if (!flag) return false;
      // bitmap check

      const tex = this.texture;
      const baseTex = this.texture.baseTexture;
      const res = baseTex.resolution;
      // @ts-ignore
      if (!baseTex.hitmap) return true;

      // @ts-ignore
      const hitmap = baseTex.hitmap;
      // this does not account for rotation yet!!!
      let dx = Math.round((tempPoint.x - x1 + tex.frame.x) * res);
      let dy = Math.round((tempPoint.y - y1 + tex.frame.y) * res);
      let ind = (dx + dy * baseTex.realWidth);
      let ind1 = ind % 32;
      let ind2 = ind / 32 | 0;
      return (hitmap[ind2] & (1 << ind1)) !== 0;
    }
  }

  private _spineHitmapHack() {
    Debug.info('applying hitmap hack for Spine...');
    //  debugger;
    const tempPoint = new PIXI.Point();
    /* Sprite.prototype.containsPoint = function (point: Point) : boolean {
      Debug.info('containsPoint hack');
      return false;
    } */

   // Debug.info((<any>window).PIXI.spine.Spine);

    (<any>window.PIXI.spine.Spine).prototype.containsPoint = function (point: Point): boolean {
      // Debug.info('in overridden containsPoint hack method for spine...');
      //  debugger;
      this.worldTransform.applyInverse(point, tempPoint);

    //  const width = this.texture.orig.width;
    //  const height = this.texture.orig.height;
      //const x1 = -width * this.anchor.x;
      const x1 = this.width * -1;
      let y1 = 0;

      let flag = false;

      if (tempPoint.x >= x1 && tempPoint.x < x1 + this.width) {
       // y1 = -this.height * 0;
        y1 = 0;
        if (tempPoint.y >= y1 && tempPoint.y < y1 + this.height) {
          flag = true;
        }
      }

      if (!flag) return false;
      // bitmap check
      // @ts-ignore
      if (!this.hitmap) return true;

      // @ts-ignore
      const hitmap = this.hitmap;
      // this does not account for rotation yet
      let dx = Math.round((tempPoint.x - x1));
      let dy = Math.round((tempPoint.y - y1));
      let ind = (dx + dy * this.width);
      let ind1 = ind % 32;
      let ind2 = ind / 32 | 0;
      return (hitmap[ind2] & (1 << ind1)) !== 0;
    }
  }

  public createContainer(): Container {
    return new Container();
  }
}

export default PxFactory;