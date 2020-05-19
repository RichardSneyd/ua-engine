import Tween from "../../../Data/Tween";

class TweenManager {
    private _tween: Tween;
    private _tweens: Tween[];

    constructor(tween: Tween) {
        this._tween = tween;
        this._tweens = [];
    }

    createNew() {
        return new TweenManager(this._tween.createNew());
    }

    /**
     * 
     * @param tweenName the name of the tween. You will referense this when playing it in future
     * @param easing The easing Algorithm to use.
     * @param object The GameObject to apply the tween to
     */
    public add(tweenName: string, easing: string, object: any): Tween {
        let tween = this._getTween(tweenName);
        if (tween != null) {
            console.warn('cannot create 2 tweens with same name; original will be returned'); 
            return tween;
        }
        tween = this._tween.createNew();
        tween.init(tweenName, easing, object);

        this._tweens.push(tween);

        return tween;
    }   

    public remove(tweenName: string){
        let tween = this._getTween(tweenName);
        if(tween !== null) this._remove(tween); else console.warn("cannot remove tween '%s' because it does'nt exist", tweenName);
    }

    private _remove(tween: Tween){
        tween.remove();
        this._tweens.splice(this._tweens.indexOf(tween), 1);
    }

    public play(tweenName: string, toObject: any, duration: number, updateFunction: Function = () => { }) : Tween{
        let tween = this._getTween(tweenName);
        if (tween != null) {
            //console.log("Tween", tween);
            tween.to(toObject, duration, updateFunction);
            return tween;
        } else {
            console.error("Tween called %s not found!", tweenName);
            tween = this._tween.createNew();
        }

       return tween;
    }


    public once(tweenName: string, easing: string, object: any, toObject: any, duration: number, updateFunction?: Function): Tween{
        let tween = this.add(tweenName, easing, object);
        this.play(tweenName, toObject, duration, updateFunction);
        tween.onComplete(()=>{
            console.log('onComplete called through TweenManager.once, removing tween...');
            this._remove(tween);
        });
        return tween;
    }

    public pause(tweenName: string) {
        let tween = this._getTween(tweenName);

        if (tween != null) {
            tween.pause();
        } else {
            console.warn("Tween named '%s' doesn't exist to be paused!", name);
        }
    }

    public resume(tweenName: string) {
        let tween = this._getTween(tweenName);

        if (tween = this._getTween(tweenName)) {
            tween.resume();
        } else {
            console.warn("Tween named '%s' doesn't exist to be paused!", name);
        }
    }

    public update(time: number) {
     //   console.log('update called in TweenManager');
        for (let c = 0; c < this._tweens.length; c++) {
            let tween = this._tweens[c];
            tween.update(time);
        }
    }

    private _getTween(name: string): Tween | null {
        for (let c = 0; c < this._tweens.length; c++) {
            let tween = this._tweens[c];
            //console.log("tween.name(%s) == name(%s)", tween.name, name);
            if (tween.name == name) return tween;
        }

        return null;
    }

}

export default TweenManager;