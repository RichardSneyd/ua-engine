import UAE from "../../../UAE";
import Game from "../../Game";
import Debug from "../Debug";
import BaseGameObject from "../GameObjects/BaseGameObject";
import Button from "../GameObjects/Button";
import ContainerObject from "../GameObjects/ContainerObject";
import GOFactory from "../GameObjects/GOFactory";
import SpineObject from "../GameObjects/SpineObject";
import SpriteObject from "../GameObjects/SpriteObject";
import Loader from "../Loader";
import Loop from "../Loop";
import IScene from "./IScene";
import SceneEvents from "./SceneEvents";

/**
 * @description Extending the BaseScene class is the quickes, cleanest and easiest way of creaing a barebones Highwood scene
 */
abstract class BaseScene implements IScene {
    protected _name: string;
    protected _events: SceneEvents;
    protected _loop: Loop;
    protected _goFactory: GOFactory;
    protected _loader: Loader;
    protected _game: Game;
    protected _background: ContainerObject;
    protected _playground: ContainerObject;
    protected _foreground: ContainerObject;
    // protected _HUD: ContainerObject;

    constructor(events: SceneEvents, loop: Loop, goFactory: GOFactory, loader: Loader, game: Game) {
        this._events = events;
        this._loop = loop;
        this._goFactory = goFactory;
        this._loader = loader;
        this._game = game;
    }

    get events() {
        return this._events;
    }

    init(...args: any): void {
        this._events.global.emit('scene_init');
        Debug.info('scene args: ', args);
        this._name = args[0];
        this._background = this._goFactory.container(0, 0);
        this._playground = this._goFactory.container(0, 0);
        this._foreground = this._goFactory.container(0, 0);
        this._events.global.on('shutdown', this.shutdown, this);

        this._loop.addFunction(this.update, this);
        this._loop.start(); // just in case the loop hasn't been started yet - if it has, this will do nothing.
        Debug.exposeGlobal(this, 'scene');
       // Debug.clear();
        // remember to call preload from the subclass
    }

 /*    createNew(){
        return new BaseScene(this._events, this._loop, this._goFactory, this_loader, this._game);
    } */

    get name(): string {
        return this._name;
    }

    preload(): void {
        this._events.global.emit('stop_all_audio');
        // override this to preload your assets, call super.preload at the end to start the promise
        if (Debug.level == Debug.LEVELS.INFO) this._loader.addSnd(Debug.fillerAudio);
        this._loader.download().then(() => {
            this.start();
        });
    }

    /**
     * @description used to build the scene. override me.
     */
    start() {

        this._events.global.emit('scene_start');
        // build the scene
    }

    /**
     * @description per-tick operations go here. The update method is called via a callback which is passed to UAE.Loop, which is our RAF loop.
     */
    update(...args: any) {
        // per tick
    }

    /**
     * @description shutdown the level before loading another one. By default, it removes the UAE.Loop listener, and turns of fthe shutdown listener
     */
    shutdown(): void {
        this._events.global.emit('scene_shutdown');
        this._loop.removeFunction(this.update, this);
        this._events.global.off('shutdown', this.shutdown, this);
        this.destroy();
    }

    /**
    * 
    * @param code the name of the scene to go to
    */
    protected _goto(code: string) {
        //   Debug.info('clicked on ' + code);
        this._game.startActivity(code);
    }

    /**
    * @description calls the destroy methods on all layers, effectively destroying the entire scene
    */
    destroy() {
        Debug.trace('scene destroy called');
        this._playground.destroy();
        this._background.destroy();
        this._foreground.destroy(); 
        Debug.trace('scene destroy finished');
    }
}

export default BaseScene;