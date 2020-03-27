import Point from '../Core/Data/Point';
interface IObjectHandler {
  setXy(object: any, x: number, y: number): void;
  setSize(object: any, width: number, height: number): void;
  setPivot(object: any, anchor: Point): void;
 // move(object: any, x: number, y: number): void;
}

export default IObjectHandler;