import Loop from './Loop';

interface IScene {
  init(scriptName: string): void;

  start(): void;

  shutdown(): void;
}

export default IScene;