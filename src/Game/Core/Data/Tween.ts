import Debug from '../Engine/Debug';
import * as TWEEN from '@tweenjs/tween.js';
import Events from '../Engine/Events';

/**
 * @description A wrapper for a Tween.tween, essentially -- enables encapsulation, so in theory, it would be easier to implement a different tweening
 * library down the line if we had to. Not to be confused with TweenManager, which is used to create and manage tweens.
 */
class Tween {
  private _name: string;
  protected _easing: string;
  protected _object: any;
  protected _data: TWEEN.Tween<any> | null;
  private _paused: boolean;
  protected _pausedTime: number;
  protected _time: number;
  protected _pauseDiff: number;
  private _onCompleteListeners: Function[];
  private _onUpdateListeners: Function[];
  private _onRepeatListeners: Function[];
  private _onStartListeners: Function[];
  protected _events: Events;

  constructor(events: Events) {
    this._events = events;
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

  get object() {
    return this._object;
  }

  get data(){
    return this._data;
  }

  get isPaused(): boolean { 
    if (this._data) {
      return this._data.isPaused();
    }
    Debug.error('cannot return isPaused for uninitialized tween object');
    return false;
  }

  get onComplete() {
    return this._onComplete;
  }

  get onStart() {
    return this._onStart;
  }

  get onRepeat() {
    return this._onRepeat;
  }

  get onUpdate() {
    return this._onUpdate;
  }

  start(): Tween {
    if (this._data) {
      this._data.start.bind(this._data)();
      return this;
    }
    Debug.error('cannot return start property for undefined tween object');
    return this;
  }

  stop(): Tween {
    if (this._data) {
      this._data.stop.bind(this._data)();
      return this;
    }
    else {
      Debug.warn('cannot return stop property for undefined tween object');
      return this;
    }
  }

  end(): Tween {
    if (this._data) {
      this._data.end.bind(this._data)();
      return this;
    }
    Debug.warn  ('cannot return end property for undefined tween object');
    return this;
  }

  public chain(tween: Tween): Tween {
    if (this._data !== undefined && this._data !== null && tween._data !== null) {
      this._data.chain(tween._data);
      return this;
    }

    if (this._data == undefined) Debug.error('this._data is undefined');
    if (this._data == null) Debug.error('this._data is null');
    if (tween == null) Debug.error('tween._data of tween provided for chaining is null');
    return this;
  }

  private _onComplete(callback: Function): Tween {
    this._onCompleteListeners[1] = callback;
    return this;
  }

  private _onUpdate(callback: Function): Tween {
    this._onUpdateListeners[1] = callback;
    return this;
  }

  private _onStart(callback: Function): Tween {
    this._onStartListeners[0] = callback;
    return this;
  }

  private _onRepeat(callback: Function): Tween {
    this._onRepeatListeners[0] = callback;
    return this;
  }

  private _callOnComplete() {
    this._callAll(this._onCompleteListeners);
    return this;
  }

  private _callOnRepeat() {
    this._callAll(this._onRepeatListeners);
    return this;
  }

  private _callOnStart() {
    this._callAll(this._onStartListeners);
    return this;
  }

  private _callOnUpdate() {
    //   Debug.info('tween _callOnUpdate');
    this._callAll(this._onUpdateListeners);
  }

  private _callAll(callbacks: Function[]) {
    for (let x = 0; x < callbacks.length; x++) {
      callbacks[x]();
    }
  }

  init(name: string, easing: string, object: any, yoyo: boolean, repeat: number = 0, delay: number = 0) {
    this._name = name;
    this._easing = easing;
    this._object = object;

    this._data = new TWEEN.Tween(this._object);
    this._data.yoyo(yoyo);
    // if (repeat !== 0) this._data.repeat(repeat);
    if (repeat !== 0) this._data.repeat(repeat);
    // if (delay !== 0) this._data.delay(delay);
    this._data.delay(delay);

    this._data.onComplete(() => { this._callOnComplete() });
    this._data.onRepeat(() => { this._callOnRepeat() });
    this._data.onStart(() => { this._callOnStart() });
    this._data.onUpdate(this._callOnUpdate.bind(this));
    // turned these off, because pausing of tweens is being handled by Loop.ts, which stops updating the time during pause.
  //  this._events.on('pause', this.pause, this); 
 //   this._events.on('resume', this.resume, this);
    if (this._easing.split('.').length != 2) Debug.error("invalid easing: %s", easing);
    this.reset();
  }

  remove() {
    this.stop();
    this._events.off('pause', this.pause, this);
    this._events.off('resume', this.resume, this);
    if (this._data) {
      TWEEN.remove(this._data);
      this._data = null;
    }
  }

  to(toObject: any, time: number, updateFunction: Function = () => { }): Tween {
    this.freeze();
 //   Debug.info('tween.to...');
    if (this._data != null) {
      let easing = this._easing.split('.')[0];
      let inOut = this._easing.split('.')[1];
  //    Debug.info('easing: ', easing, inOut);
      this._paused = false;
  //    Debug.info('paused: ', this._data.isPaused());
      this._data.to(toObject, time)
        .easing((<any>TWEEN).Easing[easing][inOut]);

      this._onUpdateListeners[0] = updateFunction;
      this._onCompleteListeners[0] = () => { this.freeze() };

    } else {
      Debug.error("this._data is null");
    }
    return this;
  }

  createNew(): Tween {
    return new Tween(this._events);
  }

  update(time: number) {
    if (this._data != null) {
      if (!this._paused) {
        if (this._object !== undefined && this._object !== null) this._data.update(time - this._pauseDiff);
      }
    }

    this._time = time;
  }

  pause(tweenName?: string): Tween {
    if (this._data != null) {
      this._paused = true;
      this._data.pause();
      this._pausedTime = this._time;
    } else {
      Debug.warn("Tween doesn't exist to be paused!");
    }

    return this;
  }

  freeze(): Tween {
    if (this._data != null) {
      this._paused = true;
    }

    return this;
  }

  reset(): Tween {
    if (this._data != null) {
      this._paused = false;
    }

    return this;
  }

  resume(): Tween {
    if (this._data != null && this._paused) {
      this._paused = false;
      this._data.resume();
      let diff = this._time - this._pausedTime;
      this._pauseDiff = this._pauseDiff + diff;
    } else {
      Debug.warn("Tween._data doesn't exist to be resumed!");
    }
    return this;
  }

}

export default Tween;