import {Application, Sprite} from 'pixi.js';

import IScreen from '../Services/IScreen';
import PxGame from '../Services/Pixi/PxGame';

class Screen implements IScreen {
  private _pxGame: PxGame;

  constructor(pxGame: PxGame) {
    this._pxGame = pxGame;

    console.log("a screen has been createed!");
  }

  public createScreen(width: number, height: number, elementId: string): void {
    this._pxGame.init(width, height, elementId);
  }

  public createSprite(x: number, y: number, name: string, frame: string | null): any {
    return this._pxGame.addSprite(x, y, name, frame);
  }

  public createSpine(name: string): any {
    return this._pxGame.addSpine(name);
  }

  public changeTexture(sprite: Sprite, name: string, frame: string | null = null): void {
    this._pxGame.updateTexture(sprite, name, frame);
  }

  public clearScreen(): void {
    this._pxGame.clearScreen();
  }
}

export default Screen;