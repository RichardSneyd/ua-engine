import Utils from "../Generic/Utils";

export default class BearsLogo extends Phaser.GameObjects.Sprite {
    selection: string = null;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string){
        super(scene, x, y, texture, 0);
        this.setOrigin(0, 0);
        this.x = scene.game.canvas.width / 2  - this.width / 2;
        
        scene.add.existing(this);
        this.setInteractive();

        this.on('pointermove', this.updateSelection.bind(this), this);

        this.on('pointerout', function(this: BearsLogo){
            this.setIdle();
        }, this);

        this.on('pointerdown', this.goTo.bind(this));
    }

    updateSelection(){
        let left: number = this.getLeftCenter().x;
        let right: number = this.getRightCenter().x;
        let stepWidth: number = 1050 / 3;

        let pointerX = this.scene.input.activePointer.x;
        if(pointerX > (this.x +( stepWidth * 2))){
            this.setPanda();
            
        } 
        else if(pointerX > (this.x + (stepWidth * 1))){
            this.setBrown();
            
        } 
        else {
            this.setPolar();
            
        }
    }

    setPolar(){
        this.anims.play('logo_polar');
        this.selection = 'polar';
    }

    setBrown(){
        this.anims.play('logo_brown');
        this.selection = 'brown';
    }

    setPanda(){
        this.anims.play('logo_panda');
        this.selection = 'panda';
    }

    setIdle(){
        this.anims.play('logo_idle');
        this.selection = null;
    }

    goTo(){
        this.updateSelection();
        if(this.selection !== null){
            this.scene.sound.stopAll();
            this.scene.scene.start(Utils.concatStrings(['k1_demo', this.selection, 'a1'], '_'));
        }
    }
}