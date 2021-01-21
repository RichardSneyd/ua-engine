import AbstractEventEmitter from "./AbstractEventEmitter";
import Debug from "./Debug";

/**
 * An EventEmitter which implements the pub/sub design pattern. Listen for events, emit them, pass data, and even optionally trigger a 'multiplayer' event
 * which will communicate with the parent window (if in an Iframe)
 */
class Events extends AbstractEventEmitter{

    constructor() {
        super();
        this.addListener('pause', this.pause, this);
        this.addListener('resume', this.resume, this);
        
        // listen for multiplayer messages passed down to IFrame from parent
        this._listenMultiplayer();

    /*     //log events easily for testing
        Debug.exposeGlobal(this, 'events');
        // emit events easily for testing
        Debug.exposeGlobal(this._trigger, 'emit'); */
    }
}

export default Events;