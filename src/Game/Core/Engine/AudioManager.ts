import Loader from './Loader';
import HwPlayer from '../../Services/Howler/HwPlayer';

class AudioManager {

    private _loader: Loader; _hwPlayer: HwPlayer;
    private _playing: string[];
    private _instPlaying: string; // the ID of the instruction audio file currently playing
    private _instArr: string[]; // the array of instructional audio names currently being played through
    private _music: string; // the name of the current music file

    constructor(loader: Loader, hwLoader: HwPlayer) {
        this._loader = loader;
        this._hwPlayer = hwLoader;
        this._playing = [];
        this._instPlaying = '';
        this._instArr = [];
        this._music = '';
    }

    play(name: string, onStop: Function, loop: boolean = false) {
        let _name = name;
      //  console.log('in HwPlayer.play.');
        let res = this._loader.getSndResByBasename(name);
      //  console.log('asked for resource:');
      //  console.log(res);
        if (res !== null) {

            this._hwPlayer.play(name, res, () => {
             //   console.log('callback received for %s in AudioManager', _name)
                this._playing.splice(this._playing.indexOf(name), 1);
                onStop();
            }, loop);
        } else console.log('resource %s returned null', name);

     //   console.log('end of play func');
    }

    playMusic(name: string, onStop: Function, loop: boolean = false){
        // todo
        this._music = name;
        this.play(name, onStop, loop);
    }

    stopMusic(){
        this._stop(this._music);
    }

    stop(name: string){
        this._stop(name);
    }

    private _stop(name: string){
        let res = this._loader.getSndResByBasename(name);
        if(res !== null) {
            this._playing.splice(this._playing.indexOf(name), 1);
            this._hwPlayer.stop(res);
        }
    }

    private _pause(){
        for(let x = 0; x < this._playing.length; x++){
            this._pauseFile(this._playing[x]);
        }
    }

    private _resume(){
        for(let x = 0; x < this._playing.length; x++){
            this._resumeFile(this._playing[x]);
        }
    }

    private _pauseFile(name: string){
        let res = this._loader.getSndResByBasename(name);
        if(res !== null) this._hwPlayer.pause(res);
    }

    private _resumeFile(name: string){
        let res = this._loader.getSndResByBasename(name);
        if(res !== null) this._hwPlayer.resume(res);
    }

    private _playInstruction(i: number, onDone: Function){
     //   console.log('playInst');
        let _i = i,_name = this._instArr[i];

       // console.log('_playInstruction started for sound %s at position %s, time: %s', _name, _i, new Date().getMilliseconds());
      //  console.log('instArr length: ' + this._instArr.length);
        this._instPlaying = _name;
        this.play(_name, ()=>{
            _i++;
          //  console.log('playing %s, at position %s, time: %s', _name, _i, new Date().getMilliseconds());
            if(_i < this._instArr.length){
              //  setTimeout(()=>{
                    this._playInstruction(_i, onDone);
              //  }, 100)
                
            } else {
         //       console.log('play loop finished on %s at position %s, time: %s', _name, _i, new Date().getMilliseconds  ());
        //        debugger;
                onDone();
            }
        });
    }

    playInstructionArr(arr: string[], onDone: Function){
        this._stopInstPlaying(); // clean the palette
        this._instArr = arr; // new instructional array
     //   console.log('playInstructionalArr called..');
     //   debugger;
        this._playInstruction(0, onDone);
    }

    _stopInstPlaying(){
        this._instArr = [];
        let res = this._loader.getSndResByBasename(this._instPlaying);
        if(res !== null){
            this._hwPlayer.stop(res);
            this._instPlaying = '';
        }
    }

    get filesPlaying() {
        return this._playing;
    }



}

export default AudioManager;