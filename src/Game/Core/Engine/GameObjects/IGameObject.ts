import ObjectCore from "./Components/ObjectCore";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from "./Components/ScaleHandler";
import ParentChildHandler from './Components/ParentChildHandler';

interface IGameObject {
    core: ObjectCore;
    input: InputHandler;
    scaleHandler: ScaleHandler;
    pcHandler: ParentChildHandler;
    init(...args: any[]): void;
    createNew(...args: any[]): any;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    width: number;
    height: number;
    visible: boolean;
    destroy(): void;
}

export default IGameObject;