import BaseGame from './BaseGame';
import House from '../objects/House';
import Utils from '../Generic/Utils';
import { CONST } from '../CONST/CONST';
import OptionPanel from '../objects/OptionPanel';
import ElementsPanel from '../objects/ElementsPanel';
import Bear from '../objects/SpineActor';

export interface Elements {
    roofs: string[],
    walls: string[],
    doors: string[],
    windows: string[],
    decor: string[]
}

enum Step {
    WALL = 1,
    ROOF,
    DOOR,
    WINDOW,
    DECOR
}

export default class BuildAHouse extends BaseGame {
    house: House;

    elements: Elements;
    icons: Elements;

    answer: string;
    step: Step;
    numOfSteps: number;
    panel: ElementsPanel;

    bears: Array<Bear>;
    baseKey: string;
    bearConfig: any[];
    outroProp: Phaser.GameObjects.Sprite;

    constructor(key: string, bearConfig: any[]) {
        super(key, ['audio_id'], ['all_images']);
        this.elements = { roofs: [], walls: [], doors: [], windows: [], decor: [] };
        this.icons = { roofs: [], walls: [], doors: [], windows: [], decor: [] };
        this.bearConfig = bearConfig;
    }

    preload() {
        super.preload();
    }

    loadAfterJSON() {
        super.loadAfterJSON();
        let biome = this.actScript[1].biome;
        //let roofs: string[] = [], walls: string[] = [], doors: string[] = [], windows: string[] = [];
        this.elements.roofs = this.genElementKeys(biome, 'roof', 3);
        this.elements.walls = this.genElementKeys(biome, 'wall', 3);
        this.elements.doors = this.genElementKeys(biome, 'door', 3);
        this.elements.windows = this.genElementKeys(biome, 'window', 3);
        this.elements.decor = this.genElementKeys(biome, 'decor', 3);


        this.icons.roofs = this.genIconKeys(biome, 'roof', 3);
        this.icons.walls = this.genIconKeys(biome, 'wall', 3);
        this.icons.doors = this.genIconKeys(biome, 'door', 3);
        this.icons.windows = this.genIconKeys(biome, 'window', 3);
        this.icons.decor = this.genIconKeys(biome, 'decor', 3);

        let e = this.elements, i = this.icons;
        let allElements = this.elements.roofs.concat(e.walls, e.doors, e.windows, e.decor, i.roofs, i.walls, i.doors, i.windows, i.decor);
        this.load.setPath(CONST.PATHS.GRAPHICS);
        for (let x = 0; x < allElements.length; x++) {
            this.load.image(allElements[x]);
        }

        this.baseKey = 'base_' + this.actScript[1].biome;
        this.load.image(this.baseKey, this.baseKey + '.png');

        this.load.image('panel_3_options', 'panel_3_options.png');
        this.load.image('panel_highlight_large', 'panel_highlight_large.png');
        for (let x = 1; x <= 3; x++){
            let biome = this.actScript[1].biome;
            this.load.image(biome + '_outro_' + x);
        }
        this.loadBears();

        this.load.setPath(CONST.PATHS.SPRITESHEETS);
        this.load.spritesheet('ok_button', 'ok_button.png', { frameWidth: 186, frameHeight: 144, startFrame: 0, endFrame: 31 });
        this.load.spritesheet('panel_house_nav', 'panel_house_nav.png', { frameWidth: 189, frameHeight: 172});
    }

    loadBears() {
        this.load.setPath(CONST.PATHS.SPINE);
        for (let x = 0; x < this.bearConfig.length; x++) {
            let conf = this.bearConfig[x];
            this.load.spine(conf.key, conf.key + '.json', [conf.key + '.atlas'], true);
        }
    }

    genElementKeys(biome: string, type: string, count: number): string[] {
        let array: string[] = [];
        for (let x = 1; x <= count; x++) {
            array.push(Utils.concatStrings([biome, type + x], '_'));
        }
        return array;
    }

    genIconKeys(biome: string, type: string, count: number): string[] {
        let array: string[] = [];
        for (let x = 1; x <= count; x++) {
            array.push(Utils.concatStrings([biome, type + x, 'icon'], '_'));
        }
        return array;
    }

    changeToStep(step: number, trigger: string) {

    }

    resetOptions() {
        let ar = this.activeRow;
        let icons: string[] = ar.all_images.split(',');
        for (let x = 0; x < icons.length; x++) {
            icons[x] = icons[x] + '_icon';
        }
        this.panel.resetOptions(icons);
    }


    backStep() {
        let step = this.step - 1, trigger = 'back_arrow';
        // this.changeToStep(this.step - 1, 'back_arrow');
        if(this.house.unlocked >= step){
            if (step <= this.numOfSteps && step > 0) {
                this.step = step;
                let rows = Utils.allElementsWithPropVal(this.actScript, ['trigger'], [trigger]);
                this.changeRow(rows[this.step - 1].id);
                this.panel.updateArrows(this.step, this.house.unlocked);
                this.resetOptions();
            }
        }
    }

    forwardStep() {
        let step = this.step + 1, trigger = 'forward_arrow';
        //   this.changeToStep(this.step + 1, 'forward_arrow');
        if(this.house.unlocked >= step){
            if (step <= this.numOfSteps && step > 0) {
                this.step = step;
                let rows = Utils.allElementsWithPropVal(this.actScript, ['trigger'], [trigger]);
                this.changeRow(rows[this.step - 2].id);
                this.resetOptions();
                this.panel.updateArrows(this.step, this.house.unlocked);
            }
        }
        // this.panel.update();
    }

    create() {
        super.create();
        this.wipe();
        this.house = new House(this, 480, 0, this.baseKey, this.actScript[2].biome);
        this.playground.add(this.house);

        let ar = this.actScript[2];
        let icons: string[] = ar.all_images.split(',');
        this.panel = new ElementsPanel(this, 350, this.game.canvas.height - this.bottomBar.height, 'panel_3_options', this.underHUD, [
            {
                key: icons[0] + '_icon',
                x: 190,
                y: -140,
                callback: this.highlightRight.bind(this),
                callbackContext: this
            },
            {
                key: icons[1] + '_icon',
                x: 560,
                y: -140,
                callback: this.highlightRight.bind(this),
                callbackContext: this
            },
            {
                key: icons[2] + '_icon',
                x: 930,
                y: -140,
                callback: this.highlightRight.bind(this),
                callbackContext: this
            },
            {
                key: 'panel_house_nav',
                x: 0,
                y: -140,
                callback: function (this: BuildAHouse) {
                    this.backStep();
                }.bind(this),
                callbackContext: this
            },
            {
                key: 'panel_house_nav',
                x: 1140,
                y: -140,
                callback: function (this: BuildAHouse) {
                    this.forwardStep();
                }.bind(this),
                callbackContext: this
            }
        ], this.changeOption.bind(this), this.okButton.bind(this), 'panel_highlight_large', 3, 4);

        this.createBears();
    }

    highlightRight(){
        this.panel.highlightRight();
    }

    showOK(){
        this.panel.showOK();
    }

    okButton(){
        // ok button logic
        let row = Utils.findArrElWithPropVal(this.actScript, ['trigger'], ['ok_button']);
        this.changeRow(row.id);
        this.panel.disableAll();
        this.panel.OKDown();
    }

    createBears() {
        for (let x = 0; x < this.bearConfig.length; x++) {
            let conf = this.bearConfig[x];
            let row = this.actScript[1];
            let index = x + 1;
            let label = 'bear_' + index;
            this.bears.push(new Bear(this, conf.x, conf.y, conf.key, this.playground, null, this, row[label], true, conf.idleAnim));

            //  this.objects[x].setState(label, Utils.concatStrings([label, index], '_'));
            // if(x > -1){
            //@ts-ignore
            //   this.bears[x].spine.setScale(0.4);
            //   }
        }
    }

    wipe() {
        this.step = 1;
        this.answer = '';
        this.numOfSteps = 5;
        this.bears = [];
    }

    changeOption(optionKey: string) {
        let row = Utils.findArrElWithPropVal(this.actScript, ['trigger'], [optionKey]);
        this.changeRow(row.id);
        this.time.addEvent({
            delay: 100, callback: function (this: any) {
                this.evaluate(optionKey);
            }, callbackScope: this
        })
    }

    evaluate(optionKey: string) {
        if (this.step == Step.WALL) {
            this.house.setWall(optionKey);
        }
        else if (this.step == Step.ROOF) {
            this.house.setRoof(optionKey);
        }
        else if (this.step == Step.DOOR) {
            this.house.setDoor(optionKey);
        }
        else if (this.step == Step.WINDOW) {
            this.house.setWindow(optionKey);
        }
        else if (this.step == Step.DECOR) {
            this.house.setDecor(optionKey);
            this.panel.showOK();
            
        }
        /*   if (this.step < 2) {
              let row = Utils.allElementsWithPropVal(this.actScript, ['trigger'], [this.answer])[this.step];
              this.changeRow(row.id);
  
              if (val == this.actScript[2].correct_image) {
                  this.bears[this.step].eatOnce();
                  this.step++;
                  if (this.step >= 2) {
                      this.panel.disableAll();
                  }
              }
          } */

    }

    createSpriteAnims() {
        super.createSpriteAnims();
        this.anims.create({
            key: 'ok_out',
            frames: this.anims.generateFrameNumbers('ok_button', { frames: [0] }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });
        this.anims.create({
            key: 'ok_over',
            frames: this.anims.generateFrameNumbers('ok_button', { frames: Utils.numberArray(0, 30) }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });


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
    }

    changeRow(rowID: number) {
        super.changeRow(rowID);
       // this.resetOptions();
       let biome = this.activeRow.biome;
       let key1 = biome + '_outro_1';
       let key2 = biome + '_outro_2';
       let key3 = biome + '_outro_3';
       if(this.activeRow.trigger == key1){
           this.outroProp = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, key1);
           this.playground.add(this.outroProp);

           this.panel.destroy();
       }
       else if(this.activeRow.trigger == key2){
           this.outroProp.setTexture(key2);
       }
       else if(this.activeRow.trigger == key3){
           this.outroProp.setTexture(key3);
       }
       else if(this.activeRow.trigger == 'outro_finish'){
           this.outroProp.visible = false;
       }
    }

    audioComplete() {
        super.audioComplete();
        // this.resetOptions();
    }

}

export class Build_Polar extends BuildAHouse {

    constructor(key: string) {
        super(key, [
            {
                key: 'polar_bear_cub_1',
                x: 1450,
                y: 630,
                idleAnim: 'bear_idle'
            }]);
    }
}

export class Build_Brown extends BuildAHouse {

    constructor(key: string) {
        super(key, [
            {
                key: 'brown_bear_cub_1',
                x: 1450,
                y: 630,
                idleAnim: 'bear_idle'
            }]);
    }
}

export class Build_Panda extends BuildAHouse {

    constructor(key: string) {
        super(key, [
            {
                key: 'panda_bear_cub_1',
                x: 1450,
                y: 630,
                idleAnim: 'bear_idle'
            }]);
    }
}