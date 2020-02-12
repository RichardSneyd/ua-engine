import BaseGame from "./BaseGame";
import UIBar from '../Generic/HUD/UIBar';
import Starburst from "../objects/Starburst";
import Utils from "../Generic/Utils";
import { CONST } from "../CONST/CONST";
import OptionPanel from "../objects/OptionPanel";
import Bear from '../objects/SpineActor';
import AudioManager from "../Generic/Audio/Manager";

export default class FeedTheBears extends BaseGame {

    protected panel: OptionPanel;
    protected answer: string;
    protected step: number = 0;
    objectConfig: any[];

    bears: Array<Bear> = [];

    constructor(key: string, objectConfig: any[]) {
        super(key, ['audio_id'], ['all_images']);
        this.objectConfig = objectConfig;
    }

    changeRow(rowID: number){
        super.changeRow(rowID);
        if(this.activeRow.trigger == 'unhighlight'){
            this.panel.clearHighlight();
        }
    }

    okPressed() {
        this.evaluate(this.answer);
    }

    wipe(){
        this.bears = [];
        this.step = 0;
        this.answer = null;
    }

    updateStage() {
        super.updateStage();
        this.updateBears(this.activeRow);
    }

    updateBears(row: any) {
        // update bear states here
        for (let x = 0; x < this.bears.length; x++) {
            let label = 'bear_' + (x + 1);
            this.bears[x].setState(row[label], row[label + '_loop']);
        }
    }

    evaluate(val: string) {
        if (this.step < 2) {
            let row = Utils.allElementsWithPropVal(this.actScript, ['trigger'], [this.answer])[this.step];
            this.changeRow(row.id);

            if (val == this.actScript[2].correct_image) {
                this.bears[this.step].eatOnce();
                this.step++;
                if (this.step >= 2) {
                    this.panel.disableAll();
                    this.panel.OKDown();
                }
            }
        }

    }

    loadAfterJSON() {
        super.loadAfterJSON();
        this.load.setPath(CONST.PATHS.GRAPHICS);
        this.load.image('panel_3_options', 'panel_3_options.png');
        this.load.image('panel_highlight_large', 'panel_highlight_large.png');


        this.load.setPath(CONST.PATHS.SPRITESHEETS);
        this.load.spritesheet('ok_button', 'ok_button.png', { frameWidth: 186, frameHeight: 144, startFrame: 0, endFrame: 31 });

        this.load.setPath(CONST.PATHS.SPINE);
        this.loadObjects();
    }

    updateAnswer(val: string) {
        this.answer = val;
    }

    create() {
        this.wipe();
        super.create();

        let origin = new Phaser.Geom.Point(0.5, 0.5);
        let sharedY: number = -135;

        this.createObjects();

        this.panel = new OptionPanel(this, 350, this.game.canvas.height - this.bottomBar.height, 'panel_3_options', this.underHUD, [
            {
                key: this.actGraphics[0],
                x: 204,
                y: sharedY,
                origin: origin,
                callback: function (this: FeedTheBears) {
                    this.updateAnswer(this.actGraphics[0]);
                }.bind(this),
                callbackContext: this,
            },
            {
                key: this.actGraphics[1],
                x: 566,
                y: sharedY,
                origin: origin,
                callback: function (this: any) {
                    this.updateAnswer(this.actGraphics[1]);
                }.bind(this),
                callbackContext: this,
            },
            {
                key: this.actGraphics[2],
                x: 929,
                y: sharedY,
                origin: origin,
                callback: function (this: any) {
                    this.updateAnswer(this.actGraphics[2]);
                }.bind(this),
                callbackContext: this,
            }
        ], this.okPressed.bind(this), 'panel_highlight_large');
    }

    createObjects() {
        for (let x = 0; x < this.objectConfig.length; x++) {
            let conf = this.objectConfig[x];
            this.bears.push(new Bear(this, conf.x, conf.y, conf.key, this.playground, function (this: any) {
                // bear fed callback
            }, this, conf.idleAnim, false, conf.idleAnim));
            //@ts-ignore
            //  this.bears[x].spine.setScale(0.4);
        }
    }


    createSpriteAnims() {
        super.createSpriteAnims();
        this.anims.create({
            key: 'ok_out',
            frames: this.anims.generateFrameNumbers('ok_button', { frames: [0] }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });
        this.anims.create({
            key: 'ok_over',
            frames: this.anims.generateFrameNumbers('ok_button', { frames: Utils.numberArray(0, 30) }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });
    }

    loadObjects() {
        this.load.setPath(CONST.PATHS.SPINE);
        for (let x = 0; x < this.objectConfig.length; x++) {
            let conf = this.objectConfig[x];
            this.load.spine(conf.key, conf.key + '.json', [conf.key + '.atlas'], true);
        }
    }

    audioComplete(){
        super.audioComplete();
       // this.panel.clearHighlight();
    }
}

export class Feed_Polar extends FeedTheBears {
    constructor(key: string) {
        super(key, [
            {
                key: 'polar_bear_cub_1',
                x: 620,
                y: 520,
                idleAnim: 'bear_idle'
            },
            {
                key: 'polar_bear_cub_1',
                x: 1250,
                y: 540,
                idleAnim: 'bear_idle'
            }
        ])
    }
}

export class Feed_Brown extends FeedTheBears {
    constructor(key: string) {
        super(key, [
            {
                key: 'brown_bear_cub_1',
                x: 620,
                y: 520,
                idleAnim: 'bear_idle'
            },
            {
                key: 'brown_bear_cub_1',
                x: 1250,
                y: 540,
                idleAnim: 'bear_idle'
            }
        ])
    }
}

export class Feed_Panda extends FeedTheBears {
    constructor(key: string) {
        super(key, [
            {
                key: 'panda_bear_cub_1',
                x: 620,
                y: 520,
                idleAnim: 'bear_idle'
            },
            {
                key: 'panda_bear_cub_1',
                x: 1250,
                y: 540,
                idleAnim: 'bear_idle'
            }
        ])
    }
}