import BaseActivity from "./BaseActivity";
import BaseLevel from "./BaseLevel";
import BaseScene from "./BaseScene";
import IActivity from "./IActivity";

/**
 * @description a wrapper for Activity related base classes; extending these is advised, it cuts down on a lot of needless code repetition
 */
class Activities {
  /**
  * @description Extending the BaseLevel class is the quickes, cleanest and easiest way of creaing a barebones Highwood activity
  */
  get BaseActivity() { return BaseActivity }
  /**
* @description Extending the BaseLevel class is the quickes, cleanest and easiest way of creaing a barebones Highwood level
*/
  get BaseLevel() { return BaseLevel }
/**
 * @description Extending the BaseScene class is the quickes, cleanest and easiest way of creaing a barebones Highwood scene
 */
  get BaseScene() { return BaseScene }
}

export default Activities;