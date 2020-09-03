import MathUtils from "../Utils/MathUtils";

import ContainerObject from "./ContainerObject";
import Point from "../../Geom/Point";
import Geom from "../../Geom/Geom";
import GameConfig from "../GameConfig";


class Camera {
    protected _math: MathUtils;
    protected _gameConfig: GameConfig;
    protected _geom: Geom;
    protected _container: ContainerObject;
    protected _initialized: boolean;
    protected _pivot: Point;
    protected _x: number;
    protected _y: number;
    //  protected _zoom: number;

    constructor(math: MathUtils, gameConfig: GameConfig, geom: Geom) {
        this._math = math;
        this._gameConfig = gameConfig;
        this._geom = geom;
        this._pivot = geom.point(0, 0);
        this._x = 0;
        this._y = 0;
        //  this._zoom = 1;
        this._initialized = false;
        (<any>window).camera = this;
    }

    get initialized(): boolean {
        return this._initialized;
    }

    get x() {
        //   return this._container.x * -1;
        return this._x;
    }

    /**
     * @default set the x position of the camera. clamped so that you can't scroll out of the bounds of the defining container object
     */
    set x(x: number) {

        // this._container.x = x * -1;
        this._x = x;
        this.pivot = this.pivot;
    }

    get y() {
        //  return this._container.y * -1;
        return this._y;
    }

    /**
   * @default set the y position of the camera. clamped so that you can't scroll out of the bounds of the defining container object
   */
    set y(y: number) {
        // this._container.y = y * -1;
        this.y = y;
        this.pivot = this.pivot;
    }

    get left(): number {
        return this.x;
    }

    get right(): number {
        return this.x + this._gameConfig.data.DISPLAY.WIDTH;
        // todo
        // possibly offset for zoom...
        // return this.x + this._game.width() / this._container.scaleHandler.scaleX;
    }

    get top(): number {
        return this.y;
    }

    get bottom(): number {
        return this.y + this._gameConfig.data.DISPLAY.HEIGHT;
    }

    /**
     * @description move the camera, with the option of clamping movement within the bounds of the controlling ContainerObject (defaults to true)
     * @param x the x to move the camera to
     * @param y the y to move the camera to
     * @param clampToBounds enabled by default. Pass false to disable
     */
    move(x: number, y: number, clampToBounds: boolean = true) {
        if (!clampToBounds) {
            this.x = x;
            this.y = y;
            return;
        }

        let clampX = this._math.clamp(x, 0, this._container.width - this._gameConfig.data.DISPLAY.WIDTH);
        let clampY = this._math.clamp(y, 0, this._container.height - this._gameConfig.data.DISPLAY.HEIGHT);
        this.x = clampX;
        this.y = clampY;
    }

    /**
     * @description get the angle of the camera (attained relative to the angle of the controlling container)
     */
    get angle() {
        let contAngle = this._container.angle;
        let angle = 360 - contAngle;
        return angle;
    }

    set angle(value: number) {
        let angle = value % 360;
        this._container.angle = 360 - angle;
    }

    /**
     * @description pivot point of camera
     */
    set pivot(pivot: { x: number, y: number }) {

        this._pivot = this._pivot.createNew(pivot.x, pivot.y);
        let xVal = pivot.x * this.width;
        let yVal = pivot.y * this.height;
        console.log('xVal: ', xVal, ' yVal: ', yVal);

        let xCenter = this.left + xVal;
        let yCenter = this.top + yVal;
        console.log('xCenter: ', xCenter, ' yCenter: ', yCenter);
        let originX = xCenter / this._container.width;
        let originY = yCenter / this._container.height;
        console.log('x: ', originX, ' y: ', originY);
        this._container.setOrigin(originX, originY);
    }

    setPivot(x: number, y: number) {
        this.pivot = { x: x, y: y }
    }

    get pivot() {
        return this._pivot;
    }
    /**
     * @description set the zoom level of the camera. Sets the scaleX and scaleY of the container
     */
    set zoom(zoom: number) {
        this._container.scaleHandler.scaleX = zoom;
        this._container.scaleHandler.scaleY = zoom;
    }

    /**
     * @description the zoom level of the camera. Sets the scaleX and scaleY of the container
     */
    get zoom() {
        return this._container.scaleHandler.scaleX;
    }

    /**
     * @description returns the calculated 'bounds' of the camera, as an object
     */
    get bounds(): { x: number, y: number, width: number, height: number } {
        return { x: this.left, y: this.top, width: this.width, height: this.height }
    }

    /**
     * @description the width of the camera, or 'viewport'
     */
    get width(): number {
        return this._gameConfig.data.DISPLAY.WIDTH; // possibly factor in scale to complensate for zoom level....
    }

    /**
     * @description the height of the camera, or 'viewport'
     */
    get height() {
        return this._gameConfig.data.DISPLAY.HEIGHT; // possibly factor in scale to compensate for zoom level...
    }

    createNew(container: ContainerObject): Camera {
        let camera = this.createEmpty();
        camera.init(container);
        return camera;
    }

    createEmpty(): Camera {
        return new Camera(this._math, this._gameConfig, this._geom);
    }

    init(container: ContainerObject) {
        this._container = container;
        this._initialized = true;
    }
}

export default Camera;