import Resource from '../Data/Resource';
import IImgLoader from '../../Services/IImgLoader';
import SndLoader from '../../Services/SndLoader';
import ISndLoader from '../../Services/ISndLoader';
import AjaxLoader from '../../Services/AjaxLoader';
import GameConfig from './GameConfig';


class Loader {
  private _resource: Resource;
  private _gameConfig: GameConfig;
  private _imgLoader: IImgLoader; _sndLoader: ISndLoader; _ajaxLoader: AjaxLoader;
  private _resList: Resource[];
  private _imgList: Resource[];
  private _sndList: Resource[];
  private _spineList: Resource[];
  private _scripts: any;
  private _downloadComplete: boolean;

  private _base: string;

  /**
   * @description the base path to load assets from.
   */
  get base(): string {
    return this._base;
  }

  set base(base: string) {
    this._base = base;
  }

  get scripts() {
    return this._scripts;
  }

  constructor(resource: Resource, imgLoader: IImgLoader, sndLoader: ISndLoader,
    ajaxLoader: AjaxLoader, gameConfig: GameConfig) {
    this._resource = resource;
    this._imgLoader = imgLoader;
    this._sndLoader = sndLoader;
    this._ajaxLoader = ajaxLoader;
    this._gameConfig = gameConfig;

    this._base = "";

    this._resList = [];
    this._imgList = [];
    this._sndList = [];
    this._spineList = [];
    this._scripts = {}

    this._downloadComplete = false;
  }

  get downloadComplete(): boolean {
    return this._downloadComplete
  }

  /**
   * @description Creates an image resource and adds the image to the load queue. The data property of the resource will be
   * populated with the image once loaded; Everything in the queue is processed when the download() method is called
   * @param name the filename of the image to load. This is added to the base path value to find the image file.
   */
  public addImage(name: string) {
    let res = this._createResource();
    res.initImage(this._base + name, false);

    this._resList.push(res);
    this._imgList.push(res);
  }

  /**
   * @description Creates an atlas resource and adds adds the atlas to the load queue. The data property of the resource will be
   * populated with the image once loaded; Everything in the queue is processed when the download() method is called
   * @param filename the filename of the atlas you wish to load
   */
  public addAtlas(filename: string) {
    let res = this._createResource();
    res.initImage(this._base + filename, false);
    //console.log("atlas location '%s'", this._base + url);

    this._resList.push(res);
    this._imgList.push(res);
  }


  public addJSON(basename: string) {
    this.base = this._getPath().json;
    let res = this._createResource();
    res.initJSON(this._base + basename + '.json', false);

    this._resList.push(res);
    this._sndList.push(res);
  }


  public addSpine(filename: string) {
    let res = this._createResource();
    res.initImage(this._base + filename, false);

    this._resList.push(res);
    this._spineList.push(res);
    this._imgList.push(res);
  }

  /**
   * @description download everything in the load queue. This must be done before the activity can start.
   * @param onDone (optional) called when loading is complete
   */
  public download(onDone?: Function) {
    return new Promise((resolve: Function, reject: Function) => {
      let _imgsDone: boolean = false, _sndsDone: boolean = false;

      this._downloadSounds(() => {
        _sndsDone = true;
        if (_imgsDone) {
          if (onDone !== undefined) {
            onDone();
          }
        }
      });

      this._downloadImages(() => {
        _imgsDone = true;
        if (_sndsDone) {
          if (onDone !== undefined) {
            onDone();
          }
        }
      });

      setTimeout(() => {
        this._sendAllDone(resolve, reject);
      }, 100);


    })
  }

  private _sendAllDone(resolve: Function, reject: Function) {
    if (this._downloadComplete) {
      resolve({status: true});
    } else {
      setTimeout(() => {
        this._sendAllDone(resolve, reject);
      }, 100);
    }
  }

  public getResource(name: string): Resource | null {
    for (let c = 0; c < this._imgList.length; c++) {
      if (this._imgList[c].name == name) return this._imgList[c];
    }

    return null;
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

  public update(): void {
    let isLoaded = true;

    for (let c = 0; c < this._imgList.length; c++) {
      let res = this._imgList[c];

      if (!res.loaded) isLoaded = false;
    }

    this._downloadComplete = isLoaded;
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
    if (data2.texture != null) {
      this._downloadedResource(data2.url, data2.texture);
    } else {
      this._downloadedResource(data2.url, data2); //Spine!
    }

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
    } else console.warn("no resource exists with url: %s", url);
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

  /*   private _getJSONByName(basename: string): Resource | null {
      return this._getResourceByBasename(basename, this._jsnList);
    } */

  private _getResourceByBasename(basename: string, resList: Resource[]): Resource | null {
    for (let c = 0; c < resList.length; c++) {
      let bname = resList[c].url;


      if (bname == basename) {
        return resList[c];
      }
    }

    return null;
  }

  getSndResByBasename(basename: string): Resource | null {
    let resList = this._sndList;
    for (let c = 0; c < resList.length; c++) {
      let bname = resList[c].basename;


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

  private _downloadImages(onDone: Function) {
    let urlList = this._getUrls(this._imgList);
    this._imgLoader.loadImages(urlList, this._imgLoaded, this._imgDone, this);

    this._downloadSpines();

    this._imgLoader.download();
    this._imgLoader.download(onDone);
  }

  /**
   * @description create a sound resource, to be inject with data later, at download
   * @param filename the filename of the sound to be loaded, without extension.
   */
  addSnd(name: string) {
    // all sounds will be housed in the same directory, so..
    this.base = this._getPath().sound;
    let res = this._createResource();
    res.initSnd(this._base + name, false);

    this._resList.push(res);
    this._sndList.push(res);
  }

  /**
  * @description create several sound resources, to be injected with data (howls) at download phase
  * @param filenames filenames array of the sounds to be loaded, without extension (extentions are defined in config file).
  */
  addSnds(filenames: string[]) {
    for (let x = 0; x < filenames.length; x++) {
      this.addSnd(filenames[x]);
    }
  }

  private _downloadSounds(onDone: Function) {
    // WIP
    let urlList = this._getUrls(this._sndList);

    this._sndLoader.loadSounds(urlList, this._getSndExt(), this._sndLoaded, (data: any) => {
      this._injectDataToSnds(data);
      onDone();
    }, this);
  }

  private _injectDataToSnds(data: any[]) {
    for (let x = 0; x < data.length; x++) {
      this._sndList[x].data = data[x];
    }

   // console.log(data);
   // console.log(this._sndList);
  }

  public loadActScript(file: string, callback?: Function, staticPath: boolean = false): any {
    let basePath = this._getPath().json;

    if (staticPath) basePath = '';

    this._ajaxLoader.loadFile(basePath + file + '.json', (data: any) => {
      if (callback !== undefined) {
        this._scripts[file] = data.data;
        callback(data.data, data);
      }
    });
  }

  /*   private _downloadJSON(callback?: Function, context?: any) {
      let urlList = this._getUrls(this._jsnList);
      this._ajaxLoader.loadFile(urlList[0], callback);
      return this._scripts[file];
    } */

  /*  public downloadJSON(callback?: Function) {
     this._downloadJSON(callback);
   } */

  /*  public getActScript(basename: string): any | null {
     let scriptRes = this._getJSONByBasename(basename);
     if (scriptRes !== null) {
       return JSON.parse(scriptRes.data);
     }
     return null;
   } */

  private _downloadSpines() {
    for (let c = 0; c < this._spineList.length; c++) {
      let res = this._spineList[c];

      this._imgLoader.loadSpine(res.name, res.url);
    }
  }

  private _extractTexture(data: any, frame: any = null) {
    return this._imgLoader.getTexture(data, frame);
  }

  private _getPath(): { json: string, sound: string } {
    return { json: this._gameConfig.data.PATHS.JSN, sound: this._gameConfig.data.PATHS.SND };
  }

  private _getSndExt(): string[] {
    return this._gameConfig.data.SND.EXT;
  }
}

export default Loader;