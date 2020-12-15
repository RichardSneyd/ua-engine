
import Rect from "../../../../Geom/Rect";
import IGameObject from "../../IGameObject";
import IHitShape from "./IHitShape";

class RectHitShape implements IHitShape {
    protected _go: IGameObject;
    protected _rectFactory: Rect;
    protected _rect: Rect;
    
    constructor(rect: Rect){
        this._rectFactory = rect;
    }

    init(go: IGameObject, x?: number, y?: number, width?: number, height?: number): RectHitShape{
        this._go = go;
        if(!x) x = 0;
        if(!y) y = 0;
        if(!width) width = this._go.width;
        if(!height) height = this._go.height;
        this._rect = this._rectFactory.createNew(x, y, width, height);
        return this;
    }

    createNew(go: IGameObject, x?: number, y?: number, width?: number, height?: number): RectHitShape{
        return this.createEmpty().init(go, x, y, width, height);
    }

    createEmpty(): RectHitShape{
        return new RectHitShape(this._rectFactory);
    }

    containsPoint(point: { x: number, y: number }): boolean {
        let s = this._go.scaleHandler.x;
        if(point.x > this._go.left + (this._rect.left * s) 
            && point.x < this._go.left + (this._rect.right * s) 
            && point.y > this._go.top + (this._rect.top * s) 
            && point.y < this._go.bottom + (this._rect.bottom * s)) return true;
        return false;
    }
}

export default RectHitShape;