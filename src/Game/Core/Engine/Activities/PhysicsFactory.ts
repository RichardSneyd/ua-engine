import * as p2 from "p2";
import P2Factory from "../../../Services/P2/P2Factory";
import IPoint from "../../Geom/IPoint";

class PhysicsFactory {
    private _p2Factory: P2Factory;
    private _world: p2.World;

    constructor(p2Factory: P2Factory){
        this._p2Factory = p2Factory;
    }

    get world(){
        return this._world;
    }

    initWorld(gravity: IPoint = {x: 0, y: 1}) {
        if (!this._world) this._world = this._p2Factory.world(gravity);
        return this._world;
        // this.clearBodies();
    }

    clearWorld() {
        /* for (let actor of this._actors) {
            this._world.removeBody(actor.body);
        } */
        this._world.clear();
    }

    body(position: IPoint = {x: 0, y: 0}, mass: number = 5){
        let b = this._p2Factory.body(position, mass);
        this._world.addBody(b);
        return b;
    }


    circle(radius: 10){
        return this._p2Factory.circle(radius);
    }

    box(width: number, height: number){
        return this._p2Factory.box(width, height);
    }

    plane(){
        return this._p2Factory.plane();
    } 
}

export default PhysicsFactory;