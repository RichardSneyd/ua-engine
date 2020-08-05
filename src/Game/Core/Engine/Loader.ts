import Resource from '../Data/Resource';
import IImgLoader from '../../Services/IImgLoader';
import SndLoader from '../../Services/SndLoader';
import ISndLoader from '../../Services/ISndLoader';
import AjaxLoader from '../../Services/AjaxLoader';
import GameConfig from './GameConfig';
import Loop from './Loop';
import Events from './Events';



class Loader {
  private _resource: Resource;
  private _gameConfig: GameConfig; private _loop: Loop; private _events: Events;
  private _imgLoader: IImgLoader; _sndLoader: ISndLoader; _ajaxLoader: AjaxLoader;
  private _resList: Resource[];
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

  get progress(): number {
    let done: number = 0;
    let notDone: number = 0;

    for (let c = 0; c < this._resList.length; c++) {
      let res = this._resList[c];

      if (res.name.length > 0) {

        if (res.loaded) {
          done++
        } else {
          notDone++;
        }


      }
    }

    let total = done + notDone;

    let prog = done / total;

    if (isNaN(prog)) {
      return 0;
    } else {
      return prog;
    }
  }

  constructor(resource: Resource, imgLoader: IImgLoader, sndLoader: ISndLoader,
    ajaxLoader: AjaxLoader, gameConfig: GameConfig, loop: Loop, events: Events) {
    this._resource = resource;
    this._imgLoader = imgLoader;
    this._sndLoader = sndLoader;
    this._ajaxLoader = ajaxLoader;
    this._gameConfig = gameConfig;
    this._loop = loop;
    this._events = events;

    this._loop.addFunction(this._update, this);
    this._init();
  //  this._events.on('shutdown', this._init, this);
  }

  private _init(){
    this._base = "";

    this._resList = [];
    this._scripts = {}

    this._downloadComplete = false;
  }

  get downloadComplete(): boolean {
    return this._downloadComplete;
  }

  /**
   * @description Creates an image resource and adds the image to the load queue. The data property of the resource will be
   * populated with the image once loaded; Everything in the queue is processed when the download() method is called
   * @param name the filename of the image to load. This is added to the base path value to find the image file.
   */
  public addImage(name: string) {
    if (this._getResource(name, true) == null) {
      let res = this._createResource();
      res.initImage(this._base + name, false);

      this._resList.push(res);
      return true;
    }

    console.warn('did not add %s, as it already exists', name);
    return false;
  }

  /**
   * @description Creates an atlas resource and adds adds the atlas to the load queue. The data property of the resource will be
   * populated with the image once loaded; Everything in the queue is processed when the download() method is called
   * @param name the filename of the atlas you wish to load
   */
  public addAtlas(name: string) {
    if (this._getResource(name, true) == null) {
      let res = this._createResource();
      res.initImage(this._base + name, false);
      //console.log("atlas location '%s'", this._base + url);

      this._resList.push(res);
      return true;
    }
    console.warn('did not add %s, as it already exists', name);
    return false;
  }


  public addJSON(name: string) {
    if (this._getResource(name, true) == null) {
      this.base = this._getPath().json;
      let res = this._createResource();
      res.initJSON(this._base + name + '.json', false);

      this._resList.push(res);
      return true;
    }
    console.warn('did not add %s, as it already exists', name);
    return false;
  }


  public addSpine(name: string) {
    if (this._getResource(name, true) == null) {
      let res = this._createResource();
      res.initSpine(this._base + name, false);

      this._resList.push(res);
      return false;
    }
    console.warn('did not add %s, as it already exists', name);
    return false;
  }

  /**
   * @description create a sound resource, to be inject with data later, at download
   * @param filename the filename of the sound to be loaded, without extension.
   */
  addSnd(name: string) {
    if (this._getResource(name, true) == null) {
      // all sounds will be housed in the same directory, so..
      this.base = this._getPath().sound;
      let res = this._createResource();
      res.initSnd(this._base + name, false);

      this._resList.push(res);
      return true;
    }
    console.warn('did not add %s, as it already exists', name);
    return false;
  }

  /**
  * @description create several sound resources, to be injected with data (howls) at download phase
  * @param filenames filenames array of the sounds to be loaded, without extension (extentions are defined in config file).
  */
  addSnds(names: string[]) {
    for (let x = 0; x < names.length; x++) {
      this.addSnd(names[x]);
    }
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
      resolve({ status: true });
    } else {
      setTimeout(() => {
        this._sendAllDone(resolve, reject);
      }, 100);
    }
  }

  public getResource(name: string): Resource | null {
    for (let c = 0; c < this._resList.length; c++) {
      if (this._resList[c].name == name) return this._resList[c];
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

  /**
   * @description continuely updates the _downloadComplete property, by checking the loaded property of all registered resources
   * each tick.
   */
  private _update(): void {
    let isLoaded = true;

    for (let c = 0; c < this._resList.length; c++) {
      let res = this._resList[c];



      if (!res.loaded && res.name.length > 0) {
        isLoaded = false;
        //console.log("%s is loaded(%s)", res.name.length, res.loaded);
      }
    }

    this._downloadComplete = isLoaded;
  }

  /**
   * @description a utility method which returns the URLs to be downloaded for resources
   * @param arr an array of the resources to generate the list from
   */
  private _getUrls(arr: Resource[], ignoreLoaded: boolean = false): string[] {
    let urlList: string[] = [];
    console.log(arr);
    //debugger;
    for (let c = 0; c < arr.length; c++) {
      // only return a URL for download if the resource hasn't already been loaded
      if(!ignoreLoaded){
        let url = arr[c].url;
        urlList.push(url);
        console.log('added ' + arr[c].name + ' to URL list');
      }
      else {
        if(!arr[c].loaded){
          let url = arr[c].url;
          urlList.push(url);
          console.log('added ' + arr[c].name + ' to URL list');
        }
        else {
          console.trace(arr[c].name + ' already loaded, will not load again');
        }
      }
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
    } else {
      //Turn off for now, no real use
      //console.warn("no resource exists with url: %s", url);
    }
  }


  private _getResource(url: string, byName: boolean = false): Resource | null {
    let resArr = this._resList;

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
    let resList = this._getSndArray();
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
    let imgList = this._getImgArray();
    let spnList = this._getSpnArray();
    let spnImgList = imgList.concat(spnList);

    let urlList = this._getUrls(spnImgList, true);
   /*  console.log('images to load:');
    console.log(urlList); */
    //add images to the load queue
    this._imgLoader.loadImages(urlList, this._imgLoaded, this._imgDone, this);

    this._downloadSpines();

    //start processing the load queue for images
    this._imgLoader.download();
    this._imgLoader.download(onDone);
  }

  private _getSndArray(): Resource[] {
    let r: Resource[] = [];

    for (let c = 0; c < this._resList.length; c++) {
      let res = this._resList[c];

      if (res.isSnd()) r.push(res);
    }

    return r;
  }


  private _getSpnArray(): Resource[] {
    let r: Resource[] = [];

    for (let c = 0; c < this._resList.length; c++) {
      let res = this._resList[c];

      if (res.isSpn()) r.push(res);
    }

    return r;
  }


  private _getImgArray(): Resource[] {
    let r: Resource[] = [];

    for (let c = 0; c < this._resList.length; c++) {
      let res = this._resList[c];

      if (res.isImg()) r.push(res);
    }

    return r;
  }

  private _downloadSounds(onDone: Function) {
    // WIP
    let sndList = this._getSndArray();
    let urlList = this._getUrls(sndList);
    /* console.log('sounds to load:');
    console.log(urlList); */
    this._sndLoader.loadSounds(urlList, this._getSndExt(), this._sndLoaded, (data: any) => {
      this._injectDataToSnds(data);
      onDone();
    }, this);
  }

  private _injectDataToSnds(data: any[]) {
    let sndList = this._getSndArray();
    for (let x = 0; x < data.length; x++) {
      sndList[x].data = data[x];
    }

    // console.log(data);
    // console.log(sndList);
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
    let spineList = this._getSpnArray();
    console.log('spines to load:');
    console.table(spineList);
    for (let c = 0; c < spineList.length; c++) {
      let res = spineList[c];

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