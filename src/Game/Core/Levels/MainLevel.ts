import ILevel from '../Engine/ILevel';

import Loader from '../Engine/Loader';
import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';
import LevelManager from '../../Services/LevelManager';

class MainLevel implements ILevel {
  private _manager: LevelManager;_loop: Loop; _player: Entity; _loader: Loader;

  constructor(manager: LevelManager, loop: Loop, player: Entity, loader: Loader) {
    this._manager = manager;
    this._loop = loop;
    this._player = player;
    this._loader = loader;
  }

  get manager() : LevelManager {
    return this._manager;
  }

  init(): void {
    console.log('started main!');

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
    this._loader.download();
   
  /*   this._loader.download(()=>{
      console.log('loaded!!');
    }); */

    this._loop.addFunction(this.update, this);
    this._loop.start();
  }

  update(): void {
    this._player.update();
  }

  shutdown(): void {
    this._loop.removeFunction(this.update);
  }
}

export default MainLevel;