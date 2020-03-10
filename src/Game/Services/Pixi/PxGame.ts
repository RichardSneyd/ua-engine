import {Application} from 'pixi.js';
import PxFactory from './PxFactory';

class PxGame {
  private _pxFactory: PxFactory;
  private _game: Application | null;

  constructor(pxFactory: PxFactory) {
    this._pxFactory = pxFactory;
    this._game = null;
  }

  public init(w: number, h: number, container: string) {
    let elm = document.getElementById(container);

    this._game = this._createGame(w, h, container);

    if (elm != null) {
      elm.appendChild(this._game.view);
    } else {
      console.warn("No element by id: '%s', appending to the body.", container);
      document.body.appendChild(this._game.view);
    }
  }

  public clearScreen() {
    console.log('clearning screen');
  }

  //Foreign Elements
  private _createGame(w: number, h: number, container: string): Application {
    return this._pxFactory.createGame(w, h, container);
  }
}

export default PxGame;