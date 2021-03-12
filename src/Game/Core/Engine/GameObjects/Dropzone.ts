import PxGame from "../../../Services/Pixi/PxGame";
import Point from "../../Geom/Point";
import InputManager from "../InputManager";
import DraggableObject from "./DraggableObject";

class Dropzone {
    private _point: Point;
    private _input: InputManager;
    private _pxGame: PxGame;
    private _name: string;
    private _topLeft: Point;
    private _bottomRight: Point;
    private _centre: Point;
    private _vertical: boolean | undefined;
    private _gap: number;
    private _draggables: DraggableObject[];
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    constructor(point: Point, input: InputManager, pxGame: PxGame) {
        this._point = point;
        this._input = input;
        this._pxGame = pxGame;
        this._draggables = [];
    }

    init(name: string, zone: { x: number, y: number, width: number, height: number },
        vertical?: boolean, gap: number = 0): void {
        this._name = name;
        this._vertical = vertical;
        this._gap = gap;

        this._topLeft = this._point.createNew(zone.x, zone.y);
        this._bottomRight = this._point.createNew(zone.x + zone.width, zone.y + zone.height);
        this._centre = this._point.createNew(zone.x + zone.width / 2, zone.y + zone.height / 2);
    }

    createNew(name: string, zone: { x: number, y: number, width: number, height: number },
        vertical?: boolean, gap: number = 0): Dropzone {
        let dropzone = this.createEmpty();

        this._x = zone.x;
        this._y = zone.y;
        this._width = zone.width;
        this._height = zone.height;

        dropzone.init(name, zone, vertical, gap);
        return dropzone;
    }

    createEmpty(): Dropzone {
        return new Dropzone(this._point, this._input, this._pxGame);
    }

    get name(): string {
        return this._name;
    }

    get topLeft(): Point {
        return this._topLeft;
    }

    get bottomRight(): Point {
        return this._bottomRight;
    }

    get centre(): Point {
        return this._centre;
    }

    set topLeft(topLeft: Point) {
        this._topLeft = topLeft;
    }

    set bottomRight(bottomRight: Point) {
        this._bottomRight = bottomRight;
    }

    set centre(centre: Point) {
        this._centre = centre;
    }

    add(draggable: DraggableObject) {
        if (this._vertical === undefined) {
            draggable.moveTo(this._centre);
        } else {
            let length = (this._vertical) ? draggable.height : draggable.width;
            let start = (this._vertical) ? this.topLeft.y : this.topLeft.x;
            let origin = (this._vertical) ? draggable.origin.y : draggable.origin.x;
            let draggablesIn = this._draggables.length;
            let coordinate = start + draggablesIn * (length + this._gap) + length * origin;

            if (this._vertical) {
                let x = this._topLeft.x + draggable.origin.x * draggable.width;
                draggable.moveTo(this._point.createNew(x, coordinate));
            } else {
                let y = this._topLeft.y + draggable.origin.y * draggable.height;
                draggable.moveTo(this._point.createNew(coordinate, y));
            }
            this._draggables.push(draggable);
        }
    }

    remove(draggable: DraggableObject) {
        let position = this._draggables.indexOf(draggable);
        if (position >= 0) {
            let current = draggable.currentPosition;
            while (position + 1 < this._draggables.length) {
                let next = this._draggables[position + 1].currentPosition;
                this._draggables[position + 1].moveTo(current);
                current = next;
                position++;
            }
            this._draggables.splice(this._draggables.indexOf(draggable), 1);
        }
    }

    pointerIsInside(): boolean {
        return (this._input.pointer.x >= this.topLeft.x && this._input.pointer.x <= this.bottomRight.x
            && this._input.pointer.y >= this.topLeft.y && this._input.pointer.y <= this.bottomRight.y);
    }

    /**
   * @description Draws visual version of the dropzone
   */
    enableDebug() {
        this._pxGame.addRectangle(this._x, this._y, this._width, this._height, 0x34eb4c, 1, 4, 0x34eb4c, 1);
    }
}

export default Dropzone;