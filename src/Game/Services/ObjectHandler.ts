import IObjectHandler from './IObjectHandler';
import Point from '../Core/Data/Point';
import {Container} from 'pixi.js';

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

  public move(object: Container, x: number, y: number){
    this.setXy(object, x, y);
  }
}

export default ObjectHandler;