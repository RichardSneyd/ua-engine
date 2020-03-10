import FunObj from '../Data/FunObj';

class Loop {
  private _funObj: FunObj;
  private _fList: FunObj[];
  private _boundExecuteAll: any;
  
  constructor(funObj: FunObj) {
    this._funObj = funObj;

    this._fList = [];

    this._boundExecuteAll = this._executeAll.bind(this);
  }

  addFunction(f: any, context: any) {
    let i = this._findFunction(f);

    if (i == null) {
      let o = this._newFunObj(f, context);
      this._fList.push(o);
    } else {
      console.error("trying to add function %s twice", f);
    }
  }

  removeFunction(f: any) {
    let i = this._findFunction(f);

    if (i != null) {
      this._fList.splice(i, 1);
    } else {
      console.warn("Did not find function %s to remove", f);
    }
  }

  start(): void {
    window.requestAnimationFrame(this._boundExecuteAll);
  }

  private _executeAll() {
    for (let c = 0; c < this._fList.length; c++) {
      this._fList[c].execute();
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
}

export default Loop;