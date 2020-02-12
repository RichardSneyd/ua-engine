///<reference path='../types/spine.d.ts' />
///<reference path='../types/phaser.d.ts' />
///<reference path='../types/spine.plugin.d.ts' />

import * as _ from 'lodash';

var config: Phaser.Types.Core.GameConfig = {
  title: "demo-class",
  type: Phaser.AUTO,
  scene: [
   
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
    parent: 'phaser-game'
  }

}
var game = new Phaser.Game(config);



