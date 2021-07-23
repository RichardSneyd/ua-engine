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

    get go(){
        return this._go;
    }

    get body(){
        return this._body;
    }

    constructor(physicsFactory: PhysicsFactory) {
        this._physicsFactory = physicsFactory;
    }

    init(go: IGameObject){
        this._go = go;
        this._body = this._physicsFactory.body();
        this._body.addShape(this._physicsFactory.box(this._go.width, this._go.height));
        this._enabled = true;
        return this;
    }

    createNew(go: IGameObject){
        return this.createEmpty().init(go);
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