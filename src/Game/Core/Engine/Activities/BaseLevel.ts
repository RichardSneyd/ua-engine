
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
    protected _ready: boolean;
    //  protected _started: boolean;

    protected _character: SpineObject;
    protected _extraCharacters: SpineObject[];


    constructor(manager: LevelManager, events: SceneEvents, loop: Loop, goFactory: GOFactory, loader: Loader, game: Game) {
        super(events, loop, goFactory, loader, game);
        this._manager = manager;
        this._ready = false;

        //  Debug.exposeGlobal(this, 'level'); // expose all levels globally as 'level' for debugging convenience
    }

    /**
     * @description a plubic getter for the level manager
     */
    get manager() {
        return this._manager;
    }

    get roundCount() {
        return this.manager.script.rounds.length - 1;
    }

    get maxRounds() {
        if (this.configRow.config.rounds) { return this.configRow.config.rounds }
        Debug.error('no rounds property in config cell');
    }

    get background() {
        return this._background;
    }

    get playground() {
        return this._playground;
    }

    get foreground() {
        return this._foreground;
    }

    /**@description the init method. Adds a callback to the update method for Loop.ts, adds listeners for shutdown and newRow,
     * loads the script, then calls preload
     * @param scriptName the name of the script to load, without the '.json' file extension
     * @param parseCols the columns in the activity script to parse into lists, via split (with default seperate of , ). Always include audio_id
     * @param objectifyCols the columns to convert into key value data (objects). Always include config. 
     * @param processText the colums to convert into lines and words (mostly just for working with text in passage types)
     */
    init(scriptName: string, parseCols: string[], objectifyCols: string[], processText?: string[] | undefined): void {
        super.init(scriptName);
        this._extraCharacters = [];

        // create 4 basic layers for positioning objects on. More can be added in the subclass where needed
        //   this._HUD = this._goFactory.container(0, 0);
        // cookie-cutter event listeners (necessary for the functioning of activities and levels, and for avoiding memory leaks etc)
        this._manager.globalEvents.emit('level_init');
        this._manager.globalEvents.on('newRow', this.onNewRow, this);
        //  this._manager.globalEvents.on('shutdown', this.shutdown, this);

        // load activity script, then call manager.init to preprocess the activity script, then call preload
        this._loader.loadActScript(scriptName, (script: any, data: any) => {
            if (data == null || data == undefined) Debug.error('no script data returned: ', data);
            this.manager.init(scriptName, script, parseCols, objectifyCols, processText);
            this._onActivityScriptInitialized(scriptName, script);
        });
    }

    /**
     * @description this method triggers when the activity script is initialized -- trying to access the script in init() directly will 
     * result in errors because it uses async to load script
     * @param scriptName the name of the script to load (needed to load the level file within BaseLevel itself)
     * @param script the script object
     */
    protected _onActivityScriptInitialized(scriptName: string, script: any) {
        //  this.manager.init(scriptName, script, parseCols, objectifyCols, processText);
        if (script[0].hasOwnProperty('config')) {
            if (script[0].config.includes('level_file:')) {
                this._loader.loadLevelFile(scriptName, (script: any) => {
                    this.manager.setLevelFile(script);
                    this._onLevelFileInitialized();
                });
            }
            else {
                this.preload();
            }
        }

    }

    protected _onLevelFileInitialized() {
        this.preload();
    }

    /**
     * @description adds resources to the load queue, then uses a promise to download those resource, then call the start method
     */
    preload(): void {
        if (!this.manager.script.isFalsy(this._manager.script.levelFile)) this._loader.addLevelFileAssets(this._manager.script.levelFile); // if level_file present, load assets
        this._loader.addSnds(this.manager.script.fileList(['audio_id'])); // 'audio_id' is present in all scripts
        this._loader.addImages(this._manager.script.fileList(['config.bgd']), 'jpg'); // bgd property is common to all types, and added in BaseLevel, so load it here too...
        this._preloadCharacters();
        let sfx = this._manager.script.fileList(['config.sfx', 'config.trans_sfx', 'config.music']);
        //  alert(sfx);
        if (sfx.length > 0) {
            this._loader.addSnds(sfx);
        }

        let firstRow = this._manager.script.rows[0];
        if (firstRow.hasOwnProperty('config') && firstRow.config.hasOwnProperty('graph_trans_in')) {
            Debug.info(' ')
            this._loader.addImages([this._manager.script.rows[0].config.graph_trans_in], 'png');
        }
        super.preload();
    }

    protected _preloadCharacters() {
        let prefix = 'config.char';
        for (let x = 1; x > 0; x++) {
            let tag: string = prefix;
            if (x !== 1) tag = prefix + '_' + x;
            let charF = this._manager.script.fileList([tag]); // check if the char property has a value in any of the config cells
            //   if (!this._manager.script.isFalsy(this.configRow.config.char)) {
            if (charF == undefined || charF.length == 0) {
                Debug.warn('no "', tag, '" found');
                break;
            }
            if (charF.length >= 1) {
                this._loader.addSpine(charF[0]);
                //  this._loader.addSpine(this.configRow.config.char);
            }
        }
    }

    /**
     * @description the start method is used to setup the scene, then call waitForFirstInput, so that nothing kicks off until audio has been
     * enabled (Chrome disables audio until the first user gesture, and Highwood activities are highly audio-dependant/audio-driven)
     * @param configRow optionally pass a config row. If not passed, it will be read from the first row of the script
     */
    start(configRow?: any): void {
        this._inTransition(); // call in transition if there is one - handled via event emitter
        this._events.global.emit('level_start');
        // add anything that should be done by all levels on start
        if (!configRow) configRow = this._manager.script.rows[0];
        if (configRow.config.hasOwnProperty('bgd')) {
            this._bgd = this._goFactory.sprite(0, 0, configRow.config.bgd, null, this._background);
            this._bgd.width = this._game.width();
            this._bgd.height = this._game.height();
        }
        else {
            Debug.error('no bgd property in config cell of first row');
        }

        // allows you to test 'ok button' functionality by tapping the O key
        this._manager.input.onKeyDown(this._manager.input.keys.O, this._virtualOKPress, this);
        // allows you skip to next row by tapping the S key, if auto_next is set for active row. faster testing.
        this._manager.input.onKeyDown(this._manager.input.keys.S, this._skipToNextRow, this);

        super.start();
        this._waitForFirstInput();
    }

    protected _skipToNextRow() {
        if (this.activeRow && !this._manager.script.isFalsy(this.activeRow.auto_next)) {
            this._manager.script.goToAutoNext();
        }
    }

    protected _virtualOKPress() {
        this._manager.globalEvents.emit('ok_pressed');
    }

    /**
     * @description called whenever the 'newRow' event is emitted. Forms the foundation of the 'row loop', as it were. Logic to perform whenever a 
     * new row is loaded
     */
    public onNewRow(): void {
       // Debug.info('onNewRow called for row %s: ', this.manager.script.active.id, this.manager.script.active);
        this.loadConfig();
        this.updateCharacterState();
        // this.playSfx(); // this is already being done elsewhere
        if (!this.manager.script.isFalsy(this.manager.script.active.audio_id)) {
            this.manager.audio.playInstructionArr(this.manager.script.active.audio_id, this.onInstructionAudioComplete.bind(this));
        }
        else if (!this.manager.script.isFalsy(this.manager.script.active.auto_next)) {
            this.manager.script.goToAutoNext();
        }
        if (this.activeRow.config && this.activeRow.config.hasOwnProperty('go_to')) {
            this._goto(this.activeRow.config.go_to);
        }
        if (this.activeRow.id !== 0 && 'forward_tapped') {
            //  this._outTransition();
        }
    }

    /**
     * @description callback for playInstructionArr in onNewRow when the instructional audio for the current row completes. Override to change logic
     */
    public onInstructionAudioComplete() {
        this.events.global.emit('instructional_audio_complete'); // listen for this to fire a callback fron newRound after the audio for that row has completed, can be useful
        // override for different logic
        if (!this.manager.script.isFalsy(this.manager.script.active.auto_next)) {
            this.manager.script.goToAutoNext();
        }
    }

    /**
     * @description check the current row, and play animation if one is indicated for the character
     */
    public updateCharacterState() {
        if (this.activeRow.config && this.activeRow.config.hasOwnProperty('char') && !this._manager.script.isFalsy(this.activeRow.config.char) && this._loader.getResource(this.activeRow.config.char, true)) {
            this._addCharacters();
        }

        if (this._character) {
            let loop = (this.activeRow.char_loop == 'y');
            let animation = this.activeRow.char;
            if (animation && animation !== '') this._character.animations.play(animation, loop);
            if (animation && !loop) {
                if (this._character.animations.animationNames.includes('idle')) {
                    this._character.animations.addAnimation('idle', true);
                } else {
                    Debug.error('Character "%s" has no "idle" animation', this._character.name);
                }
            }
        }

        for (let x = 2; x > 1; x++) {
            let label = 'char_' + x;
            let index = x - 2;
            if (this._extraCharacters.length >= x - 1) {
                let loop = (this.activeRow['char_' + x + '_loop'] == 'y');
                let char = this._extraCharacters[index];
                let animation = this.activeRow[label];
                if (animation && animation !== '') char.animations.play(animation, loop);
                if (animation && !loop) {
                    if (char.animations.animationNames.includes('idle')) {
                        char.animations.addAnimation('idle', true);
                    } else {
                        Debug.error('Character "%s" has no "idle" animation', char.name);
                    }
                }
            }
            else {
                break;
            }
        }
    }

    protected _addCharacters() {
        this._destroyCharacters();
        let charLFObj;
        if (this.manager.script.levelFile) charLFObj = this.manager.script.getLevelFileObject('spines', this.activeRow.config.char);
        if (!charLFObj) { // Default position and scale if char is not on Level file
            charLFObj = { x: 20, y: this._game.height() - 50, scaleX: 1, originX: 0, originY: 1 };
        }

        this._character = this._goFactory.spine(charLFObj.x, charLFObj.y, this.activeRow.config.char, this._foreground);
        this._character.scaleHandler.scale = charLFObj.scaleX;
        this._character.setOrigin(charLFObj.originX, charLFObj.originY);
        //  if(!this._manager.script.levelFile || !this._manager.script.getLevelFileObject('spines', this._manager.script.active.config.char)) 
        Debug.exposeGlobal(this._character, 'char');

        for (let x = 2; x > 1; x++) {
            let charLabel = 'char_' + x;
            let index = x - 2;
            let extraCharLFObj;
            if (!this.configRow.config[charLabel]) break;
            if (this.manager.script.levelFile) extraCharLFObj = this.manager.script.getLevelFileObject('spines', this.activeRow.config[charLabel]);
            if (extraCharLFObj == undefined) {
                //  Debug.error('no object in LF for ' + charLabel, ', ', this.activeRow.config[charLabel]);
                extraCharLFObj = { x: this._game.width() - 20, y: this._game.height() - 50, scaleX: 1, originX: 1, originY: 1 }; // just for testing
            }
            if (this.activeRow.config.hasOwnProperty(charLabel)) {
                this._extraCharacters[index] = this._goFactory.spine(extraCharLFObj.x, extraCharLFObj.y, this.activeRow.config[charLabel], this._foreground);
                this._extraCharacters[index].scaleHandler.scale = extraCharLFObj.scaleX;
                this._extraCharacters[index].setOrigin(extraCharLFObj.originX, extraCharLFObj.originY);
            }
        }
    }

    protected _destroyCharacters() {
        if (this._character) this._character.destroy();
        if (this._extraCharacters && this._extraCharacters.length > 0) {
            for (let char of this._extraCharacters) {
                char.destroy();
            }
            this._extraCharacters = [];
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
        if (this.activeRow.hasOwnProperty('config')) {
            if (this.activeRow.config.hasOwnProperty('bgd') && this.activeRow.config.bgd !== '') {
                this._bgd.changeTexture(this.manager.script.active.config.bgd);
            }
            if (this.activeRow.config.hasOwnProperty('trans_sfx')) {
                this._manager.audio.play(this.activeRow.config.trans_sfx, () => {
                    // this._manager.globalEvents.emit('transition_finish'); // curtain fall complete, signal this
                });
            }
            if (this.activeRow.config.hasOwnProperty('sfx')) {
                this._manager.audio.play(this.activeRow.config.sfx, () => {
                    // yo
                });
            }
            if (this.activeRow.config.hasOwnProperty('music')) {
                let loop = false;
                if(this.activeRow.config.music_loop) loop = true;
                this._manager.audio.playMusic(this.activeRow.config.music, () => {
                    // yo
                }, loop);
            }

        }
    }

    protected _inTransition() {
        let row = this._manager.script.rows[0];
        let graphic: string = '';
        if (row.config.graph_trans_in) {
            graphic = row.config.graph_trans_in; // attempting to keep it generic as possible, not coupled to particular projects
        }
        else {
            Debug.warn('no graph_trans_in property on id 0 config');
        }
        this._manager.globalEvents.emit('enter_transition', { graphic: graphic }); // start the 'curtain fall'
    }

    protected _outTransition() {
        let row = this._manager.script.rows[0];
        let graphic: string = '';
        if (row.config.graph_trans_in) {
            graphic = row.config.graph_trans_in; // attempting to keep it generic as possible, not coupled to particular projects
        }
        this._manager.globalEvents.emit('exit_transition', { graphic: graphic }); // start the 'curtain fall'
    }

    /**
     * @description a method which waits for the first user gesture, before calling the first row in the activityScript
     */
    _waitForFirstInput(): void {
        if (this._game.gestureRecieved) {
            this._onFirstInput();
        }
        else {
            this._events.global.once('gesture_received', this._onFirstInput, this);
        }
    }

    protected _onFirstInput() {
        this.ready = true;
        this.manager.script.goTo(this.manager.script.rows[0]);
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

    protected _totalRounds(): number {
        if (!this._manager.script.rows[0].hasOwnProperty('round')) Debug.error('no round column in script');
        return this._game._utils.math.max(this._allRounds());
    }

    protected _allRounds(): number[] {
        if (!this._manager.script.rows[0].hasOwnProperty('round')) Debug.error('no round column in script');
        return this._manager.script.valueList(['round']);
    }

    /**
     * @description shutdown the scene, in preperation for transition. This involves destroying objects, as well as removing loop callbacks and event listeners etc
     */
    shutdown() {
        this._events.global.emit('level_shutdown');
        this._events.global.emit('hide_nav_bar');
        // this._manager.globalEvents.off('shutdown', this.shutdown, this);
        this._manager.globalEvents.off('newRow', this.onNewRow, this);
        this._manager.input.offKeyDown(this._manager.input.keys.O, this._virtualOKPress, this);
        this._manager.input.offKeyDown(this._manager.input.keys.S, this._skipToNextRow, this);

        this._destroyCharacters();
        super.shutdown();
    }
}

export default BaseLevel;