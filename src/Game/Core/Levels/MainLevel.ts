import ILevel from '../Engine/ILevel';

import Loader from '../Engine/Loader';
import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';
import LevelManager from '../Engine/LevelManager';

class MainLevel implements ILevel {
  protected _manager: LevelManager; _loop: Loop; _player: Entity; _loader: Loader; _player2: Entity;


  constructor(manager: LevelManager, loop: Loop, loader: Loader, entity: Entity, entity2: Entity) {
    this._manager = manager;
    this._loop = loop;
    this._loader = loader;

    this._player = entity;
    this._player2 = entity2;
    // this._utils = utils;
  }

  get manager(): LevelManager {
    return this._manager;
  }

  init(scriptName: string): void {
    //test load a json file

    /*   this._loader.addJSON('sample_script.json');
      this._loader.downloadJSON(()=>{
          console.log('loaded json')
    }, this); */

    //  let actScript: any = this._loader.getActScript('sample_script');

    setTimeout(() => {
      this._player2.init(150, 150, 'fly_atlas', 'idle1');
      this._player2.addAnimation('idle', '', 5, 10, null);
      this._player2.playAnimation('idle');

      
      this._player.initSpine(200, 200, 'professor');
      this._player.addSpineAnimation('prof_dance', 0.1);
      this._player.playSpineAnimation('prof_dance');
      this._player.addTween('xyTween', 'Bounce.Out');
      this._player.playTween('xyTween', {x: 500, y: 500}, 6000, ()=> {
        
      });

      setTimeout(() => {
        console.log("GLOBAL PAUSE!!");
        this._manager.events.fire('pauseAll');
      }, 1000);


      setTimeout(() => {
        console.log("GLOBAL RESUME!!");
        this._manager.events.fire('resumeAll');
      }, 4000);
      

      /*
      setTimeout(() => {
        console.log("PAUSING TWEEN!");
        this._player.pauseTween('xyTween');
      }, 1000);


      setTimeout(() => {
        console.log("RESUMING TWEEN!");
        this._player.resumeTween('xyTween');
      }, 3000);


      setTimeout(() => {
        console.log("PAUSING SPINE!");
        this._player.pauseAnimation('prof_dance');
      }, 8000);


      setTimeout(() => {
        console.log("RESUMING SPINE!");
        this._player.resumeAnimation('prof_dance');
      }, 12000);


      setTimeout(() => {
        console.log("PAUSING ATLAS ANIMATION!");
        this._player2.pauseAnimation('idle');
      }, 14000);

      setTimeout(() => {
        console.log("RESUMING ATLAS ANIMATION!");
        this._player2.resumeAnimation('idle');
      }, 16000);
      */

    }, 2000);
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
    this._loader.addImage('virus1_active1.png');
    this._loader.addImage('virus1_active2.png');
    this._loader.addImage('virus1_active3.png');
    this._loader.addImage('virus1_active4.png');
    this._loader.addImage('virus1_active5.png');
    this._loader.addImage('virus1_active6.png');
    this._loader.addAtlas('professor.json');
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


  update(time: number): void {
    //console.log('time %s', time);
    
    this._player.update(time);
    this._player2.update(time);
  }

  shutdown(): void {
    this._loop.removeFunction(this.update);
  }
}

export default MainLevel;