import Tween from "../../../Data/Tween";
import Easing from './Easing';

class TweenManager {
    private _tween: Tween;
    private _tweens: Tween[];
    private _easing = Easing;

    constructor(tween: Tween) {
        this._tween = tween;
        this._tweens = [];
    }

    createNew() {
        return new TweenManager(this._tween.createNew());
    }

    get Easing() {
        return this._easing;
    }

    /**
     * 
     * @param tweenName the name of the tween. You will referense this when playing it in future
     * @param easing The easing Algorithm to use.
     * @param object The GameObject to apply the tween to
     * @param repeat 0 for no repeat. Infinity for infinite repeat.
     * @param delay in milliseconds. Defaults to 0.
     */
    public add(tweenName: string, easing: string, object: any, repeat: number = 0, delay: number = 0): TweenManager {
        let tween = this._getTween(tweenName);
        if (tween != null) {
            console.warn('cannot create 2 tweens with same name. cancel adding ', tweenName);
            return this;
        }
        tween = this._tween.createNew();
        tween.init(tweenName, easing, object, repeat, delay);
        console.log('created and initiated ', tweenName);
        this._tweens.push(tween);

        return this;
    }

    public remove(tweenName: string) {
        let tween = this._getTween(tweenName);
        if (tween !== null) this._remove(tween); else console.warn("cannot remove tween '%s' because it does'nt exist", tweenName);
    }

    private _remove(tween: Tween) {
        tween.remove();
        this._tweens.splice(this._tweens.indexOf(tween), 1);
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
            //console.log("Tween", tween);
            tween.to(toObject, duration, updateFunction);
            return this;
        }

        console.error("Tween called %s not found!", tweenName);
        //  tween = this._tween.createNew();

        return this;
    }

    public getTween(name: string): Tween {
        let tween = this._getTween(name);
        if (tween != null) return tween;
        console.error('cannot return a nonexistant tween');
        return this._tween.createNew();
    }

    /**
     * @description a method that creates a tween, plays it once, and deletes it all all-in-one
     * @param tweenName 
     * @param easing 
     * @param object 
     * @param toObject 
     * @param duration 
     * @param delay 
     * @param updateFunction 
     */
    public once(easing: string, object: any, toObject: any, duration: number, delay: number = 0, updateFunction?: Function): TweenManager {
        let tweenName = this._tempName();
        let tween = this.add(tweenName, easing, object, 0, delay)._getTween(tweenName);
        if (tween !== null) {
            this.play(tweenName, toObject, duration, updateFunction);
            tween.onComplete(() => {
                console.log('onComplete called through TweenManager.once, removing tween...');
                if (tween != null) this._remove(tween);
            });
        }

        return this;
    }

    private _tempName(): string {
        let prefix = 'tempTween'; let index = 0; let name: string;
        name = _tryName(this._tweens, prefix, index);

        function _tryName(tweens: Tween[], prefix: string, index: number): string {
            let unique: boolean = true;

            for (let t = 0; t < tweens.length; t++) {
                if (tweens[t].name == prefix + index) {
                    unique = false;
                };
            }

            if (!unique) return _tryName(tweens, prefix, index++);
            return (prefix + index);
        }

        if (name == undefined) console.error('tempName not generated properly - is null');
        return name;
    }


    public pause(tweenName: string): TweenManager {
        let tween = this._getTween(tweenName);

        if (tween != null) {
            tween.pause();
        } else {
            console.warn("Tween named '%s' doesn't exist to be paused!", name);
        }

        return this;
    }

    public resume(tweenName: string): TweenManager {
        let tween = this._getTween(tweenName);

        if (tween = this._getTween(tweenName)) {
            tween.resume();
        } else {
            console.warn("Tween named '%s' doesn't exist to be paused!", name);
        }

        return this;
    }

    public update(time: number): TweenManager {
        //   console.log('update called in TweenManager');
        for (let c = 0; c < this._tweens.length; c++) {
            let tween = this._tweens[c];
            tween.update(time);
        }

        return this;
    }

    private _getTween(name: string): Tween | null {
        for (let c = 0; c < this._tweens.length; c++) {
            let tween = this._tweens[c];
            //console.log("tween.name(%s) == name(%s)", tween.name, name);
            if (tween.name == name) return tween;
        }

        console.warn('no tween found with name: ', name);
        return null; // just to satisfy the lint
    }

}

export default TweenManager;