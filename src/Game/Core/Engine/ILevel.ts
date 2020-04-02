import Loop from './Loop';

interface ILevel {
  init(): void;
  shutdown(): void;
}

export default ILevel;