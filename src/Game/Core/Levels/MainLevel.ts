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
    console.log("init main!");
  }

  preload() {
    
  }

  start() {

  }

  

  update(time: number): void {

  }

  shutdown(): void {
    this._loop.removeFunction(this.update);
  }
}

export default MainLevel;