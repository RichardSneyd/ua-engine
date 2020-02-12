import SpineObject from "./SpineObject";

export default class Starburst extends SpineObject {


    constructor(scene: Phaser.Scene, x: number, y: number, target: Phaser.GameObjects.GameObject, container: Phaser.GameObjects.Container) {
        super(scene, x, y, 'starburst', container, 'starburst_out', false, 'starburst_out');
        //@ts-ignore

       // container.swap(this.spine, target);

        scene.time.addEvent({delay: 1000, callback: function(this: any){
            this.destroy();
        }, callbackScope: this})
    }

    destroy(){
        this.spine.destroy();
    }

}