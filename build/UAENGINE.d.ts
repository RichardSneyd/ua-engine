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
/**
 * @class the UAEngine API.
 */
declare class UAENGINE {
    static world: World;
    static loop: Loop;
    static loader: Loader;
    static events: Events;
    static levelManager: LevelManager;
    static game: Game;
    static goFactory: GOFactory;
    static gameConfig: GameConfig;
    static geom: Geom;
    static utils: Utils;
}
export default UAENGINE;
