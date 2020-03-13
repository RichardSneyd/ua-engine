import Anim from '../Data/Anim';

class AnimationManager {
  private _anim: Anim; _activeAnimation: Anim | null;
  private _animations: Anim[];
  private _loopIndex: number;

  constructor(anim: Anim) {
    this._anim = anim;
    this._activeAnimation = null;
    this._loopIndex = 0;

    this._animations = [];
  }

  public play(name: string) {
    let anim = this._getAnim(name);

    if (anim != null ) {
      this._play(anim);
    } else {
      console.error("Could not find aimation named: %s", name);
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
    return new AnimationManager(this._anim);
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

  private _getAnim(name: string): Anim | null {
    for (let c = 0; c < this._animations.length; c++) {
      let anim = this._animations[c];
      if (anim.name == name) return anim;
    }

    return null;
  }
}

export default AnimationManager;