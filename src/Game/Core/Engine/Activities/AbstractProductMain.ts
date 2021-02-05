import Game from "../../Game";
import IActivity from "./IActivity";

class AbstractProductMain {
    protected _game: Game;
    protected _defaultActivity: IActivity;
    protected _urlParams: URLSearchParams;

    constructor(game: Game, defaultActivity: IActivity) {
        this._game = game;
        this._defaultActivity = defaultActivity;
        this._game.addActivity(defaultActivity); 
        this._init();
    }

    protected _init() {
        this._game.setProduct(this);
        this._retrieveURLParams();
        this._start();
    }

    /**
     * @description start the product. If there is a scene property in URL, load that. Otherwise, load 'main_menu'.
     */
    protected _start() {
        let scene = this.getURLSceneCode()
        if (scene == null) scene = 'main_menu';
        if (scene.includes('menu')) this._game.startActivity(scene, this._defaultActivity);
        else this._game.startActivity(scene);
    }

    get urlParams() {
        return this._urlParams;
    }

    /**
     * @description The default activity for this product - contains the menu scenes etc.
     */
    get menuSystem(){
        return this._defaultActivity;
    }

    /**
     * @description Is there a 'scene' param in the URL? Returns it, or null if not
     */
    getURLSceneCode() {
        return this._urlParams.get('scene');
    }

    protected _retrieveURLParams() {
        let queryString = window.location.search;
        this._urlParams = new URLSearchParams(queryString);
    }
}

export default AbstractProductMain;