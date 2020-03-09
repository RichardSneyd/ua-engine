import {Game, GameObjects, Scene} from 'phaser';

import IScreen from '../Services/IScreen';
import PhGame from '../Services/Phaser/PhGame';
import PhGraphics from '../Services/Phaser/PhGraphics';

class Screen implements IScreen {
  private _phGame: PhGame; _phGraphics: PhGraphics;

  constructor(phGame: PhGame, phGraphics: PhGraphics) {
    this._phGame = phGame;
    this._phGraphics = phGraphics;

    console.log("a screen has been createed!");
  }

  createScreen(width: number, height: number, elementId: string): void {
    this._phGame.init(width, height, elementId);
  }

  createReact(x: number, y: number, width: number, height: number): GameObjects.Graphics {
    console.log('scene', this._phGame.scene)
    return this._phGraphics.drawRect(this._phGame.scene, x, y, width, height);
  }

  clearScreen(): void {
    this._phGame.clearScreen();
  }
}

export default Screen;