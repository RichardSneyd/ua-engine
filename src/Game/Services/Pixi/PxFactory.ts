import {Application, Loader, Sprite, Renderer, NineSlicePlane} from 'pixi.js';
import PxText from './PxText';

class PxFactory {
  private _pxText: PxText;

  constructor(pxText: PxText) {
    this._pxText = pxText;
  }

  public createGame(w: number, h: number, container: string, renderer: string = "null"): Application {
    return new Application({
      width: w,
      height: h
    });
  }

  public createSprite(texture: any): Sprite {

    return new Sprite(texture);
  }

  public createNineSlice(texture: PIXI.Texture, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): NineSlicePlane {
    return new NineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight);
  }
  
  public createText(text: string, renderer: Renderer, style: any = undefined): PxText {
    let pxt = this._pxText.createNew();
    pxt.init(text, renderer, style);

    return pxt;
  }

  public createLoader(): Loader {
    return new Loader();
  }
}

export default PxFactory;