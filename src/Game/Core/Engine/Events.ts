class Events {
    private _events: any;
    constructor(){
        this._events = {};
    }

    get events(){
        return this._events;
    }

    public eventNames(): string[]{
        return this._eventNames();
    }

    private _eventNames(): string[]{
        return Object.keys(this._events);
    }

    public addEvent(event: string){
        this._addEvent(event);
    }

    private _addEvent(event: string){
        if(this._eventNames().indexOf(event) == -1){
            this._events[event] = [];
        }
        else {
            console.warn('event %s already exists, so cannot be added', event);
        }
    }

    public removeEvent(event: string){
        this._removeEvent(event);
    }

    private _removeEvent(event: string){
        delete this._events[event];
    }

    public addListener(event: string, callback: Function){
       this._addListener(event, callback);
    }

    private _addListener(event: string, callback: Function, once: boolean = false){
        if(this.eventNames().indexOf(event) == -1){
            this._events[event] = [];
        }

        this._events[event].push([callback, once]);
    }

    public removeListener(event: string, callback: Function){
        this._removeListener(event, callback);

    }

    private _removeListener(event: string, callback: Function){
        if(this.eventNames().indexOf(event) !== -1){
            this._events[event].splice(callback, 1);
        }
        else {
            console.warn('event %s does not exist, cannot remove callback', event);
        }

    }

    public on(event: string, callback: Function){
        this._addListener(event, callback);
    }

    public once(event: string, callback: Function){
        this._addListener(event, callback, true);
    }

    public off(event: string, callback: Function){
        this._removeListener(event, callback);
    }

    

    public fire(event: string){
        this._trigger(event);
    }

    public trigger(event: string){
        this._trigger(event);
    }

    private _trigger(event: string){
        if(this.eventNames().indexOf(event) !== -1){
            let total = this._events[event].length-1;
            if(total >= 0){
                for(let x = total; x >= 0; x--){
                    this._events[event][x][0]();
                    if(this._events[event][x][1] == true){ // if 'once' is set to true, remove callback
                        this._events[event].splice(this._events[event].indexOf(this.events[event][x])); 
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
}

export default Events;