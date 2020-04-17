import IObjectHandler from './IObjectHandler';
import Point from '../Core/Geom/Point';
import {Container, DisplayObject} from 'pixi.js';

class ObjectHandler implements IObjectHandler {
  constructor() {
    
  }

  public setXy(object: any, x: number, y: number) {
    if(Number(x)){
     // console.log('setting new value');
      object.x = x;
    }
    if(Number(y)){
      object.y = y;
    }
  }

  public setPivot(object: Container, anchor: Point){
    object.pivot.set(anchor.x * object.width, anchor.y * object.height);
  }

  public setSize(object: Container, width: number, height: number){
    object.width = width;
    object.height = height;
  }

  public setStyle(text: any, style: any){
    text.style = style;
  }

  public setTextColor(text: any, color: string){
    text.fill = color;
  }

  public move(object: Container, x: number, y: number){
    this.setXy(object, x, y);
  }

  public setX(object: any, x: number) {
    object.x = x;
  }

  public setY(object: any, y: number) {
    object.y = y;
  }

  public setScaleXY(object: any, x: number, y: number) {
    object.scale.x = x;
    object.scale.y = y;
  }

  public destroy(object: any){
    object.destroy();
  }
}

export default ObjectHandler;