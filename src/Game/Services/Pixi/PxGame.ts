import { Application, Sprite, DisplayObject } from 'pixi.js';
import PxFactory from './PxFactory';
import Loader from '../../Core/Engine/Loader';
import 'pixi-spine';
import Events from '../../Core/Engine/Events';

class PxGame {
  private _pxFactory: PxFactory; _loader: Loader; _events: Events;
  private _game: Application | null;

  constructor(pxFactory: PxFactory, loader: Loader, events: Events) {
    this._pxFactory = pxFactory;
    this._loader = loader;
    this._events = events;
    this._game = null;
  }

  public init(w: number, h: number, container: string) {
    let elm = document.getElementById(container);

    this._game = this._createGame(w, h, container);

    if (elm != null) {
      elm.appendChild(this._game.view);
    //  this._game.view.addEventListener('mousemove', this._onMouseMove.bind(this));
      this._game.view.addEventListener('pointermove', this._onMouseMove.bind(this));
    } else {
      console.warn("No element by id: '%s', appending to the body.", container);
      document.body.appendChild(this._game.view);
    }
  }

  _onMouseMove(evt: any) {
    let canvas = document.getElementsByTagName('canvas')[0];
    let rect = canvas.getBoundingClientRect();
    let args: any = {}
    args.mouseX = evt.clientX - rect.left;
    args.mouseY = evt.clientY - rect.top;
    args.moveX = evt.movementX;
    args.moveY = evt.movementY;
    //console.warn(evt);
    this._events.fire('pointermove', args);
  }

  public addSprite(x: number, y: number, sprName: string, frame: string | null): Sprite {
    let texture = this._loader.getTexture(sprName);
    let sprite;

    sprite = this._createSprite(x, y, sprName, frame);

    sprite.x = x;
    sprite.y = y;

    if (this._game != null) {
      this._game.stage.addChild(sprite);
    } else {
      console.error("Can not add sprite before initializing the game!");
    }

    // this._enableInputEvents(sprite);

    return sprite;
  }

  public enableInput(sprite: DisplayObject) {
    sprite.interactive = true;
  }

  public disableInput(sprite: DisplayObject) {
    sprite.interactive = false;
  }

  public removeListener(event: string, sprite: DisplayObject, callback: Function) {
   // sprite.removeAllListeners('mouseup');
    sprite.removeListener(event, callback);
  }

  public addListener(event: string, sprite: DisplayObject, callback: Function, context: any) {
    sprite.on(event, callback, context);
  //  sprite.on('touchend', callback, context);
  }

  public addSpine(name: string): PIXI.spine.Spine | null {
    let spineResource = this._loader.getResource(name);
    let sprite = null;

    if (spineResource != null) {
      sprite = new PIXI.spine.Spine(spineResource.data.spineData);
      if (this._game != null) {
        //  this.enableInputEvents(sprite);
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
}

export default PxGame;