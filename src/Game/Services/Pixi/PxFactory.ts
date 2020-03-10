import {Application} from 'pixi.js';

class PxFactory {
  constructor() {
    
  }

  public createGame(w: number, h: number, container: string, renderer: string = "null"): Application {
    return new Application({
      width: w,
      height: h
    });
  }
}

export default PxFactory;