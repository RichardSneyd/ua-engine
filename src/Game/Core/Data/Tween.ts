import * as TWEEN from '@tweenjs/tween.js';

class Tween {
  private _name: string; _easing: string; _object: any; _data: TWEEN.Tween | null;

  constructor() {
    this._name = '';
    this._easing = '';
    this._object = null;
    this._data = null;
  }

  get name(): string {
    return this._name;
  }

  init(name: string, easing: string, object: any) {
    this._name = name;
    this._easing = easing;
    this._object = object;

    this._data = new TWEEN.Tween(this._object);

    if (this._easing.split('.').length != 2) console.error("invalid easing: %s", easing);
  }

  to(toObject: any, time: number, updateFunction: Function = ()=>{}) {
    if (this._data != null) {
      let easing = this._easing.split('.')[0];
      let inOut = this._easing.split('.')[1];
      this._data.to(toObject, time)
      .easing((<any>TWEEN).Easing[easing][inOut])
      .onUpdate(() => {
        updateFunction();
      })
      .start();
    } else {
      //console.error("no animation data exists");
    }
  }

  createNew(): Tween {
    return new Tween();
  }

  update(time: number) {
    if (this._data != null) this._data.update(time);
  }


}

export default Tween;