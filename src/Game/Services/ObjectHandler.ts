import IObjectHandler from './IObjectHandler';

class ObjectHandler implements IObjectHandler {
  constructor() {
    
  }

  public setXy(object: any, x: number, y: number) {
    object.x = x;
    object.y = y;
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
}

export default ObjectHandler;