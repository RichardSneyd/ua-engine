import BaseScene from './Scenes/BaseScene';
abstract class BaseComponent {
    public name: string;
    enabled: boolean = false;

    constructor(name: string){
        this.name = name;
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

    public abstract remove();

    public requestUpdate() {
        if(this.isEnabled){
            this.update();
        }
    }

    protected abstract update();
}

export default BaseComponent;