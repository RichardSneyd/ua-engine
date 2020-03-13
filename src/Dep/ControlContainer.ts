import SmartDepend from '../Dep/SmartDepend';

//Core
import Game          from        '../Game/Core/Game';
  //Data
  import Anim        from        '../Game/Core/Data/Anim';
  import FunObj      from        '../Game/Core/Data/FunObj';
  import Resource    from        '../Game/Core/Data/Resource';
  //Engine
  import Entity      from        '../Game/Core/Engine/Entity';
  import AnimationManager from   '../Game/Core/Engine/AnimationManager';
  import Loader      from        '../Game/Core/Engine/Loader';
  import Loop        from        '../Game/Core/Engine/Loop';
  import World       from        '../Game/Core/Engine/World';
  //Levels
  import MainLevel   from        '../Game/Core/Levels/MainLevel';


//Services
import ImgLoader     from        '../Game/Services/ImgLoader';
import ObjectHandler from        '../Game/Services/ObjectHandler';
import Screen        from        '../Game/Services/Screen';
  //Pixi
  import PxFactory   from        '../Game/Services/Pixi/PxFactory';
  import PxGame      from        '../Game/Services/Pixi/PxGame';
  import PxLoader    from        '../Game/Services/Pixi/PxLoader';


class ControlContainer {
  private _smartDepend:SmartDepend;
  private _game: any;
  private _funObj: any; _resource: any; _anim: any;
  private _entity: any; _world: any; _loop: any; _loader: any; _animationManager: any;
  private _mainLevel: any;

  private _screen: any; _imgLoader:any; _objectHandler: any;
  private _pxFactory: any; _pxGame: any; _pxLoader: any;

  constructor() {
    this._smartDepend = new SmartDepend();

    this._addModules();
    this._addDepends();
  }

  public getMain(): Game {
    let spEntity = <Game> this._smartDepend.resolve(this._game);

    return spEntity;
  }

  private _addModules() {
    //Game
      //Core
        this._game            = this._smartDepend.addModule(Game, false);
        //Data
          this._anim          = this._smartDepend.addModule(Anim, false);
          this._funObj        = this._smartDepend.addModule(FunObj, false);
          this._resource      = this._smartDepend.addModule(Resource, false);
        //Engine
          this._animationManager = this._smartDepend.addModule(AnimationManager, false);
          this._entity        = this._smartDepend.addModule(Entity, false);
          this._loader        = this._smartDepend.addModule(Loader, true);
          this._loop          = this._smartDepend.addModule(Loop, false);
          this._world         = this._smartDepend.addModule(World, false);
        //Levels
          this._mainLevel     = this._smartDepend.addModule(MainLevel, false);

      //Services
        this._imgLoader       = this._smartDepend.addModule(ImgLoader, true);
        this._objectHandler   = this._smartDepend.addModule(ObjectHandler, false);
        this._screen          = this._smartDepend.addModule(Screen, true);
        //Pixi
          this._pxFactory     = this._smartDepend.addModule(PxFactory, false);
          this._pxGame        = this._smartDepend.addModule(PxGame, true);
          this._pxLoader      = this._smartDepend.addModule(PxLoader, true);


  }

  private _addDepends() {
    //Game
      //Core
      this._smartDepend.addDependency(this._game, this._world);
      this._smartDepend.addDependency(this._game, this._mainLevel);
        //Engine
        this._smartDepend.addDependency(this._animationManager, this._anim);
        
        this._smartDepend.addDependency(this._entity, this._screen);
        this._smartDepend.addDependency(this._entity, this._objectHandler);
        
        this._smartDepend.addDependency(this._world, this._entity);
        this._smartDepend.addDependency(this._world, this._screen);

        this._smartDepend.addDependency(this._loader, this._resource);
        this._smartDepend.addDependency(this._loader, this._imgLoader);

        this._smartDepend.addDependency(this._loop, this._funObj);
        //Levels
        this._smartDepend.addDependency(this._mainLevel, this._loop);
        this._smartDepend.addDependency(this._mainLevel, this._entity);
        this._smartDepend.addDependency(this._mainLevel, this._loader);

      //Services
      this._smartDepend.addDependency(this._imgLoader, this._pxLoader);

      this._smartDepend.addDependency(this._screen, this._pxGame);
        //Pixi
        this._smartDepend.addDependency(this._pxGame, this._pxFactory);
        this._smartDepend.addDependency(this._pxGame, this._loader);

        this._smartDepend.addDependency(this._pxLoader, this._pxFactory);
  }

}

export default ControlContainer;