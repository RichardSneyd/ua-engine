import World from './Core/Engine/World';
import Loop from './Core/Engine/Loop';
import Loader from './Core/Engine/Loader';
import Events from './Core/Engine/Events';
import LevelManager from './Core/Engine/LevelManager';
import Game from './Core/Game';
import GameConfig from './Core/Engine/GameConfig';
import GOFactory from './Core/Engine/GameObjects/GOFactory';
import Geom from './Core/Geom/Geom';
import Utils from './Core/Engine/Utils/Utils';
import MultiplayerHandler from './Core/Engine/MultiplayerHandler';

/**
 * @class the UAEngine API. 
 */
class UAENGINE {
  public static world: World;
  public static loop: Loop;
  public static loader: Loader;
  public static events: Events;
  public static levelManager: LevelManager;
  public static game: Game;
  public static goFactory: GOFactory;
  public static gameConfig: GameConfig;
  public static geom: Geom;
  public static utils: Utils;
  public static multiplayer: MultiplayerHandler;
}

export default UAENGINE;

