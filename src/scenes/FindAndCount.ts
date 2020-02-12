import BaseGame from './BaseGame';
import HiddenObject from '../objects/HideReveal';
import { CONST } from '../CONST/CONST';
import Utils from '../Generic/Utils';
import Starburst from '../objects/Starburst';
import _ = require('lodash');

export default class FindAndCount extends BaseGame {
  objectCount: number;
  objectsFound: number;
  objectConfig: any[];
  objects: Array<HiddenObject>;
  numberLabels: Array<Phaser.GameObjects.Sprite> = [];
  counterPrefix: string = 'reveal_bears_numbers_000';

  constructor(key: string, objectConfig: any[]) {
    super(key, ['audio_id'], []);
    this.objectConfig = objectConfig;
    this.objectCount = objectConfig.length;
    this.objectsFound = 0;
    this.objects = [];
  }

  init() {

  }
  

  updateStage() {
    super.updateStage();
    this.updateBears(this.activeRow);
  }

  updateBears(row: any) {
    // update bear states here

    for (let x = 0; x < this.objects.length; x++) {
      let label = 'bear_' + (x + 1);
      this.objects[x].setState(row[label], row[label + '_loop']);
    }
    /*    this.objects[0].setState(row.bear_left, row.bear_left_loop);
       this.objects[1].setState(row.bear_middle, row.bear_middle_loop);
       this.objects[2].setState(row.bear_right, row.bear_right_loop); */
    //   debugger;
  }

  preload() {
    // don't load activity script assets here, use loadAfterJSON
    super.preload();
  }

  loadAfterJSON() {
    // use this to load assets based on the activity script
    super.loadAfterJSON();
    this.load.setPath(CONST.PATHS.GRAPHICS);

    this.loadCountMarkers();

    // this.load.image('gateway', 'park_gateway.png');

    this.load.setPath(CONST.PATHS.SPINE);
    // console.log('spine path should be ' + CONST.PATHS.SPINE);

    this.loadObjects();

    this.load.setPath('spine/');

  }

  loadCountMarkers() {
    for (let x = 1; x < 6; x++) {
      let key = this.counterPrefix + x;
      this.load.image(key, key + '.png');
    }
  }

  loadObjects() {
    this.load.setPath(CONST.PATHS.SPINE);
    for (let x = 0; x < this.objectConfig.length; x++) {
      let conf = this.objectConfig[x];
      this.load.spine(conf.key, conf.key + '.json', [conf.key + '.atlas'], true);
    }
  }

  wipe() {
    HiddenObject.wipe();
    this.objectsFound = 0;
    this.objects = [];
  }

  create() {
    this.wipe();
    super.create();

    // this.add.sprite
    let x = this.game.canvas.width / 2;
    let y = this.game.canvas.height / 2;

    /*  this.input.on('pointerdown', function (this: FindAndCount) {
       this.newActor();
     }, this); */

  }

  start(){
    super.start();
    this.createObjects();
  }


  createObjects() {
    for (let x = 0; x < this.objectConfig.length; x++) {
      let conf = this.objectConfig[x];
      let row = this.actScript[1];
      let index = x + 1;
      let label = 'bear_' + index;
      this.objects.push(new HiddenObject(this, conf.x, conf.y, conf.key, this.playground, this.objectFound.bind(this), this, row[label], true, conf.idleAnim));
      this.playground.sort('y');
      //  this.objects[x].setState(label, Utils.concatStrings([label, index], '_'));
      if (x > 0) {
        //@ts-ignore
        // this.objects[x].spine.setScale(0.4);
      }
    }
  }

  objectFound(object: HiddenObject) {
    this.sound.play('harp');
    this.objectsFound++;
    this.numberObject(object);
    let index = this.objects.indexOf(object) + 1;
    let indexString = index.toString();
    let trigger = Utils.concatStrings(['bear', indexString], '_')
    let rows = Utils.allElementsWithPropVal(this.actScript, ['trigger'], [trigger]);
    // debugger;
    this.changeRow(rows[this.objectsFound - 1].id);
    //  this.evalState();
  }

  numberObject(object: HiddenObject) {
    //@ts-ignore
    let numLabel = this.add.sprite(object.getX(), object.getY(), this.counterPrefix + this.objectsFound);
    object.parent.add(numLabel);
    //@ts-ignore
    let burst = new Starburst(this, object.getX(), object.getY(), object.spine, this.playground);
  }

  audioComplete() {
    super.audioComplete();
    HiddenObject.enableAll();
  }

  changeRow(rowID: number) {
    // HiddenObject.disableAll();
    super.changeRow(rowID);
  }

  evalState() {

    if (this.objectsFound < this.objectCount) {

    }
    else {
      this.endActivity();
    }
  }

  endActivity() {
    super.endActivity();
    //  HiddenObject.wipe();
  }


}

export class Find_Polar extends FindAndCount {

  constructor(key: string) {
    super(key, [
      {
        key: 'polar_bear_adult',
        x: 330,
        y: 400,
        idleAnim: 'bear_idle'
      },
      {
        key: 'polar_bear_cub_1',
        x: 900,
        y: 550,
        idleAnim: 'bear_idle'
      },
      {
        key: 'polar_bear_cub_1',
        x: 1470,
        y: 520,
        idleAnim: 'bear_idle_side'
      }
    ]);
  }
}

export class Find_Brown extends FindAndCount {

  constructor(key: string) {
    super(key, [
      {
        key: 'brown_bear_adult1',
        x: 386,
        y: 340,
        idleAnim: 'bear_idle'
      },
      {
        key: 'brown_bear_cub_1',
        x: 638,
        y: 530,
        idleAnim: 'bear_idle'
      },
      {
        key: 'brown_bear_cub_1',
        x: 992,
        y: 406,
        idleAnim: 'bear_idle'
      },
      {
        key: 'brown_bear_cub_1',
        x: 1240,
        y: 558,
        idleAnim: 'bear_idle_side'
      },
      {
        key: 'brown_bear_adult2',
        x: 1510,
        y: 293,
        idleAnim: 'bear_idle'
      }
    ]);
  }
}

export class Find_Panda extends FindAndCount {

  constructor(key: string) {
    super(key, [
      {
        key: 'panda_bear_adult1',
        x: 500,
        y: 390,
        idleAnim: 'bear_idle'
      },
      {
        key: 'panda_bear_cub_1',
        x: 1000,
        y: 550,
        idleAnim: 'bear_idle'
      },
      {
        key: 'panda_bear_cub_1',
        x: 1470,
        y: 520,
        idleAnim: 'bear_idle_side'
      }
    ]);
  }
}
