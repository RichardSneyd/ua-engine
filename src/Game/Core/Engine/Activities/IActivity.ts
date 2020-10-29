/**
 * @description An interface which defines the basic properties and methods of an Activity object. All activities must have an implementation of IActivity, 
 * since it will serve as the entry point of the activity for the engine.
 */
interface IActivity {
  name: string;
  code: string;
  startActivity(scriptName: string): void;
}

export default IActivity;