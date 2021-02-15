import Game from "../../Game";
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

    constructor(events: SceneEvents, loop: Loop, goFactory: GOFactory, loader: Loader, manager: LevelManager, game: Game){
        super(events, loop, goFactory, loader, game);
        this._manager = manager;
    }
    
        init(sceneName: string, bgdName: string){
            this._bgdName = bgdName;
            this._events.global.emit('hide_nav_bar');
            super.init(sceneName);
            this._manager.init(sceneName, [], [], []);
            this._loader.loadLevelFile(this.name, (data: any)=>{ 
                this._manager.setLevelFile(data);
                this.preload();
            });
        }
    
        preload(){
            this._loader.addImages([this._bgdName], 'jpg');
            this._loader.addLevelFileAssets(this._manager.script.levelFile);
            super.preload();
        }

    start(){
        this._goFactory.sprite(0, 0, this._bgdName, null, this._background);
        super.start(); 
    }
}

export default BaseMenu;