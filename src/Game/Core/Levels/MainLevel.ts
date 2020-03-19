import ILevel from '../Engine/ILevel';

import Loader from '../Engine/Loader';
import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';
import LevelManager from '../Engine/LevelManager';

class MainLevel implements ILevel {
  protected _manager: LevelManager; _loop: Loop; _player: Entity; _loader: Loader;
  //protected _script: any;


  constructor(manager: LevelManager, loop: Loop, player: Entity, loader: Loader) {
    this._manager = manager;
    this._loop = loop;
    this._player = player;
    this._loader = loader;
   // this._script = [];
    // this._utils = utils;
  }

  get manager(): LevelManager {
    return this._manager;
  }

  init(scriptName: string): void {
    //test load a json file

    this.manager.events.once('preload', this.preload.bind(this));
    this.manager.events.once('start', this.start.bind(this));
    this.manager.events.on('newRow', this.onNewRow.bind(this));

    this._loader.loadActScript(scriptName, (script: any, data: any) => {
      
      this.manager.init(scriptName, script, ['images', 'audio_id'], ['settings']);
      this.manager.events.fire('preload');
    });
    
  }
  
  preload() {
    
    this._loader.base = 'assets/img/';
    this._loader.addAtlas('fly_atlas.json');
 
    let audio = this.manager.script.fileList(['audio_id']);
    console.log(audio);
    this._loader.addSnds(audio);
    console.log('addSounds completed');

    this._loader.download();

    setTimeout(() => {
     this.manager.events.fire('start');
    // this.start();
    }, 4000);
  }

  start() {

    //  let actScript: any = this._loader.getActScript('sample_script');
    //this._player.init(100, 100, 'virus1_active1.png');

    this._player.init(150, 150, 'fly_atlas', 'idle1');
    this._player.addAnimation('idle', '', 5, 24, null);
    this._player.playAnimation('idle');


    this._loop.addFunction(this.update, this);
    this._loop.start();

    // a hack to test the audio management system -- input events will be handled by an input handler ultimately 
    let canvas = document.getElementsByTagName('canvas')[0];
    canvas.addEventListener('click', () => {
        this.manager.script.goTo(this.manager.script.rows[0]);
    });

  }

  onNewRow(){
    
    this.manager.audio.playInstructionArr(this.manager.script.active.audio_id, () => {
      this.manager.script.goToAutoNext();
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