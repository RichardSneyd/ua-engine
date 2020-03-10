import SmartDepend from '../Dep/SmartDepend';

//Core
import Game          from        '../Game/Core/Game';
  //Data
  import FunObj      from        '../Game/Core/Data/FunObj';
  //Engine
  import Entity      from        '../Game/Core/Engine/Entity';
  import Loop        from        '../Game/Core/Engine/Loop';
  import World       from        '../Game/Core/Engine/World';
  //Levels
  import MainLevel   from        '../Game/Core/Levels/MainLevel';


//Services
import ObjectHandler from        '../Game/Services/ObjectHandler';
import Screen        from        '../Game/Services/Screen';
  //Phaser
  import PhFactory   from        '../Game/Services/Phaser/PhFactory';
  import PhGame      from        '../Game/Services/Phaser/PhGame';
  import PhGraphics  from        '../Game/Services/Phaser/PhGraphics';


class ControlContainer {
  private _smartDepend:SmartDepend;
  private _game: any;
  private _funObj: any;
  private _entity: any; _world: any; _loop: any;
  private _mainLevel: any;

  private _screen: any; _objectHandler: any;
  private _phFactory: any; _phGame: any; _phGraphics: any;

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
          this._funObj        = this._smartDepend.addModule(FunObj, false);
        //Engine
          this._entity        = this._smartDepend.addModule(Entity, false);
          this._loop          = this._smartDepend.addModule(Loop, false);
          this._world         = this._smartDepend.addModule(World, false);
        //Levels
          this._mainLevel     = this._smartDepend.addModule(MainLevel, false);

      //Services
        this._objectHandler   = this._smartDepend.addModule(ObjectHandler, false);
        this._screen          = this._smartDepend.addModule(Screen, true);
        //Phaser
          this._phFactory     = this._smartDepend.addModule(PhFactory, false);
          this._phGame        = this._smartDepend.addModule(PhGame, true);
          this._phGraphics    = this._smartDepend.addModule(PhGraphics, false);


  }

  private _addDepends() {
    //Game
      //Core
      this._smartDepend.addDependency(this._game, this._world);
      this._smartDepend.addDependency(this._game, this._mainLevel);
        //Engine
        this._smartDepend.addDependency(this._entity, this._screen);
        this._smartDepend.addDependency(this._entity, this._objectHandler);
        
        this._smartDepend.addDependency(this._world, this._entity);
        this._smartDepend.addDependency(this._world, this._screen);

        this._smartDepend.addDependency(this._loop, this._funObj);
        //Levels
        this._smartDepend.addDependency(this._mainLevel, this._loop);
        this._smartDepend.addDependency(this._mainLevel, this._entity);

      //Services
      this._smartDepend.addDependency(this._screen, this._phGame);
      this._smartDepend.addDependency(this._screen, this._phGraphics);
        //Phaser
        this._smartDepend.addDependency(this._phGame, this._phFactory);

        this._smartDepend.addDependency(this._phGraphics, this._phFactory);
  }

}

export default ControlContainer;