import ILevel from '../Engine/ILevel';

import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';

class MainLevel implements ILevel {
  private _loop: Loop; _player: Entity;

  constructor(loop: Loop, player: Entity) {
    this._loop = loop;
    this._player = player;
  }

  init(): void {
    console.log('started main!');

    this._player.init(100, 100);

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