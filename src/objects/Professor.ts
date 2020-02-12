import SpineObject from "./SpineObject";

export default class Professor extends SpineObject {
    static xOffset: number = 175;
    static yOffset: number = 240;
    paused: boolean = false;

    constructor(scene: Phaser.Scene, key: string, container: Phaser.GameObjects.Container) {
        super(scene, Professor.xOffset, scene.game.canvas.height - Professor.yOffset, key, container, 'prof_idle', true, 'prof_idle');

        this.spine.setInteractive();
        this.spine.on('pointerdown', function (this: Professor) {
            if (this.paused == false) {
                this.scene.sound.pauseAll();
                this.paused = true;
            }
            else {
                this.scene.sound.resumeAll();
            }
            
            this.paused = false; 
        }, this)
    }


}