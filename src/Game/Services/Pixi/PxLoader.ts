import {Loader} from 'pixi.js';
import 'pixi-spine';

import PxFactory from './PxFactory';

class PxLoader {
  private _pxFactory: PxFactory;;
  private _loader: Loader;

  constructor(pxFactory: PxFactory) {
    this._pxFactory = pxFactory;

    this._loader = this._createLoader();

    this._loader.use(PIXI.spine.AtlasParser.use);
  }

  public addOnLoad(onLoad: any) {
    this._loader.onLoad.add(onLoad);
  }

  public addOnComplete(onComplete: any) {
    this._loader.onComplete.add(onComplete);
  }

  public addImages(images: string[]) {
    this._loader.add(images);
  }

  public addSpine(name: string, jsonUrl: string) {
    console.log("adding spine(%s): %s", name, jsonUrl);
    this._loader.add(name, jsonUrl);
  }

  public download() {
    this._loader.load();
  }


  //Foreign dependencies
  private _createLoader(): Loader {
    return this._pxFactory.createLoader();
  }

}

export default PxLoader;