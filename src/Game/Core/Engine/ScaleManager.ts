import GameConfig from './GameConfig';
import ContainerObject from './GameObjects/ContainerObject';
import Events from './Events';
import Debug from './Debug';

/**
 * @description responsible for determining scale factor. ScaleHandler GO component uses it to calculate scale for game objects.
 */
class ScaleManager {
  private _gameConfig: GameConfig;

  private _width: number;
  private _height: number;

  constructor(gameConfig: GameConfig) {
    this._gameConfig = gameConfig;

    this._width = 0;
    this._height = 0;
    Debug.exposeGlobal(this, 'scale');
  }

  public init() {
    this._width = this._gameWidth();
    this._height = this._gameHeight();
  }

  /**
   * @description Rescales for window resize events, adapting to both width and height changes while maintaining aspect ratio
   * @param x width 
   * @param y 
   */
  public getWidthHeight(x: number, y: number): { x: number, y: number } {
    let scale = this._scaleFactor();
    let xPos = x, yPos = y;
    if (x !== 0) xPos = (x * scale);

    if (y !== 0) yPos = (y * scale);
    return { x: xPos, y: yPos };
  }

  /**
   * @description Multiplies the local scale by the scaleFactor (for the screen), to provide the true scale
   * @param localScale 
   */
  public getTrueScale(localScale: number): number {
    let scale = this._scaleFactor() * localScale;

    return scale;
  }

  public createNew(): ScaleManager {
    return new ScaleManager(this._gameConfig);
  }

  public scaleFactor(): number {
    return this._scaleFactor();
  }

  /**
   * @description Returns the current scaleFactor. This value will change based on window resize events etc
   */
  private _scaleFactor(): number {
    let width = window.innerWidth;
    let height = window.innerHeight;

    let hRatio = (height / this._height);
    let wRatio = (width / this._width);

    return hRatio < wRatio ? hRatio : wRatio;
  }

  private _gameWidth(): number {
    return this._gameConfig.data.DISPLAY.WIDTH;
  }

  private _gameHeight(): number {
    return this._gameConfig.data.DISPLAY.HEIGHT;
  }

}

export default ScaleManager;