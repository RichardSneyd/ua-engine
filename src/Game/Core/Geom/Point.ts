class Point {
    _x: number;
    _y: number;

    constructor(x: number, y: number) {
        this._x = x; this._y = y;
    }

    get x(): number {
        return this._x;
    }

    set x(x: number) {
        this._x = x;
    }

    get y(): number {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
    }

    public createNew(x: number, y: number): Point {
        return new Point(x, y);
    }
}

export default Point;