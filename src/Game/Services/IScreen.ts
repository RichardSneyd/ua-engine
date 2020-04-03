import {Sprite} from 'pixi.js';

interface IScreen {
  createScreen(width: number, height: number, elementId: string): void;

  createContainer(x: number, y: number): any;

  createText(x: number, y: number, text: string, style?: any): any;

  createSprite(x: number, y: number, name: string, frame: string | null): any;

  clearScreen(): void;

  changeTexture(sprite: Sprite, name: string, frame?: string | null): void;

  createSpine(name: string): any;

  resize(x: number, y: number): void;
}

export default IScreen;