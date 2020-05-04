import ObjectCore from "./Components/ObjectCore";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from "./Components/ScaleHandler";
import ParentChildHandler from './Components/ParentChildHandler';
import TweenManager from "./Components/TweenManager";

interface IGameObject {
    core: ObjectCore;
    input: InputHandler;
    scaleHandler: ScaleHandler;
    pcHandler: ParentChildHandler;
    init(...args: any[]): void;
    createNew(...args: any[]): any;
    createEmpty(): any;
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
    data: any;
    destroy(): void;
    update(time: any): void;
    tweens: TweenManager;
}

export default IGameObject;