import World from './Core/Engine/World';
import Entity from './Core/Engine/Entity';
import Loop from './Core/Engine/Loop';
import Loader from './Core/Engine/Loader';
import Events from './Core/Engine/Events';
import LevelManager from './Core/Engine/LevelManager';

class UAENGINE {
  public static world: World;
  public static entity: Entity;
  public static loop: Loop;
  public static loader: Loader;
  public static events: Events;
  public static levelManager: LevelManager;
}
export default UAENGINE;