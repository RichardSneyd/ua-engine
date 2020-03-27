import { Point } from "pixi.js";

class Polygon {
    private _center: Point;
    private _points: Point[];

    // points relative to center
    constructor(center: Point, points: Point[]){
        this._center = center;
        this._points = points;
    }

    get center(): Point {
        return this._center;
    }

    set center(center: Point) {
        this._center = center;
    }

    setCenter(x: number, y: number){
        this.center = new Point(x, y);
    }

    get points(): Point[]{
        return this._points;
    }

    set points(points: Point[]) {
        this._points = points;
    }
}