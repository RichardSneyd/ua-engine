import {Sprite} from 'pixi.js';

interface IScreen {
  createScreen(width: number, height: number, elementId: string): void;

  createSprite(x: number, y: number, name: string): Sprite;

  clearScreen(): void;
}

export default IScreen;