import * as p2 from 'p2';
import P2Factory from '../../../Services/P2/P2Factory';
import IGameObject from '../GameObjects/IGameObject';
import PhysicsActor from './PhysicsActor';

class PhysicsComponent {
    private _initialized: boolean = false;
    private _world: p2.World;
    private _p2Factory: P2Factory;
    private _actors: PhysicsActor[] = [];

    constructor(p2Factory: P2Factory){
        this._p2Factory = p2Factory;
    }

    start(){
        this._world = this._p2Factory.world();
        this._initialized = true;       
    }

    enable(go: IGameObject){
      //  this._p2Factory.box()
    }
}

export default PhysicsComponent;