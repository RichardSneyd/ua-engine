import { spine } from "pixi.js-legacy";
import SpineObject from "../SpineObject";
import ObjectCore from "./ObjectCore";

/**
 * @description Handles spine animation for the SpineGameObject.
 */
class SpineAnimationManager implements IAnimationManager {
    protected _go: SpineObject; protected _core: ObjectCore;
    protected _activeAnimation: string;

    constructor() {

    }

    get current() {
        return this.spine.state.getCurrent(0).animation.name;
    }

    /**
     * @description returns the 'animations' object from the spine json file. Each property is the name of an animation
     */
    get animations(): any {
        return this.spineData.animations;
    }

    /**
     * @description returns a list of all the animation names in the animations object of the spine file.
     */
    get animationNames(): string[] {
        let anims = this.animations;
        let names: string[] = [];
        anims.forEach((anim: any) => {
            names.push(anim.name);
        })
        return names;
    }

    get bones(): any {
        return this.spineData.bones;
    }

    get skins(): any {
        return this.spineData.skins;
    }

    get slots(): any {
        return this.spineData.slots;
    }

    get spineData(): spine.core.SkeletonData {
        return this.spine.spineData;
        //this._core.data
    }

    get spine(): PIXI.spine.Spine {
        return this._go.data;
    }

    init(go: SpineObject, core: ObjectCore) {
        this._go = go; this._core = core;
        this._go.events.on('pause', this.pause, this);
        this._go.events.on('resume', this.resume, this);

        this.spine.stateData.defaultMix = 0.3; // default mix rate when switching animations
    }

    createNew() {
        return new SpineAnimationManager();
    }

    play(animName: string, loop: boolean = false) {
        this.spine.state.setAnimation(0, animName, loop);
    }

    pause() {
        this.spine.state.timeScale = 0;
    }

    resume() {
        this.spine.state.timeScale = 1;
    }

    public addAnimation(animName: string, loop: boolean, delay: number = 0) {
        this.spine.state.addAnimation(0, animName, loop, delay);
    }

    // a helper method for playing a sequence of animations
    public playAnimations(animNames: string[], loop: boolean = false) {
        for (let x = 0; x < animNames.length; x++) {
            this.spine.state.addAnimation(0, animNames[x], loop, 0);
        }
    }

    public clearAnimations() {
        this.spine.state.clearTrack(0);
    }

    public setToSetupPose() {
        this.spine.skeleton.setToSetupPose();
    }

    destroy() {
        this._go.events.off('pause', this.pause, this);
        this._go.events.off('resume', this.resume, this);
    }

    update() {

    }

}

export default SpineAnimationManager;