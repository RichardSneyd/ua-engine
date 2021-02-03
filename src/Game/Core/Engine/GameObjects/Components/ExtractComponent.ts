import IGameObject from "../IGameObject";
import Screen from "../../../../Services/Screen";
import { RenderTexture } from "pixi.js-legacy";

class ExtractComponent {
    protected _screen: Screen;
    protected _go: IGameObject;

    constructor(screen: Screen) {
        this._screen = screen;
    }

    /**
    * @description syncronously generates an image element from the object/container
    */
    public toImgElement(): HTMLImageElement {
        let cont = this._go.data.data !== undefined ? this._go.data.data : this._go.data;
        return this._screen.toImgElement(cont);
    }

    /**
     * @description returns a 1D array of pixels for the image. This is achieved by creating an imgEl with base64 src, and drawing it to an invisible canvas. 
     * img.onload must be used to avoid drawing the img before it is loaded, hence the Promise.
     * @param x the x value to start at on the canvas
     * @param y the y value to start at on the canvas
     * @param width the width of the section to return data for
     * @param height the height of the section to return data for
    */
    public toPixels(x: number = 0, y: number = 0, width?: number, height?: number): Promise<Uint8Array | Uint8ClampedArray> {
        return this._screen.toPixels(this._go.data, x, y, width, height);
    }

    /**
 * @description extract 1D Uint8Array of RGBA pixel data synchronously using PIXI RenderTexture to circumvent PIXI extract issues
 * @param container the Container/DisplayObject to retrieve pixels for
 */
    public pixels(): Uint8Array | Uint8ClampedArray {
        return this._screen.pixels(this._go.data);
    }

    /**
   * @description Generate a base64 version of the image synchronously, using PIXI extract
   */
    public toBase64(): string {
        return this._screen.toBase64(this._go.data);
    }

    /**
   * @description Generate a new texture and baseTexture, with base64 src, from existing gameObject/container
   */
    public toTexture(): RenderTexture {
        return this._screen.toTexture(this._go.data);
    }

    /**
    * @description generates a canvas element asyncronously for the object/container
    */
    public toCanvas(): Promise<HTMLCanvasElement> {
        return this._screen.toCanvas(this._go.data);
    }

    /**
  * @description generate canvas syncronously via PIXI renderTexture and extract. Based on bounding box, which can be inaccurate in spine animations
  */
    public canvas(): HTMLCanvasElement {
        return this._screen.canvas(this._go.data);
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