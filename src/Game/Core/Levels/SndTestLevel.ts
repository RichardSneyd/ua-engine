import ILevel from '../Engine/ILevel';

import Loader from '../Engine/Loader';
import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';
import Utils from '../../Utils/Utils';
import BaseLevel from './BaseLevel';
import LevelManager from '../../Services/LevelManager';

abstract class SndTestLevel implements ILevel {
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

        this._loader.base = 'assets/img/';
        this._loader.addImage('virus1.png');
        this._loader.addImage('virus2.png');

        //test load 3 audio files

        this._loader.addSnds(['airplane', 'air', 'adult']);
        console.log('addSounds completed');

        console.log('loader.download called');
        this._loader.download();
        console.log('loader.download finished');

        setTimeout(() => {

            this.start();
        }, 4000);
    }

    start(): void {
        this._player.init(100, 100, 'virus1.png');


        console.log('calling audio.play');
        this.manager.audio.play('airplane', () => {
            console.log('finished playing airplane!');
        });


        this._loop.addFunction(this.update, this);
        this._loop.start();
    }

    update(): void {
        //console.log('updating main');
    }

    shutdown(): void {
        this._loop.removeFunction(this.update);
    }
}

export default SndTestLevel;