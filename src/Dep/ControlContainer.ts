import SmartDepend from '../Dep/SmartDepend';

import Anim from '../../src/Game/Core/Data/Anim';
import FunObj from '../../src/Game/Core/Data/FunObj';
import Resource from '../../src/Game/Core/Data/Resource';
import Tween from '../../src/Game/Core/Data/Tween';
import AnimationManager from '../../src/Game/Core/Engine/AnimationManager';
import AudioManager from '../../src/Game/Core/Engine/AudioManager';
import Entity from '../../src/Game/Core/Engine/Entity';
import Events from '../../src/Game/Core/Engine/Events';
import Expose from '../../src/Game/Core/Engine/Expose';
import GameConfig from '../../src/Game/Core/Engine/GameConfig';
import GameObjectFactory from '../../src/Game/Core/Engine/GameObjectFactory';
import InputHandler from '../../src/Game/Core/Engine/InputHandler';
import LevelManager from '../../src/Game/Core/Engine/LevelManager';
import Loader from '../../src/Game/Core/Engine/Loader';
import Loop from '../../src/Game/Core/Engine/Loop';
import ScaleManager from '../../src/Game/Core/Engine/ScaleManager';
import ScriptHandler from '../../src/Game/Core/Engine/ScriptHandler';
import ActScripts from '../../src/Game/Core/Engine/Utils/ActScripts';
import ArrayHandler from '../../src/Game/Core/Engine/Utils/ArrayHandler';
import Collections from '../../src/Game/Core/Engine/Utils/Collections';
import Colors from '../../src/Game/Core/Engine/Utils/Colors';
import MathUtils from '../../src/Game/Core/Engine/Utils/MathUtils';
import Mixins from '../../src/Game/Core/Engine/Utils/Mixins';
import Text from '../../src/Game/Core/Engine/Utils/Text';
import Utils from '../../src/Game/Core/Engine/Utils/Utils';
import Vectors from '../../src/Game/Core/Engine/Utils/Vectors';
import World from '../../src/Game/Core/Engine/World';
import Game from '../../src/Game/Core/Game';
import AjaxLoader from '../../src/Game/Services/AjaxLoader';
import HwFactory from '../../src/Game/Services/Howler/HwFactory';
import HwLoader from '../../src/Game/Services/Howler/HwLoader';
import HwPlayer from '../../src/Game/Services/Howler/HwPlayer';
import ImgLoader from '../../src/Game/Services/ImgLoader';
import ObjectHandler from '../../src/Game/Services/ObjectHandler';
import PxFactory from '../../src/Game/Services/Pixi/PxFactory';
import PxGame from '../../src/Game/Services/Pixi/PxGame';
import PxLoader from '../../src/Game/Services/Pixi/PxLoader';
import PxPoint from '../../src/Game/Services/Pixi/PxPoint';
import PxText from '../../src/Game/Services/Pixi/PxText';
import Screen from '../../src/Game/Services/Screen';
import SndLoader from '../../src/Game/Services/SndLoader';




class ControlContainer {
  private _smartDepend: SmartDepend;

  private _Anim: any;
private _FunObj: any;
private _Resource: any;
private _Tween: any;
private _AnimationManager: any;
private _AudioManager: any;
private _Entity: any;
private _Events: any;
private _Expose: any;
private _GameConfig: any;
private _GameObjectFactory: any;
private _InputHandler: any;
private _LevelManager: any;
private _Loader: any;
private _Loop: any;
private _ScaleManager: any;
private _ScriptHandler: any;
private _ActScripts: any;
private _ArrayHandler: any;
private _Collections: any;
private _Colors: any;
private _MathUtils: any;
private _Mixins: any;
private _Text: any;
private _Utils: any;
private _Vectors: any;
private _World: any;
private _Game: any;
private _AjaxLoader: any;
private _HwFactory: any;
private _HwLoader: any;
private _HwPlayer: any;
private _ImgLoader: any;
private _ObjectHandler: any;
private _PxFactory: any;
private _PxGame: any;
private _PxLoader: any;
private _PxPoint: any;
private _PxText: any;
private _Screen: any;
private _SndLoader: any;


  constructor() {
    this._smartDepend = new SmartDepend();

    this._addModules();
    this._addDepends();
  }

  public getMain(): Game {
    let spEntity = <Game>this._smartDepend.resolve(this._Game);

    return spEntity;
  }

  private _addModules() {
    this._Anim = this._smartDepend.addModule(Anim, false);
this._FunObj = this._smartDepend.addModule(FunObj, false);
this._Resource = this._smartDepend.addModule(Resource, false);
this._Tween = this._smartDepend.addModule(Tween, false);
this._AnimationManager = this._smartDepend.addModule(AnimationManager, false);
this._AudioManager = this._smartDepend.addModule(AudioManager, true);
this._Entity = this._smartDepend.addModule(Entity, false);
this._Events = this._smartDepend.addModule(Events, true);
this._Expose = this._smartDepend.addModule(Expose, false);
this._GameConfig = this._smartDepend.addModule(GameConfig, true);
this._GameObjectFactory = this._smartDepend.addModule(GameObjectFactory, false);
this._InputHandler = this._smartDepend.addModule(InputHandler, false);
this._LevelManager = this._smartDepend.addModule(LevelManager, false);
this._Loader = this._smartDepend.addModule(Loader, true);
this._Loop = this._smartDepend.addModule(Loop, false);
this._ScaleManager = this._smartDepend.addModule(ScaleManager, false);
this._ScriptHandler = this._smartDepend.addModule(ScriptHandler, false);
this._ActScripts = this._smartDepend.addModule(ActScripts, true);
this._ArrayHandler = this._smartDepend.addModule(ArrayHandler, false);
this._Collections = this._smartDepend.addModule(Collections, true);
this._Colors = this._smartDepend.addModule(Colors, true);
this._MathUtils = this._smartDepend.addModule(MathUtils, false);
this._Mixins = this._smartDepend.addModule(Mixins, true);
this._Text = this._smartDepend.addModule(Text, true);
this._Utils = this._smartDepend.addModule(Utils, true);
this._Vectors = this._smartDepend.addModule(Vectors, true);
this._World = this._smartDepend.addModule(World, false);
this._Game = this._smartDepend.addModule(Game, false);
this._AjaxLoader = this._smartDepend.addModule(AjaxLoader, true);
this._HwFactory = this._smartDepend.addModule(HwFactory, true);
this._HwLoader = this._smartDepend.addModule(HwLoader, true);
this._HwPlayer = this._smartDepend.addModule(HwPlayer, true);
this._ImgLoader = this._smartDepend.addModule(ImgLoader, true);
this._ObjectHandler = this._smartDepend.addModule(ObjectHandler, false);
this._PxFactory = this._smartDepend.addModule(PxFactory, false);
this._PxGame = this._smartDepend.addModule(PxGame, true);
this._PxLoader = this._smartDepend.addModule(PxLoader, true);
this._PxPoint = this._smartDepend.addModule(PxPoint, false);
this._PxText = this._smartDepend.addModule(PxText, false);
this._Screen = this._smartDepend.addModule(Screen, true);
this._SndLoader = this._smartDepend.addModule(SndLoader, true);

  }

  private _addDepends() {
    this._smartDepend.addDependency(this._Anim, this._Events);


this._smartDepend.addDependency(this._AnimationManager, this._Anim);
this._smartDepend.addDependency(this._AnimationManager, this._Tween);


this._smartDepend.addDependency(this._AudioManager, this._Loader);
this._smartDepend.addDependency(this._AudioManager, this._HwPlayer);


this._smartDepend.addDependency(this._Entity, this._Screen);
this._smartDepend.addDependency(this._Entity, this._AnimationManager);
this._smartDepend.addDependency(this._Entity, this._ObjectHandler);
this._smartDepend.addDependency(this._Entity, this._InputHandler);
this._smartDepend.addDependency(this._Entity, this._MathUtils);
this._smartDepend.addDependency(this._Entity, this._Events);
this._smartDepend.addDependency(this._Entity, this._ScaleManager);


this._smartDepend.addDependency(this._GameObjectFactory, this._Entity);


this._smartDepend.addDependency(this._InputHandler, this._Events);
this._smartDepend.addDependency(this._InputHandler, this._Loader);
this._smartDepend.addDependency(this._InputHandler, this._Screen);


this._smartDepend.addDependency(this._LevelManager, this._AudioManager);
this._smartDepend.addDependency(this._LevelManager, this._Events);
this._smartDepend.addDependency(this._LevelManager, this._ScriptHandler);
this._smartDepend.addDependency(this._LevelManager, this._Utils);
this._smartDepend.addDependency(this._LevelManager, this._InputHandler);


this._smartDepend.addDependency(this._Loader, this._Resource);
this._smartDepend.addDependency(this._Loader, this._ImgLoader);
this._smartDepend.addDependency(this._Loader, this._SndLoader);
this._smartDepend.addDependency(this._Loader, this._AjaxLoader);
this._smartDepend.addDependency(this._Loader, this._GameConfig);


this._smartDepend.addDependency(this._Loop, this._Events);
this._smartDepend.addDependency(this._Loop, this._FunObj);


this._smartDepend.addDependency(this._ScaleManager, this._GameConfig);


this._smartDepend.addDependency(this._ScriptHandler, this._ActScripts);
this._smartDepend.addDependency(this._ScriptHandler, this._Events);


this._smartDepend.addDependency(this._ActScripts, this._Text);
this._smartDepend.addDependency(this._ActScripts, this._Collections);


this._smartDepend.addDependency(this._Utils, this._ActScripts);
this._smartDepend.addDependency(this._Utils, this._Collections);
this._smartDepend.addDependency(this._Utils, this._Colors);
this._smartDepend.addDependency(this._Utils, this._Mixins);
this._smartDepend.addDependency(this._Utils, this._MathUtils);
this._smartDepend.addDependency(this._Utils, this._Text);
this._smartDepend.addDependency(this._Utils, this._Vectors);


this._smartDepend.addDependency(this._World, this._Entity);
this._smartDepend.addDependency(this._World, this._Screen);


this._smartDepend.addDependency(this._Game, this._World);
this._smartDepend.addDependency(this._Game, this._Entity);
this._smartDepend.addDependency(this._Game, this._Loop);
this._smartDepend.addDependency(this._Game, this._Loader);
this._smartDepend.addDependency(this._Game, this._Events);
this._smartDepend.addDependency(this._Game, this._ScaleManager);
this._smartDepend.addDependency(this._Game, this._Expose);
this._smartDepend.addDependency(this._Game, this._GameConfig);
this._smartDepend.addDependency(this._Game, this._LevelManager);


this._smartDepend.addDependency(this._HwLoader, this._HwFactory);


this._smartDepend.addDependency(this._HwPlayer, this._Loader);


this._smartDepend.addDependency(this._ImgLoader, this._PxLoader);


this._smartDepend.addDependency(this._PxFactory, this._PxText);


this._smartDepend.addDependency(this._PxGame, this._PxFactory);
this._smartDepend.addDependency(this._PxGame, this._Loader);
this._smartDepend.addDependency(this._PxGame, this._Events);


this._smartDepend.addDependency(this._PxLoader, this._PxFactory);


this._smartDepend.addDependency(this._PxText, this._PxPoint);


this._smartDepend.addDependency(this._Screen, this._PxGame);


this._smartDepend.addDependency(this._SndLoader, this._HwLoader);



  }

}

export default ControlContainer;