import {Game, GameObjects, Scene} from 'phaser';

import PhFactory from './PhFactory';
import PhScene from './PhScene';

class PhGame {
  private _phFactory: PhFactory;
  private _game: Game | null;
  private _sceneKey: string;
  private _scene: Scene | null;

  constructor(phFactory: PhFactory) {
    this._phFactory = phFactory;
    this._game = null;
    this._scene = null;

    console.log('i am phgame');

    this._sceneKey = 'main_scene';
  }

  get scene(): Scene {
    let scn = null;

    if ( this._game != null ) scn = this._game.scene.getScenes()[0];

    return <Scene> scn;
  }

  public init(w: number, h: number, container: string): void {
    this._scene = new PhScene();

    this._game = this._createGame(w, h, container);
  }

  public clearScreen() {
    if (this._game != null) {
      this._game.scene.start(this._sceneKey);
    } else {
      console.error("Game has not been initialized!");
    }
  }

  //Foreign Dependencies
  private _createGame(w: number, h: number, container: string): Game {
    return this._phFactory.createGame(w, h, container, 'canvas');
  }
}

export default PhGame;