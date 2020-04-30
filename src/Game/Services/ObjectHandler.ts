import IObjectHandler from './IObjectHandler';
import Point from '../Core/Geom/Point';
import {Container, DisplayObject} from 'pixi.js';

class ObjectHandler implements IObjectHandler {
  constructor() {
    
  }

  public setXy(object: any, x: number, y: number) {
      object.x = x; 
      object.y = y;
  }

  public setPivot(object: Container, anchor: Point){
    object.pivot.set(Math.floor(anchor.x * object.width), Math.floor(anchor.y * object.height));
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

  public setScale(object: any, x: number, y: number) {
    object.scale.set(x, y);
  }

  public setWidth(object: any, width: number) {
    object.width = width;
  }

  public setHeight(object: any, height: number) {
    object.height = height;
  }

  public destroy(object: any){
    object.destroy();
  }

  public setMask(object: any, mask: any) {
    object.mask = mask;
  }

  public getSize(object: any): {width: number, height: number} {
    return {width: object.width, height: object.height};
  }
}

export default ObjectHandler;