import IImgLoader from './IImgLoader';

import PxLoader from './Pixi/PxLoader';

class ImgLoader implements IImgLoader {
  private _pxLoader: PxLoader;

  constructor(pxLoader: PxLoader) {
    this._pxLoader = pxLoader;
  }
  
  init(onLoad: any, onComplete: any, context: any){
    this.addOnLoad(onLoad, context);
    this.addOnComplete(onComplete, context);
  }

  addOnLoad(callback: any, context: any){
    this._pxLoader.addOnLoad(callback.bind(context));
  }

  addOnComplete(callback: any, context: any){
    this._pxLoader.addOnComplete(callback.bind(context));
  }

  public loadImages(images: string[]): void {
    this._pxLoader.addImages(images);
  }

  public loadSpine(name: string, jsonUrl: string): void {
    this._pxLoader.addSpine(name, jsonUrl);
  }

  public download(): void {
    this._pxLoader.download();
  }

  public getResources(foo: Function): void {
    this._pxLoader.getResources(foo);
  }

  public getTexture(resource: any, frame: any = null): any {
    return this._pxLoader.getTexture(resource, frame);
  }
}

export default ImgLoader;