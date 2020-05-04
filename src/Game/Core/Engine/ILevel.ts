import Loop from './Loop';

interface ILevel {
  init(scriptName: string): void;

  start(): void;

  shutdown(): void;
}

export default ILevel;