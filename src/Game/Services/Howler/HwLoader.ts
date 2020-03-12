import {Howler, Howl} from 'howler';
import HwFactory from './HwFactory';

class HwLoader {
    _factory: HwFactory;
     
    constructor(factory: HwFactory){
       this._factory = factory;
    }

    loadSounds() {

    }

  /*   public addOnLoad(onLoad: any) {
        this._loader.onLoad.add(onLoad);
    } */
}

export default HwLoader;