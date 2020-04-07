import World from './Core/Engine/World';
import Entity from './Core/Engine/Entity';
import Loop from './Core/Engine/Loop';
import Loader from './Core/Engine/Loader';
import Events from './Core/Engine/Events';
import LevelManager from './Core/Engine/LevelManager';
import Game from './Core/Game';
import GameConfig from './Core/Engine/GameConfig';
import GameObjectFactory from './Core/Engine/GameObjectFactory';

class UAENGINE {
  public static world: World;
  public static entity: Entity;
  public static loop: Loop;
  public static loader: Loader;
  public static events: Events;
  public static levelManager: LevelManager;
  public static game: Game;
  public static gameConfig: GameConfig;
  public static goFactory: GameObjectFactory;
}
export default UAENGINE;