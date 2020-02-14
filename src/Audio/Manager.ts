import SoundArray from './SoundArray';
import _ = require('lodash');

/**
 * @description the AudioManager is a static class for handling every operation involving sound.
 */
class AudioManager {
    static lowSongVol: number = 0.5;
    static activeArray: SoundArray;

    private constructor() {} // setting constructor to private stops it from being instantiated by mistake

    /**
     * @description this method plays an array of audio files in succession, and if another audio array is currently playing, stops it.
     * @param scene the scene accessing the method should be passed here as an argument
     * @param index the index to start at in the array of audio files to  be played
     * @param audio a string array of sound file names, to be played in succession
     * @param callBack a callback method to execute when the entire sound array has finished playing
     * @param callBackContext the object to call the callback from
     * @param canSkip if true, the playback of the array can be cut short if the user taps the screen
     */
    static playArrayHard(scene: Phaser.Scene, index: number, audio: string[], callBack?: Function, callBackContext?: any, canSkip?: boolean) {

        scene.time.addEvent({
            delay: 10, callback: function (this: any) {
                AudioManager.stopArray(scene);

                AudioManager.changeSongVolume(AudioManager.lowSongVol);
                AudioManager.activeArray = new SoundArray(scene, audio, index, callBack, callBackContext, canSkip);
            }, callbackScope: this
        });
    }

    /**
     * @description immediately stops the active sound array, of which there is never more than 1.
     * @param scene a reference to the active scene
     */
    public static stopArray(scene: Phaser.Scene){
    
        if (AudioManager.activeArray != null) {
            AudioManager.activeArray.destroy();
            this.activeArray = null;
        }
    }

    static changeSongVolume(vol: number) {

    }
}

export default Manager;
