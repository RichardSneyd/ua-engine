import {Sprite} from 'pixi.js';

interface IScreen {
  addHitMap(object: Sprite, threshold: number): void;
  
  createScreen(width: number, height: number, elementId: string): void;

  createContainer(x: number, y: number): any;

  createText(x: number, y: number, text: string, style?: any): any;

  createSprite(x: number, y: number, name: string, frame: string | null): any;

  createNineSlice(x: number, y: number, name: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): any;

  clearScreen(): void;

  changeTexture(sprite: Sprite, name: string, frame?: string | null): void;

  createSpine(name: string): any;

  enableInput(sprite: any): void;
  disableInput(sprite: any): void;

  addListener(event: string, sprite: any, callback: Function, context: any): void;

  removeListener(event: string, sprite: any, callback: Function): void;
  resize(x: number, y: number): void;
}

export default IScreen;