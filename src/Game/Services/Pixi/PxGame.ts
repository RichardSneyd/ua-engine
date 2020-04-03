import {Application, Sprite, Renderer, Container} from 'pixi.js';
import PxText from './PxText';
import PxFactory from './PxFactory';
import Loader from '../../Core/Engine/Loader';
import 'pixi-spine';

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
    this._game.renderer.backgroundColor = 0xfafad2;

    if (elm != null) {
      elm.appendChild(this._game.view);
    } else {
      console.warn("No element by id: '%s', appending to the body.", container);
      document.body.appendChild(this._game.view);
    }
  }

  public resize(x: number, y: number) {
    if (this._game != null) this._game.renderer.resize(x, y);
  }

  public addText(x: number, y: number, text: string, style: any = undefined) : PxText {
    if (this._game != null) {
      let txt = this._pxFactory.createText(text, this._game.renderer, style);

      txt.x = x;
      txt.y = y;

      this._game.stage.addChild(txt.data);

      return txt;
    } else {
      console.error("Can't add text before starting game!");

      let t: any;

      return <PxText> t;
    }
  }

  public addContainer(x: number, y: number): Container {
    let cont = this._createContainer();
    cont.x = x;
    cont.y = y;
    return cont;
  }

  public addSprite(x: number, y: number, sprName: string, frame: string | null): Sprite {
    let texture = this._loader.getTexture(sprName);
    let sprite;
    
    sprite = this._createSprite(x, y, sprName, frame);

    sprite.x = x;
    sprite.y = y;

    if(this._game != null) {
      this._game.stage.addChild(sprite);
    } else {
      console.error("Can not add sprite before initializing the game!");
    }

    return sprite;
  }

  public addSpine(name: string): PIXI.spine.Spine | null {
    let spineResource = this._loader.getResource(name);
    let sprite = null;

    if (spineResource != null) {
      sprite = new PIXI.spine.Spine(spineResource.data.spineData);
      if (this._game != null) {
        this._game.stage.addChild(sprite);
      } else {
        console.error("Can not add sprite before initializing the game!");
      }
    } else {
      console.log('spine resource named "%s" not found', name);
    }

    return sprite;
  }

  public updateTexture(sprite: Sprite, sprName: string, frame: string | null = null): void {
    let texture = this._loader.getTexture(sprName, frame);
    sprite.texture = texture;
  }

  public clearScreen() {
    console.log('clearning screen');
  }

  private _createSprite(x: number, y: number, sprName: string, frame: string | null = null) {
    let texture = this._loader.getTexture(sprName, frame);
    let sprite = this._pxFactory.createSprite(texture);
    sprite.x = x;
    sprite.y = y;

    return sprite;
  }

  //Foreign Elements
  private _createGame(w: number, h: number, container: string): Application {
    return this._pxFactory.createGame(w, h, container);
  }

  private _createContainer(): Container {
    return this._pxFactory.createContainer();
  }
}

export default PxGame;