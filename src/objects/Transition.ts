export default class Transition extends Phaser.GameObjects.Sprite {
    callback: Function;
    callbackContext: any;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, callback: Function, callbackContext: any){
        super(scene, x, y, texture, 0);
        this.callback = callback;
        this.callbackContext = callbackContext;

        scene.add.existing(this);
        this.setOrigin(0, 0);

        let tween = this.scene.tweens.add({targets: this, duration: 1600, easing: Phaser.Math.Easing.Sine.InOut, yoyo: true, y: 0 });
        tween.on('complete', function(this: Transition){
            this.callback(this.callbackContext);
        }, this);
    }
}   