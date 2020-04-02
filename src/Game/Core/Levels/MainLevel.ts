import ILevel from '../Engine/ILevel';

import Loader from '../Engine/Loader';
import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';
import LevelManager from '../Engine/LevelManager';

class MainLevel implements ILevel {
  protected _manager: LevelManager; _loop: Loop; _player: Entity; _loader: Loader; _player2: Entity;


  constructor() {
    this._manager = (<any>window).UAENGINE.levelManager;
    this._loop = (<any>window).UAENGINE.loop;
    this._loader = (<any>window).UAENGINE.loader;

    this._player = (<any>window).UAENGINE.entity.createNew();
    this._player2 = (<any>window).UAENGINE.entity.createNew();
    // this._utils = utils;
  }

  get manager(): LevelManager {
    return this._manager;
  }

  init(): void {
    let scriptName = 'sample_script';

    this.manager.events.once('preload', this.preload, this);
    this.manager.events.once('start', this.start, this);
    this.manager.events.on('newRow', this.onNewRow, this);

    this._loader.loadActScript(scriptName, (script: any, data: any) => {

      this.manager.init(scriptName, script, ['images', 'audio_id'], ['settings']);
      this.manager.events.fire('preload');
    });

    // demo code showcasing events and timers....
    let i = 0;
    let tail ='.';
    this.manager.events.timer(1000, function(this: any){
      console.warn('executing callback %s repeat at: ', i, this);
      i++;
      if(i == 3){
          this.manager.events.timer(2000, function(this: any){
              tail = tail + '.';
              console.warn('repeat forever %s', tail);
          }, this, -1); // a repeat value of -2 means forever, until the timer is removed (events.removeTimer(callback))
      }
  }, this, 3); 


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

    this._player.initText(150, 150, "Highwood Education", {"fill": "red","fontWeight": "bold" });

    
    
    this._player.addTween('xyTween', 'Bounce.Out');
    this._player.playTween('xyTween', {x: 500, y: 500}, 6000, ()=> {
      
    });


    this._loop.addFunction(this.update, this);
    this._loop.start();

    // a hack to test the audio management system -- input events will be handled by an input handler ultimately 
    let canvas = document.getElementsByTagName('canvas')[0];
    canvas.addEventListener('click', () => {
      this.manager.script.goTo(this.manager.script.rows[0]);
    });

  }

  onNewRow() {

    this.manager.audio.playInstructionArr(this.manager.script.active.audio_id, () => {
      this.manager.script.goToAutoNext();
    });
  }


  update(time: number): void {
    //console.log('time %s', time);
    
    this._player.update(time);
  }

  shutdown(): void {
    this._loop.removeFunction(this.update);
  }
}

export default MainLevel;