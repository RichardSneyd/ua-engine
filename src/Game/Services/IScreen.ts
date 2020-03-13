import {Sprite} from 'pixi.js';

interface IScreen {
  createScreen(width: number, height: number, elementId: string): void;

  createSprite(x: number, y: number, name: string): any;

  clearScreen(): void;

  changeTexture(sprite: Sprite, name: string): void;
}

export default IScreen;