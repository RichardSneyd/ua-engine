import Resource from '../Data/Resource';
import ImgLoader from '../../Services/ImgLoader';
import SndLoader from '../../Services/SndLoader';
import ISndLoader from '../../Services/ISndLoader';
import AjaxLoader from '../../Services/AjaxLoader';
import GameConfig from './GameConfig';
import Loop from './Loop';
import Events from './Events';
import Debug from './Debug';

/**
 * @description Responsible for the loading of all resources. Accessible via UAE.loader
 */
class Loader {
  private _resource: Resource;
  private _gameConfig: GameConfig; private _loop: Loop; private _events: Events;
  private _imgLoader: ImgLoader; _sndLoader: ISndLoader; _ajaxLoader: AjaxLoader;
  private _resList: Resource[];
  private _newResList: Resource[];
  private _downloadComplete: boolean = false;
  private _startedLoading: boolean = false;

  private _base: string;

  /**
   * @description The base path to load assets from.
   */
  get base(): string {
    return this._base;
  }

  set base(base: string) {
    this._base = base;
  }

  get loading(){
    return this._startedLoading;
  }

  /**
   * @description Load progress as a float value between 0 and 1
   * @returns the current progress value
   */
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

  /**
   * @description Load progress as a percentage
   */
  get progressPercentage(): number {
    return Math.floor(this.progress * 100);
  }

  constructor(resource: Resource, imgLoader: ImgLoader, sndLoader: ISndLoader,
    ajaxLoader: AjaxLoader, gameConfig: GameConfig, loop: Loop, events: Events) {
    this._resource = resource;
    this._imgLoader = imgLoader;
    this._sndLoader = sndLoader;
    this._ajaxLoader = ajaxLoader;
    this._gameConfig = gameConfig;
    this._loop = loop;
    this._events = events;

    this._resList = [];

    this._init();
    this._loop.addFunction(this._update, this);
    this._events.on('shutdown', this._init, this);
    // expose loader globaly for testing
    Debug.exposeGlobal(this, 'loader');
  }

  get resList() {
    return this._resList;
  }

  get spineList(){
    return this._getSpnArray();
  }

  get imgList(){
    return this._getImgArray();
  }

  get sndList(){
    return this._getSndArray();
  }

  private _init() {
    this._imgLoader.init(this._imgLoaded, this._imgDone, this);
    this._base = "";
    this._downloadComplete = false;
    this._startedLoading = false;
    this._newResList = [];
    Debug.info('%cLoader initialized', Debug.STYLES.GOOD);
  }

  /**
   * @description add a listener which fires every time a file is successfully loaded
   * @param callback the callback function
   * @param context the context of the callback
   */
  addOnLoad(callback: any, context: any) {
    this._imgLoader.addOnLoad(callback, context);
  }

  /**
   * @description add a listener that fires when the entire download queue is completed
   * @param callback the callback function
   * @param context the context of the callback
   */
  addOnComplete(callback: any, context: any) {
    this._imgLoader.addOnComplete(callback, context);
  }

  get downloadComplete(): boolean {
    return this._downloadComplete;
  }

  /**
   * @description returns a list of files that are not loading properly
   */
  get snagList(): any[] {
    let list: any[] = [];
    for(let x = 0; x < this._resList.length; x++){
      let res = this._resList[x];
      if((res.data == null || (res.type == 'snd' && res.data._state != 'loaded'))) {
        list.push({type: res.type, name: res.name, ext: res.data._ext});
      }
    }
    return list;
  }

  public printSnagList(){
    Debug.info('snag-list (missing or problematic files):');
    Debug.table(this.snagList);
  }

  /**
   * @description Creates an image resource and adds the image to the load queue. The data property of the resource will be
   * populated with the image once loaded; Everything in the queue is processed when the download() method is called
   * @param name the filename of the image to load, including file extension. This is added to the base path value to find the image URL.
   */
  public addImage(name: string, hasPath: boolean = false, imgName?: string): Loader {

    // NOTE: I put seperated whole code that way in case if anything else needed to be specific for now.
    if (hasPath) {
      let url = name;
      // if the file has .json extension, it's an atlas, so change path. Won't be confused with spine assets - they are loaded via addSpine
      if (imgName?.indexOf('.json') !== -1) { url = this._getPath().atlas + name }
      if (this._getResource(url, false, this.imgList) == null) {
        let res = this._createResource();
        res.initImage(url, false);

        this._resList.push(res);
        this._newResList.push(res);
        // Debug.info(this._resList);
        return this;
      }
    }
    else {
      let url = this._getPath().img + name;
      // if the file has .json extension, it's an atlas, so change path. Won't be confused with spine assets - they are loaded via addSpine
      if (name.indexOf('.json') !== -1) { url = this._getPath().atlas + name }
      if (this._getResource(url, false) == null) {
        let res = this._createResource();
        res.initImage(url, false);

        this._resList.push(res);
        this._newResList.push(res);
        // Debug.info(this._resList);
        return this;
      }
    }

    Debug.info('did not add %s, as it already exists', name);
    return this;
  }

  public addImages(names: string[], extension: string): Loader {
    let _ext = extension;
    if (_ext.indexOf('.') !== 0)  _ext = '.' + _ext;
    
    for (let x = 0; x < names.length; x++) {
      this.addImage(names[x] + _ext);
    }
    return this;
  }

  /**
   * @description Creates an atlas resource and adds adds the atlas to the load queue -- must include .json extension. The data property of the resource will be
   * populated with the image once loaded; Everything in the queue is processed when the download() method is called
   * @param name the filename of the atlas you wish to load, including '.json' extension. image is loaded internally.
   */
  public addAtlas(name: string): Loader {
    // handles atlas at PxLoader level, added just the same as image resource, except with .json ext instead of .img ....
    if (name.indexOf('.jpg') != -1) Debug.error('addAtlas requires .json file extension, not .jpg');
    if (name.indexOf('.png') != -1) Debug.error('addAtlas requires .json file extension, not .png');
    if (name.indexOf('.json') == -1) name = name + '.json';
    this.addImage(name);
    return this;
  }

  /**
   * @description a loop which adds an array of Atlas files by name.
   * @param names an array of the names of the atlas files to load. If the name does not include '.json' at the end, this will be appended automatically.
   */
  public addAtlases(names: string[]): Loader {
    for (let x = 0; x < names.length; x++) {
      let _name = names[x];
      this.addAtlas(_name);
    }

    return this;
  }


  /**
   * @description add a spine file to the load queue - must include .json extension
   * @param name if name does not include '.json' at the end, this will be automatically appended
   */
  public addSpine(name: string, hasPath: boolean = false): Loader {

    if (hasPath) {
      if (name.indexOf('.json') == -1) name = name + '.json';
      let url = this._getPath().spn + name;
      if (this._getResource(url, false, this.spineList) == null) {
        let res = this._createResource();
        res.initSpine(url, false);

        this._resList.push(res);
        this._newResList.push(res);
      //  Debug.info(this._resList);
        return this;
      }
      Debug.warn('did not add %s spine, as it already exists', name);
      return this;
    }
    else {
      if (name.indexOf('.json') == -1) name = name + '.json';
      let url = this._getPath().spn + name;
      if (this._getResource(url, false) == null) {
        let res = this._createResource();
        res.initSpine(url, false);

        this._resList.push(res);
        this._newResList.push(res);
        Debug.info(this._resList);
        return this;
      }
      Debug.warn('did not add %s spine, as it already exists', name);
      return this;
    }
  }

  /**
   * @description a loop which adds an array of spine files by name.
   * @param names an array of the names of the spine files to load. If the name does not include '.json' at the end, this will be appended automatically.
   */
  public addSpines(names: string[]): Loader {
    for (let x = 0; x < names.length; x++) {
      let _name = names[x];
      this.addSpine(_name);
    }

    return this;
  }

  /**
   * @description Create a sound resource, to be inject with data later, at download
   * @param filename the filename of the sound to be loaded, without extension.
   */
  addSnd(name: string): Loader {
    let url = this._getPath().snd + name;
    if (this._getResource(url, false) == null) {
      let res = this._createResource();
      res.initSnd(url, false);

      this._resList.push(res);
      this._newResList.push(res);
      // Debug.info(this._resList);
      return this;
    }
    Debug.info('%cdid not add %s, as it already exists', Debug.STYLES.NOTEWORTHY, name);
    return this;
  }

  /**
  * @description Create several sound resources, to be injected with data (howls) at download phase
  * @param filenames filenames array of the sounds to be loaded, without extension (extentions are defined in config file).
  */
  addSnds(names: string[]): Loader {
    for (let x = 0; x < names.length; x++) {
      this.addSnd(names[x]);
    }

    return this;
  }

  /**
   * @description Download everything in the load queue. This must be done before the activity can start.
   * @param onDone (optional) called when loading is complete
   */
  public download() {
    if(this.loading) Debug.error('cant start new download before previous completes');
    return new Promise((resolve: Function, reject: Function) => {
      let _imgsDone: boolean = false, _sndsDone: boolean = false;

      // if no new resource being loaded for this activity, just resolve, as there is nothing to wait for
      Debug.info('%ctotal new resources: ' + this._newResList.length, Debug.STYLES.GOOD);
      //  Debug.info(this._newResList);
      if (this._newResList.length == 0) {
        this._startedLoading = false;
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
    //Debug.info('progress: ', this.progressPercentage, '%');
    if (this._downloadComplete) {
      this._newResList = [];
      this._startedLoading = false;
      resolve({ status: true });
      Debug.info('%cdownload complete, promise RESOLVED', Debug.STYLES.GOOD)
    } else {
      setTimeout(() => {
        this._sendAllDone(resolve, reject);
      }, 100);
    }
  }

  public getResource(url: string, byName?: boolean, resList?: Resource[]): Resource | null {
    return this._getResource(url, byName, resList);
  }

  /**
   * 
   * @param sprite the name/url of the the resource to retrieve a texture from
   * @param frame the frame to retrieve. Optional.
   * @param byName Find by name (i.e 'star'). If false, will find by URL (.ie 'mydomain.com/assets/img/star.png')
   */
  public getTexture(sprite: string, frame: string | null = null, byName: boolean = true): any {
    let res = this.getImgResource(sprite, byName);
    if (res != null) {
      return this._extractTexture(res.data, frame);
    } else {
      Debug.info('byName: ', byName);
      //Debug.breakpoint();
      if (byName) {
        Debug.warn("Resource '%s' doesn't exist.", sprite);
        return;
      }
      Debug.warn("No resource with url: %s");
    }
  }

  /**
   * @description Continuely updates the _downloadComplete property, by checking the loaded property of all registered resources each tick.
   */
  private _update(): void {
    let isLoaded = true;

    if (this._downloadComplete == false && this._startedLoading == true) {
      //  Debug.info('downloading');
      for (let c = 0; c < this._resList.length; c++) {
        let res = this._resList[c];

        // !res.loaded && res.name.length > 0
        if (!res.loaded) {
          isLoaded = false;
          // Debug.info("%s is loaded(%s)", res.name.length, res.loaded);
        }
      }
      this._downloadComplete = isLoaded;
      if (this._downloadComplete) {
        Debug.info('%cdownload complete!', Debug.STYLES.GOOD);
        this._startedLoading = false;
      }
    }
  }

  /**
   * @description Utility method which returns the URLs to be downloaded for resources
   * @param arr an array of the resources to generate the list from
   */
  private _getUrls(arr: Resource[], ignoreLoaded: boolean = false): string[] {
    let urlList: string[] = [];
    //  Debug.info(arr);
    //debugger;
    for (let c = 0; c < arr.length; c++) {
      // only return a URL for download if the resource hasn't already been loaded
      if (!ignoreLoaded) {
        let url = arr[c].url;
        urlList.push(url);
        // Debug.info('added ' + arr[c].url + ' to URL list');
      }
      else {
        if (!arr[c].loaded) {
          let url = arr[c].url;
          urlList.push(url);
          //  Debug.info('added ' + arr[c].url + ' to URL list');
        }
        else {
          Debug.info(arr[c].url + ' already loaded, will not load again');
        }
      }
    }

    return urlList;
  }

  private _imgDone() {
    //Debug.info('all images loaded');
    this._imgLoader.getResources((blob: any) => {
      // Debug.info(blob.url, blob.data);

      this._downloadedResource(blob.url, blob.data);
    })
  }

  /**
   * @description "data" is BS from PIXI, "data2" is the actual PIXI resource object. Handles spine resource downloads/injections too
   * @param pixi 
   * @param data2 
   */
  private _imgLoaded(pixi: any, data: any) {
    if (data.texture != null) {
      //  Debug.info('image loaded and returned: ', data, 'attemping injection....');
      if (data.name.indexOf('.json_image') !== -1) {
        // ignore irrelavent returns from PxLoader
        Debug.info('will not inject a .json_image, no resource in resList for that, is internal PIXI Loader child image resource mapped to atlas json resource');
      }
      else {
        this._downloadedResource(data.url, data.texture);
      }
    } else {
      // Debug.info('spine loaded and returned: ', data2, 'attempting injection...');
      this._downloadedResource(data.url, data); //Spine!

    }
  }

  private _sndDone() {
    // WIP
    Debug.info('all sounds loaded')
  }

  private _sndLoaded(data: any) {
    // Debug.info('sound loaded and returned: ', data);
    this._downloadedResource(data.url, data.data);
  }

  private _downloadedResource(url: string, data: any) {
    // Debug.info(url + ': ', data);
    // don't load json_image resources, which PIXI uses internally as child-resources of the json resources (atlas, spine etc)
    if (data.hasOwnProperty('name') && data.name.indexOf('.json_image') !== -1) {
      Debug.info('will not inject a json_image resource, used by PIXI Loader internally as children of json resources like atlases');
      return;
    }
    else if (data.hasOwnProperty('name') && data.name.indexOf('.json_atlas') !== -1) {
      Debug.info('will not inject a json_atlas resource, used by PIXI Loader internally as children of json resources like atlases');
      return;
    }
    let res = this._getResource(url);

    if (res != null) {
      res.loaded = true;
      res.data = data;
    } else {
      //   let res = this._createResource()
      Debug.warn("Injection failed: no resource exists in Loader.resList with name %s & url %s:", data.name, url, data);
    }

  }

  private _getResource(url: string, byName: boolean = false, resList?: Resource[]): Resource | null {
    let _url = url.trim();
    let resArr = this._resList;
    if (resList && resList.length > 0) { resArr = resList }

    for (let c = 0; c < resArr.length; c++) {
      let currentUrl = resArr[c].url;
      let currentName = resArr[c].name;

      if (!byName) {
        if (currentUrl == _url) return resArr[c];
      } else {
        // Debug.info("currentName(%s) == name(%s)", currentName, url)
        if (currentName == _url) return resArr[c];
      }
    }
    return null;
  }

  getSndResource(url: string, byName: boolean = true): Resource | null {
    // return this._getResource(url.split('.')[0], byName, this._getSndArray());
    return this._getResource(url, byName, this._getSndArray());
  }

  getImgResource(url: string, byName: boolean = false): Resource | null {
   // return this._getResource(url, byName, this._getImgArray());
    return this._getResource(url, byName, this.imgList);
  }

  getSpnResource(url: string, byName: boolean = false): Resource | null {
    return this._getResource(url, byName, this.spineList);
  }

  /**
   * @description Foreign dependencies
   */
  private _createResource(): Resource {
    return this._resource.createNew();
  }

  private _downloadImages() {
    let imgList = this._getImgArray(this._newResList);
    let spnList = this._getSpnArray(this._newResList);
    let spnImgList = imgList.concat(spnList);

    let urlList = this._getUrls(spnImgList, true);

    //add images to the load queue
    this._imgLoader.loadImages(urlList);

    this._downloadSpines();

    //start processing the load queue for images
    this._imgLoader.download();
    //  this._imgLoader.download(onDone);
  }

  private _getSndArray(array?: Resource[]): Resource[] {
    let r: Resource[] = [];
    let resList = this._resList;
    if (array !== undefined) { resList = array }

    for (let c = 0; c < resList.length; c++) {
      let res = resList[c];
      if (res.isSnd()) r.push(res);
    }

    return r;
  }

  private _getSpnArray(array?: Resource[]): Resource[] {
    let r: Resource[] = [];
    let resList = this._resList;
    if (array !== undefined) { resList = array }

    for (let c = 0; c < resList.length; c++) {
      let res = resList[c];
      if (res.isSpn()) r.push(res);
    }
    return r;
  }

  private _getImgArray(array?: Resource[]): Resource[] {
    let r: Resource[] = [];
    let resList = this._resList;
    if (array !== undefined) { resList = array }

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
    let basePath = '';

    if (!staticPath) basePath = this._getPath().jsn;

    this._ajaxLoader.loadFile(basePath + file + '.json', (data: any) => {
      if (callback !== undefined) {
        callback(data.data, data);
      }
    });
  }

  loadLevelFile(file: string, callback?: Function, staticPath: boolean = false) {
    let basePath = '';
    if (!staticPath) basePath = this._getPath().jsn;

    this._ajaxLoader.loadFile(basePath + file + '_level.json', (data: any) => {
      if (callback !== undefined) {
        callback(data.data);
      }
    });
  }

  private _downloadSpines() {
    let spineList = this._getSpnArray(this._newResList);
  //  Debug.info('spines to load:');
  //  Debug.info(spineList);
    for (let c = 0; c < spineList.length; c++) {
      let res = spineList[c];
      // the resources were already created in resList at the downloadImages phase, this is service level
      this._imgLoader.loadSpine(res.name, res.url);
    }
  }

  /**
   * @description Retrieve texture object from resource, and returns it.
   * @param data the PIXI resource object to extract the texture from
   * @param frame optional. Specify if you are looking for a specific frome from an atlas to use as texture etc
   */
  private _extractTexture(data: any, frame: any = null) {
  //  Debug.info('data: ', data);
  //  Debug.breakpoint(); 
   // if(frame !== null && frame == '') frame = data.frames[0].filename;
    return this._imgLoader.getTexture(data, frame);
  }

  private _getPath(): { jsn: string, snd: string, img: string, spn: string, atlas: string } {
    return {
      jsn: this._gameConfig.data.PATHS.JSN, snd: this._gameConfig.data.PATHS.SND,
      img: this._gameConfig.data.PATHS.IMG, spn: this._gameConfig.data.PATHS.SPN, atlas: this._gameConfig.data.PATHS.ATLAS
    };
  }

  private _getSndExt(): string[] {
    return this._gameConfig.data.SND.EXT;
  }
}

export default Loader;