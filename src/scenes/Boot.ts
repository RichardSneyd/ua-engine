import Base from './Base';
import {CONST} from '../CONST/CONST';

    export class Boot extends Base {

        constructor() {
            super(CONST.KEYS.SCENES.BOOT);
        }

        preload(){
            this.load.setPath(CONST.PATHS.GRAPHICS);
            this.load.image('bear_loadingscreen_bg', 'bear_loadingscreen_bg.jpg');
            this.load.image('bear_loading_bar_back', 'bear_loading_bar_back.png');
            this.load.image('bear_loading_bar_time', 'bear_loading_bar_time.png');
        }

        create() {
            this.scene.start('FestivalSelection');
        }
    }


