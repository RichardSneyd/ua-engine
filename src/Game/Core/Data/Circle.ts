import { Point } from "pixi.js";

class Cirlce {
    private _center: Point;
    private _radius: number;

    constructor(center: Point, radius: number){
        this._center = center;
        this._radius = radius;
    }

    set center(center: Point){
        this._center = center;
    }

    get center(): Point {
        return this._center;
    }

    set radius(radius: number){
        this._radius = radius;
    }

    get radius(): number {
        return this._radius;
    }
}

export default Cirlce;