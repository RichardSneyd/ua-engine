import Point from "../../Geom/Point";
import DraggableObject from "./DraggableObject";

class Dropzone {
    private _point: Point;
    private _name: string;
    private _topLeft: Point;
    private _bottomRight: Point;
    private _center: Point;

    constructor(point: Point) {
        this._point = point;
    }

    init(name: string, zone: { x1: number, y1: number, x2: number, y2: number, x3?: number, y3?: number }): void {
        this._name = name;

        this._topLeft = this._point.createNew(zone.x1, zone.y1);
        this._bottomRight = this._point.createNew(zone.x2, zone.y2);
        let centerX = (zone.x3) ? zone.x3 : zone.x1 + (zone.x2 - zone.x1) / 2;
        let centerY = (zone.y3) ? zone.y3 : zone.y1 + (zone.y2 - zone.y1) / 2;
        this._center = this._point.createNew(centerX, centerY);
    }

    createNew(name: string, zone: { x1: number, y1: number, x2: number, y2: number, x3?: number, y3?: number }): Dropzone {
        let dropzone = this.createEmpty();
        dropzone.init(name, zone);
        return dropzone;
    }

    createEmpty(): Dropzone {
        return new Dropzone(this._point);
    }

    get name(): string {
        return this._name;
    }

    get topLeft(): Point {
        return this._topLeft;
    }

    get bottomRight(): Point {
        return this._bottomRight;
    }

    get center(): Point {
        return this._center;
    }

    set topLeft(topLeft: Point) {
        this._topLeft = topLeft;
    }

    set bottomRight(bottomRight: Point) {
        this._bottomRight = bottomRight;
    }

    set center(center: Point) {
        this._center = center;
    }
}

export default Dropzone;