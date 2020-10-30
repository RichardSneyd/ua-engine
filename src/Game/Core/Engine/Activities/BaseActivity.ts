import Game from "../../Game";
import IActivity from "./IActivity";
import ILevel from "./ILevel";

/**
 * @description Extending the BaseLevel class is the quickes, cleanest and easiest way of creaing a barebones Highwood activity
 */
abstract class BaseActivity implements IActivity {
    private _game: Game;
    private _code: string;
    private _name: string;

    constructor(code: string, name: string, game: Game){
        this._game = game;
        this._code = code;
        this._name = name;
    }

    get code(){
        return this._code;
    }

    get name(){
        return this._code;
    }

    startActivity(scriptName: string, level: ILevel) {
        if(this._game.gameStarted){
            this._game.loadScene(level, scriptName);
        }
        else {
            this._game.startGame('./config.json').then(() =>{
                this._game.loadScene(level, scriptName);
          });
        }
      }
}

export default BaseActivity;