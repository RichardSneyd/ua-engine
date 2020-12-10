import IPoint from "../../../../Geom/IPoint";
import Triangle from "../../../../Geom/Triangle";
import Triangles from "../../../Utils/Triangles";
import IGameObject from "../../IGameObject";
import IHitShape from "./IHitShape";

class TriangleHitShape implements IHitShape {
    private _go: IGameObject;
    private _triUtils: Triangles;
    private _triangleFactory: Triangle;
    private _triangle: Triangle;

    constructor(triangle: Triangle, triUtils: Triangles) {
        this._triangleFactory = triangle;
        this._triUtils = triUtils;
    }

    init(go: IGameObject, pointA: IPoint, pointB: IPoint, pointC: IPoint): TriangleHitShape {
        this._go = go;
        this._triangle = this._triangleFactory.createNew(pointA, pointB, pointC);
        return this;
    }

    createNew(go: IGameObject, pointA: IPoint, pointB: IPoint, pointC: IPoint): TriangleHitShape {
        return this.createEmpty().init(go, pointA, pointB, pointC);
    }

    createEmpty(): TriangleHitShape {
        return new TriangleHitShape(this._triangleFactory, this._triUtils);
    }

    /**
     * @description returns the global position of a point, factoring in local scale of attached gameObject
     * @param point the point to find global position of
     */
    global(point: IPoint): IPoint {
        let xOff = this._go.left; let yOff = this._go.top;
        let local = this.local(point);
        return this.local({ x: xOff + local.x, y: yOff + local.y});
    }

    /**
     * @description return the local position of a point, factoring in scale of attached gameObject
     * @param point the point to calculate the local position of
     */
    local(point: IPoint): IPoint {
        let s = this._go.scaleHandler.x;
        return { x: point.x * s, y: point.y * s }
    }

    /**
     * @description does the triangle contain this point?
     * @param point the point to check 
     * @param local defaults to global space. set this to true for local space
     */
    containsPoint(point: IPoint, local: boolean = false): boolean {
        let v1 = this.global(this._triangle.pointA);
        let v2 = this.global(this._triangleFactory.pointB);
        let v3 = this.global(this._triangle.pointC);
        if(local) point = this.global(point);
        return this._triUtils.containsPoint(point, v1, v2, v3);
    }

    /*    sign(p1: IPoint, p2: IPoint, p3: IPoint) {
           return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
       } */
}

export default TriangleHitShape;