import Game from "../../Game";
import Debug from "../Debug";
import Events from "../Events";
import ContainerObject from "../GameObjects/ContainerObject";
import GOFactory from "../GameObjects/GOFactory";
import IGameObject from "../GameObjects/IGameObject";
import MenuBar from "../GameObjects/MenuBar";
import SpriteObject from "../GameObjects/SpriteObject";
import LevelManager from "../LevelManager";
import Loader from "../Loader";
import IActivity from "./IActivity";

abstract class AbstractAppMain {
    protected _HUD: ContainerObject;
    protected _game: Game;
    protected _loader: Loader;
    protected _levelManager: LevelManager;
    protected _goFactory: GOFactory;
    protected _bottomBar: MenuBar;
    protected _defaultActivity: IActivity;
    protected _urlParams: URLSearchParams;
    protected _loadCont: ContainerObject;
    protected _loadBar: SpriteObject;

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
        this._boot();
        Debug.info('about to create HUD...');
        this._HUD = this._goFactory.container(0, 0);
        Debug.info('hud cont: ', this._HUD);
        this._addToOverlay(this._HUD);
    }

    /**
     * @description Use this 'boot' method to pre-preload assets you need loaded at the VERY start, such as a 'load_bar' or a UI element etc. Override and call super._boot() last.
     */
    protected _boot() {
        this._loader.download().then(() => { this._preload() });
    }

    /**
    * @description Use this preload to load assets you'll need for anything you add from the AppMain, such as menu bars and UI elements etc. If you are adding a 'loading bar'
    * here, make sure you pre-preload those assets when you override the _boot() method of this class. Override and call super._preload() last.
    */
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

    createLoadScreen(bgd: string, loadStatic: string, loadBar: string, yScreenOffset: number = 200, xOffset: number = 20, yOffset: -5){
        this._loadCont = this._goFactory.container(0, 0, this._HUD);
        this._goFactory.sprite(0, 0, bgd, null, this._loadCont);
        let staticBar = this._goFactory.sprite(this._game.width() / 2, this._game.height() / 2 + yScreenOffset, loadStatic, null, this._loadCont);
        staticBar.setOrigin(0.5, 0);
        this._loadBar = this._goFactory.sprite(staticBar.left + xOffset, (staticBar.top + staticBar.height / 2) + yOffset, loadBar, null, this._loadCont);
        this._loadBar.setOrigin(0, 0.5);
        this._levelManager.globalEvents.on('download_start', this.showLoadScreen, this);
        this._levelManager.globalEvents.on('download_complete', this.hideLoadScreen, this);
        this._levelManager.globalEvents.on('download_progress', this.updateLoadBar, this);
        Debug.exposeGlobal(this._loadCont, 'loadScreen');
       // this.showLoadScreen();
    }

    showLoadScreen(){
        this._loadCont.visible = true;
    }

    hideLoadScreen(){
        this._loadCont.visible = false;
    }

    updateLoadBar(){
        if(this._loadBar) this._loadBar.scaleHandler.x = this._loader.progressPercentage / 100;
    }

    /**
     * @description creases a bare-bones 'nav bar', with background image. Buttons must be added in sub class.
     * @param x the x coordinate
     * @param y the y coordinate
     * @param texture the name of the img resource to use for the texture
     */
    protected _buildNavBar(x: number, y: number, texture: string) {
        this._bottomBar = this._goFactory.menu(x, y, texture, this._HUD, false);
    }

    showNavBar() {
        if (this._bottomBar) { this._bottomBar.show(); } else Debug.warn('bottomBar is undefined');
    }

    hideNavBar() {
        if (this._bottomBar) { this._bottomBar.hide(); } else Debug.warn('bottomBar is undefined');
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