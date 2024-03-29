import PxPoint from './PxPoint';

import {Text, Sprite, Renderer, SCALE_MODES} from 'pixi.js-legacy';
import Debug from '../../Core/Engine/Debug';

class PxText {
  private _pxPoint: PxPoint;
  private _data: Sprite | null;
  private _rawText: Text| null;
  private _renderer: Renderer | null;
  private _scale: PxPoint | null; _anchor: PxPoint | null;
  protected _style: any;
  protected _fill: any;

  constructor(pxPoint: PxPoint) {
    this._pxPoint = pxPoint;
    this._data = null;
    this._renderer = null;

    this._scale = null;
    this._anchor = null;

    this._rawText = null;

  }


  get visible(): boolean {
    if(this._data !== null){
      return this._data.visible;
    }
    return false;
  }

  set visible(visible: boolean){
    if(this._data !== null){
      this._data.visible = visible;
    }
  }


  get width(): number{
    if(this._data){
      return this._data.width;
    }
    return -1;
  }

  get pivot(){
    if(this._data){
      return this._data.pivot;
    }
  }

  set pivot(val: any){
    if(this._data){
      this._data.pivot = val;
    }
  }

  set width(width: number){
    if(this._data){
      this._data.width = width;
    }
  }

  get height(){
    if(this._data){
      return this._data.height; 
    }
    return -1;
  }

  set height(height: number){
    if(this._data){
      this._data.height = height;
    }
  }

  get style() {
    return this._style;
  }

  set style(style: any){
    this._style = style;
    if(this._rawText){
      this._rawText.style = style;
      this._fill = style.fill;
    }
    this.updateTexture();
  }

  setTextColor(color: string){
    if(this._rawText) this._rawText.style.fill = color;
    this._updateTexture();
  }

  set fill(fill: string){
    this._style.fill = fill;
    this._fill = this._style.fill;
    if(this._rawText !== null && this._rawText !== undefined){
      this._rawText.style = this._style;
    }
    this.updateTexture();
  }

  get fill(){
    return this._fill;
  }

  set text(text: string){
    if(this._rawText) this._rawText.text = text;
    else Debug.error('cannot update text for unitiatied text object');
    this._updateTexture();
  }

  get text(){
   if(this._rawText) return this._rawText.text;
   else Debug.error('cannot retrieve text value from undefined object');
   return '';
  }

  createNew(): PxText {
    return new PxText(this._pxPoint.createNew(1, 1, () => {}, () => {}));
  }

  public init(text: string, renderer: Renderer, style: any = { fontFamily: 'gothic' }) {
    this._renderer = renderer;
    if (!style.fontFamily) style.fontFamily = 'gothic';
    this._style = style;
    this._fill = style.fill;
    this._rawText = new Text(text, style);
    this._data = new Sprite(this._renderer.generateTexture(this._rawText, SCALE_MODES.LINEAR, 1));

    this._scale = this._pxPoint.createNew(1, 1, (xVal: number)=> {
      if (this._data != null) this._data.scale.x = xVal;
      //this._updateTexture();
      Debug.info("updated X Val!");
    }, (yVal: number) => {
      if (this._data != null) this._data.scale.y = yVal;
      //this._updateTexture();
      Debug.info("updated Y Val!");
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
      Debug.error("Can not access data before initializing text!");

      return <Sprite> dummy;
    }
  }

  get scale(): any {
    return this._scale;
  }

  get alpha(): number {
    if(this._data){
      return this._data.alpha;
    }
    Debug.warn('cannot return alpha for object that is not initialized!');
    return -1;
  }

  set alpha(alpha: number){
    if(this._data){
      this._data.alpha = alpha;
    }
  }

  get x(): number {
    if (this._data != null) {
      return this._data.x;
    } else {
      Debug.error("Can not access data before initializing text!");

      return 0;
    }
  }

  get y(): number {
    if (this._data != null) {
      return this._data.y;
    } else {
      Debug.error("Can not access data before initializing text!");

      return 0;
    }
  }

  set x(xval: number) {
    if (this._data != null) {
      this._data.x = xval;
    } else {
      Debug.error("Can not access data before initializing text!");
    }
  }

  set y(yval: number) {
    if (this._data != null) {
      this._data.y = yval;
    } else {
      Debug.error("Can not access data before initializing text!");
    }
  }

  addChild(object: any){
    this.data.addChild(object);
  }

  removeChild(object: any){
    this.data.removeChild(object);
  }

  public updateTexture() {
    this._updateTexture();
  }

  private _updateTexture() {
    if (this._data != null && this._renderer != null && this._rawText != null) {
      let texture = this._renderer.generateTexture(this._rawText, SCALE_MODES.LINEAR, 1);
      this._data.texture = texture;
      this._data.width = texture.width;
      this._data.height = texture.height;
    } else {
      Debug.error("Can not update text texture before init!");
    }
  }

  public destroy(){
    if(this._data !== undefined && this._data !== null){
      this._data.destroy();
    }
    if(this._rawText !== undefined && this._rawText !== null){
      this._rawText.destroy();
    }
  }
  
}

export default PxText;