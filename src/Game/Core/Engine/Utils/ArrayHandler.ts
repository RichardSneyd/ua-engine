import Debug from "../Debug";

/**
 * @description A utlity class for dealing with arrays 
 */
class ArrayHandler {
  constructor() {

  }

  public indexOf(array: any[], key: string, data: any) {
    for (let c = 0; c < array.length; c++) {
      let elm = array[c];
      if (elm[key] === data) return c;
    }

    return -1;
  }

  public emitData(array: any[], key: string, f: Function, context: any) {
    let g = f.bind(context);

    for (let c = 0; c < array.length; c++) {
      let elm = array[c];
      g(elm[key]);
    }
  }

  public removeEq(array: any[], key: string, data: any) {
    Debug.error("removeEq is still not implemented");
  }
}

export default ArrayHandler;