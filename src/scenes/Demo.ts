import Utils from "../Generic/Utils";
import Base from "./Base";
import { CONST } from "../CONST/CONST";

export default class Demo extends Base {
    bgSprite: Phaser.GameObjects.Sprite;

    constructor() {
        super(CONST.KEYS.SCENES.DEMO);
        // this.scene.setActive(true);
    }

    preload() {
        super.preload();

        // load images
        this.load.setPath(CONST.PATHS.GRAPHICS);
        this.load.image('main_menu_bg', 'main_menu_bg.png');
    }

    create() {
        super.create();
        this.bgSprite = this.add.sprite(0, 0, 'main_menu_bg', 0);
        this.bgSprite.setOrigin(0, 0);
        // this.cameras.default.setBackgroundColor( "#ffffff")
        //@ts-ignore
    //    this.scene.manager.get
     //   console.log(scenes)
        let links = Utils.getSceneKeys(this);


        DemoLink.genLinks(this, links, this.switchState.bind(this));
    }

    public switchState(stateName: string) {
        DemoLink.all = [];
        this.scene.start(stateName);
    }
}


class DemoLink extends Phaser.GameObjects.Text {
    static all: Array<DemoLink> = [];
    origin: Demo;
    callback: Function;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, callback: Function) {
        super(scene, x, y, text, Utils.basicFont);
        this.style.setFontSize(60);
        this.callback = callback;
        scene.add.existing(this);
        DemoLink.all.push(this);
        this.setOrigin(0, 0);
        this.setInteractive();
        this.input.cursor = 'cursor: pointer';

        this.on('pointerdown', function (this: any) {
            this.callback(text);
        }, this);
    }

    static genLinks(scene: Phaser.Scene, links: string[], callback: Function) {
        let y = 100;
        let xPad = 560;
        let col = 0;
        for (let x = 0; x < links.length; x++) {
            if (DemoLink.all.length > 0) {
                let top = DemoLink.all[DemoLink.all.length - 1].getBottomCenter().y + 10;
                if (top >= scene.game.canvas.height - 60) {
                    top = 20;
                    col++;
                }

                y = top;

            }
            else {
                y = 20;
            }
            new DemoLink(scene, 20 + xPad * col, y, links[x], callback);
        }
    }
}