///<reference path= '../../typings/phaser3-spine-plugin.d.ts' />

import _ = require("lodash");

export default class SpineObject {
    spine: SpineGameObject;
    parent: Phaser.GameObjects.Container;
    scene: Phaser.Scene; 
    track: number = 1;
    key: string;
    defaultAnimation: string;
    constructor(scene: Phaser.Scene, x: number, y: number, key: string, container: Phaser.GameObjects.Container, animation: string, loop: boolean, defaultAnimation: string) {
        this.scene = scene;
        this.parent = container;
        this.key = key;
        this.defaultAnimation = defaultAnimation;
        this.spine = scene.add.spine(x, y, key, animation, loop);
        //  this.spine = scene.make.spine({ scene, x, y, key, animation, loop });
        this.spine.setInteractive(this.spine.getBounds());
        //   this.changeSkin('default');
        // @ts-ignore
    
        // @ts-ignore
        this.parent.add(this.spine);

        //console.log(container);
    }

    moveY(val: number){
        //@ts-ignore
        this.spine.y += val;
    }

    /**
     * @description set the state of the spine actor. Designed to work easily with activity scripts.
     * @param anim the name of the spine animation, or 'state', to play
     * @param loop whether or not to loop. value should be 'y' for true, or 'n' for false (this minimises errors in the activity scripts)
     */

    setState(anim: string, loop: string){
        let loopBool: boolean = false;
        if(loop.trim() == 'y'){
            loopBool = true;
        }
        else {
            loopBool = false;
        } 

        if(!_.isNil(anim)){
          this.spine.setAnimation(this.track, anim, loopBool);
            if(loopBool == false){
                console.log('add idle for ' + this.key );
                console.log('default: ' + this.defaultAnimation);
                this.spine.addAnimation(this.track, this.defaultAnimation, true, 200);
           
            }
        }
    }


    play(animation: string, loop: boolean){
        this.spine.setAnimation(this.track, animation, loop);
    }

    getKey(){
        return this.key;
    }

    getX(): number {
        //@ts-ignore
        return this.spine.x;
    }

    getY(): number {
        //@ts-ignore
        return this.spine.y;
    }
    reactToPointer(this: SpineObject) {
        /*
        if (this.spine.skeleton.skin.name == 'goblin') {
            this.changeSkin('goblingirl');
        }
        else {
            this.changeSkin('goblin');
        }
        let dir = Phaser.Math.RND.integerInRange(-1, 1);
        if (dir == -1) {
            this.spine.scaleX *= dir;
        }
        this.spine.setAnimation(this.track, 'walk', false);
        this.spine.addAnimation(this.track, 'idle', true, 0);
        this.spine.setToSetupPose();
        this.spine.setAnimation(this.track, 'walk', false);
        this.spine.addAnimation(this.track, 'idle', true); */
    }

    public getAttachments() {
        return this.spine.skeleton.skin.attachments;
    }


    public getSlots() {
        return this.spine.skeleton.slots;
    }

    public changeSkin(skinName: string) {
        // @ts-ignore
        this.spine.setSkin(null);
        // @ts-ignore
        this.spine.setSkinByName(skinName);
    }

}
