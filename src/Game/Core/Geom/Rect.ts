import IPoint from './IPoint';
import Point from './Point';

class Rect {
    protected _pointFactory: Point;
    protected _x: number;
    protected _y: number;
    protected _width: number;
    protected _height: number;

    constructor(pointFactory: Point) {
        this._pointFactory = pointFactory;
    }

    init(x: number, y: number, width: number, height: number) {
        this._x = x; this._y = y; this._width = width; this._height = height;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    set x(x: number) {
        this._x = x;
    }

    set y(y: number) {
        this._y = y;
    }

    get width(): number {
        return this._width;
    }

    set width(width: number) {
        this._width = width;
    }

    get height(): number {
        return this._height;
    }

    set height(height: number) {
        this._height = height;
    }

    get halfHeight(): number {
        return this.height / 2;
    }

    get halfWidth(): number {
        return this.width / 2;
    }

    get topLeft(): Point {
        return this._pointFactory.createNew(this.x, this.y);
    }

    get topCenter() {
        return this._pointFactory.createNew(this.x + this.halfWidth, this.y);
    }

    get center() {
        return this._pointFactory.createNew(this.x + this.halfWidth, this.y + this.halfHeight);
    }

    get topRight(): Point {
        return this._pointFactory.createNew(this.x + this.width, this.y);
    }

    get left(): number {
        return this.x;
    }

    get right(): number {
        return this.x + this.width;
    }

    get top(): number {
        return this.y;
    }

    get bottom(): number {
        return this.y + this.height;
    }

    get rightCenter(): Point {
        return this._pointFactory.createNew(this.x + this.width, this.y + this.halfHeight);
    }

    get bottomRight(): Point {
        return this._pointFactory.createNew(this.x + this.width, this.y + this.height);
    }

    get bottomCenter(): Point {
        return this._pointFactory.createNew(this.x + this.halfWidth, this.y + this.height)
    }

    get bottomLeft(): Point {
        return this._pointFactory.createNew(this.x, this.y + this.height);
    }

    get leftCenter(): Point {
        return this._pointFactory.createNew(this.x, this.y + this.halfHeight);
    }

    /**
     * @description Creates a new Rect object based on coordinates and height then returns the object
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     */
    createNew(x: number, y: number, width: number, height: number): Rect {
        let rect = new Rect(this._pointFactory);
        rect.init(x, y, width, height);
        return rect;
    }
}

export default Rect;