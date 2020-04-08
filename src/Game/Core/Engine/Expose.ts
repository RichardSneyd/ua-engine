class Expose {
  constructor() {

  }

  init() {
    (<any>window).UAENGINE = {};
  }

  add(key: string, object: any) {
    (<any>window).UAENGINE[key] = object;
  }
}

export default Expose;