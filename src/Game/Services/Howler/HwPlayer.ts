import Loader from '../../Core/Engine/Loader';
import {Howl} from 'howler';

class HwPlayer {
    private _loader: Loader;
    private _playing: string[];
    
    constructor(loader: Loader){
        this._loader = loader;
        this._playing = [];
    }

    get playing(){
        return this._playing;
    }

    play(name: string,  onStop: Function, loop: boolean = false){
        console.log('in HwPlayer.play.');
        let res = this._loader.getSndResByBasename(name);
        console.log('asked for resource:');
        console.log(res);
        let url = '';
        if(res !== null){
            let howl = <Howl>res.data;
            url = res.url;
    
            if(howl !== null){
                if(loop){
                    howl.loop(true);
                }
                howl.play();
                this._playing.push(res.url);
                howl.once('stop', ()=>{
                    this._playing.splice(this._playing.indexOf(url, 1));
                    onStop();
                });
            }
            else {
                console.log('howl was null');
            }
            console.log('res was null');
        }
        console.log('end of play func');
    }

    getHowlByName(name: string): Howl | null{
        let res = this._loader.getSndResByBasename(name);
        if(res !== null){
            return <Howl>res.data;
        }

        return null;
    }


}

export default HwPlayer;