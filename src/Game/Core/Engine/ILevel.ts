import Loop from './Loop';
import LevelManager from './LevelManager';

interface ILevel {
  manager: LevelManager;
  init(): void;
  shutdown(): void;
}

export default ILevel;