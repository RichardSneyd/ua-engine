import ObjectCore from "./Components/ObjectCore";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from "./Components/ScaleHandler";
import ParentChildHandler from './Components/ParentChildHandler';
import TweenManager from "./Components/TweenManager";
import IParentChild from "./IParentChild";
import Events from "../Events";


interface IGameObject extends IParentChild{
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
    alpha: number;
    setOrigin(x: number, y?: number): void;
    data: any;
    destroy(): void;
    tweens: TweenManager;
    events: Events;
    changeTexture(textureName: string): void;
    textureName: string;
    atlas: string;
}

export default IGameObject;