import SceneEvents from "./SceneEvents";

/**
 * @description Defines the barebones methods all scenes must have.
 */
interface IScene {
  init(scriptName?: string, ...args: any): void;
  preload(): void;
  start(): void;
  shutdown(): void;
}

export default IScene;