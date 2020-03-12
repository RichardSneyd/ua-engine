import ILevel from '../Engine/ILevel';

import Loader from '../Engine/Loader';
import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';

class MainLevel implements ILevel {
  private _loop: Loop; _player: Entity; _loader: Loader;

  constructor(loop: Loop, player: Entity, loader: Loader) {
    this._loop = loop;
    this._player = player;
    this._loader = loader;
  }

  init(): void {
    console.log('started main!');

    setTimeout(() => {
      this._player.init(100, 100, 'virus1.png');
    }, 5000);

    this._loader.base = 'assets/img/';
    this._loader.addImage('virus1.png');
    this._loader.addImage('virus2.png');
    this._loader.download();

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

export default MainLevel;