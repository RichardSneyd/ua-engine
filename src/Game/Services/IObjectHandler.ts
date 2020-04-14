import Point from '../Core/Geom/Point';
interface IObjectHandler {
  setXy(object: any, x: number, y: number): void;
  setSize(object: any, width: number, height: number): void;
  setPivot(object: any, anchor: Point): void;
 // move(object: any, x: number, y: number): void;
  setX(object: any, x: number): void;
  setY(object: any, y: number): void;
  setScaleXY(object: any, x: number, y: number): void;
  setStyle(text: any, style: any): void;
  destroy(object: any): void;
}

export default IObjectHandler;