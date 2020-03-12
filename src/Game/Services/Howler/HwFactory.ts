import {Howler, Howl} from 'howler';

class HwFactory {
  constructor() {
    this.createHowl(['arse.ogg', 'arse.mp3'], 'assets/')
  }

  createHowl(src: string[], baseURL: string = ''): Howl {
    return new Howl({
        src: 
    })
  }
  
}

export default HwFactory;

{
    "I": Howl,
    "Am": Howl,
    "A": Howl,
    "Sound": Howl
}