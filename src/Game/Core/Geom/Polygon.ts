import IPoint from './IPoint';
import Point from './Point';

class Polygon {
    protected _pointFactory: Point;
    private _center: IPoint;
    private _points: IPoint[];

    // points relative to center
    constructor(pointFactory: Point){
        this._pointFactory = pointFactory;
        this._center = this._pointFactory.createNew(0, 0);
    }

    init(points: IPoint[], center?: IPoint): Polygon{
        if(center) this._center = center;
        this._points = points;
        return this;
    }
    
    /**
     * @description Creates a new Polygon object based on center Point and Point arrays
     * @param center 
     * @param points 
     */
    createNew(points: IPoint[], center?: IPoint): Polygon{      
        return this.createEmpty().init(points, center);
    }

    createEmpty(): Polygon{
        return new Polygon(this._pointFactory);
    }

    get center(): IPoint {
        return this._center;
    }

    set center(center: IPoint) {
        this._center = center;
    }

    setCenter(x: number, y: number){
        this.center = this._pointFactory.createNew(x, y);
    }

    get points(): IPoint[]{
        return this._points;
    }

    set points(points: IPoint[]) {
        this._points = points;
    }

}

export default Polygon;