import Base from "./Base";
import { CONST } from "../CONST/CONST";
import Utils from "../Generic/Utils";
import UIBar from "../Generic/HUD/UIBar";

export default class WarmUpSong extends Base {
    vidKey: string = 'warm_up_song';
    video: Phaser.GameObjects.Video;
    bgSprite: Phaser.GameObjects.Sprite;

    background: Phaser.GameObjects.Container;
    playground: Phaser.GameObjects.Container;
    foreground: Phaser.GameObjects.Container;
    HUD: Phaser.GameObjects.Container;
    underHUD: Phaser.GameObjects.Container;
    bottomBar: UIBar;
    firstTap: boolean = false;

    constructor(key) {
        super(key);
    }

    preload() {
        super.preload();
        this.load.setPath(CONST.PATHS.VIDEOS);
        this.load.video(this.vidKey, [this.vidKey + '.mp4'], 'canplay');

        this.load.setPath(CONST.PATHS.GRAPHICS);
        this.load.image(CONST.UI.BAR_TEXTURE, CONST.UI.BAR_TEXTURE + '.png');
        this.load.image('bear_activity6_bg', 'bear_activity6_bg.jpg');

        // load spritesheets
        this.load.path = CONST.PATHS.SPRITESHEETS;
        this.load.spritesheet('continue_button', 'continue_button.png', { frameWidth: 119, frameHeight: 121, startFrame: 0, endFrame: 31 });
        this.load.spritesheet('exit_button', 'exit_button.png', { frameWidth: 120, frameHeight: 188, startFrame: 0, endFrame: 30 });
        this.load.spritesheet('bear_paw_breadcrumb', 'bear_paw_breadcrumb.png', { frameWidth: 98, frameHeight: 89, startFrame: 0, endFrame: 1 });
    }


    create() {
        this.firstTap = false;
        this.background = this.add.container(0, 0)
        this.playground = this.add.container(0, 0);
        this.foreground = this.add.container(0, 0);
        this.underHUD = this.add.container(0, 0);
        this.HUD = this.add.container(0, 0);

        this.bgSprite = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'bear_activity6_bg');
        this.background.add(this.bgSprite);

        this.video = new Phaser.GameObjects.Video(this, this.game.canvas.width / 2, 0, this.vidKey);
        this.video.setOrigin(0.5, 0);
        this.video.visible = true;
        // this.video.
        this.playground.add(this.video);
        this.video.setScale(0.85);
        this.video.setInteractive();
        this.video.on('pointerdown', function (this: WarmUpSong) {
            if (this.firstTap == false) {
              //  console.log('first tap!');
                this.firstTap = true;
                this.video.play();
            }
            else {

                 if (this.video.isPaused() == false) {
                    this.video.setPaused(true);
                }
                else {
                    this.video.setPaused(false);
                } 

            }


        }, this);

        this.createHUD();

        console.log('video me baby');
    }

    update() {
        this.video.updateTexture();
    }

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
                callback: function (this: WarmUpSong) {
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
                callback: function (this: WarmUpSong) {
                    // this.nextAct();
                    this.changeAct(CONST.KEYS.SCENES.MAIN_MENU);
                }.bind(this),
                callbackContext: this
            }


        ]);
    }

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
    }

}
