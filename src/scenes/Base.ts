///<reference path='../../types/phaser.d.ts' />

import { CONST } from "../CONST/CONST";
import Utils from "../Generic/Utils";
import AudioManager from "../Generic/Audio/Manager";


export default class Base extends Phaser.Scene {
    loadBg: Phaser.GameObjects.Sprite;
    loadbarBg: Phaser.GameObjects.Sprite;
    loadbarTime: Phaser.GameObjects.Sprite;

    professorKey: string;
    bannerKey: string;
    transitionKey: string;

    static pack: Phaser.Types.Loader.FileTypes.PackFileConfig = {
        //@ts-ignore
        files: [
            { type: 'scenePlugin', key: 'SpinePlugin', url: 'libs/SpinePlugin.min.js', sceneKey: 'spine' }
        ]
    }

    constructor(key: string) {
        super({ key: key, pack: Base.pack });
    }
    setFestival() {
        let festival = CONST.FESTIVAL;

        if (festival == 'default') {
            this.professorKey = 'professor';
            this.transitionKey = 'standard_transition';
            this.bannerKey = null;
        }
        else {
            this.transitionKey = 'transition_' + festival;
            this.bannerKey = 'festival_banner_' + festival;
            if (festival == 'spring') {
                this.professorKey = 'professor_spring_festival'

            }
            else if (festival == 'dragon') {
                this.professorKey = 'professor_dragon_boat_festival'

            }
            else if (festival == 'autumn') {
                this.professorKey = 'professor_autumn_festival'

            }
            else if (festival == 'easter') {
                this.professorKey = 'professor_easter'

            }
            else if (festival == 'halloween') {
                this.professorKey = 'professor_halloween'

            }
            else if (festival == 'christmas') {
                this.professorKey = 'professor_christmas'

            }
        }
    }

    preload() {
        this.setFestival();
        //  this.load.scenePlugin('SpinePlugin');
        //  this.load.scenePlugin('spine');

        this.load.setPath(CONST.PATHS.GRAPHICS);
        this.load.image('bear_loadingscreen_bg', 'bear_loadingscreen_bg.jpg');
        this.load.image('bear_loading_bar_back', 'bear_loading_bar_back.png');
        this.load.image('bear_loading_bar_time', 'bear_loading_bar_time.png');
        this.load.image(this.transitionKey, this.transitionKey + '.png');

        //if(this.cache.binary.exists('bear_loadingscreen_bg')){
        this.loadBg = this.add.sprite(0, 0, 'bear_loadingscreen_bg').setOrigin(0, 0);
        this.loadbarBg = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2 + 200, 'bear_loading_bar_back');
        this.loadbarTime = this.add.sprite(this.loadbarBg.getLeftCenter().x + 20, this.loadbarBg.getLeftCenter().y, 'bear_loading_bar_time').setOrigin(0, 0.5);

        this.load.on('progress', this.loadUpdate.bind(this));

        this.load.setPath(CONST.PATHS.SPINE);
        this.load.spine(this.professorKey, this.professorKey + '.json', this.professorKey + '.atlas', true);
    }

    loadUpdate() {
        if (this.loadbarTime !== null) {
            let width = this.loadbarTime.width;
            this.loadbarTime.setScale(this.load.progress, 1);
        }
    }

    create() {
        //  this.scene.start('MainMenu');

       // this.loadBg.destroy();
       // this.loadbarBg.destroy();
       // this.loadbarTime.destroy();
        this.createSpriteAnims();
    }

    createSpriteAnims() {
        // add anims common to all scenes that inherit base. Called in subclasses.    
    }

    changeAct(key: string) {
        AudioManager.stopArray(this);
        this.time.addEvent({
            delay: 10, callback: function (this: any) {
                this.scene.start(key);
            }, callbackScope: this
        });
    }
}

