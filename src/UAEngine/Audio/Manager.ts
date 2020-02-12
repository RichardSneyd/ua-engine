import SoundArray from './SoundArray';
import _ = require('lodash');

class AudioManager {
    static lowSongVol: number = 0.5;
    static activeArray: SoundArray;


    static playArrayHard(scene: Phaser.Scene, index: number, audio: string[], callBack?: Function, callBackContext?: any, canSkip?: boolean) {
        // let config: Phaser.Types.Time.

        scene.time.addEvent({
            delay: 10, callback: function (this: any) {
                AudioManager.stopArray(scene);

                AudioManager.changeSongVolume(AudioManager.lowSongVol);
                AudioManager.activeArray = new SoundArray(scene, audio, index, callBack, callBackContext, canSkip);
            }, callbackScope: this
        });
    }

    public static stopArray(scene: Phaser.Scene){
     //   scene.time.addEvent({
         //   delay: 10, callback: function (this: any) {
        if (AudioManager.activeArray != null) {
            AudioManager.activeArray.destroy();
            this.activeArray = null;
          //  delete this.activeArray;      
        }
   // }, callbackScope: this
//});
    }

    static changeSongVolume(vol: number) {

    }
}

export default Manager;
