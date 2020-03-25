import SmartDepend from '../Dep/SmartDepend';

//Core
import Game from '../Game/Core/Game';
//Data
import Anim from '../Game/Core/Data/Anim';
import FunObj from '../Game/Core/Data/FunObj';
import Resource from '../Game/Core/Data/Resource';
import Tween from '../Game/Core/Data/Tween';
//Engine
import Entity from '../Game/Core/Engine/Entity';
import AnimationManager from '../Game/Core/Engine/AnimationManager';
import Loader from '../Game/Core/Engine/Loader';
import Loop from '../Game/Core/Engine/Loop';
import World from '../Game/Core/Engine/World';
import Events from '../Game/Core/Engine/Events';
import ScaleManager from '../Game/Core/Engine/ScaleManager';
//Levels


//Utils
import Utils from '../Game/Core/Engine/Utils/Utils';
import ActScripts from '../Game/Core/Engine/Utils/ActScripts';
import Collections from '../Game/Core/Engine/Utils/Collections';
import Colors from '../Game/Core/Engine/Utils/Colors';
import Mixins from '../Game/Core/Engine/Utils/Mixins';
import Numbers from '../Game/Core/Engine/Utils/Numbers';
import Text from '../Game/Core/Engine/Utils/Text';
import Vectors from '../Game/Core/Engine/Utils/Vectors'
//Levels
import MainLevel from '../Game/Core/Levels/MainLevel';


import LevelManager from '../Game/Core/Engine/LevelManager';
import AudioManager from '../Game/Core/Engine/AudioManager';
import ScriptHandler from '../Game/Core/Engine/ScriptHandler';

//Services
import ImgLoader from '../Game/Services/ImgLoader';
import SndLoader from '../Game/Services/SndLoader';
import AjaxLoader from '../Game/Services/AjaxLoader';
import ObjectHandler from '../Game/Services/ObjectHandler';
import Screen from '../Game/Services/Screen';
//Pixi
import PxFactory from '../Game/Services/Pixi/PxFactory';
import PxGame from '../Game/Services/Pixi/PxGame';
import PxLoader from '../Game/Services/Pixi/PxLoader';
//Howler
import HwFactory from '../Game/Services/Howler/HwFactory';
import HwLoader from '../Game/Services/Howler/HwLoader';
import HwPlayer from '../Game/Services/Howler/HwPlayer';
//Levels
import SndTestLevel from '../Game/Core/Levels/SndTestLevel';



class ControlContainer {
  private _smartDepend: SmartDepend;

  // property declarations for all modules 

  private _game: any;
  private _funObj: any; _resource: any; _anim: any;
  private _entity: any; _world: any; _loop: any; _loader: any; _animationManager: any; private _events: any;
  private _scaleManager: any;
  private _mainLevel: any; _tween: any;
  private _script: any;

  private _sndTestLevel: any; _baseLevel: any;

  private _screen: any;
  private _levelManager: any; _audioManager: any;
  private _imgLoader: any; _sndLoader: any; _ajaxLoader: any;
  _objectHandler: any;
  private _pxFactory: any; _pxGame: any; _pxLoader: any;
  private _hwFactory: any; _hwLoader: any; _hwPlayer: any;

  // utils
  private _utils: any; _actScripts: any; _collections: any; _colors: any;
  private _mixins: any; private _numbers: any; _text: any; _vectors: any;

  constructor() {
    this._smartDepend = new SmartDepend();

    this._addModules();
    this._addDepends();
  }

  public getMain(): Game {
    let spEntity = <Game>this._smartDepend.resolve(this._game);

    return spEntity;
  }

 /*  public getAudioManager(): AudioManager {
    let audio = <AudioManager>this._smartDepend.resolve(this._audioManager);

    return audio;
  } */

  private _addModules() {
    //Game
    //Core
    this._game = this._smartDepend.addModule(Game, false);
    //Data
    this._anim = this._smartDepend.addModule(Anim, false);
    this._funObj = this._smartDepend.addModule(FunObj, false);
    this._resource = this._smartDepend.addModule(Resource, false);
    this._tween = this._smartDepend.addModule(Tween, false);
    //Engine
    this._animationManager = this._smartDepend.addModule(AnimationManager, false);
    this._script = this._smartDepend.addModule(ScriptHandler, false);
    this._entity = this._smartDepend.addModule(Entity, false);
    this._scaleManager = this._smartDepend.addModule(ScaleManager, false);
    this._loader = this._smartDepend.addModule(Loader, true);
    this._loop = this._smartDepend.addModule(Loop, false);
    this._world = this._smartDepend.addModule(World, false);
    this._events = this._smartDepend.addModule(Events, true);
    //Levels
    this._mainLevel = this._smartDepend.addModule(MainLevel, false);
    this._sndTestLevel = this._smartDepend.addModule(SndTestLevel, false);

    //Services
    this._levelManager = this._smartDepend.addModule(LevelManager, false);
    this._audioManager = this._smartDepend.addModule(AudioManager, true);
    this._imgLoader = this._smartDepend.addModule(ImgLoader, true);
    this._sndLoader = this._smartDepend.addModule(SndLoader, true);
    this._ajaxLoader = this._smartDepend.addModule(AjaxLoader, true);
    this._objectHandler = this._smartDepend.addModule(ObjectHandler, false);
    this._screen = this._smartDepend.addModule(Screen, true);
    //Pixi
    this._pxFactory = this._smartDepend.addModule(PxFactory, false);
    this._pxGame = this._smartDepend.addModule(PxGame, true);
    this._pxLoader = this._smartDepend.addModule(PxLoader, true);
    //Howler
    this._hwFactory = this._smartDepend.addModule(HwFactory, true);
    this._hwLoader = this._smartDepend.addModule(HwLoader, true);
    this._hwPlayer = this._smartDepend.addModule(HwPlayer, true);
    //Utils
    this._utils = this._smartDepend.addModule(Utils, true);
    this._actScripts = this._smartDepend.addModule(ActScripts, true);
    this._collections = this._smartDepend.addModule(Collections, true);
    this._colors = this._smartDepend.addModule(Colors, true);
    this._mixins = this._smartDepend.addModule(Mixins, true);
    this._numbers = this._smartDepend.addModule(Numbers, true);
    this._text = this._smartDepend.addModule(Text, true);
    this._vectors = this._smartDepend.addModule(Vectors, true);


  }

  private _addDepends() {
    //Game
    //Core
    this._smartDepend.addDependency(this._game, this._world);
    this._smartDepend.addDependency(this._game, this._mainLevel);
    this._smartDepend.addDependency(this._game, this._sndTestLevel);
    this._smartDepend.addDependency(this._game, this._events);
    this._smartDepend.addDependency(this._game, this._scaleManager);
    //Data
    this._smartDepend.addDependency(this._anim, this._events);
    //Engine
    this._smartDepend.addDependency(this._animationManager, this._anim);
    this._smartDepend.addDependency(this._animationManager, this._tween);

    this._smartDepend.addDependency(this._entity, this._screen);
    this._smartDepend.addDependency(this._entity, this._animationManager);
    this._smartDepend.addDependency(this._entity, this._objectHandler);
    this._smartDepend.addDependency(this._entity, this._events);
    this._smartDepend.addDependency(this._entity, this._scaleManager);

    this._smartDepend.addDependency(this._world, this._entity);
    this._smartDepend.addDependency(this._world, this._screen);

    this._smartDepend.addDependency(this._loader, this._resource);
    this._smartDepend.addDependency(this._loader, this._imgLoader);
    this._smartDepend.addDependency(this._loader, this._sndLoader);
    this._smartDepend.addDependency(this._loader, this._ajaxLoader);

    this._smartDepend.addDependency(this._loop, this._events);
    this._smartDepend.addDependency(this._loop, this._funObj);

    //Utils
    this._smartDepend.addDependency(this._utils, this._actScripts);
    this._smartDepend.addDependency(this._utils, this._collections);
    this._smartDepend.addDependency(this._utils, this._colors);
    this._smartDepend.addDependency(this._utils, this._mixins);
    this._smartDepend.addDependency(this._utils, this._numbers);
    this._smartDepend.addDependency(this._utils, this._text);
    this._smartDepend.addDependency(this._utils, this._vectors);
    this._smartDepend.addDependency(this._actScripts, this._text);
    this._smartDepend.addDependency(this._actScripts, this._collections);

    //Levels
    this._smartDepend.addDependency(this._sndTestLevel, this._levelManager);
    this._smartDepend.addDependency(this._sndTestLevel, this._loop);
    this._smartDepend.addDependency(this._sndTestLevel, this._loader);
    this._smartDepend.addDependency(this._sndTestLevel, this._entity);
    this._smartDepend.addDependency(this._sndTestLevel, this._entity);

    this._smartDepend.addDependency(this._mainLevel, this._levelManager);
    this._smartDepend.addDependency(this._mainLevel, this._loop);
    this._smartDepend.addDependency(this._mainLevel, this._loader);
    this._smartDepend.addDependency(this._mainLevel, this._entity);
    this._smartDepend.addDependency(this._mainLevel, this._entity);

    //Services
    this._smartDepend.addDependency(this._levelManager, this._audioManager);
    this._smartDepend.addDependency(this._levelManager, this._events);
    this._smartDepend.addDependency(this._levelManager, this._script);
    this._smartDepend.addDependency(this._levelManager, this._utils);
    this._smartDepend.addDependency(this._audioManager, this._loader);
    this._smartDepend.addDependency(this._audioManager, this._hwPlayer);
    this._smartDepend.addDependency(this._imgLoader, this._pxLoader);
    this._smartDepend.addDependency(this._sndLoader, this._hwLoader);
    this._smartDepend.addDependency(this._script, this._actScripts);
    this._smartDepend.addDependency(this._script, this._events);
    this._smartDepend.addDependency(this._screen, this._pxGame);
    //Pixi
    this._smartDepend.addDependency(this._pxGame, this._pxFactory);
    this._smartDepend.addDependency(this._pxGame, this._loader);
    this._smartDepend.addDependency(this._pxLoader, this._pxFactory);
    //Howler
    this._smartDepend.addDependency(this._hwLoader, this._hwFactory);
    this._smartDepend.addDependency(this._hwPlayer, this._loader);
  }

}

export default ControlContainer;