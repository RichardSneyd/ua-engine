import Point from '../Core/Geom/Point';
interface IObjectHandler {
  setXy(object: any, x: number, y: number): void;
  setSize(object: any, width: number, height: number): void;
  setPivot(object: any, anchor: Point): void;
 // move(object: any, x: number, y: number): void;
  setX(object: any, x: number): void;
  setY(object: any, y: number): void;
  setScale(object: any, x: number, y: number): void;
  setStyle(text: any, style: any): void;
  setTextColor(text: any, color: string): void;
  destroy(object: any): void;
  setWidth(object: any, width: number): void;
  setHeight(object: any, height: number): void;
  setMask(object: any, mask: any): void;
  getSize(object: any): {width: number, height: number};
}

export default IObjectHandler;