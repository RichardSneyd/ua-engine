class Point {
    protected _x: number;
    protected _y: number;

    constructor() {
       
    }

    init(x: number, y: number){
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
        let point = new Point();
        point.init(x, y);
        return point;
    }
}

export default Point;