import IPoint from "./IPoint";
import ITriangle from "./ITriangle";

class Triangle implements ITriangle {
    protected _pointA: IPoint;
    protected _pointB: IPoint;
    protected _pointC: IPoint;

    get pointA(): IPoint {
        return this._pointA;
    }

    set pointA(point: IPoint){
        this._pointA = point;
    }

     get pointB(): IPoint {
        return this._pointA;
    }

    set pointB(point: IPoint){
        this._pointB = point;
    }

    get pointC(): IPoint {
        return this._pointA;
    }

    set pointC(point: IPoint){
        this._pointC = point;
    }

    init(pointA: IPoint, pointB: IPoint, pointC: IPoint): Triangle{
        this._pointA = pointA; this._pointB = pointB; this._pointC = pointC;
        return this;
    }

    createNew(pointA: IPoint, pointB: IPoint, pointC: IPoint): Triangle {
        return this.createEmpty().init(pointA, pointB, pointC);
    }

    createEmpty(): Triangle {
        return new Triangle();
    }
}

export default Triangle;