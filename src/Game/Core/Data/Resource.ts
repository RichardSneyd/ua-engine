import ResourceType from './ResourceType';

class Resource {
  private _type: string;
  private _url: string;
  private _name: string;
  private _loaded: boolean;
  private _data: any;

  constructor() {
    this._type = '';
    this._url = '';
    this._name = '';
    this._loaded = false;
    this._data = null;
  }

  get data(): any {
    return this._data;
  }

  get name(): string {
    return this._name;
  }

  get url(): string {
    return this._url;
  }

  set data(dat: any) {
    this._data = dat;
  }

  public initImage(url: string, loaded: boolean) {
    let type = this._getImgTag();
    this._init(type, url, loaded);
  }

  public initSnd(url: string, loaded: boolean) {
    let type = this._getImgTag();
    this._init(type, url, loaded);
  }

  public isImg(): boolean {
    if (this._type == ResourceType.IMG) {
      return true;
    } else {
      return false;
    }
  }

  public isSnd(): boolean {
    if (this._type == ResourceType.SND) {
      return true;
    } else {
      return false;
    }
  }

  public createNew(): Resource {
    return new Resource();
  }

  private _init(type: string, url: string, loaded: boolean) {
    this._type = type;
    this._url = url;
    this._loaded = loaded;
    this._name = this._getName(url);
  }

  private _getImgTag(): string {
    return ResourceType.IMG;
  }

  private _getSndTag(): string {
    return ResourceType.SND;
  }
  
  private _getName(url: string): string {
    let arr = url.split('/');
    return arr[arr.length - 1];
  }
}
export default Resource;