/**
 * @description used to expose an object on the engine API via the add method -- as in UAE.myObject... In practice, this should only be used in src/Game/Core/Game.ts
 * to expose key engine components.
 */
class Expose {
  constructor() {

  }

  init() {
    (<any>window).UAE = {
      "default": {}
    };
   // (<any>window).UAE = (<any> window).UAE_1['default'];
  }

  add(key: string, object: any) {
    (<any>window).UAE["default"][key] = object;
  }
}

export default Expose;