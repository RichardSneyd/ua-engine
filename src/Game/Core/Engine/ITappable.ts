import Rect from "../Data/Rect";

interface ITappable {
    enabled: boolean;
    getBounds(): Rect;
}

export default ITappable;