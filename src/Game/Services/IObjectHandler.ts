interface IObjectHandler {
  setXy(object: any, x: number, y: number): void;
  setX(object: any, x: number): void;
  setY(object: any, y: number): void;
  setScaleXY(object: any, x: number, y: number): void;
}

export default IObjectHandler;