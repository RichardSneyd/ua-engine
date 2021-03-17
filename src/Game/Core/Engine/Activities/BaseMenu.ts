import Game from "../../Game";
import Debug from "../Debug";
import ContainerObject from "../GameObjects/ContainerObject";
import GOFactory from "../GameObjects/GOFactory";
import SpriteObject from "../GameObjects/SpriteObject";
import LevelManager from "../LevelManager";
import Loader from "../Loader";
import Loop from "../Loop";
import BaseScene from "./BaseScene";
import SceneEvents from "./SceneEvents";

abstract class BaseMenu extends BaseScene {
    protected _manager: LevelManager;
    protected _bgdName: string;
    protected _bgd: SpriteObject;
    protected _levelFile: any;
    protected _background: ContainerObject;
    protected _playground: ContainerObject;
    protected _foreground: ContainerObject;

    constructor(events: SceneEvents, loop: Loop, goFactory: GOFactory, loader: Loader, manager: LevelManager, game: Game) {
        super(events, loop, goFactory, loader, game);
        this._manager = manager;
    }

    init(sceneName: string, bgdName: string, hasLevelFile: boolean = true) {
        this._bgdName = bgdName;
        this._events.global.emit('menu_init');
     //   this._events.global.on('shutdown', this.shutdown, this);
        super.init(sceneName);
        this._manager.init(sceneName, [], [], []);
        if (!hasLevelFile) {
            this.preload();
            return;
        }
        //Debug.info('scene.name: ', this.name)
        this._loader.loadLevelFile(sceneName, (data: any) => {
            Debug.info('this: ', this);
            this._manager.setLevelFile(data);
            this.preload();
        });
    }
    
    preload() {
        Debug.info('lFile: ', this._manager.script.levelFile);
        this._loader.addImages([this._bgdName], 'jpg');
        this._loader.addLevelFileAssets(this._manager.script.levelFile);
        super.preload();
    }

    start() {
        this._events.global.emit('menu_start');
        this._bgd = this._goFactory.sprite(0, 0, this._bgdName, null, this._background);
        this._bgd.width = this._game.width();
        this._bgd.height = this._game.height();
        super.start();
    }

    shutdown(){
        this._events.global.emit('menu_shutdown');
        super.shutdown();
    }
}

export default BaseMenu;