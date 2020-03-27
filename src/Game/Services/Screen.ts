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

  public createNineSlice(x: number, y: number, name: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): any {
    return this._pxGame.addNineSlice(x, y, name, leftWidth, topHeight, rightWidth, bottomHeight);
  }

  public createSpine(name: string): any {
    return this._pxGame.addSpine(name);
  }

  public enableInput(sprite: any) {
    this._pxGame.enableInput(sprite);
  }

  public disableInput(sprite: any) {
    this._pxGame.disableInput(sprite);
  }
  
  public addListener(event: string, sprite: any, callback: Function, context: any) {
    this._pxGame.addListener(event, sprite, callback, context);
  }

  public removeListener(event: string, sprite: any, callback: Function) {
    this._pxGame.removeListener(event, sprite, callback);
  }

  /* public removeDownListener(sprite: any) {
    this._pxGame.removeDownListeners(sprite);
  }

  public removeUpListener(sprite: any){
    this._pxGame.removeUpListeners;
  } */

  public changeTexture(sprite: Sprite, name: string, frame: string | null = null): void {
    this._pxGame.updateTexture(sprite, name, frame);
  }

  public clearScreen(): void {
    this._pxGame.clearScreen();
  }
}

export default Screen;