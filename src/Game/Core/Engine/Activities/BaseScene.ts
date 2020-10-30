import Game from "../../Game";
import Debug from "../Debug";
import Events from "../Events";
import GOFactory from "../GameObjects/GOFactory";
import Loader from "../Loader";
import Loop from "../Loop";
import IScene from "./IScene";

/**
 * @description Extending the BaseScene class is the quickes, cleanest and easiest way of creaing a barebones Highwood scene
 */
abstract class BaseScene implements IScene {
    protected _events: Events;
    protected _loop: Loop;
    protected _goFactory: GOFactory;
    protected _loader: Loader;
    protected _game: Game;

    constructor(events: Events, loop: Loop, goFactory: GOFactory, loader: Loader, game: Game){
        this._events = events;
        this._loop = loop;
        this._goFactory = goFactory;
        this._loader = loader;
        this._game = game;
    }

    init(...args: any): void {
        // do init stuff for all scenes
        Debug.info('init called');
        Debug.info(this);
        this._loop.addFunction(this.update, this);
        this._loop.start();
        this._events.on('shutdown', this.shutdown, this);
        // remember to call preload from the subclass
    }

    preload(): void {
        // override this to preload your assets, call super.preload at the end to start the promise
         this._loader.download().then(() => {
            this.start();
        });
    }

    /**
     * @description used to build the scene. override me.
     */
    start(){
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
      this._loop.removeFunction(this.update, this);
      this._events.off('shutdown', this.shutdown, this);
    }

}

export default BaseScene;