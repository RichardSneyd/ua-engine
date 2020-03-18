import Anim from '../Data/Anim';
import Tween from '../Data/Tween';

class AnimationManager {
  private _anim: Anim; _activeAnimation: Anim | null; _tween: Tween;
  private _animations: Anim[];
  private _tweens: Tween[];
  private _loopIndex: number;

  constructor(anim: Anim, tween: Tween) {
    this._anim = anim;
    this._tween = tween;
    this._activeAnimation = null;
    this._loopIndex = 0;

    this._animations = [];
    this._tweens = [];
  }

  public play(name: string) {
    let anim = this._getAnim(name);

    if (anim != null ) {
      this._play(anim);
    } else {
      console.error("Could not find aimation named: %s", name);
    }
  }

  public playSpine(name: string) {
    let anim = this._getAnim(name);

    if (anim != null) {
      this._playSpine(anim);
    } else {
      console.error("Could not find spine aimation named: %s", name);
    }
  }

  public addTween(name: string, easing: string, object: any) {
    let tween = this._tween.createNew();
    tween.init(name, easing, object);
  }

  public playTween(name: string, toObject: any, time: number, updateFunction: Function = ()=>{}) {
    let tween = this._getTween(name);
    if (tween != null) tween.to(toObject, time, updateFunction);
  }

  public addSpineAnimation(name: string, fps: number, data: any) {
    let prevAnim = this._getAnim(name);
    let anim: Anim = this._anim.createNew();

    if (prevAnim == null) {
      anim.init(name, '', 0, fps, data);
      this._animations.push(anim);
    } else {
      console.warn('Animation with name: "%s" already added, not adding it again!', name);
    }
  }

  public addAnimation(name: string, base: string, max: number, fps: number, data: any)  {
    let prevAnim = this._getAnim(name);
    let anim: Anim = this._anim.createNew();

    if (prevAnim == null) {
      anim.init(name, base, max, fps, data);
      this._animations.push(anim);
    } else {
      console.warn('Animation with name: "%s" already added, not adding it again!', name);
    }
  }

  public createNew(): AnimationManager {
    return new AnimationManager(this._anim, this._tween);
  }

  public getUpdatedFrame(): string | null {
    if (this._loopIndex < 60) {
      this._loopIndex++;
    } else {
      this._loopIndex = 1;
    }

    if (this._activeAnimation != null) {
      let canUpdate = this._canUpdate(this._activeAnimation.fps, this._loopIndex);

      if (canUpdate) {
        return this._activeAnimation.getNextFrame();
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  private _canUpdate(fps: number, loopIndex: number): boolean {
    let difference = 60 / fps;

    if (loopIndex % difference == 0) {
      return true;
    } else {
      return false;
    }
  }

  private _play(anim: Anim) {
    this._activeAnimation = anim;
  }

  private _playSpine(anim: Anim) {
    anim.startSpineAnimation();
  }

  private _getAnim(name: string): Anim | null {
    for (let c = 0; c < this._animations.length; c++) {
      let anim = this._animations[c];
      if (anim.name == name) return anim;
    }

    return null;
  }

  private _getTween(name: string): Tween | null {
    for (let c = 0; c < this._tweens.length; c++) {
      let tween = this._tweens[c];
      if (tween.name == name) return tween;
    }

    return null;
  }
}

export default AnimationManager;