import Resource from '../Data/Resource';
import IImgLoader from '../../Services/IImgLoader';

class Loader {
  private _resource: Resource; _imgLoader: IImgLoader;
  private _imgList: Resource[];
  private _spineList: Resource[];

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
    this._spineList = [];

    this._base = "";

    this._imgList = [];
  }

  public addImage(url: string) {
    let res = this._createResource();
    res.initImage(this._base + url, false);

    this._imgList.push(res);
  }

  public addAtlas(url: string) {
    let res = this._createResource();
    res.initImage(this._base + url, false);
    //console.log("atlas location '%s'", this._base + url);

    this._imgList.push(res);
  }

  public addSpine(name: string, jsonUrl: string) {
    let res = this._createResource();
    res.initImage(this._base + jsonUrl, false);

    this._spineList.push(res);
  }

  public download(): void {
    this._downloadImages();
  }

  public getTexture(sprite: string, frame: string | null = null): any {
    //let url = this._base + sprite;
    let res = this._getResource(sprite, true);

    if (res != null) {
      return this._extractTexture(res.data, frame);
    } else {
      console.warn("Resource named '%s' doesn't exist.", sprite);
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
    //console.log('all images loaded');
    this._imgLoader.getResources((blob: any) => {
      //console.log(blob.url, blob.data);

      this._downloadedResource(blob.url, blob.data);
     })
  }

  private _imgLoaded(data: any, data2: any) {
    //this._downloadedResource(data2.url, data2.texture);
  }

  private _downloadedResource(url: string, data: any) {
    let res = this._getResource(url);

    if (res != null) {
        res.loaded = true;
        res.data = data;
      } else {
        console.warn("no resource exists with url: %s", url);
      }
  }


  private _getResource(url: string, byName: boolean = false): Resource | null {
    let resArr = this._imgList;

    for (let c = 0; c < resArr.length; c++) {
      let currentUrl = resArr[c].url;
      let currentName = resArr[c].name;

      if (!byName) {
        if (currentUrl == url) return resArr[c];
      } else {
        //console.log("currentName(%s) == name(%s)", currentName, url)
        if (currentName == url) return resArr[c];
      }
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

    this._downloadSpines();

    this._imgLoader.download();
  }

  private _downloadSpines() {
    for (let c = 0; c < this._spineList.length; c++) {
      let res = this._spineList[c];

      this._imgLoader.loadSpine(res.name, res.url);
    }
  }

  private _extractTexture(data: any, frame: any = null) {
    return this._imgLoader.getTexture(data, frame);
  }
}

export default Loader;