## Introduction
Universal Activity Engine, or UAE, is a HTML5 engine, developed by Highwood Education, for building visually and sonicly rich games and activities. It is specifically designed to support the design of 'audio-driven' learning activities, with the flow of the activity being determined by the audio. UAE utilised a custom DI/IoC framework, and leverages PIXI.js for rendering and Howler.js for audio, at the service layer. It supports spine animations, and now comes with it's own basic level editor which can be accessed via UAE.editor.launch().

## Installation & Build
```
git clone https://github.com/RichardSneyd/ua-engine
npm install
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



