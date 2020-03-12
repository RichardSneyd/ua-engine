import {Application, Loader, Sprite} from 'pixi.js';

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

  public createLoader(): Loader {
    return new Loader();
  }
}

export default PxFactory;