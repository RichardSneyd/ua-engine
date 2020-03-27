import {Application, Loader, Sprite, NineSlicePlane} from 'pixi.js';

class PxFactory {

  constructor() {
   
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

  public createLoader(): Loader {
    return new Loader();
  }
}

export default PxFactory;