import {Howler, Howl} from 'howler';
import HwFactory from './HwFactory';

class HwLoader {
    _factory: HwFactory;
    _howls: Howl[];
    // keep track of exactly what sound resources have been loaded
    _loadedSounds: string[];

    constructor(factory: HwFactory){
       this._factory = factory;
       this._howls = [];
       this._loadedSounds = [];
    }

    loadSounds(urls: string[], extensions: string[], onProgress: Function, onDone: Function, context: any) {
      //  console.log('in HwLoader.loadSounds.');
      //  console.log(urls);
        let i = 0;
        this.loadSound(i, urls, extensions, onProgress, onDone, context);
    }

    /**
     * @description has this sound asset URL already been loaded?
     * @param url the url to check
     */
    loaded(url: string): boolean{
        return this._loadedSounds.indexOf(url) == -1 ?  false : true;
    }

    loadSound(i: number, urls: string[], extensions: string[], onProgress: Function, onDone: Function, context: any){
        let _i = i;
    //    console.log('in HwLoader.loadSound..');
        if(_i<urls.length){
            if(!this.loaded(urls[i])){
                let url = urls[i];
                this._loadedSounds.push(urls[i]);
                let howl = this._factory.createHowl(url, extensions, ()=>{
                //    console.log('loaded %s successfully...', [urls[_i].toString()]); 
                    _i++;     
                    this.loadSound(_i, urls, extensions, onProgress, onDone, context);
                });
                if(howl !== null){
                    this._howls.push(howl);
                    onProgress.bind(context)({data: howl, url: url});
                }
            }
            else {
                console.log('skipping %s, already loaded', urls[i]);
                _i++;     
                this.loadSound(_i, urls, extensions, onProgress, onDone, context);
            }
        }
        else {
            console.log('HwLoader loaded %s sounds, finished now....', i);
          //  console.log(this._howls);
            onDone.bind(context)(this._howls);
        }
    }

  /*   public addOnLoad(onLoad: any) {
        this._loader.onLoad.add(onLoad);
    } */
}

export default HwLoader;