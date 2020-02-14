import SpineObject from './SpineObject';

export default class SpineActor extends SpineObject {
    static all: Array<SpineActor> = [];
    
    static enableAll() {
        for (let x = 0; x < SpineActor.all.length; x++){
            SpineActor.all[x].enableInput();
        }
    }
    
    static disableAll() {
        for (let x = 0; x < SpineActor.all.length; x++){
            SpineActor.all[x].disableInput();

        }
    }

    static wipe() { 
        SpineActor.all = [];
    }

    callback: Function;
    callbackContext: any;

    constructor(scene: Phaser.Scene, x: number, y: number, key: string, container: Phaser.GameObjects.Container, callback: Function, callbackContext: any, animation: string, loop: boolean, defaultAnimation: string) {
        super(scene, x, y, key, container, animation, loop, defaultAnimation);
        this.callback = callback;
        this.callbackContext = callbackContext;
        SpineActor.all.push(this);
     //   this.spine.on('pointerdown', this.eatOnce, this);
    }

    eatOnce() {
       // this.eat();
        this.spine.input.enabled = false;
        this.spine.removeListener('pointerdown', this.eatOnce);
        if(this.callback !== null){
            this.callback(this, this.callbackContext);
        }
    }

    eat() {
        this.spine.setAnimation(this.track, 'bear_reveal');
    }

    hide() {
        this.spine.setAnimation(this.track, 'bear_hide');
    }

    enableInput() {
        this.spine.input.enabled = true;
    }

    disableInput() {
        this.spine.input.enabled = false;
    }

    setState(anim: string, loop: string){
        super.setState(anim, loop)
    }


}