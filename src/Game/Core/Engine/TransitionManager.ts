import { DisplayObject, Container } from "pixi.js";
import TweenManager from "./GameObjects/Components/TweenManager";
import Tween from "../Data/Tween";
import GameConfig from "./GameConfig";

class TransitionManager {
    private _tweens: TweenManager;
    private _gameConfig: GameConfig;
    private _duration: number;

    constructor(tweens: TweenManager, gameConfig: GameConfig){
        this._tweens = tweens;
        this._gameConfig = gameConfig;
        this._duration = 2000;
    }

    slideLeft(newLevel: Container, oldLevel: Container, onComplete: Function){
        let name = 'slideLeft', easing = 'Bounce.InOut', xDiff = this._gameConfig.data.DISPLAY.WIDTH;
        let newTo = {x: newLevel.x + xDiff}, oldTo = {x: oldLevel.x + xDiff};
        newLevel.x = oldLevel.x + xDiff;
        newLevel.y = oldLevel.y;
        this._transition(name, newLevel, oldLevel, newTo, oldTo, easing, onComplete);
    }

    slideRight(newLevel: Container, oldLevel: Container, onComplete: Function){
        let name = 'slideRight', easing = 'Bounce.InOut', xDiff = this._gameConfig.data.DISPLAY.WIDTH;
        let newTo = {x: newLevel.x - xDiff}, oldTo = {x: oldLevel.x - xDiff};
        newLevel.x = oldLevel.x - xDiff;
        newLevel.y = oldLevel.y;
        this._transition(name, newLevel, oldLevel, newTo, oldTo, easing, onComplete);
    }
    
    slideUp(newLevel: Container, oldLevel: Container, onComplete: Function){
        let name = 'slideRight', easing = 'Bounce.InOut', yDiff = this._gameConfig.data.DISPLAY.HEIGHT;
        let newTo = {y: newLevel.y - yDiff}, oldTo = {y: oldLevel.y - yDiff};
        newLevel.x = oldLevel.x;
        newLevel.y = oldLevel.y + yDiff;
        this._transition(name, newLevel, oldLevel, newTo, oldTo, easing, onComplete);
    }
    
    slideDown(newLevel: Container, oldLevel: Container, onComplete: Function){
        let name = 'slideRight', easing = 'Bounce.InOut', yDiff = this._gameConfig.data.DISPLAY.HEIGHT;
        let newTo = {y: newLevel.y + yDiff}, oldTo = {y: oldLevel.y + yDiff};
        newLevel.x = oldLevel.x;
        newLevel.y = oldLevel.y - yDiff;
        this._transition(name, newLevel, oldLevel, newTo, oldTo, easing, onComplete);
    }

    private _transition(name: string, newLevel: Container, oldLevel: Container, newTo: any, oldTo: any, easing: string, onComplete: Function){
        this._tweens.once(name + 1, easing, newLevel, newTo, this._duration).onComplete(onComplete);
        this._tweens.once(name + 2, easing, oldLevel, oldTo, this._duration).onComplete(onComplete);
    }
}

export default TransitionManager;