import {Application, Sprite} from 'pixi.js';
import PxFactory from './PxFactory';
import Loader from '../../Core/Engine/Loader';

class PxGame {
  private _pxFactory: PxFactory; _loader: Loader;
  private _game: Application | null;

  constructor(pxFactory: PxFactory, loader: Loader) {
    this._pxFactory = pxFactory;
    this._loader = loader;
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

  public addSprite(x: number, y: number, sprName: string): Sprite {
    let texture = this._loader.getTexture(sprName);
    let sprite = this._pxFactory.createSprite(texture);
    sprite.x = x;
    sprite.y = y;

    if(this._game != null) {
      this._game.stage.addChild(sprite);
    }

    return sprite;
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