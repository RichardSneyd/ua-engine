import Resource from '../Data/Resource';
import IImgLoader from '../../Services/IImgLoader';
import SndLoader from '../../Services/SndLoader';

class Loader {
  private _resource: Resource; _imgLoader: IImgLoader; _sndLoader: SndLoader;
  private _imgList: Resource[];
  private _sndList: Resource[];

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
    this._sndList = [];
  }

  public addImage(url: string) {
    let res = this._createResource();
    res.initImage(this._base + url, false);

    this._imgList.push(res);
  }

  addSnd(url: string) {
    let res = this._createResource();
    res.initImage(this._base + url, false);

    this._imgList.push(res);
  }

  /**
   * @description download all resources
   */
  public download(): void {
    this._downloadSounds();
    this._downloadImages();
  }

  public getTexture(name: string): any {
    let url = this._base + name;
    let res = this._getResource(url);

    if (res != null) {
      return res.data;
    } else {
      console.warn("Resource named '%s' doesn't exist.", name);
    }
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

  private _sndDone(){
    // WIP
    console.log('all sounds loaded')
  }

  private _sndLoaded(data: any){
    // WIP
    console.log(data);
  }

  private _downloadedResource(url: string, data: any) {
    for (let c = 0; c < this._imgList.length; c++) {
      let currentUrl = this._imgList[c].url;

      let res = this._getResource(currentUrl);

      if (res != null) {
        res.loaded = true;
        res.data = data;
      } else {
        console.error("no resource exists with url: %s", currentUrl);
      }
    }
  }


  private _getResource(url: string): Resource | null {
    for (let c = 0; c < this._imgList.length; c++) {
      let currentUrl = this._imgList[c].url;

      if (currentUrl == url) return this._imgList[c];
    }

    return null;
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

  private _downloadSounds() {
    // WIP
    let urlList = this._getUrls(this._sndList);
    this._sndLoader.loadSounds(urlList, this._sndLoaded, this._sndDone, this);
    this._sndLoader.download();
  }
}

export default Loader;