import PxText from './PxText';
import {Application, Renderer, Loader, Sprite} from 'pixi.js';

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