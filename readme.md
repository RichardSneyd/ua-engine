## Introduction
Universal Activity Engine, or UAE, is a HTML5 engine, developed by Highwood Education, for building visually and sonicly rich games and activities. It is specifically designed to support the design of 'audio-driven' learning activities, with the flow of the activity being determined by the audio. UAE utilised a custom DI/IoC framework, and leverages PIXI.js for rendering and Howler.js for audio, at the service layer. It supports spine animations, and now comes with it's own basic level editor which can be accessed via UAE.editor.launch().

## Installation & Build
```
git clone https://github.com/RichardSneyd/ua-engine
npm install
npm install -g dts-bundle
gulp
```
## Engine Structure
Inside the src folder, there are 2 subfolder - Dep and Game. Dep contains the DI framework, which auto-generates an IoC container and saves it ad src/Dep/ControlContainer.ts. All other source files, including core engine files, and services, are in src/Game.

## API Exposure
to add a class to the API root, you must do 2 things - expose it in the _exposeGlobal() method of src/Game/Core/Game.ts
```typescript
private _exposeGlobal() {
    this._expose.init();
    this._expose.add('game', this);
    this._expose.add('world', this._world);
    // ... others will also be there...
    this._expose.add('myClass', this._myClass); // add a line for your class (you will need to inject it as a dependency, and save it in a local private property)
}
```

and to generate the appropriate type definitions, add it as a static to src/Game/UAE.ts
```typescript
public static myClass: MyClass;
```
## Coding Style Guide
The purpose of this document is to establish a common coding style for the entire team to follow. It will incorporate common conventions, establish our own as needed.
Variables and Properties
Private variables should begin with an underscore:
```typescript
private _age: number;
```
When dealing with object properties, generally these should be made private, as above – standard OOP practice. Getters and setters should be used to access them. In many languages, such as Java, this involves creating methods like ```typescript getAge()  ```and ```typescript setAge(newAge: number) ```; however, in typescript, we have special keywords, specifically accessors, get and set, for defining getters and setters, which we will use:

```typescript
class Animal{
    private _age: number;

    constructor(){
        // todo   
    }

    // the getter method for age
    get age(){
        return this._age;
    }

    // the setter method for age
    set age(newAge: number){
        this._age = newAge;
    }
}

```
These accessors are compliant with ES2015 on, when classes began to be supported. When this is converted to older JS (specifically, ES5), it will be converted to the following, since it uses ES5 modules and the Object.defineProperty method under the hood (this is for reference only, so you understand what they do when transpiled):
```javascript
"use strict";
var Animal = /** @class */ (function () {
    function Animal() {
        // todo   
    }
    Object.defineProperty(Animal.prototype, "age", {
        get: function () {
            return this._age;
        },
        set: function (newAge) {
            this._age = newAge;
        },
        enumerable: true,
        configurable: true
    });
    return Animal;
}());
```

After declaring getters and setters this way, we can interact with them as though we were accessing normal JS properties, using standard dot syntax, but with all the benefits of getters and setters, since it is really the getter and setter methods we defined which are being accessed, not the private _age property itself. It is good OOP: 

```typescript
let animal = new Animal();
console.log(animal.age); // this calls the getter we defined, and prints the value it returns.
animal.age = 32; // this calls the setter method. 
```

## Examples
### Activity
Every activity must contain 3 build files from the UAE repo: UAE.d.ts, uae.js, and uae.js.map. These can be copied from the dist directory, where they are saved after a build has completed. Every activity, in turn, must have an Activity class which implements IActivity, or extends BaseActivity.
#### Implementing IActivity (not prefered)
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
#### Extending BaseActivity (prefered)
Extending BaseActivity keeps the IActivity implementations much cleaner and more uniform, so it is the preferred method: 
```typescript
import UAE from 'UAE';
import SomeLevel from '../Levels/SomeLevel';
import SomeOtherLevel from '../Levels/SomeOtherLevel';
import ILevel from 'UAE/Core/Engine/Activities/ILevel';

class Activity extends UAE.activities.BaseActivity {
  protected _someLevel: SomeLevel;
  protected _someOtherLevel: SomeOtherLevel;
  protected _defaultLevel: ILevel; // can be handy for quickly switching between available levels during development and QA

  constructor(someLevel: SomeLevel, someOtherLevel: SomeOtherLevel) {
    super('examples', 'examples', UAE.game);
    this._someLevel = pixelPerfect;
    this._someOtherLevel = extendBaseLevel;
    // set default level -- not requird, but can be handy for quick testing
    this._defaultLevel = this._someOtherLevel;
  }

  startActivity(scriptName: string) {
    super.startActivity(scriptName, this._defaultLevel);
  }
}

export default Activity;
```
Every activity must also contain a Level class of some description (typically called MainLevel if there's only one, but this is just a convention). Each level must either extend UAE.activities.BaseLevel (prefered, as it implements many of the coding conventions established in here, and it cuts down on a lot of biolerplate and repetition), or implement ILevel.

#### Extending BaseLevel (prefered)
```typescript
import UAE from 'UAE';

class ExtendBaseLevel extends UAE.activities.BaseLevel {
    
    // constructor must initialize the super with UAE core objects
    constructor(){
        super(UAE.levelManager, UAE.events, UAE.loop, UAE.goFactory, UAE.loader, UAE.game);
    }

    init(scriptName: string){
        // do initialization stuff...

        // call super last
        super.init(scriptName, ['audio_id'], ['config']);
    }

    preload(){
        this._aFiles = this._manager.script.fileList(['audio_id']);
        this._jpgFiles = this._manager.script.fileList(['config.bgd']);
        this._pngFiles = ['star'];
        // add resources here. super.preload will then use promise to load assets, then call start
        this._loader.addSnds(this._aFiles);
        this._loader.addImages(this._jpgFiles, '.jpg');
        this._loader.addImages(this._pngFiles, '.png');
        super.preload();
    }

    start(){
        // build the scene here. super.start will then call _waitForFirstInput to avoid starting without audio due to Chrome audio
        // playback restrictions. _waitForFirstInput automatically calls the first row of the activityScript
        this._goFactory.sprite(500, 500, 'star', null, this._playground);
        super.start();
    }

    onNewRow(){
        super.onNewRow();
    }
}

export default ExtendBaseLevel;
```
#### Implementing ILevel (not prefered)
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
## Conventions

when working with frame animations, prefer importing the frames automatically using FrameAnimationManager.autoGenFrames();
```typescript
sprite.animations.autoGenFrames('idle'); // will find all frames with the prefix 'idle', in order
```
using protected instead of private avoids the 'not initialized' issue with typescript linting
```typescript
private _myProperty: string; // possibly annoying warnings or even errors, depending on version of typescript
protected _myProperty2: string; // no warnings or errors
```
import the engine as UAE, rather thant UAENGINE (easier to type, more ergonomic)
```typescript
import UAE from 'UAE';
```
declare boilerplate local DI components first (such as _factory), common UAE components next (those which refer to UAE properties, like world, goFactory, manager, loop etc), and activity specific (non boilerplate) members last
```typescript
class MainLevel implements ILevel {
  // Boilerplate members first
  protected _factory: TypeFactory;
  protected _aFiles: string[] = [];
  protected _pngFiles: string[] = [];
  protected _jpgFiles: string[] = [];
  // UAE Components
  protected _manager: LevelManager; _loop: Loop; _loader: Loader;

  // Containers (used as layers to keep game objects visually organised)
  protected _background: ContainerObject;
  protected _playground: ContainerObject;
  protected _foreground: ContainerObject;
  protected _HUD: ContainerObject;

  //type-specific members
  protected _highlightManager: HighlightManager;

  protected _leftArrow: ArrowButton;
  protected _rightArrow: ArrowButton;
  protected _audioButton: Button;

  protected _bottomBar: BottomBar;

  protected _promptButton: PromptButton;

  protected _bgd: SpriteObject;
  protected _paragraphs: Paragraph[] = [];
  protected _paraPos: Point;
  // .....
```

Always include 3 properties for audio, jpegs and pngsto be loaded (unless there are no pngs, in which case the _pngFiles property can be omitted. BaseLevel does all of this for you), with these exact names (for consistency across types): 
```typescript
  protected _aFiles: string[] = [];
  protected _pngFiles: string[] = [];
  protected _jpgFiles: string[] = [];
```
Have a local factory for creating activity specific objects, called TypeFactory.ts (for example, the passage type has a TypeFactory, which access the createNew method of all locally defined objects, and calls the init method for the factory. This simplifies the process of creating new objects to a 1 line call). 

Example:

```typescript
class TypeFactory {
    protected _promptButton: PromptButton;

    constructor(promptButton: PromptButton){
        this._promptButton = promptButton;
    }

    promptButton(x: number, y: number, atlas: string, frame: string, container: Entity): PromptButton{
        let prompt = this._promptButton.createNew(x, y, atlas, frame, container);
        return prompt;
    }
}

export default TypeFactory;
```
## Game Object Wrapper Structure
It is best to have a src/Game/GO directory for game object wrapper classes, which function as wrappers for basic UAE gameObject types (in some very basic cases, this may not be necessary, but it is best practice and preferred).

```typescript
import SpriteObject from "UAE/Core/Engine/GameObjects/SpriteObject";
import ContainerObject from "UAE/Core/Engine/GameObjects/ContainerObject";
import GOFactory from 'UAE/Core/Engine/GameObjects/GOFactory';
import UAE from 'UAE';

class Background {
  private _goFactory: GOFactory;
  protected _sprite: SpriteObject;

  constructor() {
    this._goFactory = UAE.goFactory;
  }

  get x() {
    return this._sprite.x;
  }

  get y() {
    return this._sprite.y;
  }

  set x(num: number) {
    this._sprite.x = num;
  }

  set y(num: number) {
    this._sprite.y = num;
  }

  public scale(x: number, y: number) {
    this._sprite.scaleHandler.x = x;
    this._sprite.scaleHandlery = y;
  }

  public anchor(x: number, y: number) {
    this._sprite.origin.x = x;
    this._sprite.origin.y = y;
  }

  public init(frame: string, container?: ContainerObject){
    this._sprite = this._goFactory.sprite(0, 0, frame);

    if(container){
      container.addChild(this._sprite);
    }
  }

  public initDynamic(atlas: string, frame: string, container?: ContainerObject) {
    this._sprite = this._goFactory.sprite(0, 0, atlas, frame);

    if(container){
      container.addChild(this._sprite);
    }
  }

  public addAnimation(name: string, frames: string[], fps: number) {
    this._sprite.animations.addAnimation(name, frames, fps);
  }
  // ....
}

export default Background;
```

## Debugging
Within engine classes, all debugging should be handled through the Debug static members (that means NO direct calls to console at all)
```typescript
Debug.info('log to console'); // does the exact same thing as console.log(), and even gives correct file name and line from source map
Debug.warn('warn about something');
Debug.error('throw an error message');
Debug.trace('trace a call');
```
Debug should also be used to expose an object on the window for debugging purposes (as this can be easily switched off for production)
```typescript
  (<any>window).myObjectName = myObject; // this will expose your object on the window, but it's messy down the line, when plugging memory leaks etc
  Debug.exposeGlobal('myObjectName', myObject) // this works exactly the same, gives you window.myObjectName access in console, but easy to switch off at production
```
All of the above methods can also be used in Activities through the API via UAE.debug
```typescript
UAE.debug.info('log to console');
UAE.debug.exposeGlobal('myObjectName', myObject);
// etc....
```
## Code Documentation
Remember to document all classes and public methods that are added to the engine, including the @description and @param tags where appropriate. Type of parameters is inferred, and does not need to be defined in the tag. For example:
```typescript
/**
 * @description always provide a description tag for the class itself
 */
class SomeClass {
  /**
   * @description and provide a description tag for all public methods, also.
   * @param par1 provide a param tag for each unique parameter. Type is infered by compiler.
   * @param par2 provide a param tag for each unique parameter. Type is infered by compiler.
   */
  someMethod(par1: any, par2: any) {
    // do something...
  }
}
```
