import SmartDepend from '../Dep/SmartDepend';

//Core
import Game from '../Game/Core/Game';
//Data
import FunObj from '../Game/Core/Data/FunObj';
import Resource from '../Game/Core/Data/Resource';
//Engine
import Entity from '../Game/Core/Engine/Entity';
import Loader from '../Game/Core/Engine/Loader';
import Loop from '../Game/Core/Engine/Loop';
import World from '../Game/Core/Engine/World';
//Utils
import Utils from '../Game/Utils/Utils';
import ActScripts from '../Game/Utils/ActScripts';
import Collections from '../Game/Utils/Collections';
import Colors from '../Game/Utils/Colors';
import Mixins from '../Game/Utils/Mixins';
import Numbers from '../Game/Utils/Numbers';
import Text from '../Game/Utils/Text';
import Vectors from '../Game/Utils/Vectors'
//Levels
import MainLevel from '../Game/Core/Levels/MainLevel';


//Services
import LevelManager from '../Game/Services/LevelManager';
import AudioManager from '../Game/Services/AudioManager';
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
import BaseLevel from '../Game/Core/Levels/BaseLevel';



class ControlContainer {
  private _smartDepend: SmartDepend;

  // property declarations for all modules 
 
  private _game: any;
  private _funObj: any; _resource: any;
  private _entity: any; _world: any; _loop: any; _loader: any;
  private _mainLevel: any; _sndTestLevel: any; _baseLevel: any;

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

  public getAudioManager(): AudioManager {
    let audio = <AudioManager>this._smartDepend.resolve(this._audioManager);

    return audio;
  }

  private _addModules() {
    //Game
    //Core
    this._game = this._smartDepend.addModule(Game, false);
    //Data
    this._funObj = this._smartDepend.addModule(FunObj, false);
    this._resource = this._smartDepend.addModule(Resource, false);
    //Engine
    this._entity = this._smartDepend.addModule(Entity, false);
    this._loader = this._smartDepend.addModule(Loader, true);
    this._loop = this._smartDepend.addModule(Loop, false);
    this._world = this._smartDepend.addModule(World, false);
    //Levels
    this._baseLevel = this._smartDepend.addModule(BaseLevel, false);
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
      //Levels
      this._smartDepend.addDependency(this._game, this._mainLevel);
      this._smartDepend.addDependency(this._game, this._sndTestLevel);
      this._smartDepend.addDependency(this._game, this._utils);
        //Engine
        this._smartDepend.addDependency(this._entity, this._screen);
        this._smartDepend.addDependency(this._entity, this._objectHandler);
        
        this._smartDepend.addDependency(this._world, this._entity);
        this._smartDepend.addDependency(this._world, this._screen);

        this._smartDepend.addDependency(this._loader, this._resource);
        this._smartDepend.addDependency(this._loader, this._imgLoader);
        this._smartDepend.addDependency(this._loader, this._sndLoader);
        this._smartDepend.addDependency(this._loader, this._ajaxLoader);

        this._smartDepend.addDependency(this._loop, this._funObj);
        
        //Utils
        this._smartDepend.addDependency(this._utils, this._actScripts);
        this._smartDepend.addDependency(this._utils, this._collections);
        this._smartDepend.addDependency(this._utils, this._colors);
        this._smartDepend.addDependency(this._utils, this._mixins);
        this._smartDepend.addDependency(this._utils, this._numbers);
        this._smartDepend.addDependency(this._utils, this._text);
        this._smartDepend.addDependency(this._utils, this._vectors);

        //Levels
        this._smartDepend.addDependency(this._sndTestLevel, this._levelManager);
        this._smartDepend.addDependency(this._sndTestLevel, this._loop);
        this._smartDepend.addDependency(this._sndTestLevel, this._entity);
        this._smartDepend.addDependency(this._sndTestLevel, this._loader);
        this._smartDepend.addDependency(this._mainLevel, this._levelManager);
        this._smartDepend.addDependency(this._mainLevel, this._loop);
        this._smartDepend.addDependency(this._mainLevel, this._entity);
        this._smartDepend.addDependency(this._mainLevel, this._loader);

      //Services
      this._smartDepend.addDependency(this._levelManager, this._audioManager);
      this._smartDepend.addDependency(this._audioManager, this._loader);
      this._smartDepend.addDependency(this._audioManager, this._hwPlayer);
      this._smartDepend.addDependency(this._imgLoader, this._pxLoader);
      this._smartDepend.addDependency(this._sndLoader, this._hwLoader);
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