import Entity from "./Components/Entity";
import InputHandler from "./Components/InputHandler";

interface IGameObject {
    entity: Entity;
    input: InputHandler;
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