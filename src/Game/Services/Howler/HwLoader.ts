import {Howler, Howl} from 'howler';
import HwFactory from './HwFactory';

class HwLoader {
    _factory: HwFactory;
    _howls: Howl[];
    constructor(factory: HwFactory){
       this._factory = factory;
       this._howls = [];
    }



    loadSounds(urls: string[], extensions: string[], onDone: Function, context: any) {
      //  console.log('in HwLoader.loadSounds.');
      //  console.log(urls);
        let i = 0;
        this.loadSound(i, urls, extensions, onDone, context);
    }

    loadSound(i: number, urls: string[], extensions: string[], onDone: Function, context: any){
        let _i = i;
    //    console.log('in HwLoader.loadSound..');
        if(_i<urls.length){
            let howl = this._factory.createHowl(urls[_i], extensions, ()=>{
            //    console.log('loaded %s successfully...', [urls[_i].toString()]); 
                _i++;     
                this.loadSound(_i, urls, extensions, onDone, context);
            });
            if(howl !== null){
                this._howls.push(howl);
            }
        }
        else {
         //   console.log('loaded %s sounds, finished now....', i);
            onDone(this._howls);
        }
    }

  /*   public addOnLoad(onLoad: any) {
        this._loader.onLoad.add(onLoad);
    } */
}

export default HwLoader;