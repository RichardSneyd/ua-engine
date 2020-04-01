import PxPoint from './PxPoint';

import {Text, Sprite, Renderer, SCALE_MODES} from 'pixi.js';

class PxText {
  private _pxPoint: PxPoint;
  private _data: Sprite | null;
  private _rawText: Text| null;
  private _renderer: Renderer | null;
  private _scale: PxPoint | null; _anchor: PxPoint | null;

  constructor(pxPoint: PxPoint) {
    this._pxPoint = pxPoint;
    this._data = null;
    this._renderer = null;

    this._scale = null;
    this._anchor = null;

    this._rawText = null;
  }

  createNew(): PxText {
    return new PxText(this._pxPoint.createNew(1, 1, () => {}, () => {}));
  }

  public init(text: string, renderer: Renderer, style: any = undefined) {
    this._renderer = renderer;

    this._rawText = new Text(text, style);
    this._data = new Sprite(this._renderer.generateTexture(this._rawText, SCALE_MODES.LINEAR, 1));

    this._scale = this._pxPoint.createNew(1, 1, (xVal: number)=> {
      if (this._data != null) this._data.scale.x = xVal;
      //this._updateTexture();
      console.log("updated X Val!");
    }, (yVal: number) => {
      if (this._data != null) this._data.scale.y = yVal;
      //this._updateTexture();
      console.log("updated Y Val!");
    });

    this._anchor = this._pxPoint.createNew(1, 1, (xVal: number)=> {
      if (this._data != null) this._data.anchor.x = xVal;
    }, (yVal: number) => {
      if (this._data != null) this._data.anchor.y = yVal;
    })
  }

  get data(): Sprite {
    let dummy: any = null;

    if (this._data != null) {
      return this._data;
    } else {
      console.error("Can not access data before initializing text!");

      return <Sprite> dummy;
    }
  }

  get scale(): any {
    return this._scale;
  }

  get x(): number {
    if (this._data != null) {
      return this._data.x;
    } else {
      console.error("Can not access data before initializing text!");

      return 0;
    }
  }

  get y(): number {
    if (this._data != null) {
      return this._data.y;
    } else {
      console.error("Can not access data before initializing text!");

      return 0;
    }
  }

  set x(xval: number) {
    if (this._data != null) {
      this._data.x = xval;
    } else {
      console.error("Can not access data before initializing text!");
    }
  }

  set y(yval: number) {
    if (this._data != null) {
      this._data.y = yval;
    } else {
      console.error("Can not access data before initializing text!");
    }
  }


  public updateTexture() {
    this._updateTexture();
  }

  private _updateTexture() {
    if (this._data != null && this._renderer != null && this._rawText != null) {
      this._data.texture = this._renderer.generateTexture(this._rawText, SCALE_MODES.LINEAR, 1);
    } else {
      console.error("Can not update text texutre before init!");
    }
  }
}

export default PxText;