import Events from '../Engine/Events';
import FunObj from '../Data/FunObj';

class Loop {
  private _funObj: FunObj;
  private _fList: FunObj[];
  private _boundExecuteAll: any;
  private _events: Events;
  private _paused: number; //0: false, 1: true, 2: just turned true
  private _lastTime: number;
  private _delay: number;
  private _oldDelay: number;
  
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
  }

  public addFunction(f: any, context: any) {
    let i = this._findFunction(f);

    if (i == null) {
      let o = this._newFunObj(f, context);
      this._fList.push(o);
    } else {
      console.error("trying to add function %s twice", f);
    }
  }

  public removeFunction(f: any) {
    let i = this._findFunction(f);

    if (i != null) {
      this._fList.splice(i, 1);
    } else {
      console.warn("Did not find function %s to remove", f);
    }
  }

  public start(): void {
    window.requestAnimationFrame(this._boundExecuteAll);
  }

  private _executeAll(time: number) {
    if (this._paused == 1) {
      this._delay = this._oldDelay + (time - this._lastTime);
      //console.log("delay %s", this._delay);
    } else if (this._paused == 2) {
      this._paused = 1;
      this._oldDelay = this._delay;
      this._lastTime = time;
    } else if (this._paused == 0) {

      for (let c = 0; c < this._fList.length; c++) {
        this._fList[c].execute(time - this._delay);
      }

    }

    window.requestAnimationFrame(this._boundExecuteAll);
  }

  private _findFunction(f: any): number | null {
    for (let c = 0; c < this._fList.length; c++) {
      if (f == this._fList[c].function) return c;
    }

    return null;
  }

  private _newFunObj(f: any, context: any) {
    let obj = this._funObj.createNew();
    obj.init(f, context);

    return obj;
  }

  private _pauseAll() {
    this._paused = 2;
  }

  private _resumeAll() {
    this._paused = 0;
  }

  private _addListeners() {
    this._events.addListener('pauseAll', () => {
      this._pauseAll();
    }, this);

    this._events.addListener('resumeAll', () => {
      this._resumeAll();
    }, this);
  }
}

export default Loop;