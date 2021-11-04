import AbstractAppMain from "./AbstractAppMain";
import BaseActivity from "./BaseActivity";
import BaseGamifiedLevel from "./BaseGamifiedLevel";
import BaseLevel from "./BaseLevel";
import BaseMenu from "./BaseMenu";
import BaseScene from "./BaseScene";
import IActivity from "./IActivity";
import SceneComponentsFactory from "./SceneComponentsFactory";
import components from "./SceneComponentsFactory";

/**
 * @description a wrapper for Activity related base classes; extending these is advised, it cuts down on a lot of needless code repetition
 */
class Activities {
  private _components: SceneComponentsFactory;

  constructor(components: SceneComponentsFactory) {
    this._components = components;
  }

  /**
  * @description Extending the BaseLevel class is the quickes, cleanest and easiest way of creaing a barebones Highwood activity
  */
  get BaseActivity() { return BaseActivity }

  /**
  * @description Extending the BaseLevel class is the quickes, cleanest and easiest way of creaing a barebones Highwood level
  */
  get BaseLevel() { return BaseLevel }

   /**
  * @description Extending the BaseGamifiedLevel class is the quickes, cleanest and easiest way of creaing a barebones Highwood level, with support for gamified, round based play
  */
    get BaseGamifiedLevel() { return BaseGamifiedLevel }

  /**
   * @description Extending the BaseScene class is the quickest, cleanest and easiest way of creaing a barebones Highwood scene
   */
  get BaseScene() { return BaseScene }

   /**
   * @description Extendable base class for menu scenes
   */
  get BaseMenu() { return BaseMenu }

  /**
   * @description Extend this in your main.ts class to define a main 'app' object (used for managing app specific elements like a default activity for menus, UI elements etc). 
   * Only one of these per product please. Not needed in activity type repos, only needed for production repos.
   */
  get AbstractAppMain() { return AbstractAppMain }

  /**
   * @description a factory for scene specific components (instance members, not singletons)
   */
  get components() { return this._components }
}

export default Activities;