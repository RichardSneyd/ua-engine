import UIButton, { ButtonConfig } from './UIButton';
import { CONST } from '../../CONST/CONST';
import Utils from '../Utils/Utils';


class UIBar extends Phaser.GameObjects.Sprite {
     protected scene: Phaser.Scene;
    public buttons: Array<UIButton>;
    protected parent: Phaser.GameObjects.Container;
    protected buttonsConfig: Array<ButtonConfig>;
    protected nextArrow: UIButton;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, topContainer: Phaser.GameObjects.Container, buttonsConfig: Array<ButtonConfig>) {
        super(scene, 0, 0, texture);
        this.scene = scene;
        this.parent = new Phaser.GameObjects.Container(this.scene, x, y, [this]);
        topContainer.add(this.parent);
        this.buttonsConfig = buttonsConfig;
        this.setOrigin(0, 1);

        this.buttons = [];

        this.createButtons();
        this.scene.add.existing(this);
    }


    createButtons() {
        let leftCenter = this.getLeftCenter();
        let rightCenter = this.getRightCenter();

        // generate buttons from config object
        for (let x = 0; x < this.buttonsConfig.length; x++) {
            let btn = this.buttonsConfig[x];
            this.buttons.push(new UIButton(this.scene, btn.x, btn.y, btn.key, btn.callback, btn.callbackContext, this.parent, {
                over: btn.overAnim,
                out: btn.outAnim
            }));
            this.parentContainer.add(this.buttons[this.buttons.length-1]);
        }
        this.nextArrow = this.buttons[1];
    }

    endState(){
        this.nextArrow.removeListener('pointerover', this.nextArrow.over);
        this.nextArrow.play('continue_over');
    }
}

export default UIBar;