import RiseObserver from './RISE/RiseObserver'

class MultiplayerHandler implements RiseObserver {
    protected _observer: RiseObserver;

    constructor(){
        this._observer = (<any> window).riseObserver; 
    }

    /**
     * @description set the max number of listeners for any event on this emitter
     * @param num max number of listeners 
     */
    public setMaxListeners(num: number): void {
        this._observer.setMaxListeners(num);
    }

    /**
     * @description remove the specified listener for this event
     * @param event the event to remove listener from
     * @param listener the listener to remove
     */
    public removeListener(event: string, listener: Function): void {
        this._observer.removeListener(event, listener);
    }

    /**
     * @description remove all listeners from the specified event
     * @param event the event to remove all listeners from
     */
    public removeAllListener(event: string): void {
        this._observer.removeAllListener(event);
    }
    
    /**
     * @description emit event
     * @param event the event to emit
     */
    public emit(event: string): void {
        this._observer.emit(event);
    }
    
    /**
     * @description add a listener to an event
     * @param event the event to listen for
     * @param listener the callback function
     */
    public on(event: string, listener: Function) : void {
        this._observer.on(event, listener);
    }
    
     /**
     * @description adds a listener, but it will only execute once
     * @param event the event to listen for
     * @param listener the callback function
     */
    public once(event: string, listener: Function): void {
        this._observer.on(event, listener);
    }
    
    /**
     * @description returns an array of all listeners for the specified event
     * @param event the event to return listeners for
     */
    public listeners(event: string): any{
        return this._observer.listeners(event);
    }

}

export default MultiplayerHandler;