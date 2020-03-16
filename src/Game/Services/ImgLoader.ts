import IImgLoader from './IImgLoader';

import PxLoader from './Pixi/PxLoader';

class ImgLoader implements IImgLoader {
  private _pxLoader: PxLoader;

  constructor(pxLoader: PxLoader) {
    this._pxLoader = pxLoader;
  }

  public loadImages(images: string[], onProgress: any, onDone: any, context: any): void {
    this._pxLoader.addOnLoad(onProgress.bind(context));
    this._pxLoader.addOnComplete(onDone.bind(context));
    this._pxLoader.addImages(images);
  }

  public loadSpine(name: string, jsonUrl: string): void {
    this._pxLoader.addSpine(name, jsonUrl);
  }

  public download(onDone?: Function): void {
    this._pxLoader.download();
  }
}

export default ImgLoader;