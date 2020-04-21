import GameConfig from '../../GameConfig';
import ContainerObject from '../ContainerObject';
import IGameObject from '../IGameObject';
import Events from '../../../Engine/Events';
import ScaleManager from '../../ScaleManager';

class ScaleHandler {
  private _go: IGameObject;
  private _events: Events;
  private _scaleManager: ScaleManager;

  constructor(scaleManager: ScaleManager) {
    this._scaleManager = scaleManager;
  }

  public init(go: IGameObject) {
    this._go = go;
    this._events = this._go.core.events;

    this.onResize();
    this._addListeners();
    //console.log("smanager w(%s) h(%s)", this._width, this._height);
  }

  public createNew(): ScaleHandler {
    let handler = new ScaleHandler(this._scaleManager);
    return handler;
  }

  public onResize() {
    this._onResize();
  }

  public updateScale() {
    this._updateScale();
  }

  public getXY(x: number, y: number) {
    return this._scaleManager.getXY(x, y);
  }

  public getScale(currentScale: number) {
    return this._scaleManager.getScale(currentScale);
  }

  private _updateScale() {
    let scaleX = this._scaleManager.getScale(this._go.core.scaleX);
    let scaleY = this._scaleManager.getScale(this._go.core.scaleY);

    this._go.core.objectHandler.setScaleXY(this._go.core.data, scaleX, scaleX);
  }

  private _addListeners() {
    this._events.addListener('resize', this._onResize, this);
  }

  private _onResize() {
    if (this._go.pcHandler.parent == null || this._go instanceof ContainerObject) {
      this._updateScale();
      this._go.core.updateXY();
    }
  }

}

export default ScaleHandler;