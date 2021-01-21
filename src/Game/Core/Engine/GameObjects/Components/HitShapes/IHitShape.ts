import IGameObject from "../../IGameObject";

interface IHitShape {
    containsPoint(point: {x: number, y: number}): boolean;
}

export default IHitShape;