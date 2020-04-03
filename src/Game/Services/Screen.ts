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

  public createContainer(x: number, y: number): any {
    return this._pxGame.addContainer(x, y);
  }

  public createSprite(x: number, y: number, name: string, frame: string | null): any {
    return this._pxGame.addSprite(x, y, name, frame);
  }

  public createSpine(name: string): any {
    return this._pxGame.addSpine(name);
  }

  public createText(x: number, y: number, text: string, style: any = undefined): any {
    return this._pxGame.addText(x, y, text, style);
  }

  public changeTexture(sprite: Sprite, name: string, frame: string | null = null): void {
    this._pxGame.updateTexture(sprite, name, frame);
  }

  public clearScreen(): void {
    this._pxGame.clearScreen();
  }

  public resize(x: number, y: number): void {
    this._pxGame.resize(x, y);
  }
}

export default Screen;