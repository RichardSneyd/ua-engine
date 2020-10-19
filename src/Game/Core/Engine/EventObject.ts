class EventObject {
    private _multiplayer: boolean;
    private _listeners: any[];

    constructor(){
       
    }

    init(listeners: any[], multiplayer: boolean){
        this._multiplayer = multiplayer;
        this._listeners = listeners;
        return this;
    }

    createNew(listeners: any[], multiplayer: boolean){
        return this.createEmpty().init(listeners, multiplayer);
    }

    createEmpty(){
        return new EventObject();
    }

    get multiplayer(){
        return this._multiplayer;
    }
    
    set multiplayer(multiplayer: boolean){
        this._multiplayer = multiplayer;
    }

    get listeners(){
        return this._listeners;
    }

    set listeners(listeners: any[]) {
        this._listeners = listeners;
    }
}

export default EventObject;