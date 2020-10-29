import Game from "../../Game";
import Debug from "../Debug";
import Events from "../Events";
import ContainerObject from "../GameObjects/ContainerObject";
import GOFactory from "../GameObjects/GOFactory";
import SpriteObject from "../GameObjects/SpriteObject";
import LevelManager from "../LevelManager";
import Loader from "../Loader";
import Loop from "../Loop";
import ILevel from "./ILevel";

abstract class BaseLevel implements ILevel {
    protected _manager: LevelManager;
    protected _events: Events;
    protected _loop: Loop;
    protected _goFactory: GOFactory;
    protected _loader: Loader;
    protected _game: Game;

    protected _bgd: SpriteObject;

    protected _background: ContainerObject;
    protected _playground: ContainerObject;
    protected _foreground: ContainerObject;
    protected _HUD: ContainerObject;

    protected _aFiles: string[] = [];
    protected _pngFiles: string[] = [];
    protected _jpgFiles: string[] = [];

    constructor(manager: LevelManager, events: Events, loop: Loop, goFactory: GOFactory, loader: Loader, game: Game) {
        this._manager = manager;
        this._events = events;
        this._loop = loop;
        this._goFactory = goFactory;
        this._loader = loader;
        this._game = game;
        Debug.exposeGlobal(this, 'level'); // expose all levels globally as 'level' for debugging convenience
    }

    /**
     * @description a plubic getter for the level manager
     */
    get manager() {
        return this._manager;
    }

    /**@description the init method. Adds a callback to the update method for Loop.ts, adds listeners for shutdown and newRow,
     * loads the script, then calls preload
     * @param scriptName the name of the script to load, without the '.json' file extension
     * @param parseCols the columns in the activity script to parse into lists, via split (with default seperate of , ). Always include audio_id
     * @param objectifyCols the columns to convert into key value data (objects). Always include config. 
     * @param processText the colums to convert into lines and words (mostly just for working with text in passage types)
     */
    init(scriptName: string, parseCols: string[], objectifyCols: string[], processText?: string[] | undefined): void {
        Debug.info('init called');
        Debug.info(this);
        this._loop.addFunction(this.update, this);
        this._loop.start();

        // create 4 basic layers for positioning objects on. More can be added in the subclass where needed
        this._background = this._goFactory.container(0, 0);
        this._playground = this._goFactory.container(0, 0);
        this._foreground = this._goFactory.container(0, 0);
        this._HUD = this._goFactory.container(0, 0);

        // cookie-cutter event listeners (necessary for the functioning of activities and levels, and for avoiding memory leaks etc)
        this.manager.events.on('shutdown', this.shutdown, this);
        this.manager.events.on('newRow', this.onNewRow, this);

        // load activity script, then call manager.init to preprocess the activity script, then call preload
        this._loader.loadActScript(scriptName, (script: any, data: any) => {
            if (data == null || data == undefined) Debug.error('no script data returned: ', data);
            this.manager.init(scriptName, script, parseCols, objectifyCols, processText);
            this.preload();
        });
    }

    /**
     * @description adds resources to the load queue, then uses a promise to download those resource, then call the start method
     */
    preload(): void {
        // preload
        this._loader.download().then(() => {
            this.start();
        });
    }

    /**
     * @description the start method is used to setup the scene, then call waitForFirstInput, so that nothing kicks off until audio has been
     * enabled (Chrome disables audio until the first user gesture, and Highwood activities are highly audio-dependant/audio-driven)
     */
    start(): void {
        Debug.info('start executed');

        // add anything that should be done by all levels on start
        let firstRow = this._manager.script.rows[0];
        if (firstRow.config.hasOwnProperty('bgd')) {
            this._bgd = this._goFactory.sprite(0, 0, firstRow.config.bgd, null, this._background);
        }
        else {
            Debug.error('no bgd property in config cell of first row');
        }
        this._waitForFirstInput();
    }

    /**
     * @description called whenever the 'newRow' event is emitted. Forms the foundation of the 'row loop', as it were. Logic to perform whenever a 
     * new row is loaded
     */
    onNewRow(): void {
        Debug.info('onNewRow called for row %s: ', this.manager.script.active.id, this.manager.script.active);
        this.loadConfig();
    }

    /**
     * @description extend this to load configuration settings whenever a new row is called -- generally used to implement settings in the config 
     * cell of the row. By default, it checks for a bgd property, and updates this._bgd with the new texture if so (allows changing background image
     * from row to row, gives control to the IDs)
     */
    loadConfig(): void {
        if (this.manager.script.active.config.hasOwnProperty('bgd') && this.manager.script.active.config.bgd !== '') {
            this._bgd.changeTexture(this.manager.script.active.config.bgd);
        }
    }

    /**
     * @description a method which waits for the first user gesture, before calling the first row in the activityScript
     */
    _waitForFirstInput(): void {
        let canvas = document.getElementsByTagName('canvas')[0];
        canvas.addEventListener('click', () => {
            this._events.emit('ready', { test: 'test', content: 'tap to begin' });
            this.manager.script.goTo(this.manager.script.rows[0]);
        }, { once: true });
    }

    /**
     * @description go to previous act (todo)
     */
    protected prevAct() {
        Debug.info('prevAct!');
        let config = this._manager.script.rows[0].config;
        if(config.hasOwnProperty('prev_act')) this._game.startActivity(null, config.prev_act);   
    }

    /**
     * @description go to next act (todo)
     */
    protected nextAct() {
        Debug.info('nextAct!');
        let config = this._manager.script.rows[0].config;
        if(config.hasOwnProperty('next_act')) this._game.startActivity(null, config.prev_act);   
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

export default BaseLevel;