interface IScreen {
  createScreen(width: number, height: number, elementId: string): void;

  createSprite(x: number, y: number, name: string): any;

  clearScreen(): void;
}

export default IScreen;