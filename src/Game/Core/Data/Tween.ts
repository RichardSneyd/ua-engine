import * as TWEEN from '@tweenjs/tween.js';

class Tween {
  private _name: string; _easing: string; _object: any; _data: TWEEN.Tween | null;
  private _paused: boolean; _pausedTime: number; _time: number; _pauseDiff: number;

  constructor() {
    this._name = '';
    this._easing = '';
    this._object = null;
    this._data = null;
    this._paused = false;
    this._pausedTime = 0;
    this._time = 0;
    this._pauseDiff = 0;
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

  get isPaused(): boolean {
    if(this._data){
      return this._data.isPaused();
    }
    console.error('cannot return isPaused for uninitialized tween object');
    return false;
  }

  get onComplete(){
    if(this._data){
      return this._data.onComplete;
    }
    return (callback: Function)=>{console.warn('no onComplete function, dummy returned')}
  }

  get onStop(){
    if(this._data){
      return this._data.onStop;
    }
    return (callback: Function)=>{console.warn('no onStop function, dummy returned')}
  }

  get onStart(){
    if(this._data){
      return this._data.onStart;
    }
    return (callback: Function)=>{console.warn('no onStart function, dummy returned')}
  }

  get onUpdate(){
    if(this._data){
      return this._data.onUpdate;
    }
    return (callback: Function)=>{console.warn('no onUpdate function, dummy returned')}
  }

  init(name: string, easing: string, object: any) {
    this._name = name;
    this._easing = easing;
    this._object = object;

    //console.log('init tween object, ', this._object);

    this._data = new TWEEN.Tween(this._object);

    if (this._easing.split('.').length != 2) console.error("invalid easing: %s", easing);
  }

  to(toObject: any, time: number, updateFunction: Function = ()=>{}) {
    //console.log('going to', toObject);
    //console.log('easing', (<any>TWEEN).Easing);

    if (this._data != null) {
      let easing = this._easing.split('.')[0];
      let inOut = this._easing.split('.')[1];

      //console.log('target easing ', (<any>TWEEN).Easing[easing][inOut]);

      this._data.to(toObject, time)
      .easing((<any>TWEEN).Easing[easing][inOut])
      .onUpdate(() => {
        //console.log("Tweening!!");
        updateFunction();
      })
      .start();



    } else {
      console.error("no animation data exists");
    }
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

  pause() {
    if (this._data != null) {
      this._paused = true;
      this._pausedTime = this._time;
    } else {
      console.warn("Tween doesn't exist to be paused!");
    }
  }

  resume() {
    if (this._data != null) {
      this._paused = false;
      let diff = this._time - this._pausedTime;
      this._pauseDiff = this._pauseDiff + diff;
    } else {
      console.warn("Tween doesn't exist to be resumed!");
    }
  }


}

export default Tween;