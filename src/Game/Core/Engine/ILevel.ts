import Loop from './Loop';
import LevelManager from './LevelManager';

interface ILevel {
  manager: LevelManager;
  init(scriptName: string): void;
  shutdown(): void;
}

export default ILevel;