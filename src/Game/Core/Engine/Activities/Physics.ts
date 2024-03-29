import * as p2 from 'p2';
import P2Factory from '../../../Services/P2/P2Factory';
import IPoint from '../../Geom/IPoint';
import Debug from '../Debug';
import Events from '../Events';
import IGameObject from '../GameObjects/IGameObject';
import Loop from '../Loop';
import PhysicsActor from '../PhysicsActor';
import World from '../World';
import PhysicsFactory from './PhysicsFactory';


class Physics {
    private _initialized: boolean = false;
    private _actors: PhysicsActor[] = [];
    private _actorFact: PhysicsActor;
    private _events: Events;
    private _physicsFactory: PhysicsFactory;
    private _fixedTimeStep: number = 1 / 60; // seconds
    private _maxSubSteps: number = 10; // Max sub steps to catch up with the wall clock
    private _lastTime: number = 0;
    private _loop: Loop;

    get world(){
        return this._physicsFactory.world;
    }

    constructor(actorFact: PhysicsActor, events: Events, physicsFactory: PhysicsFactory, loop: Loop) {
        this._actorFact = actorFact; this._events = events; this._physicsFactory = physicsFactory; this._loop = loop;
        this._events.on('removeBody', this.removeBodyFor, this);
        //  this._loop.addFunction(this.synchAll, this);
        this.start();
    }

    start() {
        if (!this._initialized) {
            this.initWorld();
            this._initialized = true;
            this.initLoop();
        }
    }

    enable(go: IGameObject, fixedX: boolean = false, fixedY: boolean = false, fixedRotation: boolean = false): PhysicsActor {
        //  this._p2Factory.box()
        let actor = this._actorFact.createNew(go, fixedX, fixedY, fixedRotation);
        this._actors.push(actor);
        return actor;
    }

    initLoop() {
        /* this._events.timer(() => {
            this.step();
        }, 100, this, -1); */
        this._loop.addFunction(this.step, this);
    }

    step(time: number) {
       // let time = new Date().getTime();
        //this._physicsFactory.world.step(100);
        // Compute elapsed time since last render frame
        let deltaTime = this._lastTime ? (time - this._lastTime) : 0;
        this._lastTime = time;

        // Move bodies forward in time
        this._physicsFactory.world.step(this._fixedTimeStep, deltaTime, this._maxSubSteps);

        for (let actor of this._actors) {
          //  Debug.info('synch actor at ', new Date().toTimeString());
            actor.synchronize();
        }   
    }

    removeBodyFor(data: { go: IGameObject }) {
        let actor = this.findByGO(data.go);
        if (actor !== null) this.disable(actor);
    }

    findByGO(go: IGameObject): PhysicsActor | null {
        // let body: p2.Body;
        for (let actor of this._actors) if (actor.go == go) return actor;
        return null;
    }

    disable(actor: PhysicsActor) {
        this._actors.splice(this._actors.indexOf(actor), 1);
    }

    initWorld(gravity: IPoint = { x: 0, y: 1 }) {
        this._physicsFactory.initWorld(gravity);
        // this.clearBodies();
    }

    pause(){
      //  this.world.
    }

    clearWorld() {
        /* for (let actor of this._actors) {
            this._world.removeBody(actor.body);
        } */
        this._physicsFactory.clearWorld();
        this._actors = [];
    }

    get factory() {
        return this._physicsFactory;
    }

}

export default Physics;