import IGameObject from "./GameObjects/IGameObject";
import * as p2 from 'p2';
import P2Factory from "../../Services/P2/P2Factory";
import Debug from "./Debug";
import PhysicsFactory from "./Activities/PhysicsFactory";

class PhysicsActor {
    private _go: IGameObject;
    private _body: p2.Body;
    private _enabled: boolean = true;
    private _physicsFactory: PhysicsFactory;

    get go(): IGameObject{
        return this._go;
    }

    get body(): p2.Body {
        return this._body;
    }

    constructor(physicsFactory: PhysicsFactory) {
        this._physicsFactory = physicsFactory;
    }

    init(go: IGameObject, fixedX: boolean = false, fixedY: boolean = false, fixedRotation: boolean = false){
        this._go = go;
        this._body = this._physicsFactory.body({x: go.x, y: go.y}, 5, fixedX, fixedY, fixedRotation);
        this._body.addShape(this._physicsFactory.box(this._go.width, this._go.height));
        this._enabled = true;
        return this;
    }

    createNew(go: IGameObject, fixedX: boolean = false, fixedY: boolean = false, fixedRotation: boolean = false){
        return this.createEmpty().init(go, fixedX, fixedY, fixedRotation);
    }

    createEmpty(){
        return new PhysicsActor(this._physicsFactory);
    }

    update(){
        if(this._enabled){
            this.synchronize();
        }
    }

    synchronize(){
        Debug.info('body x: ', this._body.position[0], ', body y: ', this._body.position[1], ', angle: ', this._body.angle);
        this.syncPos();
        this.syncAngle();
    }

    syncPos(){
        this._go.x = this._body.interpolatedPosition[0];
        this._go.y = this._body.interpolatedPosition[1];
      //  this.body.
    }

    syncAngle(){
        this._go.angle = this._body.interpolatedAngle;
    }

    destroy(){
     //   this._go = undefined;

    }

    
}

export default PhysicsActor;