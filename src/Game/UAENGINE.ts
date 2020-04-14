import World from './Core/Engine/World';
import Entity from './Core/Engine/Entity';
import Loop from './Core/Engine/Loop';
import Loader from './Core/Engine/Loader';
import Events from './Core/Engine/Events';
import LevelManager from './Core/Engine/LevelManager';
import Game from './Core/Game';
import GameConfig from './Core/Engine/GameConfig';
import GOFactory from './Core/Engine/GOFactory';
import Geom from './Core/Geom/Geom';



/**
 * @class the UAEngine API. 
 */
class UAENGINE {
  public static world: World;
  public static entity: Entity;
  public static loop: Loop;
  public static loader: Loader;
  public static events: Events;
  public static levelManager: LevelManager;
  public static game: Game;
  public static goFactory: GOFactory;
  public static gameConfig: GameConfig;
  public static geom: Geom;
}

export default UAENGINE;

