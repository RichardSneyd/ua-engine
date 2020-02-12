import UIButton, { ButtonConfig } from "../Generic/HUD/UIButton";
import UIBar from "../Generic/HUD/UIBar";
import Utils from "../Generic/Utils";

export default class ElementsPanel extends UIBar {
    callback: Function;
    highlightPanel: Phaser.GameObjects.Sprite;
    leftArrow: UIButton;
    rightArrow: UIButton;
    okCallback: Function;
    okButton: UIButton;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, topContainer: Phaser.GameObjects.Container, buttonConfig: ButtonConfig[], callback: Function, okCallback: Function, highlightKey: string, leftArrowIndex: number, rightArrowIndex: number) {
        super(scene, x, y, texture, topContainer, buttonConfig);
        //  this.x = x - (this.width / 2);
        this.callback = callback;
        this.okCallback = okCallback;
        this.setOrigin(0, 1);
        this.buttons.push(new UIButton(scene, 1390, -60, 'ok_button', this.okCallback, this, this.parentContainer, {
            over: 'ok_over',
            out: 'ok_out'
        }));
        this.okButton = this.buttons[this.buttons.length - 1];
        this.okButton.visible = false;
        this.highlightPanel = new Phaser.GameObjects.Sprite(scene, 0, 0, highlightKey);
        //  this.highlightPanel.setScale(1.3);
        this.parentContainer.add(this.highlightPanel);

        this.parentContainer.moveTo(this.highlightPanel, this.parentContainer.getIndex(this) + 1);
        this.clearHighlight();
        this.leftArrow = this.buttons[leftArrowIndex];
        this.leftArrow.setScale(-1, 1);
        this.rightArrow = this.buttons[rightArrowIndex];
       // this.animateArrows();
       this.leftArrow.setFrame(0);
       this.rightArrow.setFrame(2);
        
        this.parentContainer.sendToBack(this.leftArrow);
        this.parentContainer.sendToBack(this.rightArrow);
        this.leftArrow.visible = false;
        this.buttons.forEach(function (this: any, button: UIButton, index: number, array: UIButton[]) {
            button.on('pointerdown', function (this: any) {
                if (button.texture.key == 'panel_house_nav') {
                    this.clearHighlight();
                }
                else if(button.texture.key == 'ok_button'){
                    // todo
                }
                else {
                    this.highlight(button);
                    // let key: string = 
                    this.callback(button.texture.key.replace('_icon', ''));
                }
            }.bind(this), this);
        }, this);
    }

    animateArrows(){
        let arrows = [this.leftArrow, this.rightArrow];
        for(let x = 0; x < arrows.length; x++){
            arrows[x].setFrame(2);
            arrows[x].on('pointerover', function(this: any){
                arrows[x].setFrame(0);
            }, this);
            arrows[x].on('pointerdown', function(this: any){
                arrows[x].setFrame(1);
            }, this);
            arrows[x].on('pointerup', function(this: any){
                arrows[x].setFrame(2);
            }, this);
            arrows[x].on('pointerout', function(this: any){
                arrows[x].setFrame(2);
            }, this);
        }
    }

    toggleLeftArrow(step: number) {
        if (step == 1) {
            this.leftArrow.visible = false;
        }
        else {
            this.leftArrow.visible = true;
        }
        // this.toggleVisible(this.leftArrow);
    }

    toggleVisible(object: Phaser.GameObjects.Sprite) {
        if (object.visible) {
            object.visible = false;
        }
        else {
            object.visible = true;
        }
    }

    updateArrows(step: number, unlocked: number) {
        this.toggleLeftArrow(step);
        this.toggleRightArrow(step, unlocked);
    }

    highlightRight(){
        this.rightArrow.setFrame(1);
    }

    unhighlightRight(){
        this.rightArrow.setFrame(2);
    }

    toggleRightArrow(step: number, unlocked: number) {
        if (step == 5) {
            this.rightArrow.visible = false;
        }
        else {
            this.rightArrow.visible = true;
        }

        if(unlocked > step){
            this.highlightRight();
        }
        else {
            this.unhighlightRight();
        }
    }

    highlight(button: UIButton) {
        this.highlightPanel.setX(button.x);
        this.highlightPanel.setY(button.y);
        this.highlightPanel.visible = true;
    }

    clearHighlight() {
        this.highlightPanel.visible = false;
    }

    resetOptions(keys: string[]) {
        for (let x = 0; x < keys.length; x++) {
            this.buttons[x].setTexture(keys[x]);
        }
    }

    OKDown(){
        this.scene.add.tween({targets: this.okButton, duration: 1000, y: this.okButton.y + 200});
    }

    disableAll() {
        this.buttons.forEach(function (this: any, button: UIButton, index: number, array: UIButton[]) {
            button.disableInteractive();
        }, this);
    }

    showOK(){
        this.okButton.visible = true;
    }

    destroy(){
        this.buttons.forEach(function (this: any, button: UIButton, index: number, array: UIButton[]) {
            button.destroy();
        }, this);
        this.highlightPanel.destroy();
        super.destroy();
    }
}
