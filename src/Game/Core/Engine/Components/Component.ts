import BaseScene from './Component';
import IComponent from './IComponent';

abstract class Component implements IComponent {
    public name: string;
    _enabled: boolean;

    constructor(name: string, enabled: boolean = false){
        this.name = name;
        this._enabled = enabled;
    }

    get enabled(){
        return this._enabled;
    }

    set enabled(enabled: boolean){
        this._enabled = enabled;
    }

    public enable(){
        this.enabled = true;
    }

    public disable(){
        this.enabled = false;
    }

    public isEnabled() : boolean {
        if(this.enabled){ return true} else {return false}
    }

    
    public requestUpdate() {
        if(this.isEnabled){
            this.update();
        }
    }
    
    public abstract remove();
    public abstract update();
}

export default Component;