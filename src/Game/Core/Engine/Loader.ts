import Resource from '../Data/Resource';
import IImgLoader from '../../Services/IImgLoader';
import SndLoader from '../../Services/SndLoader';
import ISndLoader from '../../Services/ISndLoader';
import conf from '../config';
import AjaxLoader from '../../Services/AjaxLoader';

class Loader {
  private _resource: Resource;
  private _imgLoader: IImgLoader; _sndLoader: ISndLoader; _ajaxLoader: AjaxLoader;
  private _imgList: Resource[];
  private _sndList: Resource[];
  private _jsnList: Resource[];

  private _base: string;

  get base(): string {
    return this._base;
  }

  set base(base: string) {
    this._base = base;
  }

  constructor(resource: Resource, imgLoader: IImgLoader, sndLoader: ISndLoader, ajaxLoader: AjaxLoader) {
    this._resource = resource;
    this._imgLoader = imgLoader;
    this._sndLoader = sndLoader;
    this._ajaxLoader = ajaxLoader;

    this._base = "";

    this._imgList = [];
    this._sndList = [];
    this._jsnList = [];
  }

  public addImage(url: string) {
    let res = this._createResource();
    res.initImage(this._base + url, false);

    this._imgList.push(res);
  }

  /**
   * @description load one sound and store in _sndList
   * @param filename the filename of the sound to be loaded, without extension.
   */
  addSnd(name: string) {
    // all sounds will be housed in the same directory, so..
    this.base = conf.PATHS.SND;
    let res = this._createResource();
    res.initSnd(this._base + name, false);

    this._sndList.push(res);
  }

  /**
 * @description load one sound and store in _sndList
 * @param filenames filenames array of the sounds to be loaded, without extension (extentions are defined in config file).
 */
  addSnds(filenames: string[]) {
    for (let x = 0; x < filenames.length; x++) {
      this.addSnd(filenames[x]);
    }
  }

  addJSON(base_fn: string) {
    this.base = conf.PATHS.JSN;
    let res = this._createResource();
    res.initJSON(this._base + base_fn, false);

    this._sndList.push(res);
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
    //console.log('url:(%s) texture(%s)', data2.url, data2.texture);
    this._downloadedResource(data2.url, data2.texture);
  }

  private _sndDone() {
    // WIP
    console.log('all sounds loaded')
  }

  private _sndLoaded(data: any) {
    // WIP
    console.log(data);
  }

  private _downloadedResource(url: string, data: any) {
    let res = this._getResource(url);

    if (res != null) {
      res.loaded = true;
      res.data = data;
    } else {
      console.error("no resource exists with url: %s", url);
    }
  }


  private _getResource(url: string): Resource | null {
    let _allList = this._imgList.concat(this._sndList);
    for (let c = 0; c < _allList.length; c++) {
      let currentUrl = _allList[c].url;


      if (currentUrl == url) {
        return _allList[c];
      }
    }

    return null;
  }

  private _getJSONByBasename(basename: string): Resource | null {
    return this._getResourceByBasename(basename, this._jsnList);
  }

  private _getResourceByBasename(basename: string, resList: Resource[]) : Resource | null {
    for (let c = 0; c <resList.length; c++) {
      let bname =resList[c].url;


      if (bname == basename) {
        return resList[c];
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
    this._imgLoader.download();
  }

  private _downloadSounds() {
    // WIP
    let urlList = this._getUrls(this._sndList);
    this._sndLoader.loadSounds(urlList, conf.SND.FL_TYPES, this._sndLoaded, this._sndDone, this);
    this._sndLoader.download();
  }


  private _downloadJSON(callback?: Function, context?: any) {
    let urlList = this._getUrls(this._jsnList);
    this._ajaxLoader.loadFile(urlList[0], callback, context);
  }

  public downloadJSON(callback?: Function, context?: any) {
    this._downloadJSON(callback, context);
  }

  public getActScript(basename: string) : any | null {
    let scriptRes = this._getJSONByBasename(basename);
    if(scriptRes !== null){
      return JSON.parse(scriptRes.data);
    }
    return null;
  }
}

export default Loader;