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

  public getResources(foo: Function): void {
    for (const property in this._loader.resources){
      let currentData = <any> this._loader.resources[property];

      if (currentData.hasOwnProperty('data')) {
        if (currentData.data.hasOwnProperty('frames')) {
          currentData.frameCustomList = {};

          for (let c = 0; c < currentData.data.frames.length; c++) {
            let label = currentData.data.frames[c].filename;
            currentData.frameCustomList[label] = currentData.textures[c];
          }
        }
      }

      foo({url: property, data: currentData});
    }
  }

  public getTexture(resource: any, frame: any) {
    //console.log('frame: %s', frame);
    if (frame != null) {
      return resource.frameCustomList[frame];
    } else {
      return resource.texture;
    }
  }


  //Foreign dependencies
  private _createLoader(): Loader {
    return this._pxFactory.createLoader();
  }

}

export default PxLoader;