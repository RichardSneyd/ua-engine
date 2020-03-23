import {Sprite} from 'pixi.js';

interface IScreen {
  createScreen(width: number, height: number, elementId: string): void;

  createSprite(x: number, y: number, name: string, frame: string | null): any;

  clearScreen(): void;

  changeTexture(sprite: Sprite, name: string, frame?: string | null): void;

  createSpine(name: string): any;
}

export default IScreen;