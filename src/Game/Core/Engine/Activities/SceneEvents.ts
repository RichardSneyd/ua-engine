import AbstractEventEmitter from "../AbstractEventEmitter";
import Debug from "../Debug";
import Events from "../Events";

// this class is pretty much identical to Events, except that Events is marked as a singleton, and is for global events. This is not a singleton, but an instance member, and is 
// garbage collected along with the rest of the level on shutdown. Both inherit from the same super class.
class SceneEvents extends AbstractEventEmitter {
    private _globalEvents: Events; // the global events object singleton (to listen for pause and resume, which are global events)

    constructor(events: Events){
        super();
        this._globalEvents = events;
     //   Debug.info('scene events instantiated');

        this._globalEvents.addListener('pause', this.pause, this);
        this._globalEvents.addListener('resume', this.resume, this);
        this._globalEvents.on('shutdown', this.shutdown, this);
    }

    get global(){
        return this._globalEvents;
    }

    createNew(){
        return new SceneEvents(this._globalEvents);
    }

    shutdown(){
        this._globalEvents.off('pause', this.pause, this);
        this._globalEvents.off('resume', this.resume, this);
    }
}

export default SceneEvents;