import {Application, Loader} from 'pixi.js';

class PxFactory {
  constructor() {
    
  }

  public createGame(w: number, h: number, container: string, renderer: string = "null"): Application {
    return new Application({
      width: w,
      height: h
    });
  }

  public createLoader(): Loader {
    return new Loader();
  }
}

export default PxFactory;