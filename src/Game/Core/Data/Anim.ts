class Anim {
  private _name: string;
  private _base: string;
  private _max: number;
  private _fps: number;
  private _data: any;
  private _index: number;

  constructor() {
    this._name = '';
    this._base = '';
    this._fps = 0;
    this._max = 0;
    this._data = null;
    this._index = 0;
  }

  get name(): string {
    return this._name;
  }

  get data(): any {
    return this._data;
  }

  get frames(): string[] {
    return this._getFrames();
  }

  get fps(): number {
    return this._fps;
  }

  public init(name: string, base: string, max: number, fps: number, data: any) {
    this._name = name;
    this._base = base;
    this._max = max;
    this._fps = fps;
    this._data = data;
  }

  public getNextFrame(): string {
    let frames = this._getFrames();
    let frm = frames[this._index];

    this._index++;

    if (this._index > (frames.length - 1)) this._index = 0;

    return frm;
  }

  public createNew(): Anim {
    return new Anim();
  }

  private _getFrames(): string[] {
    let arr: string[] = [];

    for (let c = 0; c < this._max; c++) {
      arr.push(this._base + this._name + (c+1).toString());
    }

    return arr;
  }
}

export default Anim;