export interface ButtonConfig {
    key: string;
    x: number;
    y: number;
    callback: Function;
    callbackContext: any;
    origin?: Vector2D;
    overAnim?: string;
    outAnim?: string;
}

export interface ButtonAnimationConfig {
    out?: string;
    over?: string;
}

export interface Anim {
    name: string;
    startFrame: number;
    endFrame: number;
    loop: boolean;
}

export interface Vector2D {
    x: number;
    y: number;
}

export default class UIButton extends Phaser.GameObjects.Sprite {
    callback: Function;
    callbackContext: any;
    animsConfig: ButtonAnimationConfig;
    parent: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, callback: Function, callbackContext: any, parent: Phaser.GameObjects.Container, animsConfig: ButtonAnimationConfig) {
        super(scene, x, y, texture, 0);
        this.callback = callback;
        this.callbackContext = callbackContext;
        this.animsConfig = animsConfig;

        this.setInteractive();
        this.on('pointerdown', function (this: UIButton) {
            if (this.callback !== null) {
                this.callback(this.callbackContext);
            }
        }, this);
        this.on('pointerover', function (this: UIButton) {
            this.over();
        });
        this.on('pointerout', function (this: UIButton) {
            this.out();
        })

        this.scene.add.existing(this);
        this.parent = parent;
        this.parent.add(this);

        this.out();
    }

    out() {
        if (this.animsConfig.out != null) {
            this.play(this.animsConfig.out);
        }
    }

    over() {
        if (this.animsConfig.over != null) {
            this.play(this.animsConfig.over);
        }
    }
}