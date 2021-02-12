import Game from "../../Game";
import Debug from "../Debug";
import Events from "../Events";
import BaseGameObject from "../GameObjects/BaseGameObject";
import ContainerObject from "../GameObjects/ContainerObject";
import GOFactory from "../GameObjects/GOFactory";
import IGameObject from "../GameObjects/IGameObject";
import SpineObject from "../GameObjects/SpineObject";
import SpriteObject from "../GameObjects/SpriteObject";
import LevelManager from "../LevelManager";
import Loader from "../Loader";
import Loop from "../Loop";
import BaseScene from "./BaseScene";
import ILevel from "./ILevel";
import SceneEvents from "./SceneEvents";

/**
 * @description Extending the BaseLevel class is the quickes, cleanest and easiest way of creaing a barebones Highwood level
 */
abstract class BaseLevel extends BaseScene implements ILevel {
    protected _manager: LevelManager;
    protected _bgd: SpriteObject;

    protected _background: ContainerObject;
    protected _playground: ContainerObject;
    protected _foreground: ContainerObject;
    // protected _HUD: ContainerObject;

    protected _aFiles: string[] = [];
    protected _pngFiles: string[] = [];
    protected _jpgFiles: string[] = [];

    protected _ready: boolean = false;

    protected _character: SpineObject;

    constructor(manager: LevelManager, events: SceneEvents, loop: Loop, goFactory: GOFactory, loader: Loader, game: Game) {
        super(events, loop, goFactory, loader, game);
        this._manager = manager;
        Debug.exposeGlobal(this, 'level');
        //  Debug.exposeGlobal(this, 'level'); // expose all levels globally as 'level' for debugging convenience
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
        super.init();
        // create 4 basic layers for positioning objects on. More can be added in the subclass where needed
        this._background = this._goFactory.container(0, 0);
        this._playground = this._goFactory.container(0, 0);
        this._foreground = this._goFactory.container(0, 0);
        //   this._HUD = this._goFactory.container(0, 0);
        // cookie-cutter event listeners (necessary for the functioning of activities and levels, and for avoiding memory leaks etc)
        this._manager.globalEvents.on('newRow', this.onNewRow, this);
        this._manager.globalEvents.on('shutdown', this.shutdown, this);

        // load activity script, then call manager.init to preprocess the activity script, then call preload
        this._loader.loadActScript(scriptName, (script: any, data: any) => {
            if (data == null || data == undefined) Debug.error('no script data returned: ', data);
            this.manager.init(scriptName, script, parseCols, objectifyCols, processText);
            //  this.manager.init(scriptName, script, parseCols, objectifyCols, processText);
            if (script[0].hasOwnProperty('config')) {
                if (script[0].config.includes('level_file:')) {
                    this._loader.loadLevelFile(scriptName, (script: any) => {
                        this.manager.setLevelFile(script);
                        this.preload();
                    });
                }
                else {
                    this.preload();
                }
            }
        });
    }

    /**
     * @description adds resources to the load queue, then uses a promise to download those resource, then call the start method
     */
    preload(): void {
        if (!this.manager.script.isFalsy(this._manager.script.levelFile)) this._loader.addLevelFileAssets(this._manager.script.levelFile); // if level_file present, load assets
        this._loader.addSnds(this.manager.script.fileList(['audio_id'])); // 'audio_id' is present in all scripts
        this._loader.addImages(this._manager.script.fileList(['config.bgd']), 'jpg'); // bgd property is common to all types, and added in BaseLevel, so load it here too...
        if (!this._manager.script.isFalsy(this.configRow.config.char)) {
            this._loader.addSpine(this.configRow.config.char);
        }
        let sfx = this._manager.script.fileList(['config.sfx']);
        if (sfx.length > 0) {
            this._loader.addSnds(sfx);
        }
        super.preload();
    }

    /**
     * @description the start method is used to setup the scene, then call waitForFirstInput, so that nothing kicks off until audio has been
     * enabled (Chrome disables audio until the first user gesture, and Highwood activities are highly audio-dependant/audio-driven)
     * @param configRow optionally pass a config row. If not passed, it will be read from the first row of the script
     */
    start(configRow?: any): void {
        Debug.info('start executed');
        this._events.global.emit('show_nav_bar');
        // add anything that should be done by all levels on start
        if (!configRow) configRow = this._manager.script.rows[0];
        if (configRow.config.hasOwnProperty('bgd')) {
            this._bgd = this._goFactory.sprite(0, 0, configRow.config.bgd, null, this._background);
        }
        else {
            Debug.error('no bgd property in config cell of first row');
        }
        //   let char = this._loader.getResource(configRow.config.char, true);
        if (configRow.config.hasOwnProperty('char') && !this._manager.script.isFalsy(configRow.config.char) && this._loader.getResource(configRow.config.char, true)) {
            let char = this.manager.script.getLevelFileObject('spines', configRow.config.char);
            if (!char) { // Default position and scale if char is not on Level file
                char = { x: 20, y: this._game.height() - 150, scaleX: 1 };
            }
            this._character = this._goFactory.spine(char.x, char.y, configRow.config.char, this._foreground);
            this._character.scaleHandler.scale = char.scaleX;
            Debug.exposeGlobal(this._character, 'char');
        }

        this._waitForFirstInput();
    }

    /**
     * @description called whenever the 'newRow' event is emitted. Forms the foundation of the 'row loop', as it were. Logic to perform whenever a 
     * new row is loaded
     */
    public onNewRow(): void {
        Debug.info('onNewRow called for row %s: ', this.manager.script.active.id, this.manager.script.active);
        this.loadConfig();
        this.updateCharacterState();
        this.playSfx();
        if (!this.manager.script.isFalsy(this.manager.script.active.audio_id)) {
            this.manager.audio.playInstructionArr(this.manager.script.active.audio_id, this.onInstructionAudioComplete.bind(this));
        }
        else if (!this.manager.script.isFalsy(this.manager.script.active.auto_next)) {
            this.manager.script.goToAutoNext();
        }
    }

    /**
     * @description callback for playInstructionArr in onNewRow when the instructional audio for the current row completes. Override to change logic
     */
    public onInstructionAudioComplete() {
        // override for different logic
        if (!this.manager.script.isFalsy(this.manager.script.active.auto_next)) {
            this.manager.script.goToAutoNext();
        }
    }

    /**
     * @description check the current row, and play animation if one is indicated for the character
     */
    public updateCharacterState() {
        if (this._character) {
            let loop = (this.activeRow.char_loop == 'y');
            let animation = this.activeRow.char;
            if (animation && animation !== '') this._character.animations.play(animation, loop);
        }
    }

    /**
     * @description check the current row, and play 'out' animation in sfx spine if indicated
     */
    playSfx() {
        if (this.activeRow.config && !this.manager.script.isFalsy(this.activeRow.config.sfx)) {
            this.manager.audio.play(this.activeRow.config.sfx, () => { });
        }
    }

    /**
     * @description extend this to load configuration settings whenever a new row is called -- generally used to implement settings in the config 
     * cell of the row. By default, it checks for a bgd property, and updates this._bgd with the new texture if so (allows changing background image
     * from row to row, gives control to the IDs). Called in BaseLevel.onNewRow by defeault. Override onNewRow to change this.
     */
    loadConfig(): void {
        if (this.activeRow.hasOwnProperty('config') && this.activeRow.config.hasOwnProperty('bgd') && this.activeRow.config.bgd !== '') {
            this._bgd.changeTexture(this.manager.script.active.config.bgd);
        }
    }

    /**
     * @description a method which waits for the first user gesture, before calling the first row in the activityScript
     */
    _waitForFirstInput(): void {
        let canvas = document.getElementsByTagName('canvas')[0];
        canvas.addEventListener('click', () => {
            this.manager.script.goTo(this.manager.script.rows[0]);
            this.ready = true;
        }, { once: true });
    }

    /**
     * @description go to previous act (todo)
     */
    public prevAct() {
        Debug.info('prevAct!');
        let config = this._manager.script.rows[0].config;
        if (config.hasOwnProperty('prev_act')) this.goto(config.prev_act);
    }

    /**
     * @description go to next act (todo)
     */
    public nextAct() {
        Debug.info('nextAct!');
        let config = this._manager.script.rows[0].config;
        if (config.hasOwnProperty('next_act')) this.goto(config.next_act);
    }

    /**
     * @description go to a different activity (a product is also an activity, and it's menus are levels/scenes within it)
     * @param code the code of the activity, or menu, to go to
     */
    public goto(code: string) {
        this._game.startActivity(code);
    }

    /**
     * @description Returns if the first input happened already
     */
    get ready(): boolean {
        return this._ready;
    }

    /**
     * @description Shorthand to get the script active row, possibly undefined
     */
    get activeRow(): any {
        return this.manager.script.active;
    }

    /**
     * @description Shorthand to get the first row of the activity script, always the first one.
     */
    get configRow(): any {
        return this.manager.script.rows[0];
    }

    /**
     * @description Sets the readiness of the level. Overwrite this setter to also set this value to other interactable objects in cascade.
     * @param ready If the Level is ready
     */
    set ready(ready: boolean) {
        this._ready = ready;
    }

    /**
    * @description adds all objects from the level file to screen in the playground container. Useful for debugging purposes etc
    */
    addLevelFileObjects() {
        let lFile = this._manager.script.levelFile;
        if (this._manager.script.isFalsy(lFile)) Debug.error('no level file');

        for (let x = 0; x < lFile.sprites.length; x++) {
            this._addLevelFileSprite(lFile.sprites[x]);
        }

        for (let x = 0; x < lFile.atlases.length; x++) {
            this._addLevelFileAtlas(lFile.atlases[x]);
        }

        for (let x = 0; x < lFile.spines.length; x++) {
            this._addLevelFileSpine(lFile.spines[x]);
        }
    }

    /**
     * @description Adds a sprite (static) to the scene and transforms it based on data provided from levelFile
     * @param lfObject The js data 'object' plucked from the levelFile, which provides the properties and values to adjust
     * @param parent Optional parent paremeter. Defaults to _playground.
     */
    protected _addLevelFileSprite(lfObject: any, parent: ContainerObject = this._playground): SpriteObject {
        let sprite = this._goFactory.sprite(lfObject.x, lfObject.y, lfObject.filename, null, this._playground);
        this._transformLevelFileObject(sprite, lfObject);
        return sprite;
    }

    /**
    * @description Adds a Sprite (atlas) to the scene and transforms it based on data provided from levelFile
    * @param lfObject The js data 'object' plucked from the levelFile, which provides the properties and values to adjust
    * @param parent Optional parent paremeter. Defaults to _playground.
    */
    protected _addLevelFileAtlas(lfObject: any, parent: ContainerObject = this._playground) : SpriteObject {
        let sprite = this._goFactory.sprite(lfObject.x, lfObject.y, lfObject.filename, '', this._playground);
        this._transformLevelFileObject(sprite, lfObject);
        return sprite;
    }

    /**
     * @description Adds a spineObject to the scene and transforms it based on data provided from levelFile
     * @param lfObject The js data 'object' plucked from the levelFile, which provides the properties and values to adjust
     * @param parent Optional parent paremeter. Defaults to _playground.
     */
    protected _addLevelFileSpine(lfObject: any, parent: ContainerObject = this._playground): SpineObject {
        let spine = this._goFactory.spine(lfObject.x, lfObject.y, lfObject.filename, this._playground);
        this._transformLevelFileObject(spine, lfObject);
        return spine;
    }

    /**
     * @description Assigns all transform etc properties to the object, as read from the levelFile
     * @param gameObject the object to transform
     * @param lfObject The js data 'object' plucked from the levelFile, which provides the properties and values to adjust
     */
    protected _transformLevelFileObject(gameObject: BaseGameObject, lfObject: any) {
        gameObject.setOrigin(lfObject.originX, lfObject.originY);
        gameObject.angle = lfObject.angle;
        gameObject.zIndex = lfObject.zIndex;
        gameObject.scaleHandler.x = lfObject.scaleX;
        gameObject.scaleHandler.y = lfObject.scaleY;
    }

    /**
     * @description shutdown the scene, in preperation for transition. This involves destroying objects, as well as removing loop callbacks and event listeners etc
     */
    shutdown() {
        this._events.global.emit('hide_nav_bar');
        this._manager.globalEvents.off('shutdown', this.shutdown, this);
        this._manager.globalEvents.off('newRow', this.onNewRow, this);
        this.destroy();
        super.shutdown();
    }

    /**
     * @description calls the destroy methods on all layers, effectively destroying the entire scene
     */
    destroy() {
        this._playground.destroy();
        this._background.destroy();
        this._foreground.destroy();
    }
}

export default BaseLevel;