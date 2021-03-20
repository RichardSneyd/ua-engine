import GOFactory from "../GameObjects/GOFactory";
import Loader from "../Loader";
import Loop from "../Loop";
import SceneEvents from "./SceneEvents";

/**
 * @description Defines the barebones methods all scenes must have.
 */
interface IScene {
  init(scriptName?: string, ...args: any): any;
 // createNew(): IScene;
  preload(): void;
  start(): void;
  shutdown(): void;
  events: SceneEvents;
  name: string;
}

export default IScene;