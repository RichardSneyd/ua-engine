import BaseGame from './BaseGame';
import { CONST } from '../CONST/CONST';
import ColorPanel from '../objects/OptionPanel';
import Utils from '../Generic/Utils';
import Starburst from '../objects/Starburst';
import SpineActor from '../objects/SpineActor';
import SpineObject from '../objects/SpineObject';

export default class ColorTheBears extends BaseGame {
    protected blankSuffix: string = '_blank';
    protected blankKey: string;
    activeBear: Phaser.GameObjects.Sprite;
    protected spotlight: Phaser.GameObjects.Image;
    protected panel: ColorPanel;
    bearKey: string;
    bear: SpineObject;

    bearUpPos: Phaser.Math.Vector2;
    bearMainPos: Phaser.Math.Vector2;

    constructor(key: string) {
        super(key, ['audio_id'], ['all_images']);
    }

    okPressed() {
        let key = this.activeBear.texture.key;
        let val = key.slice(key.indexOf('_') + 1);
        this.evaluate(val);
        //  this.panel.clearHighlight();
    }

    evaluate(val: string) {
        let row = Utils.findArrElWithPropVal(this.actScript, ['trigger'], [val]).id;
        this.changeRow(row);
        if (this.actScript[2].correct_image === this.actScript[2].biome + '_' + val) {
            let burst = new Starburst(this, this.activeBear.x, this.activeBear.y, this.activeBear, this.playground);
            this.panel.disableAll();
            this.panel.OKDown();
            this.sound.play('starburst');
            // game won logic
        }
    }

    loadAfterJSON() {
        super.loadAfterJSON();
        this.load.setPath(CONST.PATHS.GRAPHICS);
        this.blankKey = this.actScript[0].biome + this.blankSuffix;
        this.load.image(this.blankKey);

        this.load.image('red', 'red.png');
        this.load.image('yellow', 'yellow.png');
        this.load.image('blue', 'blue.png');
        this.load.image('green', 'green.png');
        this.load.image('white', 'white.png');
        this.load.image('spotlight', 'spotlight.png');
        this.load.image('panel_highlight', 'panel_highlight.png');


        this.load.setPath(CONST.PATHS.SPRITESHEETS);
        this.load.spritesheet('ok_button', 'ok_button.png', { frameWidth: 186, frameHeight: 144, startFrame: 0, endFrame: 31 });

        this.bearKey = this.actScript[0].biome + '_bear_cub_1';
        this.load.setPath(CONST.PATHS.SPINE);
        this.load.spine(this.bearKey, this.bearKey + '.json', this.bearKey + '.atlas');
    }

    create() {
        super.create();
        this.bearMainPos = new Phaser.Math.Vector2(this.game.canvas.width / 2, this.game.canvas.height / 2 - 180);
        this.bearUpPos = new Phaser.Math.Vector2(this.bearMainPos.x, this.bearMainPos.y - 600);
        this.activeBear = this.add.sprite(this.bearMainPos.x, this.bearMainPos.y, this.blankKey, 0);
        //  this.activeBear = this.createFaller(this.blankKey, new Phaser.Math.Vector2(this.game.canvas.width / 2, this.game.canvas.height / 2 - 180), this.playground);
        this.playground.add(this.activeBear);
    }

    start() {
        let target = this.activeBear.getCenter();
        this.activeBear.y = - this.activeBear.height / 2;
        let tween = this.add.tween({ targets: this.activeBear, y: target.y, duration: 1000, ease: Phaser.Math.Easing.Bounce.InOut });
        this.spotlight = this.add.image(this.game.canvas.width / 2, 0, 'spotlight', 0);
        this.spotlight.setOrigin(0.5, 0.2);
        this.spotlight.visible = false;
        this.sound.play('comedy_drop_1');
        super.start();

    }

    changeRow(rowID: number) {
        if (rowID !== 1 && this.spotlight.visible == false) {
            this.spotlight.visible = true;
        }
        super.changeRow(rowID);
        if (this.activeRow.trigger == 'dance_start') {
            this.addDancer();
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

    updateBear(key: string) {
        this.sound.play('comedy_drop');
        let texture = this.actScript[1].biome + '_' + key;
        let oldKey = this.activeBear.texture.key;
        this.activeBear.setTexture(texture);

        this.createFaller(oldKey, this.bearMainPos, this.activeBear.parentContainer);
        this.activeBear.y = this.bearUpPos.y;
        let tween = this.add.tween({ targets: this.activeBear, y: this.bearMainPos.y, duration: 1000, ease: Phaser.Math.Easing.Bounce.InOut });
    }

    createFaller(key: string, pos: Phaser.Math.Vector2, parent: Phaser.GameObjects.Container): Phaser.GameObjects.Sprite {
        let faller: Phaser.GameObjects.Sprite = this.add.sprite(pos.x, pos.y, key, 0);
        parent.add(faller);
        let tween = this.add.tween({ targets: faller, y: faller.y + 1000, ease: Phaser.Math.Easing.Sine.InOut });
        this.time.addEvent({
            delay: 1000, callback: function (this: any) {
                faller.destroy();
            }, callbackScope: this
        });

        return faller;
    }

    endActivity() {
        super.endActivity();

    }

    addDancer() {
        this.activeBear.destroy();
        //@ts-ignore
        this.bear = new SpineObject(this, this.bearMainPos.x, this.bearMainPos.y, this.bearKey, this.playground, 'bear_congrats', true, 'bear_idle');
        //@ts-ignore
        this.bear.spine.setScale(1.5);
        //@ts-ignore
        this.bear.moveY(100);
        //@ts-ignore
        let burst = new Starburst(this, this.bearMainPos.x, this.bearMainPos.y, this.bear, this.playground);
    }

}

export class FiveOptions extends ColorTheBears {
    colors: string[];
    constructor(key: string, colors: string[]) {
        super(key);
        this.colors = colors;
    }

    loadAfterJSON() {
        super.loadAfterJSON();
        // load graphics
        this.load.setPath(CONST.PATHS.GRAPHICS);
        this.load.image('panel_5_options', 'panel_5_options.png');
        this.load.image('black', 'black.png');
    }

    create() {
        super.create();
        // red, yellow, blue, green, white
        let origin = new Phaser.Geom.Point(0.5, 0.5);
        let sharedY: number = -95;
        this.panel = new ColorPanel(this, 350, this.game.canvas.height - this.bottomBar.height, 'panel_5_options', this.underHUD, [
            {
                key: this.colors[0],
                x: 131,
                y: sharedY,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear(this.colors[0]);
                }.bind(this),
                callbackContext: this,
            },
            {
                key: this.colors[1],
                x: 372,
                y: sharedY,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear(this.colors[1]);
                }.bind(this),
                callbackContext: this,
            },
            {
                key: this.colors[2],
                x: 609,
                y: sharedY,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear(this.colors[2]);
                }.bind(this),
                callbackContext: this,
            },
            {
                key: this.colors[3],
                x: 859,
                y: sharedY,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear(this.colors[3]);
                }.bind(this),
                callbackContext: this,
            },
            {
                key: this.colors[4],
                x: 1111,
                y: sharedY,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear(this.colors[4]);
                }.bind(this),
                callbackContext: this,
            }

        ], this.okPressed.bind(this), 'panel_highlight');
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
}

export class TenOptions extends ColorTheBears {
    constructor(key: string) {
        super(key);
    }

    loadAfterJSON() {
        super.loadAfterJSON();
        // load graphics
        this.load.setPath(CONST.PATHS.GRAPHICS);
        this.load.image('panel_10_options', 'panel_10_options.png');

        this.load.image('orange', 'orange.png');
        this.load.image('pink', 'pink.png');
        this.load.image('brown', 'brown.png');
        this.load.image('purple', 'purple.png');
        this.load.image('black', 'black.png');
    }

    create() {
        super.create();

        let origin = new Phaser.Geom.Point(0.5, 0.5);
        let sharedY: number = -240;
        let sharedY2: number = -95;
        this.panel = new ColorPanel(this, 350, this.game.canvas.height - this.bottomBar.height, 'panel_10_options', this.underHUD, [
            {
                key: 'red',
                x: 131,
                y: sharedY,
                origin: origin,
                callback: function (this: ColorTheBears) {
                    this.updateBear('red');
                }.bind(this),
                callbackContext: this,
            },
            {
                key: 'yellow',
                x: 372,
                y: sharedY,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear('yellow');
                }.bind(this),
                callbackContext: this,
            },
            {
                key: 'blue',
                x: 609,
                y: sharedY,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear('blue');
                }.bind(this),
                callbackContext: this,
            },
            {
                key: 'green',
                x: 859,
                y: sharedY,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear('green');
                }.bind(this),
                callbackContext: this,
            },
            {
                key: 'purple',
                x: 1111,
                y: sharedY,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear('purple');
                }.bind(this),
                callbackContext: this,
            },
            {
                key: 'orange',
                x: 131,
                y: sharedY2,
                origin: origin,
                callback: function (this: ColorTheBears) {
                    this.updateBear('orange');
                }.bind(this),
                callbackContext: this,
            },
            {
                key: 'pink',
                x: 372,
                y: sharedY2,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear('pink');
                }.bind(this),
                callbackContext: this,
            },
            {
                key: 'brown',
                x: 609,
                y: sharedY2,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear('brown');
                }.bind(this),
                callbackContext: this,
            },
            {
                key: 'white',
                x: 859,
                y: sharedY2,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear('white');
                }.bind(this),
                callbackContext: this,
            },
            {
                key: 'black',
                x: 1111,
                y: sharedY2,
                origin: origin,
                callback: function (this: any) {
                    this.updateBear('black');
                }.bind(this),
                callbackContext: this,
            }

        ], this.okPressed.bind(this), 'panel_highlight');
    }
}