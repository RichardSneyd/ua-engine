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
  private _newResList: Resource[];
  private _downloadComplete: boolean = false;
  private _startedLoading: boolean = false;

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

    this._resList = [];

    this._loop.addFunction(this._update, this);
    this._init();
    this._events.on('shutdown', this._init, this);
    // expose loader globaly for testing
    (<any>window).loader = this;
  }

  resList() {
    return this._resList;
  }

  private _init() {
    this._base = "";
    this._downloadComplete = false;
    this._startedLoading = false;
    this._newResList = [];
    console.log('%cLoader initialized', 'color: green;');
    debugger;
  }

  get downloadComplete(): boolean {
    return this._downloadComplete;
  }

  /**
   * @description Creates an image resource and adds the image to the load queue. The data property of the resource will be
   * populated with the image once loaded; Everything in the queue is processed when the download() method is called
   * @param name the filename of the image to load, including file extension. This is added to the base path value to find the image URL.
   */
  public addImage(name: string) {
    if (this._getResource(name.split('.')[0], true) == null) {
      let res = this._createResource();
      res.initImage(this._base + name, false);

      this._resList.push(res);
      this._newResList.push(res);
      // console.log(this._resList);
      return true;
    }

    console.warn('did not add %s, as it already exists', name);
    return false;
  }

  /**
   * @description Creates an atlas resource and adds adds the atlas to the load queue. The data property of the resource will be
   * populated with the image once loaded; Everything in the queue is processed when the download() method is called
   * @param name the filename of the atlas you wish to load, including '.json' extension. image is loaded internally.
   */
  public addAtlas(name: string) {
    // handles atlas at PxLoader level, added just the same as image resource....
    this.addImage(name);
  }

  public addSpine(name: string) {
    if (this._getResource(name, true) == null) {
      let res = this._createResource();
      res.initSpine(this._base + name, false);

      this._resList.push(res);
      this._newResList.push(res);
      console.log(this._resList);
      return false;
    }
    console.warn('did not add %s spine, as it already exists', name);
    return false;
  }

  /**
   * @description create a sound resource, to be inject with data later, at download
   * @param filename the filename of the sound to be loaded, without extension.
   */
  addSnd(name: string) {
    if (this._getResource(name, true) == null) {
      // all sounds will be housed in the same directory, so..
      this.base = this._getPath().snd;
      let res = this._createResource();
      res.initSnd(this._base + name, false);

      this._resList.push(res);
      this._newResList.push(res);
      // console.log(this._resList);
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
  public download() {
    return new Promise((resolve: Function, reject: Function) => {
      let _imgsDone: boolean = false, _sndsDone: boolean = false;

      // if no new resource being loaded for this activity, just resolve, as there is nothing to wait for
      console.log('%ctotal new resources: ' + this._newResList.length, 'color: green;');
      console.log(this._newResList);
      if(this._newResList.length == 0) {
        resolve('loading completed');
        return;
      }

      this._downloadSounds();
      this._downloadImages();
      
      // recursively check if everyhthing is loaded, until true
      setTimeout(() => {
        this._startedLoading = true;
        this._sendAllDone(resolve, reject);
      }, 100);
    })
  }


  private _sendAllDone(resolve: Function, reject: Function) {
    if (this._downloadComplete) {
      resolve({ status: true });      
      console.log('%cdownload complete, promise RESOLVED', 'color: green;')
    } else {
      setTimeout(() => {
        this._sendAllDone(resolve, reject);
      }, 100);
    }
  }

  public getResource(url: string, byName?: boolean): Resource | null {
    return this._getResource(url, byName)
  }

  public getTexture(sprite: string, frame: string | null = null): any {
   // console.log(this._getPath().img);
    let url = this._getPath().img + sprite;
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

    if (this._downloadComplete == false && this._startedLoading == true) {
      //  console.log('downloading');
      for (let c = 0; c < this._resList.length; c++) {
        let res = this._resList[c];

        // !res.loaded && res.name.length > 0
        if (!res.loaded) {
          isLoaded = false;
          //console.log("%s is loaded(%s)", res.name.length, res.loaded);
        }
      }
      this._downloadComplete = isLoaded;
      if (this._downloadComplete) {
        console.log('download complete!!!!!!!!!!!!!!!!!!!');
        this._startedLoading = false;
      }
    }
  }

  /**
   * @description a utility method which returns the URLs to be downloaded for resources
   * @param arr an array of the resources to generate the list from
   */
  private _getUrls(arr: Resource[], ignoreLoaded: boolean = false): string[] {
    let urlList: string[] = [];
    //  console.log(arr);
    //debugger;
    for (let c = 0; c < arr.length; c++) {
      // only return a URL for download if the resource hasn't already been loaded
      if (!ignoreLoaded) {
        let url = arr[c].url;
        urlList.push(url);
        // console.log('added ' + arr[c].url + ' to URL list');
      }
      else {
        if (!arr[c].loaded) {
          let url = arr[c].url;
          urlList.push(url);
          //  console.log('added ' + arr[c].url + ' to URL list');
        }
        else {
          console.log(arr[c].url + ' already loaded, will not load again');
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

  // data is BS from PIXI, data2 is the actual PIXI resource object. Handles spine resource downloads/injections too
  private _imgLoaded(data: any, data2: any) {
    if (data2.texture != null) {
      console.log('image loaded and returned: ', data2, 'attemping injection....');
      if (data2.name.indexOf('.json_image') !== -1) {
        // ignore irrelavent returns from PxLoader
        console.warn('will not inject a .json_image, no resource in resList for that, is internal PIXI Loader child image resource mapped to atlas json resource');
      }
      else {
        this._downloadedResource(data2.url, data2.texture);
      }
    } else {
      console.log('spine loaded and returned: ', data2, 'attempting injection...');
      this._downloadedResource(data2.url, data2); //Spine!

    }
  }

  private _sndDone() {
    // WIP
    console.log('all sounds loaded')
  }

  private _sndLoaded(data: any) {
    // WIP
    //  console.log(data);
    // take the file extension off, since snd files are saved without a file extention in the URL
    console.log('sound loaded and returned: ', data);
    this._downloadedResource(data.url, data.data);
  }

  private _downloadedResource(url: string, data: any) {
    // don't load json_image resources, which PIXI uses internally as child-resources of the json resources (atlas, spine etc)
    if (data.hasOwnProperty('name') && data.name.indexOf('.json_image') !== -1) {
      console.warn('will not inject a json_image resource, used by PIXI Loader internally as children of json resources like atlases');
      return;
    }
      let res = this._getResource(url);
  
      if (res != null) {
        res.loaded = true;
        res.data = data;
      } else {
        console.error("Injection failed: no resource exists in Loader.resList with url: %s", url);
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

  private _downloadImages() {
    let imgList = this._getImgArray(this._newResList);
    let spnList = this._getSpnArray(this._newResList);
    let spnImgList = imgList.concat(spnList);

    let urlList = this._getUrls(spnImgList, true);
    /*  console.log('images to load:');
     console.log(urlList); */
    //add images to the load queue
    this._imgLoader.loadImages(urlList, this._imgLoaded, this._imgDone, this);

    this._downloadSpines();

    //start processing the load queue for images
    this._imgLoader.download();
    //  this._imgLoader.download(onDone);
  }

  private _getSndArray(array?: Resource[]): Resource[] {
    let r: Resource[] = [];
    let resList = this._resList;
    if(array !== undefined){ resList = array}

    for (let c = 0; c < resList.length; c++) {
      let res = resList[c];
      if (res.isSnd()) r.push(res);
    }

    return r;
  }


  private _getSpnArray(array?: Resource[]): Resource[] {
    let r: Resource[] = [];
    let resList = this._resList;
    if(array !== undefined){ resList = array}
    
    for (let c = 0; c < resList.length; c++) {
      let res = resList[c];
      if (res.isSpn()) r.push(res);
    }
    return r;
  }


  private _getImgArray(array?: Resource[]): Resource[] {
    let r: Resource[] = [];
    let resList = this._resList;
    if(array !== undefined){ resList = array}

    for (let c = 0; c < resList.length; c++) {
      let res = resList[c];
      if (res.isImg()) r.push(res);
    }
    return r;
  }

  private _downloadSounds() {
    let sndList = this._getSndArray(this._newResList);
    let urlList = this._getUrls(sndList);
    this._sndLoader.loadSounds(urlList, this._getSndExt(), this._sndLoaded, this._sndDone, this);
  }

  public loadActScript(file: string, callback?: Function, staticPath: boolean = false): any {
    let basePath = this._getPath().jsn;

    if (staticPath) basePath = '';

    this._ajaxLoader.loadFile(basePath + file + '.json', (data: any) => {
      if (callback !== undefined) {
        callback(data.data, data);
      }
    });
  }

  private _downloadSpines() {
    let spineList = this._getSpnArray(this._newResList);
    console.log('spines to load:');
    console.table(spineList);
    for (let c = 0; c < spineList.length; c++) {
      let res = spineList[c];
      // the resources were already created in resList at the downloadImages phase, this is service level
      this._imgLoader.loadSpine(res.name, res.url);
    }
  }

  private _extractTexture(data: any, frame: any = null) {
    return this._imgLoader.getTexture(data, frame);
  }

  private _getPath(): { jsn: string, snd: string, img: string, spn: string } {
    return {
      jsn: this._gameConfig.data.PATHS.JSN, snd: this._gameConfig.data.PATHS.SND,
      img: this._gameConfig.data.PATHS.IMG, spn: this._gameConfig.data.PATHS.SPN
    };
  }

  private _getSndExt(): string[] {
    return this._gameConfig.data.SND.EXT;
  }
}

export default Loader;