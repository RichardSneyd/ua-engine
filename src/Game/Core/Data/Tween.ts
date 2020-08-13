import * as TWEEN from '@tweenjs/tween.js';

class Tween {
  private _name: string; _easing: string; _object: any; _data: TWEEN.Tween | null;
  private _paused: boolean; _pausedTime: number; _time: number; _pauseDiff: number;
  private _onCompleteListeners: Function[];
  private _onUpdateListeners: Function[];
  private _onRepeatListeners: Function[];
  private _onStartListeners: Function[];

  constructor() {
    this._name = '';
    this._easing = '';
    this._object = null;
    this._data = null;
    this._paused = false;
    this._pausedTime = 0;
    this._time = 0;
    this._pauseDiff = 0;
    this._onCompleteListeners = [];
    this._onRepeatListeners = [];
    this._onStartListeners = [];
    this._onUpdateListeners = [];
  }

  get name(): string {
    return this._name;
  }

  get stop(): Function {
    if(this._data){
      return this._data.stop;
    }
    console.error('cannot return stop property for uninitialized tween object');
    return ()=>{}
  }

  get end(): Function {
    if(this._data){
      return this._data.end;
    }
    console.error('cannot return end property for uninitialized tween object');
    return ()=>{}
  }

  get isPaused(): boolean {
    if(this._data){
      return this._data.isPaused();
    }
    console.error('cannot return isPaused for uninitialized tween object');
    return false;
  }

  get onComplete(){
    return this._onComplete;
  }

  get onStart(){
   return this._onStart;
  }

  get onRepeat(){
    return this._onRepeat;
  }

  get onUpdate(){
    return this._onUpdate;
  }

  private _onComplete(callback: Function): Tween{
    this._onCompleteListeners[1] = callback;
    return this;
  }

  private _onUpdate(callback: Function): Tween{
    this._onUpdateListeners[1] = callback;
    return this;
  }

  private _onStart(callback: Function): Tween{
    this._onStartListeners[0] = callback;
    return this;
  }

  private _onRepeat(callback: Function): Tween{
    this._onRepeatListeners[0] = callback;
    return this;
  }

  private _callOnComplete(){
    this._callAll(this._onCompleteListeners);
    return this;
  }
  
  private _callOnRepeat(){
    this._callAll(this._onRepeatListeners);
    return this;
  }
  
  private _callOnStart(){
    this._callAll(this._onStartListeners);
    return this;
  }
  
  private _callOnUpdate(){
    this._callAll(this._onUpdateListeners);
  }

  private _callAll(callbacks: Function[]){
    for(let x = 0; x < callbacks.length; x++){
      callbacks[x]();
    }
  }

  init(name: string, easing: string, object: any) {
    this._name = name;
    this._easing = easing;
    this._object = object;

    this._data = new TWEEN.Tween(this._object);
    this._data.onComplete(()=>{this._callOnComplete()});
    this._data.onRepeat(()=>{this._callOnRepeat()});
    this._data.onStart(()=>{this._callOnStart()});
    this._data.onUpdate(()=>{this._callOnUpdate()});

    if (this._easing.split('.').length != 2) console.error("invalid easing: %s", easing);
    this.reset();
  }

  remove(){
    if(this._data){
      TWEEN.remove(this._data);
      this._data = null;
    }
  }

  to(toObject: any, time: number, updateFunction: Function = ()=>{}): Tween {
    this.freeze();
    if (this._data != null) {
      let easing = this._easing.split('.')[0];
      let inOut = this._easing.split('.')[1];

      this._paused = false;
      this._data.to(toObject, time)
      .easing((<any>TWEEN).Easing[easing][inOut]).start();
      
      this._onUpdateListeners[0] = ()=>{updateFunction()};
      this._onCompleteListeners[0] = ()=>{this.freeze()};

    } else {
      console.error("no animation data exists");
    }
    return this;
  }

  createNew(): Tween {
    return new Tween();
  }

  update(time: number) {
    if (this._data != null) {
      if (!this._paused) {
        this._data.update(time - this._pauseDiff);
      }
    }

    this._time = time;
  }

  pause(): Tween{
    if (this._data != null) {
      this._paused = true;
      this._pausedTime = this._time;
    } else {
      console.warn("Tween doesn't exist to be paused!");
    }

    return this;
  }

  freeze(): Tween{
    if (this._data != null) {
      this._paused = true;
    }
    
    return this;
  }

  reset(): Tween{
    if (this._data != null) {
      this._paused = false;
    }

    return this;
  }

  resume(): Tween {
    if (this._data != null) {
      this._paused = false;
      let diff = this._time - this._pausedTime;
      this._pauseDiff = this._pauseDiff + diff;
    } else {
      console.warn("Tween doesn't exist to be resumed!");
    }
    return this;
  }

}

export default Tween;