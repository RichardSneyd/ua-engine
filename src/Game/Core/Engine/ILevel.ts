import Loop from './Loop';

interface ILevel {
  init(): void;

  start(): void;

  shutdown(): void;
}

export default ILevel;