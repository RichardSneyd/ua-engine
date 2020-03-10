import {Game, GameObjects, Scene} from 'phaser';
import PhFactory from './PhFactory';

class PhGraphics {
  private _phFactory: PhFactory;

  constructor(phFactory: PhFactory) {
    this._phFactory = phFactory;
  }

  drawRect(scene: Scene, x: number, y: number, width: number, height: number): GameObjects.Graphics {
    let thickness = 4;
    let color = 0x00ff00;
    let alpha = 1;

    let gfx = this._phFactory.createGraphics(scene);
    scene.add.existing(gfx);

    gfx.lineStyle(thickness, color, alpha);
    gfx.strokeRect(x, y, width, height);

    return gfx;
  }
}

export default PhGraphics;