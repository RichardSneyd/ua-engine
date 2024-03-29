import ObjectCore from "./Components/ObjectCore";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from "./Components/ScaleHandler";
import ParentChildHandler from './Components/ParentChildHandler';
import TweenManager from "../TweenManager";
import IParentChild from "./IParentChild";
import Events from "../Events";
import Point from "../../Geom/Point";
import TweenComponent from "./Components/TweenComponent";
import ExtractComponent from "./Components/ExtractComponent";
import IHitShape from "./Components/HitShapes/IHitShape";

/**
 * @description the base interface for all GameObjects
 */
interface IGameObject extends IParentChild{
    hitShape: IHitShape | null;
    angle: number;
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
    origin: Point;
    setOrigin(x: number, y?: number): void;
    left: number;
    right: number;
    top: number;
    bottom: number;
    data: any;
    destroy(): void;
    tweens: TweenComponent;
    events: Events;
    changeTexture(textureName: string): void;
    textureName: string;
    atlas: string;
    zIndex: number;
    sort(): void;
    extract: ExtractComponent;
    name: string;
    globalX: number;
    globalY: number;
}

export default IGameObject;