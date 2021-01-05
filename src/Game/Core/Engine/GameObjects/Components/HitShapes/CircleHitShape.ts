import { relative } from "path";
import Circle from "../../../../Geom/Circle";
import Point from "../../../../Geom/Point";
import Utils from "../../../Utils/Utils";
import IGameObject from "../../IGameObject";
import IHitShape from "./IHitShape";

class CircleHitShape implements IHitShape {
    protected _utils: Utils;
    protected _points: Point;
    protected _go: IGameObject;
    protected _initialized: boolean;
    protected _circleFactory: Circle;
    protected _circle: Circle;
    
    constructor(utils: Utils, points: Point, circle: Circle){
        this._utils = utils;
        this._points = points;
        this._initialized = false;
       // this._relativeCenter = {x: 0, y: 0};
        this._circleFactory = circle;
        this._circle = this._circleFactory.createNew(0, 0, 0);
    }

    get radius() {
        return this._circle.radius;
    }

    set radius(radius: number){
        this._circle.radius = radius;
    }

    get relativeCenter(): Point {
        return this._circle.center;
    }

    get worldCenter(){
        return {x: this._go.left + this._circle.center.x, y: this._go.top + this._circle.center.y}
    }

    set relativeCenter( center: Point){
        this._circle.center = center;
    }

    /**
     * @description does the shape contain this point? Scale is factored into the calculation. The point should be in global space
     * @param point the point to check. Should be in global space.
     */
    containsPoint(point: { x: number, y: number}): boolean {
        if(this._distFromCenter(point) <= this._circle.radius) return true;
        return false;
    }

    private _distFromCenter(point:{ x: number, y: number }){
        return this._distanceBetweenPoints(this.worldCenter, point);
    }

    private _distanceBetweenPoints(pointA:  { x: number, y: number }, pointB:  { x: number, y: number }){
        let scale = this._go.scaleHandler.x;
        return this._utils.math.distanceBetween(pointA.x * scale, pointA.y * scale, pointB.x * scale, pointB.y * scale);
    }

    init(go: IGameObject, radius?: number, relativeCenter?:  Point): CircleHitShape{
        this._go = go;
        if(relativeCenter) this._circle.center = relativeCenter;
        else this._circle.center = this._points.createNew(go.width / 2, go.height / 2);

        if(radius) this._circle.radius = radius;
        else {
            if(go.width > go.height){
                this._circle.radius = go.width / 2;
            }
            else {
                this._circle.radius = go.height / 2;
            }
        }

        this._initialized = true;
        return this;
    }

    createNew(go: IGameObject, radius?: number, relativeCenter?: Point): CircleHitShape{
        return this.createEmpty().init(go, radius, relativeCenter);
    }

    createEmpty(): CircleHitShape{
        return new CircleHitShape(this._utils, this._points, this._circleFactory);
    }
    
}

export default CircleHitShape;