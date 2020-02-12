import _ = require("lodash");


export default class SoundArray {
    scene: Phaser.Scene;
    protected allFiles: string[] = [];
    activeSound: Phaser.Sound.BaseSound;
    callBack: Function;
    callBackContext: any;


    constructor(scene: Phaser.Scene, allFiles: string[], startIndex: number, callBack?: Function, callBackContext?: Phaser.Scene, canSkip?: boolean) {
        this.scene = scene;
        this.allFiles = allFiles;
        this.callBack = callBack;
        this.callBackContext = callBackContext;
        this.playArrayFromIndex(scene, startIndex, callBack, callBackContext);
    }

    playArrayFromIndex(scene: Phaser.Scene, index: number, callBack?: Function, callBackContext?: Phaser.Scene) {
        this.activeSound = scene.sound.add(this.allFiles[index]);
        this.activeSound.play();
        this.activeSound.on('complete', function (this: any) {
            if (index < this.allFiles.length-1) {
                this.playArrayFromIndex(scene, index + 1, callBack, callBackContext);
            }
            else {
                if(!_.isNil(callBack)){
                    callBack(callBackContext);
                }
            }
          //  this.destroyActive();
        }, this);
    }

    destroyActive(){
        if(!_.isNil(this.activeSound)){
            this.activeSound.destroy();
        }
    }

    destroy(){
      //  this.activeSound.stop();
      this.destroyActive();
    }
}

