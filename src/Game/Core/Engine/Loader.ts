import Resource from '../Data/Resource';
import IImgLoader from '../../Services/IImgLoader';

class Loader {
  private _resource: Resource; _imgLoader: IImgLoader;
  private _imgList: Resource[];

  private _base: string;

  get base(): string {
    return this._base;
  }

  set base(base: string) {
    this._base = base;
  }

  constructor(resource: Resource, imgLoader: IImgLoader) {
    this._resource = resource;
    this._imgLoader = imgLoader;

    this._base = "";

    this._imgList = [];
  }

  addImage(url: string) {
    let res = this._createResource();
    res.initImage(this._base + url, false);

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

  private _imgDone() {
    console.log('all images loaded');
  }

  private _imgLoaded(data: any, data2: any) {
    console.log('url:(%s) texture(%s)', data2.url, data2.texture);
    this._downloadedResource(data2.url, data2.texture);
  }

  private _downloadedResource(url: string, data: any) {
    for (let c = 0; c < this._imgList.length; c++) {
      let currentUrl = this._imgList[c].url;

      if (currentUrl == url) {
        this._imgList[c].loaded = true;
        this._imgList[c].data = data;
      }
    }
  }



  //Foreign dependencies
  private _createResource(): Resource {
    return this._resource.createNew();
  }

  private _downloadImages() {
    let urlList = this._getUrls(this._imgList);
    this._imgLoader.loadImages(urlList, this._imgLoaded, this._imgDone, this);
    this._imgLoader.download();
  }
}

export default Loader;