import Loop from './Loop';
import LevelManager from '../../Services/LevelManager';

interface ILevel {
  manager: LevelManager;
  init(): void;
  shutdown(): void;
}

export default ILevel;