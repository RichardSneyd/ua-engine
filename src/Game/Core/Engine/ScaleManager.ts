import GameConfig from './GameConfig';
import ContainerObject from './GameObjects/ContainerObject';
import Events from './Events';

class ScaleManager {
  private _gameConfig: GameConfig;

  private _width: number;
  private _height: number;

  constructor(gameConfig: GameConfig) {
    this._gameConfig = gameConfig;

    this._width = 0;
    this._height = 0;
  }

  public init() {

    this._width = this._gameWidth();
    this._height = this._gameHeight();
    //console.log("smanager w(%s) h(%s)", this._width, this._height);
  }

  public getXY(x: number, y: number): { x: number, y: number } {
    let scale = this._scaleFactor();
    console.log('scaleFactor: ', scale);
    let xPos = x, yPos = y;
    if (x !== 0) xPos = (x * scale);

    if (y !== 0) yPos = (y * scale);
    return { x: xPos, y: yPos };
  }

  public getScale(currentScale: number): number {
    let scale = this._scaleFactor() * currentScale;

    return scale;
  }

  public createNew(): ScaleManager {
    return new ScaleManager(this._gameConfig);
  }

  public scaleFactor(): number {
    return this._scaleFactor();
  }

  private _scaleFactor(): number {
    let width = window.innerWidth;
    let height = window.innerHeight;

    return (height / this._height);
    // devicePixelRatio
  }

  private _gameWidth(): number {
    return this._gameConfig.data.DISPLAY.WIDTH;
  }

  private _gameHeight(): number {
    return this._gameConfig.data.DISPLAY.HEIGHT;
  }

}

export default ScaleManager;