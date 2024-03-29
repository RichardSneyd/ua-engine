import * as PIXI from 'pixi.js-legacy';
import { Loader } from 'pixi.js-legacy';
require('pixi-spine');

import PxFactory from './PxFactory';
import Debug from '../../Core/Engine/Debug';

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

  /**
   * @description Add images to the load queue (before download is called to process it)
   * @param images the images to add to the load queue
   */
  public addImages(images: string[]) {
    for (let i = 0; i < images.length; i++) {
      let image = images[i];
      if (!this._resExists(image)) {
        this._loader.add(image);
        // Debug.info('added %s to queue', image);
      }
    }
   // Debug.info(this._loader.resources);
  }


  /**
   * @description Add spine file to the load queue (use before download is called)
   * @param name ...
   * @param jsonUrl ...
   */
  public addSpine(name: string, jsonUrl: string) {
    Debug.info("adding spine(%s): %s", name, jsonUrl);
    if (!this._resExists(name)) {
      this._loader.add(name, jsonUrl);
    }
  }

  /**
   * @description Check if resource exists in PIXI loader
   * @param url the url of the resource to check
   */
  private _resExists(url: string): boolean {
    if (this._loader.resources[url]) {
      Debug.warn(url + ' already exists');
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * @description Start processing the load queue (calls PIXI.Loader.load internally)
   */
  public download() {
    this._loader.load();
  }

  public getResources(callback: Function): void {
    for (const property in this._loader.resources) {
      let currentData = <any>this._loader.resources[property];

      if (currentData.hasOwnProperty('data')) {
        if (currentData.data.hasOwnProperty('frames')) {
          currentData.frameCustomList = {};

          for (let c = 0; c < currentData.data.frames.length; c++) {
            let label = currentData.data.frames[c].filename;
            currentData.frameCustomList[label] = currentData.textures[c];
          }
        }
      }

      callback({ url: property, data: currentData });
    }
  }

  public getTexture(resource: any, frame: any) {
    // Debug.info('frame: %s', frame);
  //  Debug.info('resource: ', resource);
    if((frame == undefined || frame == '') && resource.hasOwnProperty('frameCustomList')) frame = Object.keys(resource.frameCustomList)[0];
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