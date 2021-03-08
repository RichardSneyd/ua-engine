import Point from "../../Geom/Point";
import InputManager from "../InputManager";
import DraggableObject from "./DraggableObject";

class Dropzone {
    private _point: Point;
    private _input: InputManager;
    private _name: string;
    private _topLeft: Point;
    private _bottomRight: Point;
    private _vertical: boolean | undefined;
    private _gap: number;
    private _draggables: DraggableObject[];

    constructor(point: Point, input: InputManager) {
        this._point = point;
        this._input = input;
        this._draggables = [];
    }

    init(name: string, zone: { x: number, y: number, width: number, height: number },
        vertical?: boolean, gap: number = 0): void {
        this._name = name;
        this._vertical = vertical;
        this._gap = gap;

        this._topLeft = this._point.createNew(zone.x, zone.y);
        this._bottomRight = this._point.createNew(zone.x + zone.width, zone.y + zone.height);
    }

    createNew(name: string, zone: { x: number, y: number, width: number, height: number },
        vertical?: boolean, gap: number = 0): Dropzone {
        let dropzone = this.createEmpty();
        dropzone.init(name, zone, vertical, gap);
        return dropzone;
    }

    createEmpty(): Dropzone {
        return new Dropzone(this._point, this._input);
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

    set topLeft(topLeft: Point) {
        this._topLeft = topLeft;
    }

    set bottomRight(bottomRight: Point) {
        this._bottomRight = bottomRight;
    }

    add(draggable: DraggableObject) {
        let x = this._topLeft.x + draggable.origin.x * draggable.width;
        let y = this._topLeft.y + draggable.origin.y * draggable.height;
        if (this._vertical === undefined) {
            draggable.moveTo(this._point.createNew(x, y));
        } else {
            let length = (this._vertical) ? draggable.height : draggable.width;
            let start = (this._vertical) ? this.topLeft.y : this.topLeft.x;
            let origin = (this._vertical) ? draggable.origin.y : draggable.origin.x;
            let draggablesIn = this._draggables.length;
            let coordinate = start + draggablesIn * (length + this._gap) + length * origin;

            if (this._vertical) {
                draggable.moveTo(this._point.createNew(x, coordinate));
            } else {
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
}

export default Dropzone;