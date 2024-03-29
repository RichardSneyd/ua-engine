import Debug from "./Debug";
import Loop from "./Loop";


/**
 *@description An EventEmitter which implements the pub/sub design pattern. Listen for events, emit them, pass data, and even optionally trigger a 'multiplayer' event
 * which will communicate with the parent window (if in an Iframe)
 */

abstract class AbstractEventEmitter {
    protected _events: any;
    protected _timers: any;
  //  protected _time: number;
  //  protected _lastTime: number;
 //   protected _delta: number;
    protected _paused: boolean;
   // protected _timer: any; // ID of the timer (integer), passed to clearInterval for deletion
    protected _step: number;
    protected _loop: Loop;

    constructor(loop: Loop) {
        this._events = {};
        this._timers = [];
        this._paused = false;
        this._step = 25; // cannot execute every millisecond, browser isn't fast enough. 40 ticks per second should be adequate.
        this._loop = loop;
      //  this.init();

    }

    get ticker(){
        return this._ticker;
    }
    
    init(){
        this._loop.addFunction(this._ticker, this);
      //  this._time = new Date().getTime();
      //  this._lastTime = this._time - this._step;
     //   this._delta = this._time - this._lastTime;
      //  this._startTimer();
    
    /*     //log events easily for testing
        Debug.exposeGlobal(this, 'events');
        // emit events easily for testing
        Debug.exposeGlobal(this._trigger, 'emit'); */

    }

    

    get events() {
        return this._events;
    }

    /**
     * @description Returns an array of all timers
     */
    get timers() {
        return this._timers;
    }

    /**
     * @description Is the timer system paused?
     */
    get paused(): boolean {
        return this._paused;
    }

    // listen for multiplayer event messages related from RISE platform parent window
    protected _listenMultiplayer() {
        let _this = this;
        window.addEventListener('message', function (evt) {
            var data = evt.data;
            if (data && data.behavior) {
                _this._requestCall(data.behavior, data.data);
            }
        });
    }

    /**
     * @description repackages the event for posting to parent window
     * @param event the event name
     * @param data data to package with event
     */
    protected _multiplayerCall(event: string, data?: any) {
        data = { behavior: event, data: data }
        this._postToRise(data);
    }

    /**
     * 
     * @param data post a message to the parent window of iFrame, for RISE API to catch and share. 'behavior' property of data should be 
     * event name. 
     */
    protected _postToRise(data: any) {
        if (data && data.behavior) {
            Debug.info('sending data:', data);
            window.parent.postMessage && window.parent.postMessage(data, '*');
            return;
        }
        Debug.warn('data not valid for transmition: ', data);
    }

    /**
     * @description Returns a string array of the names of all registered events
     */
    public eventNames(): string[] {
        return this._eventNames();
    }

    /**
     * 
     * @param event adds an event to the array of registered events
     */
    public addEvent(event: string) {
        this._addEvent(event);
    }

    /**
     * 
     * @param event remove an event from the array of registered events
     */
    public removeEvent(event: string) {
        this._removeEvent(event);
    }

    /**
     * @description add a listener to an event. 
     * @param event name of the event. If it doesn't exist, it will be created.
     * @param callback the callback function to fire when the event emits.
     * @param context the context for the callback
     */
    public addListener(event: string, callback: Function, context: any) {
        this._addListener(event, callback, context);
    }

    /**
     * @description Remove a listener (callback) from an event
     * @param event the event
     * @param callback the callback to remove
     */
    public removeListener(event: string, callback: Function, context: any) {
        this._removeListener(event, callback, context);

    }

    /**
     * @description Add a listener to an event. 
     * @param event name of the event. If it doesn't exist, it will be created.
     * @param callback the callback function to fire when the event emits.
     * @param context the context for the callback
     */
    public on(event: string, callback: Function, context: any) {
        this._addListener(event, callback, context);
    }

    /**
    * @description Add a listener to an event, to be called only one time, then removed from the list of callbacks.
    * @param event name of the event. If it doesn't exist, it will be created.
    * @param callback the callback function to fire when the event emits.
    * @param context the context for the callback
    */
    public once(event: string, callback: Function, context: any) {
        this._addListener(event, callback, context, true);
    }

    /**
    * @description Remove a listener (callback) from an event
    * @param event the event
    * @param callback the callback to remove
    */
    public off(event: string, callback: Function, context: any) {
        this._removeListener(event, callback, context);
    }

    /**
     * @description Emit an event
     * @param event the event to emit
     * @param data (optional) data object to pass to the callbacks for the event
     */
    public fire(event: string, data: any = {}, multiplayer: boolean = false) {
        this.callLocal(event, data, multiplayer);
    }

    /**
    * @description Emit an event
    * @param event the event to emit
    * @param data (optional) data object to pass to the callbacks for the event
    */
    public emit(event: string, data: any = {}, multiplayer: boolean = false) {
        this.callLocal(event, data, multiplayer);
    }

    // only for handling call requests from the server/parent window
    protected _requestCall(event: string, data: any = {}) {
        // todo - implement logic to avoid double calls from RISE platform etc
        Debug.info(event, data);
       // debugger;
        this._trigger(event, data);
    }

    /**
    * @description Emit an event
    * @param event the event to emit
    * @param data (optional) data object to pass to the callbacks for the event
    */
    public trigger(event: string, data: any = {}, multiplayer: boolean = false) {
        this.callLocal(event, data, multiplayer);
    }

    public callLocal(event: string, data: any = {}, multiplayer: boolean = false) {
        this._trigger(event, data);
        if(multiplayer) this._multiplayerCall(event, data);
    }

    /**
     * @description Creates a timed callback, which is pausable via events.pause and events.resume. Optional repeat is 0 by default, 
     * meaning method executes once. Setting this to -1 will repeat continuosly.
     * @param callback the function to call after the delay has elapsed.
     * @param delay the amound of (unpaused) milliseconds to wait before execution. 
     * @param context the context to call it in
     * @param repeat should repeat? 0 for no. -1 for infinity, 3 for 3 repeats, 4 for 4 etc...
     */
    public timer(callback: Function, delay: number, context: any, repeat: number = 0): any {
        this._addTimer(callback, delay, context, repeat);
    }

    /**
     * @description Find and remove a timer object based via the callback it contains
     * @param callback the callback of the timer object to be removed
     */
    public removeTimer(callback: Function) {
        let timer = this.getTimer(callback);
        Debug.info('removing timer ', timer);
        if(timer !== null) this._removeTimer(timer);
        else Debug.warn('cannot remove null timer ', timer);
    }

    protected _eventNames(): string[] {
        return Object.keys(this._events);
    }

    protected _trigger(event: string, data: any = null) {
        // Debug.info('triggering %s with data %s', event, data);
        if (this.eventNames().indexOf(event) !== -1) {
            let total = this._events[event].length - 1;
            if (total >= 0) {
                let objs = this.events[event];
                // Debug.info('callbacks for %s: ', event, objs);
                for (let x = total; x >= 0; x--) {
                    let obj = objs[x];

              //      Debug.info('about to attempt callback for %s with context: ', event, obj.context);

                    obj.callback.bind(obj.context)(data);
                    if (obj.once == true) { // if 'once' is set to true, remove callback
                        let i = this._events[event].indexOf(this.events[event][x]);
                        this._events[event].splice(i, 1);
                    }
                }
            }
            else {
                Debug.warn('event %s exists, but has no callbacks', event);
            }
        }
        else {
            Debug.warn('event %s does not exist, so cannot be triggered', event);
        }
    }

    protected _addListener(event: string, callback: Function, context: any, once: boolean = false) {
        if (this.eventNames().indexOf(event) == -1) {
            this._events[event] = [];
        }

        this._events[event].push({ callback: callback, context: context, once: once });
    }

    protected _removeListener(eventName: string, callback: Function, context: any) {
        //  Debug.info('requesting remove listener from %s: ', eventName, callback);
        //    debugger;
        if (this.eventNames().indexOf(eventName) !== -1) {
            let listener = this._findListener(eventName, callback, context);
            let event = this._events[eventName];
            //  Debug.info('event exists: ', event);
            // let index = event.indexOf(callback);
            if (listener) {
                //   Debug.info('found a match!! now REMOVING IT with splice..');
                event.splice(event.indexOf(listener), 1);
                Debug.info("%c removed listener for %s with context of %s", Debug.STYLES.GOOD, eventName, context);
                return;
            }
            else {
                Debug.info("cannot remove listener for %s with context of %s because it doesn't exist", eventName, context);
            }
        }
        else {
            Debug.warn('event %s does not exist, cannot remove callback', eventName);
        }
    }

    protected _findListener(eventName: string, callback: Function, context: any): { callback: Function, context: any, once: boolean } | undefined {
        let event = this._events[eventName];
        //  Debug.info('looking for callback %s of event %s for object: ', callback, event, context);
        for (let x = 0; x < event.length; x++) {
            //   Debug.warn('checking if it matches: ', event[x]);
            if (event[x].callback === callback && event[x].context === context) {
                //   Debug.info('it matches!!');
                // debugger;
                return event[x];
            }
        }

        Debug.warn("cannot find a listener for %s with context of %s that looks like: %s", eventName, context, callback);
      //  Debug.info(`${eventName} listeners: `, event);
        // debugger;
    }

    protected _removeEvent(event: string) {
        delete this._events[event];
    }

    protected _removeTimer(timer: any) {
        if (timer !== null && this._timers.indexOf(timer) !== -1) {
            this._timers.splice(this._timers.indexOf(timer), 1);
        }
        else {
            Debug.warn('timer to remove is null: ', timer);
        }
    }
    /**
     * @description Removes the array of timers
     */
    public clearTimers() {
        this._timers = [];
    }

    /**
     * @description Find the timer object from the _timers array which contains the specified callback mathod 
     * @param callback the callback of the timer object to be retrieved
     */
    public getTimer(callback: Function): object | null {
        for (let x = 0; x < this._timers.length; x++) {
            let timer = this._timers[x];
            if (timer.callback === callback) { // === is a perfect comparison, checking if same instance, instead of just 'value'
                return timer;
            }
        }

        Debug.warn('no timer found for: ', callback);
        return null;
    }

    /**
     * @description Suspends the ticker for all timer objects
     */
    public pause() {
        this._paused = true;
      //  clearInterval(this._timer);
    }

    /**
     * @description Resumes the ticker for all timer objects
     */
    public resume() {
        this._paused = false;
      //  this._startTimer();
    }

    protected _addTimer(callback: Function, delay: number, context: any, repeat: number = 0): any {
        let timer = { delay: delay, remaining: delay, callback: callback, context: context, repeat: repeat }
        this._timers.push(timer);

        //  return timer;
    }

    protected _addEvent(event: string) {
        if (this._eventNames().indexOf(event) == -1) {
            this._events[event] = [];
        }
        else {
            Debug.warn('event %s already exists, so cannot be added', event);
        }
    }

    protected _ticker(time: number) {
      //  this._lastTime = this._time;
      //  this._time = new Date().getTime();
      //  this._delta = this._time - this._lastTime;
        this._updateTimers();
    }

    protected _updateTimers() {
     //   Debug.info('offsetTime: ', this._loop.offsetTime, 'lastTime: ', this._loop.lastTime, 'delta: ', this._loop.delta);
     //   let lastLength = this._timers.length;
        for (let x = this._timers.length - 1; x >= 0; x--) {
            // an attempt to compensate if an item as been removed asynchronously during execution of loop (not miss anything) - experimental
          /*   if(lastLength !== this._timers.length) {
                x = this._timers.length - 1;
                lastLength = this._timers.length;
            } */
            let timer = this._timers[x];
            timer.remaining -= this._loop.delta;
            if (timer.remaining <= 0) {
                timer.callback.bind(timer.context)(); // call BEFORE removing, or it breaks the loop in a painful, errorless way
                if (timer.repeat > 0 || timer.repeat === -1) {
                    timer.remaining = timer.delay;
                    if (timer.repeat > 0) {
                        timer.repeat--;
                    }
                }
                else {
                    this._removeTimer(timer);
                 //   lastLength = this._timers.length;
                }
            }
            
        }
    }

 /*    protected _startTimer() {
        // let _this = this;
        this._time = new Date().getTime();
        this._timer = setInterval(() => {
            this._ticker();
        }, this._step);
    } */

}

export default AbstractEventEmitter;