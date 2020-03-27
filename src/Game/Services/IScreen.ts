import {Sprite} from 'pixi.js';

interface IScreen {
  createScreen(width: number, height: number, elementId: string): void;

  createSprite(x: number, y: number, name: string, frame: string | null): any;

  createNineSlice(x: number, y: number, name: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): any;

  clearScreen(): void;

  changeTexture(sprite: Sprite, name: string, frame?: string | null): void;

  createSpine(name: string): any;

  enableInput(sprite: any): void;
  disableInput(sprite: any): void;

  addListener(event: string, sprite: any, callback: Function, context: any): void;

  removeListener(event: string, sprite: any, callback: Function): void;
}

export default IScreen;