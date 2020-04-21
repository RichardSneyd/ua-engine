import GameConfig from './GameConfig';
import ContainerObject from 'UAENGINE/Core/Engine/GameObjects/ContainerObject';
import Events from 'UAENGINE/Core/Engine/Events';

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

  public getXY(x: number, y: number): {x: number, y: number} {
    let scale = this._scaleFactor();

    return {x: (x * scale), y: (y * scale)};
  }

  public getScale(currentScale: number): number {
    let scale = this._scaleFactor();

    return scale;
  }

  public createNew(): ScaleManager {
    return new ScaleManager(this._gameConfig);
  }


  private _scaleFactor(): number {
    let width = window.innerWidth;
    let height = window.innerHeight;

    return height / this._height;
  }

  private _gameWidth(): number {
    return this._gameConfig.data.DISPLAY.WIDTH;
  }

  private _gameHeight(): number {
    return this._gameConfig.data.DISPLAY.HEIGHT;
  }

}

export default ScaleManager;