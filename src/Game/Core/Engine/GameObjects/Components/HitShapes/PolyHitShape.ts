import IPoint from "../../../../Geom/IPoint";
import Point from "../../../../Geom/Point";
import Polygon from "../../../../Geom/Polygon";
import IGameObject from "../../IGameObject";
import IHitShape from "./IHitShape";
import SmartTriangle from "./TriangleHitShape";

class PolyHitShape implements IHitShape {
    protected _go: IGameObject;
    protected _pointFactory: Point;
    protected _polygonFactory: Polygon;
    protected _smartTriFactory: SmartTriangle;
    protected _polygon: Polygon;
    
    constructor(point: Point, polygon: Polygon, smartTriangle: SmartTriangle){
        this._pointFactory = point;
        this._polygonFactory = polygon;
        this._smartTriFactory = smartTriangle;
    }

    get triangles(): SmartTriangle[]{
        return this._calculateTriangles();
    }
    
    protected _calculateTriangles(): SmartTriangle[]{
        // assumes the triangles are arranged in clockwise or counter-clockwise order
        let triangles: SmartTriangle[] = [];
        let points = this._polygon.points;
        for(let p = 0; p < points.length - 2; p++){
            triangles.push(this._smartTriFactory.createNew(this._go, points[0], points[p+1], points[p+2]));
        }
        return triangles;
    }

    init(go: IGameObject, points: IPoint[]): PolyHitShape{
        this._go = go;
        this._polygon = this._polygonFactory.createNew(points);
        return this;
    }

    createNew(go: IGameObject, points: IPoint[]): PolyHitShape{
        return this.createEmpty().init(go, points);
    }

    createEmpty(): PolyHitShape{

        return this;
    }

    // an attempt at handling concave shapes as well...
    containsPoint(point: IPoint): boolean {
        let contains: number = 0;
        for(let t = 0; t < this.triangles.length; t++){
            if(this.triangles[t].containsPoint(point)) contains++;
        }
        if(contains % 2 == 1) return true;
        return false;
    }
}

export default PolyHitShape;