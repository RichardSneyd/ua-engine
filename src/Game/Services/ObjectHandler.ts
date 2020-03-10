import IObjectHandler from './IObjectHandler';

class ObjectHandler implements IObjectHandler {
  constructor() {

  }

  public setXy(object: any, x: number, y: number) {
    object.x = x;
    object.y = y;
  }
}

export default ObjectHandler;