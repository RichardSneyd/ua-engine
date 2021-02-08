import Game from "../../Game";
import GOFactory from "../GameObjects/GOFactory";
import Loader from "../Loader";
import Loop from "../Loop";
import BaseScene from "./BaseScene";
import SceneEvents from "./SceneEvents";

abstract class BaseMenu extends BaseScene {
    constructor(events: SceneEvents, loop: Loop, goFactory: GOFactory, loader: Loader, game: Game){
        super(events, loop, goFactory, loader, game);
    }

    start(){
        this._events.global.emit('hide_nav_bar');
        super.start();
    }
}

export default BaseMenu;