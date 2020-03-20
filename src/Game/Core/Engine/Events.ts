class Events {
    private _events: any;
    private _timers: any;
    private _time: any;
    private _lastTime: any;
    private _delta: number;
    private _paused: boolean;
    private _timer: any; // ID of the timer (integer), passed to clearInterval for deletion
    private _step: number;

    constructor() {
        this._events = {};
        this._timers = [];
        this._paused = false;
        this._time = new Date().getMilliseconds;
        this._lastTime = this._time;
        this._delta = this._lastTime - 1;
        this._step = 1;
        this._startTimer();
    }

    private _startTimer() {
        this._timer = setInterval(this._ticker, this._step);
    }

    get events() {
        return this._events;
    }

    /**
     * @description returns an array of all timers
     */
    get timers(){
        return this._timers;
    }

    /**
     * @description is the timer system paused?
     */
    get paused(): boolean{
        return this._paused;
    }


    public eventNames(): string[] {
        return this._eventNames();
    }

    private _eventNames(): string[] {
        return Object.keys(this._events);
    }

    public addEvent(event: string) {
        this._addEvent(event);
    }

    private _addEvent(event: string) {
        if (this._eventNames().indexOf(event) == -1) {
            this._events[event] = [];
        }
        else {
            console.warn('event %s already exists, so cannot be added', event);
        }
    }

    public removeEvent(event: string) {
        this._removeEvent(event);
    }

    private _removeEvent(event: string) {
        delete this._events[event];
    }

    public addListener(event: string, callback: Function, context: any) {
        this._addListener(event, callback, context);
    }

    private _addListener(event: string, callback: Function, context: any, once: boolean = false) {
        if (this.eventNames().indexOf(event) == -1) {
            this._events[event] = [];
        }

        this._events[event].push([callback, context, once]);
    }

    public removeListener(event: string, callback: Function) {
        this._removeListener(event, callback);

    }

    private _removeListener(event: string, callback: Function) {
        if (this.eventNames().indexOf(event) !== -1) {
            this._events[event].splice(callback, 1);
        }
        else {
            console.warn('event %s does not exist, cannot remove callback', event);
        }
    }

    public on(event: string, callback: Function, context: any) {
        this._addListener(event, callback, context);
    }

    public once(event: string, callback: Function, context: any) {
        this._addListener(event, callback, context, true);
    }

    public off(event: string, callback: Function) {
        this._removeListener(event, callback);
    }

    public fire(event: string) {
        this._trigger(event);
    }

    public trigger(event: string) {
        this._trigger(event);
    }

    private _trigger(event: string) {
        if (this.eventNames().indexOf(event) !== -1) {
            let total = this._events[event].length - 1;
            if (total >= 0) {
                for (let x = total; x >= 0; x--) {
                    let callback =  this._events[event][x][0], context = this._events[event][x][1];
                    let once = this._events[event][x][2];
                    callback(context);
                    if (once == true) { // if 'once' is set to true, remove callback
                        let i = this._events[event].indexOf(this.events[event][x]);
                        this._events[event].splice(i);
                    }
                }
            }
            else {
                console.warn('event %s exists, but has no callbacks', event);
            }
        }
        else {
            console.warn('event %s does not exist, so cannot be triggered', event);
        }
    }

    /**
     * @description creates a timed callback, which is pausable via events.pause and events.resume. Optional repeat is 0 by default, 
     * meaning method executes once. Setting this to -1 will repeat continuosly.
     * @param delay the amound of (unpaused) milliseconds to wait before execution. 
     * @param callback the function to call
     * @param context the context to call it in
     * @param repeat should repeat? 0 for no. -1 for infinity, 3 for 3 repeats, 4 for 4 etc...
     */
    timer(delay: number, callback: Function, context: any, repeat: number = 0): any {
        this._addTimer(delay, callback, context, repeat);
    }

    private _addTimer(delay: number, callback: Function, context: any, repeat: number = 0): any {
        let timer = { delay: delay, remaining: delay, callback: callback, context: context, repeat: repeat }
        this._timers.push(timer);

      //  return timer;
    }

    /**
     * @description find and remove a timer object based via the callback it contains
     * @param callback the callback of the timer object to be removed
     */
    removeTimer(callback: Function) {
        let timer = this.getTimer(callback);
        if (timer !== null) {
            this._timers.splice(timer);
        }
    }

    clearTimers(){
        this._timers = [];
    }

    /**
     * @description find the timer object from the _timers array which contains the specified callback mathod 
     * @param callback the callback of the timer object to be retrieved
     */
    getTimer(callback: Function): any {
        for (let x = 0; x < this._timers.length; x++) {
            let timer = this._timers[x];
            if (timer.callback == callback) {
                return timer;
            }
        }

        console.log('no such timer found');
        return null;
    }

    private _ticker() {
        this._lastTime = this._time;
        this._time = new Date().getMilliseconds;
        this._delta = this._time - this._lastTime;
        this._updateTimers();
    }

    /**
     * @description suspends the ticker for all timer objects
     */
    pause() {
        this._paused = true;
        clearInterval(this._timer);
    }

    /**
     * @description resumes the ticker for all timer objects
     */
    resume() {
        this._paused = false;
        this._time = new Date().getMilliseconds() - 1;
        this._startTimer();
    }

    private _updateTimers() {
        for (let x = this._timers.length - 1; x >= 0; x--) {
            let timer = this._timers[x];
            timer.remaining -= this._delta;
            if (timer.remaining <= 0) {
                timer.callback(timer.context);
                if (timer.repeat > 0 || timer.repeat == -1) {
                    timer.remaining = timer.delay;
                    if (timer.repeat > 0) {
                        timer.repeat--;
                    }
                }
                else {
                    this._timers.splice(this._timers.indexOf(timer));
                }
            }

        }
    }

}

// extend events to record context, context
// delay 


// Rudra
// pause using events
// scaling 

// level transitions 

export default Events;