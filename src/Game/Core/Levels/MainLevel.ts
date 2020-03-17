import ILevel from '../Engine/ILevel';

import Loader from '../Engine/Loader';
import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';
import LevelManager from '../Engine/LevelManager';

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
    canvas.addEventListener('click', () => {
      this.manager.audio.playInstructionArr(['airplane', 'air', 'adult'], () => {
        console.log('audio arr playback completed');
      });

    });

    this.manager.events.on('kissme', () => {
      console.log('you kissed me!');
    })

    this.manager.events.on('kissme', this.hugMe.bind(this));
    console.log(this.manager.events.events);
    this.manager.events.fire('kissme');
    this.manager.events.off('kissme', this.hugMe);
    console.log(this.manager.events.events);
    this.manager.events.fire('kissme');
    console.log('removing kissme event...');
    this.manager.events.removeEvent('kissme');
    this.manager.events.fire('kissme');
    this.manager.events.once('testonce', ()=>{
      console.log('called oncetest, and it executed!!');
    });
    this.manager.events.fire('testonce');
    console.log('if once works, it should not execute next');
    this.manager.events.fire('testonce');
    debugger;
  }

  hugMe() {
    console.log('and you hugged me');
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