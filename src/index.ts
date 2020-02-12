import Phaser from 'phaser';
import 'phaser/plugins/spine/dist/SpinePlugin';
import * as _ from 'lodash';

var config: Phaser.Types.Core.GameConfig = {
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
var game = new Phaser.Game(config);



