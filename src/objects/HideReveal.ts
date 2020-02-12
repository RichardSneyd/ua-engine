import SpineObject from './SpineObject';

export default class HideRevealSpineObject extends SpineObject {
    static all: Array<HideRevealSpineObject> = [];
    
    static enableAll() {
        for (let x = 0; x < HideRevealSpineObject.all.length; x++){
            HideRevealSpineObject.all[x].enableInput();
        }
    }
    
    static disableAll() {
        for (let x = 0; x < HideRevealSpineObject.all.length; x++){
            HideRevealSpineObject.all[x].disableInput();

        }
    }

    static wipe() {
        HideRevealSpineObject.all = [];
    }

    callback: Function;
    callbackContext: any;

    constructor(scene: Phaser.Scene, x: number, y: number, key: string, container: Phaser.GameObjects.Container, callback: Function, callbackContext: any, animation: string, loop: boolean, defaultAnimation: string) {
        super(scene, x, y, key, container, animation, loop, defaultAnimation);
        this.callback = callback;
        this.callbackContext = callbackContext;
        HideRevealSpineObject.all.push(this);
        this.spine.on('pointerdown', this.revealOnce, this);
    }

    revealOnce() {
      //  this.reveal();
        this.spine.input.enabled = false;
        this.spine.removeListener('pointerdown', this.revealOnce);
        this.callback(this, this.callbackContext);
    }

    reveal() {
        this.setState('bear_reveal', 'n');
      //  this.spine.setAnimation(this.track, 'bear_reveal');
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


}