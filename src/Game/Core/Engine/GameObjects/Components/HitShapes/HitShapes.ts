import IPoint from "../../../../Geom/IPoint";
import Point from "../../../../Geom/Point";
import IGameObject from "../../IGameObject";
import CircleHitShape from "./CircleHitShape";
import PolyHitShape from "./PolyHitShape";
import RectHitShape from "./RectHitShape";

class HitShapes {
    private _circleFactory: CircleHitShape;
    private _rectFactory: RectHitShape;
    private _convexPolyFactory: PolyHitShape;

    constructor(circle: CircleHitShape, rect: RectHitShape, convexPoly: PolyHitShape){
        this._circleFactory = circle; this._rectFactory = rect; this._convexPolyFactory = convexPoly;
    }

    /**
     * @description creates a circle hitshape and attaches it to the game object. This will replace the existing hitshape, if there is one. 
     * @param go The gameObject to attach to.
     * @param radius The radius of the circle -- defaults to half the width or height of the image -- whichever is greater
     * @param relativeCenter the relative center of the circle -- defaults to the center of the gameObject
     */
    public circle(go: IGameObject, radius?: number, relativeCenter?: Point): CircleHitShape{
        return this._circleFactory.createNew(go, radius, relativeCenter);
    }

    /**
     * @description a rectangular hitShape.
     * @param go the gameObject to attach to.
     * @param x top left x coordinate (in local space to the gameObject). 0 by default
     * @param y top left y coordinate (in local space to the gameObject). 0 by default
     * @param width the width. Defaults to the width of the gameObject.
     * @param height the height. Defaults to the height of the gameObject.
     */
    public rect(go:IGameObject, x?: number, y?: number, width?: number, height?: number): RectHitShape{
        return this._rectFactory.createNew(go, x, y, width, height);
    }

    /**
     * @description a convex polygon hitshape. (EXPERIMENTAL, NOT YET STABLE)
     * @param go the gameObject to attach to.
     * @param points the points that make up the convex shape. (local space. 0, 0 is the top left of the gameObject).
     */
    public convexPoly(go:IGameObject, points:IPoint[]): PolyHitShape {
        return this._convexPolyFactory.createNew(go, points);
    }
}

export default HitShapes;