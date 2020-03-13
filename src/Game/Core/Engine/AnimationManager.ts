import Anim from '../Data/Anim';

class AnimationManager {
  private _anim: Anim;
  private _animations: Anim[];

  constructor(anim: Anim) {
    this._anim = anim;

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

  private _play(anim: Anim) {
    console.log("playing implemented!");
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