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

    public add(tweenName: string, easing: string, object: any): Tween {
        let tween = this._tween.createNew();
        tween.init(name, easing, object);
        this._tweens.push(tween);
        return tween;
    }

    public play(tweenName: string, toObject: any, time: number, updateFunction: Function = () => { }) {
        let tween = this._getTween(name);
        if (tween != null) tween.to(toObject, time, updateFunction);
    }

    public pause(tweenName: string) {
        let tween = this._getTween(name);

        if (tween != null) {
            tween.pause();
        } else {
            console.warn("Tween named '%s' doesn't exist to be paused!", name);
        }
    }

    public resume(tweenName: string) {
        let tween = this._getTween(name);

        if (tween = this._getTween(name)) {
            tween.resume();
        } else {
            console.warn("Tween named '%s' doesn't exist to be paused!", name);
        }
    }

    public update(time: number) {
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