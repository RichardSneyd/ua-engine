class Events {
    private _events: any;
    private _timers: any;
    private _time: number;
    private _lastTime: number;
    private _delta: number;
    private _paused: boolean;
    private _timer: any; // ID of the timer (integer), passed to clearInterval for deletion
    private _step: number;

    constructor() {
        this._events = {};
        this._timers = [];
        this._paused = false;
        this._step = 50; // cannot execute every millisecond, browser isn't fast enough. 10 ticks per second should be adequate.
        this._time = new Date().getTime();
        this._lastTime = this._time - this._step;
        this._delta = this._time - this._lastTime;
        this._startTimer();
        
    }

    private _startTimer() {
       // let _this = this;
       this._time = new Date().getTime();
        this._timer = setInterval(()=>{
            this._ticker();
        }, this._step);
     //   console.log('_startTimer called, to call _ticker every %s, _timer set to setInterval ID', this._step);
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

    public fire(event: string, data?: any) {
        this._trigger(event, data);
    }

    public trigger(event: string, data?: any) {
        this._trigger(event, data);
    }

    private _trigger(event: string, data: any = null) {
        if (this.eventNames().indexOf(event) !== -1) {
            let total = this._events[event].length - 1;
            if (total >= 0) {
                let objs = this.events[event];
             //   console.log('callbacks for %s: ', event, objs);
                for (let x = total; x >= 0; x--) {
                    let obj = objs[x];
                    let callback =  obj[0], context = obj[1];
                    let once = obj[2];
               //     console.log('about to attempt callback with context: ', context);

                    callback.bind(context)(data);
                    if (once == true) { // if 'once' is set to true, remove callback
                        let i = this._events[event].indexOf(this.events[event][x]);
                        this._events[event].splice(i, 1);
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
     * @param callback the function to call
     * @param delay the amound of (unpaused) milliseconds to wait before execution. 
     * @param context the context to call it in
     * @param repeat should repeat? 0 for no. -1 for infinity, 3 for 3 repeats, 4 for 4 etc...
     */
    timer(callback: Function, delay: number, context: any, repeat: number = 0): any {
        this._addTimer(callback, delay, context, repeat);
    }

    private _addTimer(callback: Function, delay: number, context: any, repeat: number = 0): any {
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
        this._removeTimer(timer);
    }

    _removeTimer(timer: any){
        if (timer !== null) {
            this._timers.splice(timer, 1);
        }
        else {
            console.warn('timer to remove is null: ', timer);
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

        console.warn('no timer found for: ', callback);
        return null;
    }

    private _ticker() {
      //  console.log('made it to _ticker, this is: ', this);
        this._lastTime = this._time;
        this._time = new Date().getTime();
        this._delta = this._time - this._lastTime;
      //  console.warn('time is %s, lastTime is %s, delta is: ', this._time, this._lastTime, this._delta);
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
        this._startTimer();
    }

    private _updateTimers() {
    //    console.log('made it to _updateTimers, timers: ', this._timers);
    //    console.log('length: ', this._timers.length);
        
        for (let x = this._timers.length-1; x >= 0; x--) {
            let timer = this._timers[x];
        //    console.log('handling timer at index %s: ', x, timer);
            timer.remaining -= this._delta;
            if (timer.remaining <= 0) {
                if (timer.repeat > 0 || timer.repeat === -1) {
                //    console.log('repeat is %s for timer: ', timer.repeat, timer);
                    timer.remaining = timer.delay;
                    if (timer.repeat > 0) {
                        timer.repeat--;
                    }
                }
                else {
                ///<reference path= '' />    console.warn('removing timer from list: ', timer);
                    this._removeTimer(this._timers.indexOf(timer));
                }
                timer.callback.bind(timer.context)();
            }

        }
    }

}

export default Events;