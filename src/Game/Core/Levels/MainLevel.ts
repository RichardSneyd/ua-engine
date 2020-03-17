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
      this._player.init(150, 150, 'fly_atlas', 'idle1');
      this._player.addAnimation('idle', '', 5, 2, null);
      this._player.playAnimation('idle');
    }, 5000);

    this._loader.base = 'assets/img/';
    this._loader.addImage('virus1_active1.png');
    this._loader.addImage('virus1_active2.png');
    this._loader.addImage('virus1_active3.png');
    this._loader.addImage('virus1_active4.png');
    this._loader.addImage('virus1_active5.png');
    this._loader.addImage('virus1_active6.png');
    this._loader.addAtlas('fly_atlas.json');
    this._loader.download();

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