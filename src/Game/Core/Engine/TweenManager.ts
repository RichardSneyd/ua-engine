import Tween from "../Data/Tween";
import Easing from './GameObjects/Components/Easing';
import Debug from "./Debug";
import Loop from "./Loop";
import Events from "./Events";
import IGameObject from "./GameObjects/IGameObject";
import { forIn } from "lodash";



class TweenManager {
    private _tweenFact: Tween;
    protected _events: Events;
    private _tweens: Tween[];
    private _easing = Easing;
    private _loop: Loop;

    constructor(tween: Tween, loop: Loop, events: Events) {
        this._tweenFact = tween;
        this._loop = loop;
        this._events = events;
        this._tweens = [];
        this.init();
    }
    
    init(){
        this._loop.addFunction(this.update, this, false); // TweenManager is singleton, so adding looping call directly makes most sense
        this._events.on('shutdown', this._shutdown, this);
        this._events.on('removeForObjects', this._removeForObjects, this);
        Debug.exposeGlobal(this, 'tweens');
        return this;
    }

    createNew() {
        return new TweenManager(this._tweenFact, this._loop, this._events);
    }

    get Easing() {
        return this._easing;
    }


    /**
     * @description Add a new tween
     * @param tweenName the name of the tween. You will referense this when playing it in future
     * @param easing The easing Algorithm to use.
     * @param object The GameObject to apply the tween to
     * @param repeat 0 for no repeat. Infinity for infinite repeat.
     * @param delay in milliseconds. Defaults to 0.
     */
    public add(easing: string, object: any, yoyo: boolean = false, repeat: number = 0, delay: number = 0, tweenName?: string): Tween {
        if (tweenName == undefined) tweenName = this.tempName();
        let tween = this._getTween(tweenName);
        if (tween != null) {
            Debug.error('cannot create 2 tweens with same name. cancel adding ', tweenName);
            return tween;
        }
        tween = this._tweenFact.createNew();
        tween.init(tweenName, easing, object, yoyo, repeat, delay);
       // Debug.info('created and initiated ', tweenName);
        this._tweens.push(tween);
       // Debug.info(this._tweens)
        return tween;
    }

    // this method will accept an array of objects as tween 'targets', then remove all tweens to are associated with them. Very useful for shutdown and cleanup.
    // call it by emitting the 'removeForObjects' event on global Event emitter
    protected _removeForObjects(objects: any[]){
      //  Debug.info('reached removeForObjects'); debugger;

        for(let t = 0; t < this._tweens.length; t++){
            for(let o = 0; o < objects.length; o++){
             //   Debug.info('is ', this._tweens[t].object, ' same as ', objects[o]);
             let tween = this._tweens[t];
                if(tween.object !== undefined && tween.object === objects[o])   {
                    this.remove(this._tweens[t]);
               //     Debug.info('yes, removed');
                } 
            }
        }
    }


/**
 * @description utility method. returns a list of all objects with tweens associated to them
 */
    allObjects(){
      //  let str = '';
        for(let t = 0; t < this._tweens.length; t++){
            Debug.info(this._tweens[t].object);
        }

      //  return str; 
    }


    /**
     * @description Remove a tween
     * @param tween the tween to remove (name of the tween, or the actual object)
     */
    public remove(tweenName: string | Tween) {
        let tween;
        if (typeof tweenName !== 'string') tween = tweenName;
        if (typeof tweenName == 'string') tween = this._getTween(tweenName);
        if (tween !== null && tween !== undefined) this._remove(tween); else Debug.warn("cannot remove tween '%s' because it does'nt exist", tweenName);
    }

    private _remove(tween: Tween) {
        this._tweens.splice(this._tweens.indexOf(tween), 1);
        tween.remove();
    }


    /**
     * @description Play a tween (via the tweens name)
     * @param tweenName The name of the tween to play
     * @param toObject The toObject for the tween (values to tween to go hear)
     * @param duration The duration in milliseconds
     * @param updateFunction An optional update method to pause
     */
    public play(tweenName: string, toObject: any, duration: number, updateFunction: Function = () => { }): TweenManager {
        let tween = this._getTween(tweenName);
        if (tween != null) {
            // Debug.info("Tween", tween);
            tween.to(toObject, duration, updateFunction).start();
            return this;
        }

        Debug.error("Tween called %s not found!", tweenName);
        //  tween = this._tween.createNew();

        return this;
    }

    public getTween(name: string): Tween {
        let tween = this._getTween(name);
        if (tween != null) return tween;
        Debug.error('cannot return a nonexistant tween of name: ', name);
        return this._tweenFact.createNew();
    }

    
    /**
     * @description A method that creates a tween, plays it once, and deletes it all all-in-one
     * @param easing the type of easing to use
     * @param object the object to tween
     * @param toObject the object that specifies the tween values
     * @param duration duration of the tween
     * @param delay optional delay
     * @param updateFunction optional update function
     */
    public once(easing: string, object: any, toObject: any, duration: number, delay: number = 0, updateFunction?: Function): TweenManager {
        let tweenName = this._tempName();
        let tween = this.add(easing, object, false, 0, delay, tweenName)
        //  tween._getTween(tweenName);
        if (tween !== null) {
            this.play(tweenName, toObject, duration, updateFunction);
            tween.onComplete(() => {
                Debug.info('onComplete called through TweenManager.once, removing tween...');
                if (tween != null) this._remove(tween);
            });
        }

        return this;
    }

    public tempName(): string {
        return this._tempName();
    }

    private _tempName(): string {
        let prefix = 'tempTween'; let name: string;
        name = _tryName(this._tweens, prefix, 0);

        function _tryName(tweens: Tween[], prefix: string, index: number): string {
            let unique: boolean = true;

            for (let t = 0; t < tweens.length; t++) {
                if (tweens[t].name == prefix + index) {
                    unique = false;
                    break;
                };
            }

            if (!unique) return _tryName(tweens, prefix, index + 1);
            return (prefix + index);
        }

        if (name == undefined) Debug.error('tempName not generated properly - is null');
        return name;
    }


    public pause(tweenName: string | Tween): TweenManager {
        let tween: any = tweenName;
        if (typeof tweenName == 'string') tween = this._getTween(tweenName);

        if (tween != null) {
            tween.pause();
        } else {
            Debug.warn("Tween named '%s' doesn't exist to be paused!", name);
        }

        return this;
    }

    public resume(tweenName: string | Tween): TweenManager {
        let tween: any = tweenName;
        if (typeof tweenName == 'string') tween = this._getTween(tweenName);

        if (tween !== null) {
            tween.resume();
        } else {
            Debug.warn("Tween named '%s' doesn't exist to be paused!", name);
        }

        return this;
    }

    public update(time: number): TweenManager {
        // Debug.info('update called in TweenManager');
        for (let c = 0; c < this._tweens.length; c++) {
            let tween = this._tweens[c];
            tween.update(time);
        }

        return this;
    }

    private _getTween(name: string): Tween | null {
        for (let c = 0; c < this._tweens.length; c++) {
            let tween = this._tweens[c];
            // Debug.info("tween.name(%s) == name(%s)", tween.name, name);
            if (tween.name == name) return tween;
        }

        Debug.warn('no tween found with name: ', name);
        return null; // just to satisfy the lint
    }

    protected _shutdown(){
        this._tweens.forEach((tween: Tween)=>{
            tween.remove();
        })
        this._tweens = [];
    }

}

export default TweenManager;