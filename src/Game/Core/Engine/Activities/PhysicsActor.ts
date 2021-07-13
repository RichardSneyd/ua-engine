import IGameObject from "../GameObjects/IGameObject";
import * as p2 from 'p2';

class PhysicsActor {
    private _go: IGameObject;
    private _body: p2.Body;
    private _enabled: boolean = true;

    constructor() {

    }

    init(){

    }

    createNew(){
        return new PhysicsActor();
    }

    update(){
        if(this._enabled){
            this.synchronize();
        }
    }

    synchronize(){
        this.syncPos();
        this.syncAngle();
    }

    syncPos(){
        this._go.x = this._body.position[0];
        this._go.y = this._body.position[1];
    }

    syncAngle(){
        this._go.angle = this._body.angle;
    }

    destroy(){
     //   this._go = undefined;

    }

    
}

export default PhysicsActor;