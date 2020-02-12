import Base from "./Base";
import { CONST } from "../CONST/CONST";
import UIButton from "../Generic/HUD/UIButton";
import Utils from "../Generic/Utils";

export enum Festival {
    AUTUMN = 'autumn',
    DEFAULT = 'default',
    SPRING = 'spring',
    CHRISTMAS = 'christmas',
    HALLOWEEN = 'hallowween',
    EASTER = 'easter',
    DRAGON = 'dragon'
}


class FestivalButton extends Phaser.GameObjects.Sprite {
    callback: Function;
    callbackContext: any;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, callback: Function, callbackContext: any) {
        super(scene, x, y, texture, 0);
        this.callback = callback;
        this.callbackContext = callbackContext;
        this.setInteractive();
        this.on('pointerdown', this.down);
        scene.add.existing(this);
    }

    down() {
        this.callback(this, this.callbackContext);
    }
}
export default class FestivalSelection extends Base {
    bgSprite: Phaser.GameObjects.Sprite;
    buttons: FestivalButton[] = [];
    okButton: Phaser.GameObjects.Sprite;
    highlight: Phaser.GameObjects.Sprite;
    centerX: number;

    playground: Phaser.GameObjects.Container;
    HUD: Phaser.GameObjects.Container;

    festivals: string[] = [
        'default',
        'spring',
        'dragon',
        'autumn',
        'easter',
        'halloween',
        'christmas'
    ]

    constructor() {
        super('FestivalSelection');
    }

    preload() {
        super.preload();
        this.load.setPath(CONST.PATHS.GRAPHICS);
        this.load.image('bear_activity6_bg', 'bear_activity6_bg.jpg');
        this.load.image('festival_autumn', 'festival_autumn.png');
        this.load.image('festival_default', 'festival_default.png');
        this.load.image('festival_spring', 'festival_spring.png');
        this.load.image('festival_christmas', 'festival_christmas.png');
        this.load.image('festival_halloween', 'festival_halloween.png');
        this.load.image('festival_easter', 'festival_easter.png');
        this.load.image('festival_dragon', 'festival_dragon.png');
        this.load.image('festival_highlight', 'festival_highlight.png');

        this.load.setPath(CONST.PATHS.SPRITESHEETS);
        this.load.spritesheet('ok_button', 'ok_button.png', { frameWidth: 186, frameHeight: 144, startFrame: 0, endFrame: 31 });
    }

    festivalClicked(button: FestivalButton) {
        let festival = button.texture.key.replace('festival_', '');
        CONST.FESTIVAL = festival;
        this.highlight.x = button.x;
        this.highlight.y = button.y;
    }

    create() {
        this.createSpriteAnims();
        super.create();
        this.playground = this.add.container(0, 0);
        this.HUD = this.add.container(0, 0);
        this.playground.x = this.game.canvas.width / 2;
        this.bgSprite = this.add.sprite(0, 0, 'bear_activity6_bg', 0);
        this.bgSprite.setOrigin(0, 0);
        this.centerX = this.game.canvas.width / 2;
        this.highlight = this.add.sprite(0, 0, 'festival_highlight');
        this.highlight.setOrigin(0.5, 0.6);
        let startY: number = 550;
        let unit = 70;
        for (let x = 0; x < this.festivals.length; x++){
            let key = 'festival_' + this.festivals[x];
            let y = startY + unit*x;
            this.buttons.push(new FestivalButton(this, this.centerX, y, key, this.festivalClicked.bind(this), this));
        }
        this.highlight.x = this.buttons[0].x;
        this.highlight.y = this.buttons[0].y;
        CONST.FESTIVAL = 'default';

       this.createOKButton();
    }

    createOKButton(){
        this.okButton = this.add.sprite(this.game.canvas.width  - 200, this.game.canvas.height + 10, 'ok_button');
        this.okButton.setOrigin(1, 1).setInteractive();
        this.okButton.on('pointerdown', this.okPressed.bind(this));
        this.okButton.on('pointerover', function(this: FestivalSelection){
            this.okButton.play('ok_over');
        }, this);

        this.okButton.on('pointerout', function(this: FestivalSelection){
            this.okButton.play('ok_out');
        }, this);
    }

    createSpriteAnims(){
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

    okPressed(){
        this.scene.start(CONST.KEYS.SCENES.MAIN_MENU);
    }
}