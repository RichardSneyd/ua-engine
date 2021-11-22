import AbstractEventEmitter from "./AbstractEventEmitter";
import Debug from "./Debug";
import Loop from "./Loop";




/**
 *@description An EventEmitter which implements the pub/sub design pattern. Listen for events, emit them, pass data, and even optionally trigger a 'multiplayer' event
 * which will communicate with the parent window (if in an Iframe)
 */
class Events extends AbstractEventEmitter {

    constructor(loop: Loop) {
        super(loop);
        Debug.exposeGlobal(this, 'events');


        /*     //log events easily for testing
            // emit events easily for testing
            Debug.exposeGlobal(this._trigger, 'emit'); */
    }

    init() {
        super.init();
        this.addListener('pause', this.pause, this);
        this.addListener('resume', this.resume, this);

        // listen for multiplayer messages passed down to IFrame from parent
        this._listenMultiplayer();
    }

}

export default Events;