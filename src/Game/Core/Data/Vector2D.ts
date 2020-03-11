

class Vector2D {
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

    public createNew(x: number, y: number): Vector2D {
        return new Vector2D(x, y);
    }
}

export default Vector2D;