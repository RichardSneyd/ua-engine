import UIButton, { ButtonConfig } from "../Generic/HUD/UIButton";
import UIBar from "../Generic/HUD/UIBar";
import Utils from "../Generic/Utils";

export default class OptionPanel extends UIBar {
    okCallback: Function;
    okButton: UIButton;

    highlightPanel: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, topContainer: Phaser.GameObjects.Container, buttonConfig: ButtonConfig[], okCallback: Function, highlightKey) {
        super(scene, x, y, texture, topContainer, buttonConfig);
      //  this.x = x - (this.width / 2);
        this.okCallback = okCallback;
        this.setOrigin(0, 1);
        this.buttons.push(new UIButton(scene, 1390, -60, 'ok_button', this.okCallback, this, this.parentContainer, {
            over: 'ok_over',
            out: 'ok_out'
        }));
        this.okButton = this.buttons[this.buttons.length - 1];
        this.highlightPanel = new Phaser.GameObjects.Sprite(scene, 0, 0, highlightKey);
      //  this.highlightPanel.setScale(1.3);
        this.parentContainer.add(this.highlightPanel);

        this.parentContainer.moveTo(this.highlightPanel, this.parentContainer.getIndex(this)+1);
        this.clearHighlight();

        this.buttons.forEach(function(this: any, button: UIButton, index: number, array: UIButton[]){
            button.on('pointerdown', function(this: any){
                if(button.texture.key == 'ok_button'){
                  //  this.clearHighlight();
                }
                else {
                    this.highlight(button);
                }
            }.bind(this), this);
        }, this);
    }

    OKDown(){
        this.scene.add.tween({targets: this.okButton, duration: 1000, y: this.okButton.y + 200});
    }

    highlight(button: UIButton){
        this.highlightPanel.setX(button.x);
        this.highlightPanel.setY(button.y);
        this.highlightPanel.visible = true;
    }

    clearHighlight(){
        this.highlightPanel.visible = false;
    }

    resetOptions(keys: string[]){
        for(let x= 0; x <keys.length; x++){
            this.buttons[x].setTexture(keys[x]);
        }
    }

    disableAll(){
        this.buttons.forEach(function( this: any, button: UIButton, index: number, array: UIButton[]){
            button.disableInteractive();
        }, this);
    }
}
