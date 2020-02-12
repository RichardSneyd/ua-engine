export default class GoPanel extends Phaser.GameObjects.Sprite {
    callback: Function;
    callbackContext: any;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, callback: Function, callbackContext: any, group: Phaser.GameObjects.Container){
        super(scene, x, y, texture, 0);
        this.callback = callback;
        this.callbackContext = callbackContext;
        this.setInteractive();
        scene.add.existing(this);
        group.add(this);
        this.on('pointerdown', function(this: GoPanel){
            this.callback(this.callbackContext);
            this.destroy();
        }, this)
    }
}