import Events from "../Events"; // don't remove this import - it's needed
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import Screen from "../../../Services/Screen";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from './Components/ScaleHandler';
import Point from "../../Geom/Point";
import TweenComponent from "./Components/TweenComponent";
import BaseGameObject from "./BaseGameObject";
import ExtractComponent from "./Components/ExtractComponent";
import { timeStamp } from "console";

/**
 * @description A container object. Useful for grouping other GameObjects.
 */
class ContainerObject extends BaseGameObject {
    private _pointFactory: Point;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: Screen, input: InputHandler,
        scaleHandler: ScaleHandler, tweenComponent: TweenComponent, point: Point, extract: ExtractComponent) {
        super(objectCore, pcHandler, screen, input, scaleHandler, tweenComponent, extract);
        this._pointFactory = point;
    }

    public init(x: number = 0, y: number = 0, parent: IParentChild | null): void {
        this.data = this._screen.createContainer(x, y);
        this._core.init(this, x, y, '', this._update);
        super.init();
        this._pcHandler.init(this, this._core, parent);
    }

    public createNew(x: number, y: number, parent: IParentChild | null): ContainerObject {
        let cont = this.createEmpty();
        cont.init(x, y, parent);
        return cont;
    }

    public createEmpty(): ContainerObject {
        return new ContainerObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this.scaleHandler.createNew(), this._tweenComponent.createNew(), this._pointFactory, this._extract.createEmpty());
    }

    public changeTexture(textureName: string) {
        this._core.changeTexture(textureName);
    }   

     /**
     * @description set the origin for the container. This is modified version of the method for use with containers, which uses a custom setPivot implementation
     * @param x the x value
     * @param y the y value. If no y value is provided, the x value will be used for y as well.
     */
      public setOrigin(x: number, y?: number) {
        // console.log('setOrigin this: ', this);
        let yVal: number;
        let xVal = x;
        if (y !== undefined) {
          yVal = y;
        }
        else {
          yVal = xVal;
        }

        this._core.origin = this._pointFactory.createNew(xVal, yVal);
        this._setPivot();
      }

      /**
       * @description slightly hacky custom setPivot method, because we can't use the built in height and width properties, which are always 0,
       * and thus useless
       */
      private _setPivot() {
        this._core.data.pivot.set(Math.floor(this.origin.x * this._childrenWidth()), Math.floor(this.origin.y * this._childrenHeight()));
      }

}

export default ContainerObject;