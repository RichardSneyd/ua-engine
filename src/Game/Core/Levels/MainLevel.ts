import ILevel from '../Engine/ILevel';

import Loader from '../Engine/Loader';
import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';
import LevelManager from '../Engine/LevelManager';
import config from '../config';

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

 /*    this.manager.events.timer(() => {
      this._player2.init(150, 150, 'fly_atlas', 'idle1');
      this._player2.addAnimation('idle', '', 5, 10, null);
      this._player2.playAnimation('idle');


      this._player.initSpine(200, 200, 'professor');
      this._player.addSpineAnimation('prof_dance', 0.1);
      this._player.playSpineAnimation('prof_dance');
      this._player.addTween('xyTween', 'Bounce.Out');
      this._player.playTween('xyTween', { x: 500, y: 500 }, 6000, () => {

      });

      this.manager.events.timer(() => {
        console.log("GLOBAL PAUSE!!");
        this._manager.events.fire('pauseAll');
      }, 1000, this);


      this.manager.events.timer(() => {
        console.log("GLOBAL RESUME!!");
        this._manager.events.fire('resumeAll');
      }, 4000, this);

    }, 2000, this); */
    this.manager.events.once('preload', this.preload, this);
    this.manager.events.once('start', this.start, this);
    this.manager.events.on('newRow', this.onNewRow, this);

    /* this.manager.events.once('testevent', (data: any)=>{
      console.log('testevent data: ', data);
      debugger;
    }, this);
    this.manager.events.fire('testevent', {name: 'testdata', caller: this}); */

    this._loader.loadActScript(scriptName, (script: any, data: any) => {

      this.manager.script.init(scriptName, script, ['audio_id', 'time'], ['config'], ['text']);
      // console.log(this.manager.script.rows);
      //   debugger;
      this.manager.events.fire('preload');
    });

    // demo code showcasing events and timers....
    let i = 0;
    let tail = '.';
    this.manager.events.timer(function (this: any) {
      console.warn('executing callback %s repeat at: ', i, this);
      i++;
      if (i == 3) {
        this.manager.events.timer(2000, function (this: any) {
          tail = tail + '.';
          console.warn('repeat forever %s', tail);
        }, this, -1); // a repeat value of -2 means forever, until the timer is removed (events.removeTimer(callback))
      }
    }, 1000, this, 3);
  }

  preload() {
    this._loader.base = config.PATHS.IMG;
    this._loader.addImage('star.png');

    this._loader.base = config.PATHS.SLICE;
    this._loader.addImage('button_over_slice.png');

    this._loader.base = config.PATHS.SPINE;
    this._loader.addAtlas('professor.json');
    this._loader.base = config.PATHS.ATLAS;
    this._loader.addAtlas('fly_atlas.json');

    let audio = this.manager.script.fileList(['audio_id']);
    //  console.log(audio);
    this._loader.addSnds(audio);
    // console.log('addSounds completed');

    this._loader.download();

    this.manager.events.timer(() => {
      this.manager.events.fire('start');
      // this.start();
    }, 4000, this);
  }

  start() {

    //  let actScript: any = this._loader.getActScript('sample_script');
    //this._player.init(100, 100, 'virus1_active1.png');
    let star = this._player.createNew();
    star.init(700, 800, 'star');
    star.moveTo(600, 600);
    // debugger;
    star.enableInput();
    star.makePixelPerfect(200);
    console.log('bug: ', star);

    star.addInputListener('pointerdown', (evt: any) => {
      console.warn('over the pixels yo! at.. ', new Date().getTime());
    }, this);

   /*  let slice = this._player2.createNew();
    console.log('new entity: ', slice);
    slice.initNineSlice(600, 600, 'button_over_slice', 20, 20, 20, 20);
    // slice.width = 800;
    slice.enableInput();
    slice.width = 800;
    //  slice.setOrigin(0.5);

    //  slice.setSize(1, 1);
    let drag = false;

    slice.addInputListener('pointerdown', () => {
      drag = true;
      console.log('tapped the slice!');
      //  debugger;
    }, this);

    slice.addInputListener('pointermove', (evt: any) => {
      let origEvent: PointerEvent = evt.data.originalEvent;
      //   console.log('move event triggered for slice: ', evt);
      if (drag == true) {
        //   console.log('event: ', evt);
        slice.moveTo(evt.data.global.x, evt.data.global.y);
        //   console.log(slice.x);
        //   console.log(slice.y);
      }
    }, this);

    slice.addInputListener('pointerup', (evt: PointerEvent) => {
      drag = false;
    }, this);

    this._player2.init(150, 150, 'fly_atlas', 'idle1');
    console.log('just initialized player2 object');
    this._player2.addAnimation('idle', '', 5, 10, null);
    this._player2.playAnimation('idle');

    this._player.initSpine(200, 200, 'professor');
    console.log('just initialized player object');
    this._player.addSpineAnimation('prof_dance', 0.1);
    this._player.playSpineAnimation('prof_dance');

    let text = this._player.createNew();
    text.initText(150, 150, "Highwood Education", { "fill": "red", "fontWeight": "bold" });



    text.addTween('xyTween', 'Bounce.Out');
    text.playTween('xyTween', { x: 500, y: 500 }, 6000, () => {

    });

    this._player.enableInput();
    this._player.addInputListener('pointerdown', (evt: any) => {
      console.warn('pointerdown on professor: ', evt);
    }, this, true);

    this._player2.enableInput();
    this._player2.addInputListener('pointerup', (evt: any) => {
      console.warn('pointerdown on fly: ', evt)
    }, this, true)

    // this.manager.input.addListener


    this.manager.events.timer(() => {
      console.log("PAUSING TWEEN!");
      this._player.pauseTween('xyTween');
    }, 1000, this);


    this.manager.events.timer(() => {
      console.log("RESUMING TWEEN!");
      this._player.resumeTween('xyTween');
    }, 3000, this);


    this.manager.events.timer(() => {
      console.log("PAUSING SPINE!");
      this._player.pauseAnimation('prof_dance');
    }, 8000, this);


    this.manager.events.timer(() => {
      console.log("RESUMING SPINE!");
      this._player.resumeAnimation('prof_dance');
    }, 12000, this);


    this.manager.events.timer(() => {
      console.log("PAUSING ATLAS ANIMATION!");
      this._player2.pauseAnimation('idle');
    }, 14000, this);

    this.manager.events.timer(() => {
      console.log("RESUMING ATLAS ANIMATION!");
      this._player2.resumeAnimation('idle');
    }, 16000, this);


 */


    this._loop.addFunction(this.update, this);
    this._loop.start();

    // a hack to test the audio management system -- input events will be handled by an input handler ultimately 
   /*  let canvas = document.getElementsByTagName('canvas')[0];
    canvas.addEventListener('click', () => {
      this.manager.script.goTo(this.manager.script.rows[0]);
    }); */
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