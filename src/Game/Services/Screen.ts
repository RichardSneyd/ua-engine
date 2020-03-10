import {Application} from 'pixi.js';

import IScreen from '../Services/IScreen';
import PxGame from '../Services/Pixi/PxGame';

class Screen implements IScreen {
  private _pxGame: PxGame;

  constructor(pxGame: PxGame) {
    this._pxGame = pxGame;

    console.log("a screen has been createed!");
  }

  createScreen(width: number, height: number, elementId: string): void {
    this._pxGame.init(width, height, elementId);
  }

  createReact(x: number, y: number, width: number, height: number): any {
    console.log("rect creation issued");
  }

  clearScreen(): void {
    this._pxGame.clearScreen();
  }
}

export default Screen;