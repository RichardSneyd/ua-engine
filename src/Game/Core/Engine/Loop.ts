import Events from '../Engine/Events';
import FunObj from '../Data/FunObj';
import Debug from './Debug';

/**
 * @description responsible for managing the core game loop (based on requestAnimationFrame)
 */
class Loop {
  private _funObj: FunObj;
  private _fList: FunObj[];
  private _boundExecuteAll: any;
  private _events: Events;
  private _paused: number; //0: false, 1: true, 2: just turned true
  private _lastTime: number;
  private _delay: number;
  private _oldDelay: number;
  private _started: boolean = false;

  constructor(events: Events, funObj: FunObj) {
    this._events = events;
    this._funObj = funObj;

    this._fList = [];
    this._paused = 0;
    this._lastTime = 0;
    this._delay = 0;
    this._oldDelay = 0;

    this._boundExecuteAll = this._executeAll.bind(this);

    this._addListeners();
    this.start();
  }

  /**
   * @description Add a function to the list of callbacks for this loop
   * @param f the function to add to the list of callbacks
   * @param context the context
   */
  public addFunction(f: Function, context: any) {
    let fObj: FunObj | null = this._getFunObj(f, context);

    if (fObj == null) {
      let o = this._newFunObj(f, context);
      this._fList.push(o);
      //  Debug.info(`%csuccessfully added listener with context %s to Loop`, Debug.STYLES.GOOD, context);
    } else {
      Debug.error("trying to add same function %s and context %s to loop twice: ", f, context);
    }
  }

  /**
   * @description Remove a callback from this loop
   * @param f the function to remove from callbacks array
   * @param context the context of the function to remove (required to find the exact function of exact objectc)
   */
  public removeFunction(f: Function, context: any) {
    //   Debug.info(this._fList);
    let i = this._getFunObj(f, context);
    Debug.info('listener found: ', i);
    if (i) {
      this._fList.splice(this._fList.indexOf(i), 1);
      Debug.info(`%cremoved listener with context %s`, Debug.STYLES.NOTEWORTHY, context);
    } else {
      // Debug.warn("Did not find loop listener with context %s, that matches: ", context, f);
      // this.diagnostics(f, context);
    }
  }

  public diagnostics(f: Function, context: any) {
    Debug.info('looking for context: %s with function: ', context, f);
    Debug.info('%cLoop listeners:', Debug.STYLES.CURIOUS)
    Debug.table(this._fList);
    // Debug.breakpoint();
  }

  /**
   * @description start the loop -- internally, this binds the loop to requestAnimatonFrame on window obj. Loop is a singleton, so this method will only execute
   * the first time it's called; otherwise, there would be multiple requestAnimationFrame calls each time a new scene loaded, and everything would animate too fast.
   */
  public start(): void {
    if (!this._started) {
      window.requestAnimationFrame(this._boundExecuteAll);
      this._started = true;
    }
  }

  private _executeAll(time: number) {
    // Debug.info('execute all.. at %s: ', new Date().getTime(), this._fList);
    if (this._paused == 1) {
      this._delay = this._oldDelay + (time - this._lastTime);
      // Debug.info("delay %s", this._delay);
    } else if (this._paused == 2) {
      this._paused = 1;
      this._oldDelay = this._delay;
      this._lastTime = time;
    } else if (this._paused == 0) {

      // Debug.info('fList length: ', this._fList.length);
      for (let c = 0; c < this._fList.length; c++) {
        // Debug.info('exec loop callback %s', c);
        this._fList[c].execute(time - this._delay);
      }

    }
    //   debugger;
    window.requestAnimationFrame(this._boundExecuteAll);
  }

  /*  private _findFunction(f: Function, context: any): number | null {
     for (let c = 0; c < this._fList.length; c++) {
       if (f == this._fList[c].function) return c;
     }
 
     return null;
   } */

  private _getFunObj(f: Function, context: any): FunObj | null {
    for (let c = 0; c < this._fList.length; c++) {
      if (f == this._fList[c].function && this._fList[c].context == context) return this._fList[c];
    }

    // Debug.info("No existing loop listener with context %s...", context);
    return null;
  }

  private _newFunObj(f: Function, context: any): FunObj {
    let obj = this._funObj.createNew();
    obj.init(f, context);

    return obj;
  }

  private _pause() {
    this._paused = 2;
  }

  private _resume() {
    this._paused = 0;
  }

  private _addListeners() {
   // this._events.addListener('pause', this._pause, this);
   // this._events.addListener('resume', this._resume, this);
  }
}

export default Loop;