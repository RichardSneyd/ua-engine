## Introduction
Universal Activity Engine, or UAE, is a HTML5 engine, developed by Highwood Education, for building visually and sonicly rich games and activities. It is specifically designed to support the design of 'audio-driven' learning activities, with the flow of the activity being determined by the audio. UAE utilised a custom DI/IoC framework, and leverages PIXI.js for rendering and Howler.js for audio, at the service layer. It supports spine animations, and now comes with it's own basic level editor which can be accessed via UAE.editor.launch().

## Installation & Build
```
git clone https://github.com/RichardSneyd/ua-engine
npm install
gulp
```

## Examples
### Activity
Every activity must contain 3 build files from the UAE repo: UAE.d.ts, uae.js, and uae.js.map. These can be copied from the dist directory, where they are saved after a build has completed. Every activity, in turn, must have an Activity class which implements IActivity.

```typescript
import UAE from 'UAE';
import IActivity from 'UAE/Core/Engine/IActivity';
import MainLevel from '../Levels/MainLevel';

class Activity implements IActivity {
  public name: string;
  public code: string;

  private _mainLevel: MainLevel;

  constructor(mainLevel: MainLevel) {
    this._mainLevel = mainLevel;
  }

  startActivity(scriptName: string) {
    UAE.game.startGame('./config.json').then(() =>{
      UAE.game.loadLevel(this._mainLevel, scriptName);
    })
  }
}

export default Activity;

```
Every activity must also contain a Level class of some description (typically called MainLevel if there's only one, but this is just a convention), which implements ILevel.

```typescript 
import ILevel from "UAE/Core/Engine/ILevel";


class MainLevel implements ILevel {
    onNewRow(): void {
        // called every time a new 'row' from an activity script is jumped to
    }
    loadConfig(): void {
        // used to load config setting from the current row
    }
    _waitForFirstInput(): void {
        // used to wait for first user gesture on the screen, because of the Chrome issue with playing audio before a gesture occurs
    }
    init(scriptName?: string): void {
       // entry point for the level
    }
    preload(): void {
        // all assets are preloaded here, via UAE.loader. The asset lists can largely be generated via UAE.manager.script.fileList()
    }
    start(): void {
        // start the activity
    }
    shutdown(): void {
        // clean up before closing the activity and moving to another one (important for avoiding memory leaks)
    }

}
export default MainLevel;

```



