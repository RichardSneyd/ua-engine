import BaseGame from './BaseGame';
import Trash from '../Generic/GameObjects/Sprite/TapToDisappear';
import { CONST } from '../CONST/CONST';
import Utils from '../Generic/Utils';
import Starburst from '../objects/Starburst';
import _ = require('lodash');
import Bear from '../objects/SpineActor';
import Transition from '../objects/Transition';

export default class ClickToGather extends BaseGame {
  objectCount: number;
  objectsFound: number;
  bearConfig: any[];
  trashConfig: any[];
  bears: Array<Bear>;
  trash: Array<Trash>;
  transitionKey: string;
  transition: Transition;
  //numberLabels: Array<Phaser.GameObjects.Sprite> = [];
  counterPrefix: string = 'reveal_bears_numbers_000';

  constructor(key: string, bearConfig: any[], trashConfig: any[]) {
    super(key, ['audio_id'], ['all_images']);
    this.bearConfig = bearConfig;
    this.trashConfig = trashConfig;
    this.objectCount = trashConfig.length;
    this.objectsFound = 0;
    this.bears = [];
    this.trash = [];
  }

  init() {

  }

  updateStage() {
    super.updateStage();
    this.updateBears(this.activeRow);
  }

  updateBears(row: any) {
    // update bear states here

    for (let x = 0; x < this.bears.length; x++) {
      let label = 'bear_' + (x + 1);
      this.bears[x].setState(row[label], row[label + '_loop']);
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
    this.transitionKey = Utils.concatStrings(['transition_clean', this.biome], '_');
    this.load.image(this.transitionKey, this.transitionKey + '.png');

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
    for (let x = 0; x < this.bearConfig.length; x++) {
      let conf = this.bearConfig[x];
      this.load.spine(conf.key, conf.key + '.json', [conf.key + '.atlas'], true);
    }
  }

  wipe() {
    Bear.wipe();
    this.objectsFound = 0;
    this.bears = [];
    this.trash = [];
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

    this.createBears();
    this.createTrash();
  }

  createTrash() {
    for (let x = 0; x < this.trashConfig.length; x++) {
      let conf = this.trashConfig[x];
      this.trash.push(new Trash(this, conf.x, conf.y, conf.key, 0, this.playground, this.objectFound.bind(this), this));
    }
  }

  createBears() {
    for (let x = 0; x < this.bearConfig.length; x++) {
      let conf = this.bearConfig[x];
      let row = this.actScript[1];
      let index = x + 1;
      let label = 'bear_' + index;

      this.bears.push(new Bear(this, conf.x, conf.y, conf.key, this.playground, this.objectFound.bind(this), this, row[label], true, conf.idleAnim));

      //  this.objects[x].setState(label, Utils.concatStrings([label, index], '_'));
      // if(x > -1){
      //@ts-ignore
      //   this.bears[x].spine.setScale(0.4);
      //   }
    }
  }

  objectFound(object: Trash) {
    this.objectsFound++;
    //  this.numberObject(object);
    let burst = new Starburst(this, object.getX(), object.getY(), object, this.playground);
    let index = this.trash.indexOf(object) + 1;
    let indexString = index.toString();
    let trigger = object.texture.key;
    let rows = Utils.allElementsWithPropVal(this.actScript, ['trigger'], [trigger]);
    // debugger;
    this.changeRow(rows[this.objectsFound - 1].id);
    //  this.evalState();
    this.transitionClean();
  }

  transitionClean() {
    this.transition = new Transition(this, 0, this.game.canvas.height, this.transitionKey, this.transitionComplete.bind(this), this);
    this.underHUD.add(this.transition);
  }

  transitionComplete() {
    this.transition.destroy();

  }

  audioComplete() {
    super.audioComplete();
    Bear.enableAll();
  }

  changeRow(rowID: number) {
    // Bear.disableAll();
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
    Bear.wipe();
  }


}
// blue_bucket,fish_skeleton,blue_spill,snowballs

export class Clean_Polar extends ClickToGather {
  constructor(key: string, ) {
    super(key, [
      {
        key: 'polar_bear_cub_1',
        x: 640,
        y: 530,
        idleAnim: 'bear_idle_side'
      },
      {
        key: 'polar_bear_cub_1',
        x: 1370,
        y: 530,
        idleAnim: 'bear_idle'
      }

    ],
      [
        {
          key: 'blue_bucket',
          x: 700,
          y: 750,
        },
        {
          key: 'fish_skeleton',
          x: 1000,
          y: 530,
        },
        {
          key: 'blue_spill',
          x: 1240,
          y: 660,
        },
        {
          key: 'snowballs',
          x: 1500,
          y: 730,
        }
      ])
  }
}

export class Clean_Brown extends ClickToGather {
  constructor(key: string, ) {
    super(key, [
      {
        key: 'brown_bear_cub_1',
        x: 640,
        y: 540,
        idleAnim: 'bear_idle_side'
      },
      {
        key: 'brown_bear_cub_1',
        x: 1350,
        y: 550,
        idleAnim: 'bear_idle'
      }
    ],
      [
        {
          key: 'red_bucket',
          x: 696,
          y: 736,
        },
        {
          key: 'berry_mess',
          x: 944,
          y: 548,
        },
        {
          key: 'orange_spill',
          x: 1196,
          y: 774,
        },
        {
          key: 'sticks',
          x: 1540,
          y: 686,
        }
      ])
  }
}

export class Clean_Panda extends ClickToGather {
  constructor(key: string, ) {
    super(key, [
      {
        key: 'panda_bear_cub_1',
        x: 1370,
        y: 530,
        idleAnim: 'bear_idle_side'
      },
      {
        key: 'panda_bear_cub_1',
        x: 500,
        y: 500,
        idleAnim: 'bear_idle'
      }
    ],
      [
        {
          key: 'blue_bucket',
          x: 696,
          y: 672,
        },
        {
          key: 'bamboo_mess',
          x: 1024,
          y: 526,
        },
        {
          key: 'yellow_spill',
          x: 1228,
          y: 726,
        },
        {
          key: 'leaves',
          x: 1500,
          y: 730,
        }
      ])
  }
}
