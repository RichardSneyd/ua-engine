import IGameObject from "../IGameObject";
import SpineObject from "../SpineObject";

class SpineAnimationManager implements IAnimationManager{
    protected _go: SpineObject;

    constructor(){
        
    }

    update(){
        // do nothing for now
    }

    init(go: SpineObject){
        this._go = go;
    }

    createNew(){
        return new SpineAnimationManager();
    }

    play(animName: string, loop: boolean = false){
        this._go.data.state.setAnimation(0, animName, loop);
    }

    public addAnimation(animName: string, loop: boolean, delay: number = 0){
        this._go.data.state.addAnimation(0, animName, loop, delay);
    }

    // a helper method for playing a sequence of animations
    public playAnimations(animNames: string[], loop: boolean = false) {
        for(let x = 0; x < animNames.length; x++){
            this._go.data.state.addAnimation(0, animNames[x], loop, 0);
        }
    }
    
    public clearAnimations(){
        this._go.data.state.clearTrack(0);
    }

    public setToSetupPose(){
        this._go.data.skeleton.setToSetupPose();
    }



}

export default SpineAnimationManager;