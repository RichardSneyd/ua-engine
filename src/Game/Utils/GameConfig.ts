import Phaser from 'phaser';
import 'phaser/plugins/spine/dist/SpinePlugin';
import * as _ from 'lodash';

/**
 * @description a game configuration management class
 */
class GameConfig {

  static standard: Phaser.Types.Core.GameConfig = {
    title: "ua-engine",
    type: Phaser.AUTO,
    scene: [

    ],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1920,
      height: 1080,
      parent: 'phaser-game'
    },
    plugins: {
      scene: [
        { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
      ]
    }
  }

  /**
   * @description a helper method to quickly get a standardized config object, with the spine plugin enabled
   * @param title the title of the product, lower-case and hyphenated
   * @param parent the parent HTML element to place the generated canvas inside
   * @param scene a scene, or scenes, to initialize the game instance with
   */
  static getConfig(title: string, parent: string, scene: Phaser.Scene | Phaser.Scene[]): Phaser.Types.Core.GameConfig {
    GameConfig.standard.title = title;
    GameConfig.standard.parent = parent;
    GameConfig.standard.scene = scene;
    return GameConfig.standard;
  }
}

export default GameConfig;






