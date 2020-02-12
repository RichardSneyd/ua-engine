///<reference path='../../types/phaser.d.ts' />
import Base from './Base';
import { CONST } from '../CONST/CONST';
import Utils from '../Generic/Utils';
import UIBar from '../Generic/HUD/UIBar';
import Professor from '../objects/Professor';
import AManager from '../Generic/Audio/Manager';
import _ = require('lodash');
import GoPanel from '../objects/GoPanel';
import AudioManager from '../Generic/Audio/Manager';

export default class BaseGame extends Base {
    actAudio: string[];
    actGraphics: string[];
    actSpines: string[];
    actScriptId: string;
    actScript: any;
    activeRow: any;
    previousAct: string;
    components: any[];
    biome: string;
    bgSprite: Phaser.GameObjects.Sprite;
    bgSpriteKey: string;
    bottomBar: UIBar;
    goPanelKey: string;
    goPanel: GoPanel;
    transition: Phaser.GameObjects.Sprite;

    background: Phaser.GameObjects.Container;
    playground: Phaser.GameObjects.Container;
    foreground: Phaser.GameObjects.Container;
    HUD: Phaser.GameObjects.Container;
    underHUD: Phaser.GameObjects.Container;

    professor: Professor;

    banner: Phaser.GameObjects.Sprite;

    sfx: string[] = [
        'comedy_drop',
        'comedy_drop_1',
        'harp',
        'marim_1',
        'marim_2',
        'marim_3',
        'marim_4',
        'marim_5',
        'marim_6',
        'starburst'
    ];

    audioPaused: boolean = false;
    // the columns in the activity script to 'parse' for image and audio lazy-loading. Leave empty if none
    protected graphicCols: string[];
    protected audioCols: string[];

    constructor(key: string, audioCols: string[], graphicCols: string[]) {
        super(key);
        this.actScriptId = key;
        this.audioCols = audioCols;
        this.graphicCols = graphicCols;
        //  this.graphicCols.push('bgd_inter');
    }

    preload() {
        super.preload();
       // this.setFestival();
        this.load.setPath(CONST.PATHS.ACTIVITY_SCRIPTS);
        this.load.json(this.scene.key, this.scene.key + '.json');
        let scriptCompleteEventKey: string = 'filecomplete-json-' + this.scene.key;

        this.load.setPath(CONST.PATHS.SPINE);
        this.load.spine('starburst', 'starburst.json', 'starburst.atlas', true);
        this.load.on(scriptCompleteEventKey, function () {
            this.loadAfterJSON();
        }, this);


        this.load.on('complete', function (this: any) {
            console.log('preload complete');
        }, this);
    }

    /**
     * @description use this method to load assets based on the activity script JSON file, which has been preloaded before this method executes
     */

    loadAfterJSON() {
        // this is called once the activity script json is loaded, so related assets can be lazy-loader here
        this.actScript = this.cache.json.get(this.scene.key);
        this.components = Utils.objectizeColumn(this.actScript, CONST.KEYS.SCRIPT_COLUMNS.COMPONENTS);
        this.biome = this.actScript[1].biome;
        this.goPanelKey = Utils.concatStrings([this.actScript[1].activity, 'header'], '_');

        // load graphics
        this.load.setPath(CONST.PATHS.GRAPHICS);
        this.bgSpriteKey = this.components[0].bgd;
        this.load.image(this.bgSpriteKey, this.bgSpriteKey + ".png");
        this.load.image(CONST.UI.BAR_TEXTURE, CONST.UI.BAR_TEXTURE + '.png');
        this.load.image(this.goPanelKey, this.goPanelKey + '.png');

        if(this.bannerKey !== null){
            this.load.image(this.bannerKey, this.bannerKey + '.png');
        }

        //      only load graphics from specified columns, or do nothing
        if (this.graphicCols.length > 0) {
            this.actGraphics = Utils.getAllEntriesFromCols(this.actScript, this.graphicCols);
            for (let x = 0; x < this.actGraphics.length; x++) {
                //  var graphic = CommonAssets.graphics[index];
                let filename = this.actGraphics[x] + '.png';
                this.load.image(this.actGraphics[x], filename);
            }
        }

        // load audio
        this.load.setPath(CONST.PATHS.AUDIO);
        // only load audio from specified columns, or do nothing
        if (this.audioCols.length > 0) {
            this.actAudio = Utils.getAllEntriesFromCols(this.actScript, this.audioCols);
            this.actAudio.forEach(function (this: any, item: string, index: number) {
                //        console.log(item);
                //        console.log(this.load.path);
                this.load.audio(item, [
                    "mp3/" + item + ".mp3",
                    "ogg/" + ".ogg"
                ]);
            }, this);
        }

        for (let x = 0; x < this.sfx.length; x++) {
            this.load.audio(this.sfx[x], ['mp3/' + this.sfx[x] + '.mp3', 'ogg/' + this.sfx[x] + '.ogg'])
        }

        // load spritesheets
        this.load.path = CONST.PATHS.SPRITESHEETS;
        this.load.spritesheet('pause_button', 'pause_button.png', { frameWidth: 119, frameHeight: 121, startFrame: 0, endFrame: 31 });
        this.load.spritesheet('continue_button', 'continue_button.png', { frameWidth: 119, frameHeight: 121, startFrame: 0, endFrame: 31 });
        this.load.spritesheet('exit_button', 'exit_button.png', { frameWidth: 120, frameHeight: 188, startFrame: 0, endFrame: 30 });
        this.load.spritesheet('bear_paw_breadcrumb', 'bear_paw_breadcrumb.png', { frameWidth: 98, frameHeight: 89, startFrame: 0, endFrame: 1 });
    }

    create() {
        this.background = this.add.container(0, 0)
        this.playground = this.add.container(0, 0);
        this.foreground = this.add.container(0, 0);
        this.underHUD = this.add.container(0, 0);
        this.HUD = this.add.container(0, 0);


        this.background.add(this.bgSprite = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, this.bgSpriteKey));
        this.professor = new Professor(this, this.professorKey, this.foreground);

        if(this.bannerKey !== null){
            this.banner = this.add.sprite(this.game.canvas.width / 2, 0, this.bannerKey, 0);
            this.banner.setOrigin(0.5, 0);
            this.HUD.add(this.banner);
        }
        this.createHUD();
        /*  this.time.addEvent({delay: 100, callback: function(this: any){
             this.start();
         }, callbackScope: this}); */
        this.transition = this.add.sprite(0, this.game.canvas.height, this.transitionKey, 0).setOrigin(0, 1);
        this.HUD.add(this.transition);


        this.goPanel = new GoPanel(this, this.game.canvas.width / 2, this.game.canvas.height / 2, this.goPanelKey, this.start.bind(this), this, this.HUD);
        this.fadeOut();
    }

    fadeOut() {
        this.transition.setTint(0x888888);
    }

    fadeIn() {
        this.transition.setTint(0xffffff);
        /*  let all: Phaser.GameObjects.GameObject[] = this.HUD.getAll();
         for(let x = 0; x < all.length; x++){
             //@ts-ignore
             all[x].clearTint();
         } */
    }

    transitionDown() {
        this.add.tween({ targets: this.transition, duration: 1000, y: this.game.canvas.height + this.transition.height, ease: Phaser.Math.Easing.Sine.InOut });
    }

    transitionUp() {
        this.add.tween({ targets: this.transition, duration: 1000, y: this.game.canvas.height, ease: Phaser.Math.Easing.Sine.InOut });
    }

    /**
     * @descrption load a new row by associated rowID, from the activityScript and execute it
     * @param rowID the id of the row you wish to load 
     */

    changeRow(rowID: number) {
        this.activeRow = Utils.findArrElWithPropVal(this.actScript, ['id'], [rowID]);
        this.updateStage();
        let audio = Utils.cleanUnravel(this.activeRow.audio_id, ',');
        if (audio.length > 0) {
            AManager.playArrayHard(this, 0, audio, function (this: any) {
                if (_.isNumber(this.activeRow.auto_next)) {
                    this.changeRow(this.activeRow.auto_next);

                }
                else if (this.activeRow.audio_loop == 'y') {
                    this.changeRow(this.activeRow.id);
                }
                else {
                    this.audioComplete();
                }
            }.bind(this), this);
        }
        else {
            if (_.isNumber(this.activeRow.auto_next)) {
                this.changeRow(this.activeRow.auto_next);

            }
        }

        if (this.activeRow.trigger == 'end_activity') {
            this.endActivity();
        }
    }

    /**
     * @description update the stage based on the component data related to the active row
     */

    updateStage() {
        this.professor.setState(this.activeRow.prof, this.activeRow.prof_loop);
        if (!_.isNil(this.activeRow.bgd)) {
            this.bgSprite.setTexture(this.components[this.activeRow.id].bgd);
        }
    }

    /**
     * @description go to the next row on the activity script. If their is none, nothing happens.
     */

    nextRow() {
        if (this.activeRow.id < this.actScript.length) {
            this.changeRow(this.activeRow.id++);
        }
    }

    /**
     * @descriptions go to and load the previous row on the activity script. If there is no previous row, nothing happens.
     */

    previousRow() {
        if (this.activeRow.id > 0) {
            this.changeRow(this.activeRow.id--);
        }
    }

    /**
     * @description called when a complete array of audio files (or 'audio string') has completed playback. Typically, all audio in an audio_id cell from an
     * activity script
     */

    audioComplete() {
        // called when an audio 'string' has completed. override in sub classes
    }


    /**
     * @description this is the method which starts the activity. Should not be called until there is a user gesture, because of audioContext 
     * browser bug (audio playback issue)
     */

    start() {
        // start the ball rolling
        this.transitionDown();
        this.fadeIn();
        this.changeRow(1);
    }

    changeActBreadCrumb() {

    }
    /**
     * @description this method generated the Heads Up Display. Typically, all UI elements are created here. Use the HUD container for these objects
     */


    createHUD() {
        this.createSpriteAnims();
        let yOffset: number = -70;
        let yHigh: number = yOffset - 20;
        let yLow: number = yOffset + 20;

        this.bottomBar = new UIBar(this, 0, this.game.canvas.height, CONST.UI.BAR_TEXTURE, this.HUD, [
            {
                key: 'exit_button',
                x: 80,
                y: yOffset,
                origin: { x: 0, y: 1 },
                outAnim: 'exit_out',
                overAnim: 'exit_over',
                callback: function (this: BaseGame) {
                    this.changeAct(CONST.KEYS.SCENES.MAIN_MENU);
                }.bind(this),
                callbackContext: this,

            },
            {
                key: 'continue_button',
                x: 1840,
                y: yOffset,
                origin: { x: 1, y: 0.5 },
                outAnim: 'continue_out',
                overAnim: 'continue_over',
                callback: function (this: BaseGame) {
                    this.nextAct();
                }.bind(this),
                callbackContext: this
            },
            {
                key: 'bear_paw_breadcrumb',
                x: 470,
                y: yHigh,
                origin: { x: 0.5, y: 0.5 },
                callback: function (this: BaseGame) {
                    let row = this.actScript[1];
                    let key = Utils.concatStrings([row.product, row.level, row.biome, 'a1'], '_');
                    this.changeAct(key);
                }.bind(this),
                callbackContext: this,
                outAnim: 'bear_paw_default',
                overAnim: 'bear_paw_default'

            },
            {
                key: 'bear_paw_breadcrumb',
                x: 670,
                y: yLow,
                origin: { x: 0.5, y: 0.5 },
                callback: function (this: BaseGame) {
                    let row = this.actScript[1];
                    let key = Utils.concatStrings([row.product, row.level, row.biome, 'a2'], '_');
                    this.changeAct(key);
                }.bind(this),
                callbackContext: this,
                outAnim: 'bear_paw_default',
                overAnim: 'bear_paw_default'

            },
            {
                key: 'bear_paw_breadcrumb',
                x: 854,
                y: yHigh,
                origin: { x: 0.5, y: 0.5 },
                callback: function (this: BaseGame) {
                    let row = this.actScript[1];
                    let key = Utils.concatStrings([row.product, row.level, row.biome, 'a3'], '_');
                    this.changeAct(key);
                }.bind(this),
                callbackContext: this,
                outAnim: 'bear_paw_default',
                overAnim: 'bear_paw_default'

            },
            {
                key: 'bear_paw_breadcrumb',
                x: 1054,
                y: yLow,
                origin: { x: 0.5, y: 0.5 },
                callback: function (this: BaseGame) {
                    let row = this.actScript[1];
                    let key = Utils.concatStrings([row.product, row.level, row.biome, 'a4'], '_');
                    this.changeAct(key);
                }.bind(this),
                callbackContext: this,
                outAnim: 'bear_paw_default',
                overAnim: 'bear_paw_default'

            },
            {
                key: 'bear_paw_breadcrumb',
                x: 1234,
                y: yHigh,
                origin: { x: 0.5, y: 0.5 },
                callback: function (this: BaseGame) {
                    let row = this.actScript[1];
                    let key = Utils.concatStrings([row.product, row.level, row.biome, 'a5'], '_');
                    this.changeAct(key);
                }.bind(this),
                callbackContext: this,
                outAnim: 'bear_paw_default',
                overAnim: 'bear_paw_default'

            },
            {
                key: 'bear_paw_breadcrumb',
                x: 1460,
                y: yLow,
                origin: { x: 0.5, y: 0.5 },
                callback: function (this: BaseGame) {
                    let row = this.actScript[1];
                    let key: string = Utils.concatStrings([row.product, row.level, row.biome, 'a6'], '_');
                    this.changeAct(key);
                }.bind(this),
                callbackContext: this,
                outAnim: 'bear_paw_default',
                overAnim: 'bear_paw_default'
            },
            {
                key: 'pause_button',
                x: 1700,
                y: yOffset,
                origin: { x: 1, y: 0.5 },
                outAnim: 'pause_out',
                overAnim: 'pause_over',
                callback: function (this: BaseGame) {
                    this.toggleAudio();
                }.bind(this),
                callbackContext: this
            }
        ]);
        this.highlightActivePaw();
    }

    toggleAudio(){
        if(this.audioPaused){
            this.sound.resumeAll();
            this.audioPaused = false;
        }
        else {
            this.sound.pauseAll();
            this.audioPaused = true;
        }
    }

    highlightActivePaw() {
        let indexOffset = 2;
        let index = Number(this.actScript[1].activity.replace('a', '')) - 1 + indexOffset;
        let button = this.bottomBar.buttons[index];
        button.anims.play('bear_paw_highlight');
        button.removeAllListeners('pointerover');
        button.removeAllListeners('pointerout');
    }

    /**
     * @description transition to the next activity
     */

    nextAct() {
        this.changeAct(this.components[0].next_act);
    }

    /**
     * @description the main method for switching scenes
     * @param key the key of the scene to transition to
     */

    changeAct(key: string) {
        this.transitionUp();
        this.time.addEvent({
            delay: 1000, callback: function (this: BaseGame) {
                AudioManager.stopArray(this);
                this.time.addEvent({
                    delay: 10, callback: function (this: any) {
                        this.scene.start(key);
                    }, callbackScope: this
                });
            }, callbackScope: this
        });
    }

    backToMenu() {
        this.changeAct(CONST.KEYS.SCENES.MAIN_MENU);
    }

    /**
     * @description we generate all of the sprite animations here, since Phaser uses a global animation manager
     */

    createSpriteAnims() {
        super.createSpriteAnims();
        this.anims.create({
            key: 'exit_over',
            frames: this.anims.generateFrameNumbers('exit_button', { frames: Utils.numberArray(1, 29) }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });
        this.anims.create({
            key: 'exit_out',
            frames: this.anims.generateFrameNumbers('exit_button', { frames: [0] }),
            frameRate: CONST.ANIMATION.FRAME_RATE
        });
        this.anims.create({
            key: 'continue_over',
            frames: this.anims.generateFrameNumbers('continue_button', { frames: Utils.numberArray(0, 30) }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });
        this.anims.create({
            key: 'continue_out',
            frames: this.anims.generateFrameNumbers('continue_button', { frames: [0] }),
            frameRate: CONST.ANIMATION.FRAME_RATE
        });
        this.anims.create({
            key: 'pause_over',
            frames: this.anims.generateFrameNumbers('pause_button', { frames: Utils.numberArray(0, 30) }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });
        this.anims.create({
            key: 'pause_out',
            frames: this.anims.generateFrameNumbers('pause_button', { frames: [0] }),
            frameRate: CONST.ANIMATION.FRAME_RATE
        });
        this.anims.create({
            key: 'bear_paw_default',
            frames: this.anims.generateFrameNumbers('bear_paw_breadcrumb', { frames: [1] }),
            frameRate: CONST.ANIMATION.FRAME_RATE
        });
        this.anims.create({
            key: 'bear_paw_highlight',
            frames: this.anims.generateFrameNumbers('bear_paw_breadcrumb', { frames: [0] }),
            frameRate: CONST.ANIMATION.FRAME_RATE
        });
    }

    endActivity() {
        this.bottomBar.endState();
    }
}