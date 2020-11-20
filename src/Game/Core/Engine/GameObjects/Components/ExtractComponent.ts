import IGameObject from "../IGameObject";
import Screen from "../../../../Services/Screen";
import { RenderTexture } from "pixi.js-legacy";

class ExtractComponent {
    protected _screen: Screen;
    protected _go: IGameObject;

    constructor(screen: Screen) {
        this._screen = screen;
    }

    public toImgElement(): Promise<HTMLImageElement> | null {
        //  let cont = this.data.data !== undefined ? this.data.data : this.data;
        // let cont = this.data;
        // Debug.info('cont: ', cont);
        return this._screen.toImgElement(this._go.data);
    }

    public toPixels(): Uint8Array | Uint8ClampedArray {
        return this._screen.toPixels(this._go.data);
    }

    public toBase64(): string {
        return this._screen.toBase64(this._go.data);
    }

    public toTexture(): RenderTexture {
        return this._screen.toTexture(this._go.data);
    }

    init(go: IGameObject): ExtractComponent {
        this._go = go;
        return this;
    }

    createEmpty(): ExtractComponent {
        return new ExtractComponent(this._screen);
    }

    createNew(go: IGameObject): ExtractComponent {
        return this.createEmpty().init(go);
    }
}

export default ExtractComponent;