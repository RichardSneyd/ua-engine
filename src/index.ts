///<reference path='../types/spine.d.ts' />
///<reference path='../types/phaser.d.ts' />
///<reference path='../types/spine.plugin.d.ts' />

import * as _ from 'lodash';
import * as Find from './scenes/FindAndCount';
import { Boot } from './scenes/Boot';
import * as Color from './scenes/ColorTheBears';
import Demo from './scenes/Demo';
import * as Feed from './scenes/FeedTheBears';
import * as Clean from './scenes/ClickToGather';
import * as Build from './scenes/BuildAHouse';
import * as GoodNightBear from './scenes/GoodnightBear';
import MainMenu from './scenes/MainMenu';
import FestivalSelection from './scenes/FestivalSelection';
import WarmUpSong from './scenes/WarmUpSong';
import WarmUpSong2X from './scenes/WarmUpSong2X';

var config: Phaser.Types.Core.GameConfig = {
  title: "demo-class",
  type: Phaser.AUTO,
  scene: [
    new Boot(),
    new FestivalSelection(),
    new MainMenu(),
    new WarmUpSong('WarmUpSong'),
    new WarmUpSong2X('WarmUpSong2X'),

    new Find.Find_Polar('k1_demo_polar_a1'),
    new Color.FiveOptions('k1_demo_polar_a2', ['red', 'yellow', 'blue', 'green', 'white']),
    new Feed.Feed_Polar('k1_demo_polar_a3'),
    new Clean.Clean_Polar('k1_demo_polar_a4'),
    new Build.Build_Polar('k1_demo_polar_a5'),
    new GoodNightBear.Polar('k1_demo_polar_a6'),

    new Find.Find_Brown('k1_demo_brown_a1'),
    new Color.TenOptions('k1_demo_brown_a2'),
    new Feed.Feed_Brown('k1_demo_brown_a3'),
    new Clean.Clean_Brown('k1_demo_brown_a4'),
    new Build.Build_Brown('k1_demo_brown_a5'),
    new GoodNightBear.Brown('k1_demo_brown_a6'),

    new Find.Find_Panda('k1_demo_panda_a1'),
    new Color.FiveOptions('k1_demo_panda_a2', ['red', 'yellow', 'blue', 'green', 'black']),
    new Feed.Feed_Panda('k1_demo_panda_a3'),
    new Clean.Clean_Panda('k1_demo_panda_a4'),
    new Build.Build_Panda('k1_demo_panda_a5'),
    new GoodNightBear.Panda('k1_demo_panda_a6')
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



