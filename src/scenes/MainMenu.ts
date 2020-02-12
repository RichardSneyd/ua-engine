import Base from "./Base";
import {CONST} from "../CONST/CONST";
import Utils from "../Generic/Utils";
import BearsLogo from "../objects/BearsLogo";
import Professor from "../objects/Professor";
import SidePanel from "../objects/SidePanel";
import Jukebox from "../objects/Jukebox";
import UIButton from "../Generic/HUD/UIButton";
import AudioManager from "../Generic/Audio/Manager";


export default class MainMenu extends Base {
    bgSprite: Phaser.GameObjects.Sprite;
    bgKey: string = 'main_menu_bg';
    bearsLogo: BearsLogo;
    bearsLogoKey: string = 'care_for_the_bears_logo';
    gateway: Phaser.GameObjects.Sprite;

    background: Phaser.GameObjects.Container;
    playground: Phaser.GameObjects.Container;
    foreground: Phaser.GameObjects.Container;
    HUD: Phaser.GameObjects.Container;
    underHUD: Phaser.GameObjects.Container;
    sidePanel: SidePanel;
    professor: Professor;
    banner: Phaser.GameObjects.Sprite;
    jukebox: Jukebox;

    speakerButton: UIButton;
    pauseButton: UIButton;

    audioPaused: boolean = false;
    
    songs: string[] = [
        'care_for_the_bears',
        'counting_the_bears',
        'color_the_bear',
        'food_for_the_bears',
        'cleaning_up',
        'a_home_for_the_bears'
    ]

    introAudio: string[] = [
        'welcome_to_the_bear_park',
        'we_need_to_care_for_the_bears',
        'can_you_care_for_the_bears'
    ]


    constructor(){
        super(CONST.KEYS.SCENES.MAIN_MENU);
    }

    preload(){
        super.preload();
        this.load.setPath(CONST.PATHS.GRAPHICS);
        this.load.image(this.bgKey, this.bgKey + '.png');
        this.load.image('park_gateway', 'park_gateway.png');

        if(this.bannerKey !== null){
            this.load.image(this.bannerKey, this.bannerKey + '.png');
        }
        
        this.load.setPath(CONST.PATHS.SPRITESHEETS);
        this.load.spritesheet(this.bearsLogoKey, this.bearsLogoKey + '.png', {frameWidth: 1051, frameHeight: 494});
        this.load.spritesheet('ui_side_panel', 'ui_side_panel.png', {frameWidth: 175, frameHeight: 645});
        this.load.spritesheet('juke_box', 'juke_box.png', {frameWidth: 960, frameHeight: 140});
        this.load.spritesheet('speaker_button', 'speaker_button.png', {frameWidth: 186, frameHeight: 144, endFrame: 31});
        this.load.spritesheet('pause_button', 'pause_button.png', { frameWidth: 119, frameHeight: 121, startFrame: 0, endFrame: 31 });


        this.load.setPath(CONST.PATHS.SPINE);
        this.load.spine('professor', 'professor.json', 'professor.atlas', true);

        this.load.setPath(CONST.PATHS.AUDIO);

        for(let x = 0; x < this.songs.length; x++){
            this.load.audio(this.songs[x], ['mp3/'+this.songs[x]+'.mp3']);
        }

        // load intro audio
        for(let x = 0; x < this.introAudio.length; x++){
            this.load.audio(this.introAudio[x], ['mp3/'+this.introAudio[x]+'.mp3']);
        }
       
    }

    create(){
        super.create();

        this.background = this.add.container(0, 0)
        this.playground = this.add.container(0, 0);
        this.foreground = this.add.container(0, 0);
        this.underHUD = this.add.container(0, 0);
        this.HUD = this.add.container(0, 0);

        this.bgSprite = this.add.sprite(0, 0, this.bgKey, 0).setOrigin(0, 0);
        this.background.add(this.bgSprite);
        
        if(this.bannerKey !== null){
            this.banner = this.add.sprite(this.game.canvas.width / 2, 0, this.bannerKey, 0);
            this.banner.setOrigin(0.5, 0);
            this.background.add(this.banner);
        }

        this.gateway = this.add.sprite(this.game.canvas.width / 2, 860, 'park_gateway');
        this.playground.add(this.gateway);
        this.bearsLogo = new BearsLogo(this, this.game.canvas.width / 2, 75, this.bearsLogoKey);
        this.playground.add(this.bearsLogo);

        this.professor = new Professor(this, this.professorKey, this.foreground);
        this.professor.moveY(200);
        this.professor.setState('prof_idle', 'y');

        this.sidePanel = new SidePanel(this, this.game.canvas.width, 100, 'ui_side_panel', this.switchScene.bind(this));
        //this.sound.play('main_menu_song', {loop: true});

        this.jukebox = new Jukebox(this, this.game.canvas.width / 2 + 50, this.game.canvas.height, 'juke_box', this.songs);
        this.HUD.add(this.jukebox);

        this.speakerButton = new UIButton(this, 370, this.game.canvas.height - 65, 'speaker_button', function(this: any){
            console.log('speaker pressed');
            AudioManager.playArrayHard(this, 0, this.introAudio);
        }.bind(this), this, this.HUD, {
            over: 'speaker_over',
            out: 'speaker_idle',
        });

        this.pauseButton = new UIButton(this, 1394, this.game.canvas.height - 67, 'pause_button', function(this: any){
           this.toggleAudio();
        }.bind(this), this, this.HUD, {
            over: 'pause_over',
            out: 'pause_out',
        });
    }

    toggleAudio(){
        if(this.audioPaused){
            this.sound.resumeAll();
            this.audioPaused = false;
        }
        else {
            this.sound.pauseAll();
            this.audioPaused = true;
        }
    }

    createSpriteAnims(){
        super.createSpriteAnims();
        this.anims.create({
            key: 'speaker_idle',
            frames: this.anims.generateFrameNumbers('speaker_button', { frames: [0] }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: 0
        });
        this.anims.create({
            key: 'speaker_over',
            frames: this.anims.generateFrameNumbers('speaker_button', { frames: Utils.numberArray(0, 31)}),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });
        this.anims.create({
            key: 'logo_idle',
            frames: this.anims.generateFrameNumbers(this.bearsLogoKey, { frames: [0] }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: 0
        });
        this.anims.create({
            key: 'logo_polar',
            frames: this.anims.generateFrameNumbers(this.bearsLogoKey, { frames: [1] }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });
        this.anims.create({
            key: 'logo_brown',
            frames: this.anims.generateFrameNumbers(this.bearsLogoKey, { frames: [2] }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });
        this.anims.create({
            key: 'logo_panda',
            frames: this.anims.generateFrameNumbers(this.bearsLogoKey, { frames: [3] }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });
        this.anims.create({
            key: 'pause_over',
            frames: this.anims.generateFrameNumbers('pause_button', { frames: Utils.numberArray(0, 30) }),
            frameRate: CONST.ANIMATION.FRAME_RATE,
            repeat: -1
        });
        this.anims.create({
            key: 'pause_out',
            frames: this.anims.generateFrameNumbers('pause_button', { frames: [0] }),
            frameRate: CONST.ANIMATION.FRAME_RATE
        });
    }

    public switchScene(key: string){
        if(this.jukebox.song !== null && this.jukebox.song !== undefined){
            this.jukebox.song.stop();
        }
        this.scene.switch(key);
    }


}