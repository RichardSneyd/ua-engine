// Function Object
class FunObj {
  private _f: any;
  private _context: any;

  private _function: any;

  constructor() {

  }

  get function(): any {
    return this._f;
  }

  init(f: any, context: any) {
    this._f = f;
    this._context = context;
    this._function = f.bind(context);
  }

  execute(): any {
    return this._function();
  }

  createNew(): FunObj {
    return new FunObj();
  }
}

export default FunObj;