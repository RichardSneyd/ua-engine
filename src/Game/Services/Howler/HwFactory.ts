import {Howler, Howl} from 'howler';

class HwFactory {
  constructor() {
   // this.createHowl(['test.ogg', 'test.mp3'], 'assets/')
  }

  createHowl(url: string, extensions: string[], onLoad: Function): Howl {
    // Debug.info('in HwFactory.createHowl....')
    let _src = [];
    // Debug.info(extensions);
    for(let x = 0; x < extensions.length; x++){
      _src.push(url + '.' + extensions[x]);
    }
    // Debug.info(_src);
    return new Howl({
      src: _src,
      autoplay: false,
      onload: ()=>{
        onLoad();
      }
    });
  }
  
}

export default HwFactory;
