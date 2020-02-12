enum Target {
    AR = '',
    ACT = '',
    WARMUP = 'WarmUpSong',
    WARMUP2X = 'WarmUpSong2X',
    GOODNIGHT = 'k1_demo_polar_a6'
}

export default class SidePanel extends Phaser.GameObjects.Sprite {
    target: Target;
    switchScene: Function;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, switchScene: Function){
        super(scene, x, y, texture);
        this.setInteractive();
        this.setOrigin(1, 0);
        this.on('pointermove', this.move.bind(this));
        this.on('pointerdown', this.down.bind(this));
        this.on('pointerout', this.out.bind(this));
        this.scene.add.existing(this);
        this.switchScene = switchScene;
    }

    move(){
      this.updateSelection();
    }

    updateSelection(){
        let mouseY: number = this.scene.input.activePointer.y;
        let stepHeight: number = this.height / 5;

        if(mouseY > this.y + (stepHeight * 4)){
            this.target = Target.GOODNIGHT;
            this.setFrame(5);
        }
        else if(mouseY > this.y + (stepHeight * 3)){
            this.target = Target.WARMUP2X;
            this.setFrame(4);
        }
        else if(mouseY > this.y + (stepHeight * 2)){
            this.target = Target.WARMUP;
            this.setFrame(3);
        }
        else if(mouseY > this.y + (stepHeight * 1)){
            this.target = Target.ACT;
            this.setFrame(2);
        } else {
            this.target = Target.AR;
            this.setFrame(1);
        }
    }

    out(){
        this.target = null;
        this.setFrame(0);
    }

    down(){
        this.updateSelection();
        if(this.target !== ''){
            this.switchScene(this.target, this.scene);
        }
    }
}