import Resource from '../Data/Resource';
import IImgLoader from '../../Services/IImgLoader';

class Loader {
  private _resource: Resource; _imgLoader: IImgLoader;
  private _imgList: Resource[];

  constructor(resource: Resource, imgLoader: IImgLoader) {
    this._resource = resource;
    this._imgLoader = imgLoader;

    this._imgList = [];
  }

  addImage(url: string) {
    let res = this._createResource();
    res.initImage(url, false);

    this._imgList.push(res);
  }

  download(): void {
    this._downloadImages();
  }

  private _getUrls(arr: Resource[]): string[] {
    let urlList: string[] = [];

    for (let c = 0; c < arr.length; c++) {
      let url = arr[c].url;
      urlList.push(url);
    }

    return urlList;
  }

  _imgDone() {
    console.log('all images loaded');
  }

  _imgLoaded(data: any) {
    console.log('loaded', data);
  }



  //Foreign dependencies
  private _createResource(): Resource {
    return this._resource.createNew();
  }

  private _downloadImages() {
    let urlList = this._getUrls(this._imgList);
    this._imgLoader.loadImages(urlList, this._imgLoaded, this._imgDone, this);
  }
}

export default Loader;