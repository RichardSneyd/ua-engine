import {Game, GameObjects, Scene} from 'phaser';

interface IScreen {
  createScreen(width: number, height: number, elementId: string): void;
  clearScreen(): void;
  createReact(x: number, y: number, width: number, height: number): GameObjects.Graphics;
}

export default IScreen;