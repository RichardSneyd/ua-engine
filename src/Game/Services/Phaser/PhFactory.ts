import {Game, GameObjects, Scene} from 'phaser';
import PhScene from './PhScene';

class PhFactory {
  constructor() {

  }

  createGame(width: number, height: number, container: string, renderer: string = "null"): Game {
    console.log('creating new game!');
    let rnd: any;

    if (renderer == 'canvas') {
      rnd = Phaser.CANVAS;
    } else if (renderer == 'webgl') {
      rnd = Phaser.WEBGL;
    } else {
      rnd = Phaser.AUTO;
    }

    let game: Game = new Game({
      type: rnd,
      parent: container,
      width: width,
      height: height,
      scene: {
        create: () => {
          //console.log(this);
          //(<any> window).gameclass = game;
        }
      }
    });

    return game;
  }

  createGraphics(scene: Scene): GameObjects.Graphics {
    let o = new GameObjects.Graphics(scene);

    return o;
  }

  createScene(config: any): Scene {
    console.log(config);
    return new Scene(config);
  }
}

export default PhFactory;