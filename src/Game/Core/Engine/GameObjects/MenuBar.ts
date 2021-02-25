
import Debug from "../Debug";
import Button from "./Button";
import GOFactory from "./GOFactory";
import IParentChild from "./IParentChild";
import SpriteObject from "./SpriteObject";

class MenuBar {
    public _spriteFact: SpriteObject;
    public sprite: SpriteObject;
    protected _buttons: Button[] = [];
    protected _states: any;
    protected _state: string;

    constructor(spriteFact: SpriteObject){
        this._spriteFact = spriteFact;
        Debug.exposeGlobal(this, 'bar');
    }

    init(x: number, y: number, texture: string, parent: IParentChild | null){
        this.sprite = this._spriteFact.createNew(x, y, texture, null, parent);
        this.sprite.setOrigin(0, 0);
        this._buttons = [];
      //  this.y -= this.height;
    }

    show(){
        Debug.info('show nav bar');
        this.sprite.visible = true;
    }

    hide(){
        Debug.info('hide nav bar');
        this.sprite.visible = false;
    }

    get x(){
        return this.sprite.x;
    }

    set x(x: number){
        this.sprite.x = x;
    }

    get y(){
        return this.sprite.y;
    }

    set y(y: number){
        this.sprite.y = y;
    }

    get width(){
        return this.sprite.width;
    }

    get height(){
        return this.sprite.height;
    }

    setOrigin(x: number, y: number) {
        this.sprite.setOrigin(x, y);
    }

    addButton(button: Button): MenuBar{
        this._buttons.push(button);
        this.sprite.addChild(button.sprite);
        return this;
    }

    destroy(){
        this._destroyButtons();
        this.sprite.destroy();
    }

    private _destroyButtons(){
        for(let x = 0; x < this._buttons.length; x++){
            this._buttons[x].destroy();
        }
    }

    createNew(x: number, y: number, texture: string, parent: IParentChild | null): MenuBar{
        let bar = new MenuBar(this._spriteFact);
        bar.init(x, y, texture, parent);
        return bar;
    }

    /**
     * @description generate a 'state' object based on the current positions of all elements
     */
    genState(){

    }

    setState(state: any){
        
    }
}

export default MenuBar;