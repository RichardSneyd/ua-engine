
import Debug from "../Debug";
import Button from "./Button";
import ContainerObject from "./ContainerObject";
import GOFactory from "./GOFactory";
import IParentChild from "./IParentChild";
import SpriteObject from "./SpriteObject";
import GOStateMachine from "./State/GOStateMachine";

class MenuBar {
    public _containerFact: ContainerObject;
    public _group: ContainerObject;
    public _spriteFact: SpriteObject;
    public sprite: SpriteObject;
    protected _buttons: Button[] = [];
    protected _stateMachineFact: GOStateMachine;
    protected _states: GOStateMachine;

    constructor(spriteFact: SpriteObject, stateMachineFact: GOStateMachine, containerFact: ContainerObject){
        this._spriteFact = spriteFact;
        this._stateMachineFact = stateMachineFact;
        this._containerFact = containerFact;
        Debug.exposeGlobal(this, 'bar');
    }

    get group(){
        return this._group;
    }

    get states(){
        return this._states;
    }

    init(x: number, y: number, texture: string, parent: IParentChild | null){
        // keeping all elements in a 'group' (cont) allows to apply state to elements, but still tween and move them via the 'group' wrapper, which is unaffected by state
        // objects that must have state tracked should be added as children to the sprite. addButton does this automatically
        // objects that should not have state tracked should be added to 'group'
        this._group = this._containerFact.createNew(x, y, parent); 
        this.sprite = this._spriteFact.createNew(0, 0, texture, null, this._group);
        this._states = this._stateMachineFact.createNew(this.sprite);
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
        let bar = new MenuBar(this._spriteFact, this._stateMachineFact, this._containerFact);
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