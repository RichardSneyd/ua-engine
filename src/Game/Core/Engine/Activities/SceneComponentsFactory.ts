import SceneEvents from "./SceneEvents";

/**
 * @description a factory for scene specific components (instance members, not singletons)
 */
class SceneComponentsFactory {
    private _events: SceneEvents;

    constructor(events: SceneEvents){
        this._events = events;
    }

    /**
     * @description returns a SceneEvents emitter. This works like the global EventEmitter in UAE.events, but it is local, and belongs to the Scene/Level. 
     */
    events(){
        return this._events.createNew();
    }
}

export default SceneComponentsFactory;