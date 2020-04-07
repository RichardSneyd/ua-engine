// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   ../../../UAENGINE/Core/Engine/Entity
//   ../../../pixi.js
//   ../../../@tweenjs/tween.js

declare module 'UAENGINE' {
    import World from 'UAENGINE/Core/Engine/World';
    import Entity from 'UAENGINE/Core/Engine/Entity';
    import Loop from 'UAENGINE/Core/Engine/Loop';
    import Loader from 'UAENGINE/Core/Engine/Loader';
    import Events from 'UAENGINE/Core/Engine/Events';
    import LevelManager from 'UAENGINE/Core/Engine/LevelManager';
    import Game from 'UAENGINE/Core/Game';
    import GameConfig from 'UAENGINE/Core/Engine/GameConfig';
    import GameObjectFactory from 'UAENGINE/Core/Engine/GameObjectFactory';
    class UAENGINE {
        static world: World;
        static entity: Entity;
        static loop: Loop;
        static loader: Loader;
        static events: Events;
        static levelManager: LevelManager;
        static game: Game;
        static gameConfig: GameConfig;
        static goFactory: GameObjectFactory;
    }
    export default UAENGINE;
}

declare module 'UAENGINE/Core/Engine/World' {
    import Entity from 'UAENGINE/Core/Engine/Entity';
    import IScreen from 'UAENGINE/Services/IScreen';
    import ILevel from 'UAENGINE/Core/Engine/ILevel';
    class World {
        _screen: IScreen;
        constructor(entity: Entity, screen: IScreen);
        init(w: number, h: number): void;
        startLevel(level: ILevel): void;
        resize(x: number, y: number): void;
    }
    export default World;
}

declare module 'UAENGINE/Core/Engine/Entity' {
    import AnimationManager from 'UAENGINE/Core/Engine/AnimationManager';
    import Events from 'UAENGINE/Core/Engine/Events';
    import ScaleManager from 'UAENGINE/Core/Engine/ScaleManager';
    import IScreen from 'UAENGINE/Services/IScreen';
    import IObjectHandler from 'UAENGINE/Services/IObjectHandler';
    import InputHandler from 'UAENGINE/Core/Engine/InputHandler';
    import MathUtils from 'UAENGINE/Core/Engine/Utils/MathUtils';
    import Point from 'UAENGINE/Core/Data/Point';
    class Entity {
        _animationManager: AnimationManager;
        _objectHandler: IObjectHandler;
        _math: MathUtils;
        _scaleManager: ScaleManager;
        constructor(screen: IScreen, animationManager: AnimationManager, objectHandler: IObjectHandler, input: InputHandler, math: MathUtils, events: Events, scaleManager: ScaleManager);
        text: string;
        x: number;
        y: number;
        width: number;
        height: number;
        origin: Point;
        setSize(width: number, height: number): void;
        scaleX: number;
        scaleY: number;
        readonly input: InputHandler;
        readonly pixelPerfect: boolean;
        makePixelPerfect(threshold?: number): boolean;
        readonly children: Entity[];
        parent: Entity | null;
        readonly data: any;
        addChild(entity: Entity): boolean;
        removeChild(entity: Entity): boolean;
        hasChild(entity: Entity): boolean;
        initSpine(x: number, y: number, spine: string): void;
        moveBy(x: number, y: number): void;
        moveTo(x: number, y: number): void;
        setOrigin(x: number, y?: number): void;
        initNineSlice(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): void;
        init(x: number, y: number, sprite: string, frame?: string | null): void;
        initContainer(x: number, y: number): void;
        initText(x: number, y: number, text: string, style?: any): void;
        addTween(name: string, easing: string): void;
        playTween(name: string, toObject: any, time: number, updateFunction?: Function): void;
        pauseTween(name: string): void;
        resumeTween(name: string): void;
        pauseAnimation(name: string): void;
        resumeAnimation(name: string): void;
        addAnimation(name: string, base: string, max: number, fps: number, data: any): void;
        addSpineAnimation(name: string, fps: number): void;
        playAnimation(name: string): void;
        playSpineAnimation(name: string): void;
        enableInput(): void;
        disableInput(): void;
        addInputListener(event: string, callback: Function, context: any, once?: boolean): void;
        removeInputListener(event: string, callback: Function): void;
        createNew(): Entity;
        update(time: number): void;
    }
    export default Entity;
}

declare module 'UAENGINE/Core/Engine/Loop' {
    import Events from 'UAENGINE/Core/Engine/Events';
    import FunObj from 'UAENGINE/Core/Data/FunObj';
    class Loop {
        constructor(events: Events, funObj: FunObj);
        addFunction(f: any, context: any): void;
        removeFunction(f: any): void;
        start(): void;
    }
    export default Loop;
}

declare module 'UAENGINE/Core/Engine/Loader' {
    import Resource from 'UAENGINE/Core/Data/Resource';
    import IImgLoader from 'UAENGINE/Services/IImgLoader';
    import ISndLoader from 'UAENGINE/Services/ISndLoader';
    import AjaxLoader from 'UAENGINE/Services/AjaxLoader';
    import GameConfig from 'UAENGINE/Core/Engine/GameConfig';
    class Loader {
            _sndLoader: ISndLoader;
            _ajaxLoader: AjaxLoader;
            base: string;
            readonly scripts: any;
            constructor(resource: Resource, imgLoader: IImgLoader, sndLoader: ISndLoader, ajaxLoader: AjaxLoader, gameConfig: GameConfig);
            addImage(name: string): void;
            addAtlas(url: string): void;
            addJSON(basename: string): void;
            /**
                * @description download all resources
                */
            addSpine(name: string, jsonUrl: string): void;
            download(onDone?: Function): void;
            getResource(name: string): Resource | null;
            getTexture(sprite: string, frame?: string | null): any;
            getSndResByBasename(basename: string): Resource | null;
            /**
                * @description create a sound resource, to be inject with data later, at download
                * @param filename the filename of the sound to be loaded, without extension.
                */
            addSnd(name: string): void;
            /**
             * @description create several sound resources, to be injected with data (howls) at download phase
             * @param filenames filenames array of the sounds to be loaded, without extension (extentions are defined in config file).
             */
            addSnds(filenames: string[]): void;
            loadActScript(file: string, callback?: Function, staticPath?: boolean): any;
    }
    export default Loader;
}

declare module 'UAENGINE/Core/Engine/Events' {
    class Events {
            constructor();
            readonly events: any;
            /**
                * @description returns an array of all timers
                */
            readonly timers: any;
            /**
                * @description is the timer system paused?
                */
            readonly paused: boolean;
            eventNames(): string[];
            addEvent(event: string): void;
            removeEvent(event: string): void;
            addListener(event: string, callback: Function, context: any): void;
            removeListener(event: string, callback: Function): void;
            on(event: string, callback: Function, context: any): void;
            once(event: string, callback: Function, context: any): void;
            off(event: string, callback: Function): void;
            fire(event: string, data?: any): void;
            trigger(event: string, data?: any): void;
            /**
                * @description creates a timed callback, which is pausable via events.pause and events.resume. Optional repeat is 0 by default,
                * meaning method executes once. Setting this to -1 will repeat continuosly.
                * @param callback the function to call
                * @param delay the amound of (unpaused) milliseconds to wait before execution.
                * @param context the context to call it in
                * @param repeat should repeat? 0 for no. -1 for infinity, 3 for 3 repeats, 4 for 4 etc...
                */
            timer(callback: Function, delay: number, context: any, repeat?: number): any;
            /**
                * @description find and remove a timer object based via the callback it contains
                * @param callback the callback of the timer object to be removed
                */
            removeTimer(callback: Function): void;
            _removeTimer(timer: any): void;
            clearTimers(): void;
            /**
                * @description find the timer object from the _timers array which contains the specified callback mathod
                * @param callback the callback of the timer object to be retrieved
                */
            getTimer(callback: Function): any;
            /**
                * @description suspends the ticker for all timer objects
                */
            pause(): void;
            /**
                * @description resumes the ticker for all timer objects
                */
            resume(): void;
    }
    export default Events;
}

declare module 'UAENGINE/Core/Engine/LevelManager' {
    import AudioManager from "UAENGINE/Core/Engine/AudioManager";
    import Events from "UAENGINE/Core/Engine/Events";
    import Utils from "UAENGINE/Core/Engine/Utils/Utils";
    import ScriptHandler from "UAENGINE/Core/Engine/ScriptHandler";
    import InputHandler from 'UAENGINE/Core/Engine/InputHandler';
    class LevelManager {
        constructor(audioManager: AudioManager, events: Events, script: ScriptHandler, utils: Utils, input: InputHandler);
        init(scriptName: string, scriptRaw: any[], parseCols: string[], objectifyCols: string[], parseLinesCols?: string[]): void;
        readonly events: Events;
        readonly audio: AudioManager;
        readonly script: ScriptHandler;
        readonly utils: Utils;
        readonly input: InputHandler;
    }
    export default LevelManager;
}

declare module 'UAENGINE/Core/Game' {
    import World from 'UAENGINE/Core/Engine/World';
    import Events from 'UAENGINE/Core/Engine/Events';
    import ScaleManager from 'UAENGINE/Core/Engine/ScaleManager';
    import Expose from 'UAENGINE/Core/Engine/Expose';
    import Entity from 'UAENGINE/Core/Engine/Entity';
    import Loop from 'UAENGINE/Core/Engine/Loop';
    import Loader from 'UAENGINE/Core/Engine/Loader';
    import GameConfig from 'UAENGINE/Core/Engine/GameConfig';
    import LevelManager from 'UAENGINE/Core/Engine/LevelManager';
    import ILevel from 'UAENGINE/Core/Engine/ILevel';
    class Game {
        _events: Events;
        _expose: Expose;
        _loop: Loop;
        _loader: Loader;
        _gameConfig: GameConfig;
        _levelManager: LevelManager;
        constructor(world: World, entity: Entity, loop: Loop, loader: Loader, events: Events, scaleManager: ScaleManager, expose: Expose, gameConfig: GameConfig, levelManager: LevelManager);
        sayHi(): void;
        startGame(configPath: string): Promise<{}>;
        loadLevel(level: ILevel): void;
    }
    export default Game;
}

declare module 'UAENGINE/Core/Engine/GameConfig' {
    class GameConfig {
        constructor();
        readonly data: any;
        loadConfig(path: string): Promise<{}>;
    }
    export default GameConfig;
}

declare module 'UAENGINE/Core/Engine/GameObjectFactory' {
    import Entity from "UAENGINE/Core/Engine/Entity";
    class GameObjectFactory {
        constructor(entity: Entity);
        text(x: number, y: number, text: string, style: any): Entity;
        sprite(x: number, y: number, sprite: string, frame?: string | null): Entity;
        nineSlice(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): Entity;
        container(x: number, y: number): Entity;
        spine(x: number, y: number, spine: string): Entity;
    }
    export default GameObjectFactory;
}

declare module 'UAENGINE/Services/IScreen' {
    import { Sprite } from 'pixi.js';
    interface IScreen {
        addHitMap(object: Sprite, threshold: number): void;
        createScreen(width: number, height: number, elementId: string): void;
        createContainer(x: number, y: number): any;
        createText(x: number, y: number, text: string, style?: any): any;
        createSprite(x: number, y: number, name: string, frame: string | null): any;
        createNineSlice(x: number, y: number, name: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): any;
        clearScreen(): void;
        changeTexture(sprite: Sprite, name: string, frame?: string | null): void;
        createSpine(name: string): any;
        enableInput(sprite: any): void;
        disableInput(sprite: any): void;
        addListener(event: string, sprite: any, callback: Function, context: any): void;
        removeListener(event: string, sprite: any, callback: Function): void;
        resize(x: number, y: number): void;
    }
    export default IScreen;
}

declare module 'UAENGINE/Core/Engine/ILevel' {
    interface ILevel {
        init(): void;
        start(): void;
        shutdown(): void;
    }
    export default ILevel;
}

declare module 'UAENGINE/Core/Engine/AnimationManager' {
    import Anim from 'UAENGINE/Core/Data/Anim';
    import Tween from 'UAENGINE/Core/Data/Tween';
    class AnimationManager {
        _activeAnimation: Anim | null;
        _tween: Tween;
        constructor(anim: Anim, tween: Tween);
        play(name: string): void;
        playSpine(name: string): void;
        pause(name: string): void;
        resume(name: string): void;
        addTween(name: string, easing: string, object: any): void;
        playTween(name: string, toObject: any, time: number, updateFunction?: Function): void;
        pauseTween(name: string): void;
        resumeTween(name: string): void;
        addSpineAnimation(name: string, fps: number, data: any): void;
        addAnimation(name: string, base: string, max: number, fps: number, data: any): void;
        createNew(): AnimationManager;
        getUpdatedFrame(): string | null;
        update(time: number): void;
    }
    export default AnimationManager;
}

declare module 'UAENGINE/Core/Engine/ScaleManager' {
    import GameConfig from 'UAENGINE/Core/Engine/GameConfig';
    class ScaleManager {
        constructor(gameConfig: GameConfig);
        init(): void;
        getXY(x: number, y: number): {
            x: number;
            y: number;
        };
        getScale(currentScale: number): number;
        createNew(): ScaleManager;
    }
    export default ScaleManager;
}

declare module 'UAENGINE/Services/IObjectHandler' {
    import Point from 'UAENGINE/Core/Data/Point';
    interface IObjectHandler {
        setXy(object: any, x: number, y: number): void;
        setSize(object: any, width: number, height: number): void;
        setPivot(object: any, anchor: Point): void;
        setX(object: any, x: number): void;
        setY(object: any, y: number): void;
        setScaleXY(object: any, x: number, y: number): void;
    }
    export default IObjectHandler;
}

declare module 'UAENGINE/Core/Engine/InputHandler' {
    import Events from "UAENGINE/Core/Engine/Events";
    import Loader from "UAENGINE/Core/Engine/Loader";
    import Point from "UAENGINE/Core/Data/Point";
    import IScreen from "UAENGINE/Services/IScreen";
    class InputHandler {
        constructor(events: Events, loader: Loader, screen: IScreen);
        readonly pointer: Point;
        enable(displayObject: any): void;
        disable(displayObject: any): void;
        addListener(event: string, callback: Function, sprite: any, context: any, once?: boolean): void;
        removeListener(event: string, callback: Function, sprite: any): void;
    }
    export default InputHandler;
}

declare module 'UAENGINE/Core/Engine/Utils/MathUtils' {
    class MathUtils {
            /**
                * @description get a range of numbers in an array, from lowest to highest
                * @param lowest the number to start the range on
                * @param finish the number to finish the range on
                */
            static getRangeArray(lowest: number, highest: number): number[];
            /**
                * @description get the smallest number in an array
                * @param a the array of numbers to be assessed
                */
            static getSmallestNumber(a: Number[]): number;
            clamp(val: number, min: number, max: number): number;
            round(val: number): number;
    }
    export default MathUtils;
}

declare module 'UAENGINE/Core/Data/Point' {
    class Point {
        _x: number;
        _y: number;
        constructor(x: number, y: number);
        x: number;
        y: number;
        createNew(x: number, y: number): Point;
    }
    export default Point;
}

declare module 'UAENGINE/Core/Data/FunObj' {
    class FunObj {
        constructor();
        readonly function: any;
        init(f: any, context: any): void;
        execute(data: any): any;
        createNew(): FunObj;
    }
    export default FunObj;
}

declare module 'UAENGINE/Core/Data/Resource' {
    class Resource {
            constructor();
            data: any;
            readonly name: string;
            /**
                * @description returns the basename of the file, without file extension
                */
            readonly basename: string;
            readonly url: string;
            loaded: boolean;
            initImage(url: string, loaded: boolean): void;
            initSnd(url: string, loaded: boolean): void;
            initJSON(url: string, loaded: boolean): void;
            isImg(): boolean;
            isSnd(): boolean;
            createNew(): Resource;
    }
    export default Resource;
}

declare module 'UAENGINE/Services/IImgLoader' {
    interface IImgLoader {
        loadImages(images: string[], onProgress: any, onDone: any, context: any): void;
        loadSpine(name: string, jsonUrl: string): void;
        getResources(foo: Function): void;
        getTexture(resource: any, frame: any): any;
        download(onDone?: Function): void;
    }
    export default IImgLoader;
}

declare module 'UAENGINE/Services/ISndLoader' {
    interface ISndLoader {
        loadSounds(urls: string[], extensions: string[], onProgress: Function, onComplete: Function, context: any): void;
        baseURL: string;
    }
    export default ISndLoader;
}

declare module 'UAENGINE/Services/AjaxLoader' {
    class AjaxLoader {
        constructor();
        loadFile(url: string, onDone?: Function): void;
    }
    export default AjaxLoader;
}

declare module 'UAENGINE/Core/Engine/AudioManager' {
    import Loader from 'UAENGINE/Core/Engine/Loader';
    import HwPlayer from 'UAENGINE/Services/Howler/HwPlayer';
    class AudioManager {
        _hwPlayer: HwPlayer;
        constructor(loader: Loader, hwLoader: HwPlayer);
        play(name: string, onStop: Function, loop?: boolean): void;
        playMusic(name: string, onStop: Function, loop?: boolean): void;
        stopMusic(): void;
        stop(name: string): void;
        playInstructionArr(arr: string[], onDone: Function): void;
        _stopInstPlaying(): void;
        readonly filesPlaying: string[];
    }
    export default AudioManager;
}

declare module 'UAENGINE/Core/Engine/Utils/Utils' {
    import ActScripts from 'UAENGINE/Core/Engine/Utils/ActScripts';
    import Collections from 'UAENGINE/Core/Engine/Utils/Collections';
    import Mixins from 'UAENGINE/Core/Engine/Utils/Mixins';
    import Colors from 'UAENGINE/Core/Engine/Utils/Colors';
    import MathUtils from 'UAENGINE/Core/Engine/Utils/MathUtils';
    import Text from 'UAENGINE/Core/Engine/Utils/Text';
    import Vectors from 'UAENGINE/Core/Engine/Utils/Vectors';
    class Utils {
        constructor(actScripts: ActScripts, collections: Collections, colors: Colors, mixins: Mixins, math: MathUtils, text: Text, vectors: Vectors);
        readonly script: ActScripts;
        readonly coll: Collections;
        readonly color: ActScripts;
        readonly mixin: Mixins;
        readonly math: MathUtils;
        readonly text: Text;
        readonly vector: Vectors;
    }
    export default Utils;
}

declare module 'UAENGINE/Core/Engine/ScriptHandler' {
    import ActScripts from 'UAENGINE/Core/Engine/Utils/ActScripts';
    import Events from 'UAENGINE/Core/Engine/Events';
    class ScriptHandler {
            constructor(utils: ActScripts, events: Events);
            init(name: string, raw: any[], parseCols: string[], objectifyCols: string[], processText?: string[]): void;
            /**
             * @description to be used at init, to convert raw json data into a more functional script, with arrays and objects
             * instead of stringified lists and cells with 'stringified' key-value pairs into objects. The converted data is stored in the
             * rows[] array. rows, rather than raw, should be accessed for almost every subsequent task involving the activity script.
             * @param parseCols the columns which contain 'stringified' lists which should be converted into arrays of text vals
             * @param objectifyCols the columns which contain stringified key-value pairs. These are converted into objects.
             */
            convertRowsFromRaw(parseCols: string[], objectifyCols: string[], processText?: string[]): void;
            chunks(text: string): string[];
            words(text: string): string[];
            readonly name: string;
            readonly initialized: boolean;
            readonly raw: any[];
            readonly rows: any[];
            /**
                * @description set the active row.
                */
            active: any;
            /**
                * @description get the last row (the previous value of active)
                */
            readonly last: any;
            goTo(row: any): void;
            goToAutoNext(): void;
            getFromAutoNext(): any;
            /**
                * @description find the first row whose cells contain the specified vals
                * @param colname the columns (properties) to search for the respective vals in
                * @param val the vals to search for. The order of this array must match colname.
                */
            rowByCellVals(colname: string[], val: string[]): any[] | null;
            /**
                * @description searches through all arrays in the specified columns, and returns every unique value. Duplicates
                * are removed.
                * @param cols the columns to search for files in
                */
            fileList(cols: string[]): string[];
    }
    export default ScriptHandler;
}

declare module 'UAENGINE/Core/Engine/Expose' {
    class Expose {
        constructor();
        init(): void;
        add(key: string, object: any): void;
    }
    export default Expose;
}

declare module 'UAENGINE/Core/Data/Anim' {
    import Events from 'UAENGINE/Core/Engine/Events';
    class Anim {
        constructor(events: Events);
        readonly name: string;
        readonly data: any;
        readonly frames: string[];
        readonly fps: number;
        init(name: string, base: string, max: number, fps: number, data: any): void;
        getNextFrame(): string;
        createNew(): Anim;
        startSpineAnimation(): void;
        pause(): void;
        resume(): void;
    }
    export default Anim;
}

declare module 'UAENGINE/Core/Data/Tween' {
    import * as TWEEN from '@tweenjs/tween.js';
    class Tween {
        _easing: string;
        _object: any;
        _data: TWEEN.Tween | null;
        _pausedTime: number;
        _time: number;
        _pauseDiff: number;
        constructor();
        readonly name: string;
        init(name: string, easing: string, object: any): void;
        to(toObject: any, time: number, updateFunction?: Function): void;
        createNew(): Tween;
        update(time: number): void;
        pause(): void;
        resume(): void;
    }
    export default Tween;
}

declare module 'UAENGINE/Services/Howler/HwPlayer' {
    import Loader from 'UAENGINE/Core/Engine/Loader';
    import Resource from 'UAENGINE/Core/Data/Resource';
    class HwPlayer {
        constructor(loader: Loader);
        play(name: string, res: Resource, onStop: Function, loop?: boolean): void;
        pause(res: Resource): void;
        resume(res: Resource): void;
        stop(res: Resource): void;
    }
    export default HwPlayer;
}

declare module 'UAENGINE/Core/Engine/Utils/ActScripts' {
    class ActScripts {
            /**
            * @description a function to generate an array of objects from a column with 'stringified' tabular data. Use this for activity scripts with cells in columns which contain
            * more than one property, all baked into one string, with a : delineated, one line per property
            * @param array the array to pull the column from -- intended for object arrays generated from CSV files (tabular)
            * @param column the name of the column to generate objects from in the array
            */
            objectArrayifyColumn(array: any, column: string): any[];
            /**
                * @description break a string into seperate filenames, generally for image and sound references
                * @param text the string value from the 'cell', to be parsed.
                */
            getValsFromCell(text: string): string[];
            /**
                * @description returns all the unique values found in a column of the activity script, with comma delineated values
                * such as 'fish,dog,horse'
                * @param script the activityScript to pull the values from
                * @param column the name of the 'column' in the script, now a property belonging to all objects in the object array
                */
            getUniqValsFromCol(script: any, column: string): string[];
            /**
                * @description returns all the unique values found in comma delineated lists in all of the columns specified in
                * the cols array
                * @param script the script to pull the vals from
                * @param cols the 'columns', or properties, to include in the search
                */
            getUniqValsFromCols(script: any, cols: string[]): string[];
            /**
                * @description a simple helper method that takes an array, and returns it with all duplicate values removed
                * @param vals the array of values to remove duplicated from
                */
            getUniq(vals: string[]): string[];
            /**
                * @description generates an object with properties from a string, where each key-value pair is on a new line, colon assigns a value, and
                * comma seperates multiple values.
                * @param cellString the string that the cell was converted to from the Activity Script
                */
            objectifyCell(cellString: string): object;
            /**
                * @description returns the first row to match the specified criteria, or null if none
                * @param colnames the column names to look for values in. Order must match vals array
                * @param vals the vals to search for in the colnames array. Order must match colnames array.
                */
            rowByColsWithVals(rows: any[], colnames: string[], vals: string[]): any;
            /**
            * @description returns all rows which match the specified criteria, or null if none
            * @param colnames the column names to look for values in. Order must match vals array
            * @param vals the vals to search for in the colnames array. Order must match colnames array.
            */
            rowsByColsWithVals(rows: any[], colnames: string[], vals: string[]): any[];
            /**
                * @description returns a perfect, deep clone of a JSON serializable object -- suitable for cloning actScripts,
                * but not for anything with methods.
                * @param script
                */
            clone(script: any): any;
            toLines(text: string): string[];
            words(text: string): string[];
    }
    export default ActScripts;
}

declare module 'UAENGINE/Core/Engine/Utils/Collections' {
    class Collections {
        findArrElWithPropVal(array: any[], properties: string[], values: any[]): any;
        numElementsWithPropVal(array: any[], properties: string[], values: any[]): number;
        allElementsWithPropVal(array: any[], properties: string[], values: any[]): any[];
        getUniqValsFromArrays(rows: any, arrs: string[]): string[];
        /**
          * @description shuffle and return an array
          * @param a array to be shuffled
          */
        shuffle(a: any): any[];
    }
    export default Collections;
}

declare module 'UAENGINE/Core/Engine/Utils/Mixins' {
    class Mixins {
        static applyMixins(derivedCtor: any, baseCtors: any[]): void;
    }
    export default Mixins;
}

declare module 'UAENGINE/Core/Engine/Utils/Colors' {
    class Colors {
    }
    export default Colors;
}

declare module 'UAENGINE/Core/Engine/Utils/Text' {
    class Text {
            /**
                 * @description concatenate an array of strings, with a seperator substring. For no seperator, use ""
                 * @param array the array of strings to combine
                 * @param seperator the seperator substring to insert between entries, like underscore. For no seperator, use ""
                 */
            concat(array: string[], seperator: string): string;
            getUniq(vals: string[]): string[];
            /**
                * @description break a string into a string array, based on the provided seperator substring, and remove falsy values
                * @param text the string to break into a string array
                * @param seperator the seperator substring
                */
            unstringifyArray(txt: string, seperator: string): string[];
            propertiesFromString(rawText: string, lineSeperator: string, valueAssigner: string, valueSeperator: string): object;
            split(text: string, seperator: string): string[];
    }
    export default Text;
}

declare module 'UAENGINE/Core/Engine/Utils/Vectors' {
    import Vector2D from "UAENGINE/Core/Data/Point";
    class Vectors {
        static getPointGrid(hor: number[], vert: number[]): Array<Vector2D>;
    }
    export default Vectors;
}

