import {Loader} from 'pixi.js';

import PxFactory from './PxFactory';
import Resource from '../../Core/Data/Resource';

class PxLoader {
  private _pxFactory: PxFactory; _resource: Resource;
  private _loader: Loader;

  constructor(pxFactory: PxFactory, resource: Resource) {
    this._pxFactory = pxFactory;
    this._resource = resource;

    this._loader = this._createLoader();
  }

  public addOnLoad(onLoad: any) {
    this._loader.onLoad.add(onLoad);
  }

  public addOnComplete(onComplete: any) {
    this._loader.onComplete.add(onComplete);
  }

  public addImages(images: Resource[]) {
    let imageList = this._createImageList(images);
    this._loader.add(imageList);
  }

  public download() {
    this._loader.load();
  }


  //Foreign dependencies
  private _createLoader(): Loader {
    return this._pxFactory.createLoader();
  }

  private _createImageList(images: Resource[]): string[] {
    let imgList: string[] = [];

    for (let c = 0; c < images.length; c++) {
      let img = images[c];
      imgList.push(img.url);
    }

    return imgList;
  }

}

export default PxLoader;