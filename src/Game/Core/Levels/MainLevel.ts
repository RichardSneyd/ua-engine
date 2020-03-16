import ILevel from '../Engine/ILevel';

import Loader from '../Engine/Loader';
import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';
import LevelManager from '../../Services/LevelManager';

class MainLevel implements ILevel {
  protected _manager: LevelManager; _loop: Loop; _player: Entity; _loader: Loader;


  constructor(manager: LevelManager, loop: Loop, player: Entity, loader: Loader) {
    this._manager = manager;
    this._loop = loop;
    this._player = player;
    this._loader = loader;
    // this._utils = utils;
  }

  get manager(): LevelManager {
    return this._manager;
  }


  init(): void {
    //test load a json file

    /*   this._loader.addJSON('sample_script.json');
      this._loader.downloadJSON(()=>{
          console.log('loaded json')
    }, this); */

    //  let actScript: any = this._loader.getActScript('sample_script');

    setTimeout(() => {
      this._player.init(150, 150, 'virus1_active1.png');
      this._player.addAnimation('active', 'virus1_', 6, 20, null);
      this._player.playAnimation('active');
    }, 5000);

    this._loader.base = 'assets/img/';
    this._loader.addImage('virus1_active1.png');
    this._loader.addImage('virus1_active2.png');
    this._loader.addImage('virus1_active3.png');
    this._loader.addImage('virus1_active4.png');
    this._loader.addImage('virus1_active5.png');
    this._loader.addImage('virus1_active6.png');

    //test load 3 audio files

    this._loader.addSnds(['airplane', 'air', 'adult']);
    console.log('addSounds completed');


    this._loader.download();

    this._player.init(100, 100, 'virus1_active1.png');

    this._loop.addFunction(this.update, this);
    this._loop.start();

    // a hack to test the audio management system -- input events will be handled by an input handler ultimately 
    let canvas = document.getElementsByTagName('canvas')[0];
    console.log('click event')
    canvas.addEventListener('click', () => {
      console.log('calling audio.play');
      this.manager.audio.playInstructionArr(['airplane', 'air', 'adult'], () => {
        console.log('finished playing airplane!');
      });

    });
  }

  update(): void {
    //console.log('updating main');
    this._player.update();
  }

  shutdown(): void {
    this._loop.removeFunction(this.update);
  }
}

export default MainLevel;