import Anim from '../../../Data/Anim';
import Tween from '../../../Data/Tween';
import IGameObject from 'UAENGINE/Core/Engine/GameObjects/IGameObject';
import IFrameAnimatedGameObject from '../IFrameAnimatedGameObject';

// TODO --- refactor into 2 seperate AnimationManagers, 1 for atlases and 1 for spines, which both implement 
// an IAnimationManager interface

class FrameAnimationManager implements IAnimationManager {
  private _go: IFrameAnimatedGameObject; private _anim: Anim; _activeAnimation: Anim | null; _tween: Tween;
  private _animations: Anim[];
  private _loopIndex: number;

  constructor(anim: Anim, tween: Tween) {
    this._anim = anim;
    this._tween = tween;
    this._activeAnimation = null;
    this._loopIndex = 0;

    this._animations = [];
  }

  init(go: IFrameAnimatedGameObject){
    this._go = go;
  }

  public play(name: string, loop: boolean = false) {
    let anim = this._getAnim(name);

    if (anim != null) {
      this._play(anim);
    } else {
      console.error("Could not find aimation named: %s", name);
    }
  }

  public pause(name: string) {
    let anim = this._getAnim(name);

    if (anim != null) {
      anim.pause();
    }
  }

  public resume(name: string) {
    let anim = this._getAnim(name);

    if (anim != null) {
      anim.resume();
    }
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

  //max has to be dynamic
  //-1 for nothing, single frame

  public addAnimation(name: string, base: string, max: number, fps: number, data: any = null) {
    let prevAnim = this._getAnim(name);
    let anim: Anim = this._anim.createNew();

    if (prevAnim == null) {
      anim.init(name, base, max, fps, data);
      this._animations.push(anim);
    } else {
      console.warn('Animation with name: "%s" already added, not adding it again!', name);
    }
  }

  public createNew(): FrameAnimationManager {
    return new FrameAnimationManager(this._anim.createNew(), this._tween.createNew());
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

  public update(time: number){
    if (!this._go.core.initialized) return;

    let updatedFrame = this.getUpdatedFrame();

    if (updatedFrame != null) {
      if (this._go.core.atlas != null) {
        this._go.core.screen.changeTexture(this._go.core.data, this._go.core.atlas, updatedFrame);
      } else {
        this._go.core.screen.changeTexture(this._go.core.data, updatedFrame);
      }
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
}

export default FrameAnimationManager;