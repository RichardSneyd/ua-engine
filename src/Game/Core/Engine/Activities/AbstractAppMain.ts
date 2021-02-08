import Game from "../../Game";
import Debug from "../Debug";
import Events from "../Events";
import ContainerObject from "../GameObjects/ContainerObject";
import GOFactory from "../GameObjects/GOFactory";
import IGameObject from "../GameObjects/IGameObject";
import MenuBar from "../GameObjects/MenuBar";
import LevelManager from "../LevelManager";
import Loader from "../Loader";
import IActivity from "./IActivity";

class AbstractAppMain {
    protected _HUD: ContainerObject;
    protected _game: Game;
    protected _loader: Loader;
    protected _levelManager: LevelManager;
    protected _goFactory: GOFactory;
    protected _bottomBar: MenuBar;
    protected _defaultActivity: IActivity;
    protected _urlParams: URLSearchParams;

    constructor(game: Game, defaultActivity: IActivity, goFactory: GOFactory, loader: Loader, levelManager: LevelManager) {
        this._game = game;
        this._goFactory = goFactory;
        this._loader = loader;
        this._levelManager = levelManager;
        this._defaultActivity = defaultActivity;
        this._game.setProduct(this);
        this._game.addActivity(defaultActivity);

        Debug.exposeGlobal(this, 'product');

        if (this._game.gameStarted) {
            this._init();
        }
        else {
            this._game.startGame().then(() => {
                this._init();
            });
        }

    }

    protected _init() {
        this._retrieveURLParams();
        this._preload();
        Debug.info('about to create HUD...');
        this._HUD = this._goFactory.container(0, 0);
        Debug.info('hud cont: ', this._HUD);
        this._addToOverlay(this._HUD);
    }

    protected _preload() {
        this._loader.download().then(() => { this._start() });
        //    this._start();
    }

    /**
     * @description 'start' the app. If there is a scene property in URL, load that. Otherwise, load 'main_menu'.
     */
    protected _start() {
        this._levelManager.globalEvents.on('show_nav_bar', this.showNavBar, this);
        this._levelManager.globalEvents.on('hide_nav_bar', this.hideNavBar, this);
        let scene = this.getURLSceneCode();
        if (scene == null) scene = 'main_menu';
        if (scene.includes('menu')) this._game.startActivity(scene, this._defaultActivity);
        else this._game.startActivity(scene);
    }

    /**
     * @description creases a bare-bones 'nav bar', with background image. Buttons must be added in sub class.
     * @param x the x coordinate
     * @param y the y coordinate
     * @param texture the name of the img resource to use for the texture
     */
    protected _buildNavBar(x: number, y: number, texture: string){
        this._bottomBar = this._goFactory.menu(x, y, texture, this._HUD);
    }

    showNavBar() {
        if (this._bottomBar) this._bottomBar.show(); else Debug.warn('bottomBar is undefined');
    }

    hideNavBar() {
        if (this._bottomBar) this._bottomBar.hide(); else Debug.warn('bottomBar is undefined');
    }
    
    prevAct() {
        this._game.startActivity(this._levelManager.script.rows[0].config.prev_act);
    }

    nextAct() {
        this._game.startActivity(this._levelManager.script.rows[0].config.next_act);
    }

    get urlParams() {
        return this._urlParams;
    }

    /**
     * @description The default activity for this product - contains the menu scenes etc.
     */
    get menuSystem() {
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

    get HUD() {
        return this._HUD;
    }

    public addToHUD(go: IGameObject) {
        this._HUD.addChild(go);
    }

    public removeFromHUD(go: IGameObject) {
        this._HUD.removeChild(go);
    }

    private _addToOverlay(gameObject: IGameObject) {
        // gameObject.parent?.removeChild(gameObject);
        // let data = gameObject.data.data ? gameObject.data.data : gameObject.data;
        //    Debug.info('gameObject data: ', gameObject.data);
        this._game.world.overlay.addChild(gameObject.data);
        //     Debug.info('overlay layer: ', this._game.world.overlay);
    }
}

export default AbstractAppMain;