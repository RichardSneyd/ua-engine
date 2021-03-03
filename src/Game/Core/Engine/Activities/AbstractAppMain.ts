import Game from "../../Game";
import Debug from "../Debug";
import Events from "../Events";
import Button from "../GameObjects/Button";
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
    protected _activityBar: MenuBar;
    protected _okButton: Button;
    protected _defaultActivity: IActivity;
    protected _urlParams: URLSearchParams;
    protected _loadCont: ContainerObject;
    protected _loadBar: SpriteObject;
    protected _initialized: boolean;
    protected _scripts: string[];
    protected _activityBarIsDown: boolean;

    

    constructor(game: Game, defaultActivity: IActivity, goFactory: GOFactory, loader: Loader, levelManager: LevelManager) {
        this._game = game;
        this._goFactory = goFactory;
        this._loader = loader;
        this._levelManager = levelManager;
        this._defaultActivity = defaultActivity;
        this._activityBarIsDown = false;
        this._initialized = false;
        this._game.setProduct(this);
        this._game.addActivity(defaultActivity);

        Debug.exposeGlobal(this, 'product');
        this._game.startGame().then(() => {
            //  this._init(); // don't call init here, it's triggered by 'world_initialized' event
        });
        this._levelManager.globalEvents.once('world_initialized', this._init, this);
    }

    protected _init(scripts: string[]) {
        //  Debug.info('init called in AbstractAppMain');
        this._scripts = scripts;
        this._retrieveURLParams();
        //  Debug.info('about to create HUD...');
        this._HUD = this._goFactory.container(0, 0);
        //   Debug.info('hud cont: ', this._HUD);
        this._addToOverlay(this._HUD);
        this._initialized = true;
        this._boot();
    }

    /**
     * @description Use this 'boot' method to pre-preload assets you need loaded at the VERY start, such as a 'load_bar' or a UI element etc. Override and call super._boot() last.
     */
    protected _boot() {
        //   Debug.info('called _boot in AbstractAppMain');
        this._loader.download().then(() => {
            //   this._levelManager.globalEvents.timer(() => {
            this._levelManager.globalEvents.emit('shutdown');
            this._preload();
            //   }, 200, this); // try delaying to see if that fixes loader issue
        });
    }

    /**
    * @description Use this preload to load assets you'll need for anything you add from the AppMain, such as menu bars and UI elements etc. If you are adding a 'loading bar'
    * here, make sure you pre-preload those assets when you override the _boot() method of this class. Override and call super._preload() last.
    */
    protected _preload() {
        this._loader.download().then(() => { this._start() });
    }

    /**
     * @description 'start' the app. If there is a scene property in URL, load that. Otherwise, load 'main_menu'.
     */
    protected _start() {
        this._levelManager.globalEvents.on('level_start', this.showActivityBar, this);
        this._levelManager.globalEvents.on('level_shutdown', this.hideActivityBar, this);
        let scene = this.getURLSceneCode();
        if (scene == null) scene = 'main_menu';
        if (scene.includes('menu')) this._game.startActivity(scene, this._defaultActivity);
        else this._game.startActivity(scene);
    }

    
    /**
     * @description  returns a string array of all script files in the assets/scripts folder. excludes level files
     */
    get scripts(){
        return this._scripts;
    }

    /**
     * @description find the activity script based on a substring that only it contains. The substring must be specific enough that no other script in the scripts
     * array will contain it. Basically, the name of the script, minus the type code at the end, i.e 'k1_t1_l1_s1' instead of 'k1_t1_l1_s1_i4'
     * @param includes the substring to test against
     */
    getScript(includes: string): string{
        for(let x = 0; x < this._scripts.length; x++){
            if(this._scripts[x].includes(includes)) return this._scripts[x];
        }
        Debug.warn('no script in scripts array that includes ', includes);
        return '';
    }

    createLoadScreen(bgd: string, loadStatic: string, loadBar: string, yScreenOffset: number = 200, xOffset: number = 20, yOffset: -5) {
        this._loadCont = this._goFactory.container(0, 0, this._HUD);
        this._loadCont.zIndex = 100;
        this._goFactory.sprite(0, 0, bgd, null, this._loadCont);
        let staticBar = this._goFactory.sprite(this._game.width() / 2, this._game.height() / 2 + yScreenOffset, loadStatic, null, this._loadCont);
        staticBar.setOrigin(0.5, 0);
        this._loadBar = this._goFactory.sprite(staticBar.left + xOffset, (staticBar.top + staticBar.height / 2) + yOffset, loadBar, null, this._loadCont);
        this._loadBar.setOrigin(0, 0.5);
        this._levelManager.globalEvents.on('download_start', this.showLoadScreen, this);
        this._levelManager.globalEvents.on('scene_start', this.hideLoadScreen, this);
        this._levelManager.globalEvents.on('download_progress', this.updateLoadBar, this);
        Debug.exposeGlobal(this._loadCont, 'loadScreen');
        // this.showLoadScreen();
    }

    showLoadScreen() {
        this._loadCont.visible = true;
    }

    hideLoadScreen() {
        this._loadCont.visible = false;
    }

    updateLoadBar() {
        if (this._loadBar) this._loadBar.scaleHandler.x = this._loader.progressPercentage / 100;
    }

    /**
     * @description creases a bare-bones 'nav bar', with background image. Buttons must be added in sub class.
     * @param x the x coordinate
     * @param y the y coordinate
     * @param texture the name of the img resource to use for the texture
     */
    protected _buildActivityBar(x: number, y: number, texture: string) {
        this._activityBar = this._goFactory.menu(x, y, texture, this._HUD, false);
    }

    showActivityBar() {
        if (this._activityBar) { 
            this._activityBar.show(); 
        } else Debug.warn('bottomBar is undefined');
    }

    hideActivityBar() {
        if (this._activityBar) { this._activityBar.hide(); } else Debug.warn('bottomBar is undefined');
    }

    protected _activityBarDown(){
        this._activityBarIsDown = true;
        this._activityBar.y = 400;
    }

    protected _activityBarUp(){
        this._activityBarIsDown = false;
        this._activityBar.y = 0;
    }

    protected _toggleActivityBar(){
        if(this._activityBarIsDown){
            this._activityBarUp();
        }
        else {
            this._activityBarDown();
        }
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

    protected _showOK(){
        this._okButton.show();
    }

    protected _hideOK(){
        this._okButton.hide();
    }
}

export default AbstractAppMain;