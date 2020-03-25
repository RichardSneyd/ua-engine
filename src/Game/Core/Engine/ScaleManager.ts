import config from '../config';

class ScaleManager {
  private _width: number;
  private _height: number;

  constructor() {
    this._width = config.DISPLAY.WIDTH;
    this._height = config.DISPLAY.HEIGHT;
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
    return new ScaleManager();
  }

  private _scaleFactor(): number {
    let width = window.innerWidth;
    let height = window.innerHeight;

    return height / this._height;
  }
}

export default ScaleManager;