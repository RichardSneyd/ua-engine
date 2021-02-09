import Anim from '../../../Data/Anim';
import Tween from '../../../Data/Tween';
import IGameObject from '../IGameObject';
import IFrameAnimatedGameObject from '../IFrameAnimatedGameObject';
import Loader from '../../Loader';
import ObjectCore from './ObjectCore';
import Debug from '../../Debug';
import UAE from '../../../../UAE';

/**
 * @description A frame based animation manager (for use with SpriteObject mainly, with atlas animations). 
 */
class FrameAnimationManager implements IAnimationManager {
  private _go: IFrameAnimatedGameObject; private _anim: Anim; _activeAnimation: Anim | null; _tween: Tween;
  private _animations: Anim[]; private _loader: Loader;
  private _animationNames: string[];
  private _loopIndex: number; private _core: ObjectCore;
  private _initialized: boolean;

  constructor(anim: Anim, loader: Loader) {
    this._anim = anim;
    this._loader = loader;
    this._activeAnimation = null;
    this._loopIndex = 0;

    this._animations = [];
    this._initialized = false;
  }

  init(go: IFrameAnimatedGameObject, core: ObjectCore) {
    this._go = go; this._core = core;
    this._animationNames = this._importAnimationNames(); // scrapes a list of animation names by identifying alphanumeric prefixes in the frames of the atlas .json
    this._initialized = true;
  }

  get initialized(){
    return this._initialized;
  }

  /**
   * @description does this animation manager have an atlas? (read only)
   */
  get hasAtlas(): boolean {
    if(this._core.atlas) return true;
    return false;
  }

  /**
   * @description the current animation object (read only)
   */
  get current() {
    return this._anim;
  }

  public play(name: string, loop: boolean = false) {
    let anim = this._getAnim(name);
    if (anim != null) {
      // Debug.info(`%c calling play on ${name}  for ${this._go.textureName}?`, 'color: purple;');
      this._play(anim);
    } else {
      Debug.error("Could not find animation named: %s", name);
    }
  }

  /**
   * 
   * @param name 
   */
  public pause(name?: string) {
    let anim: Anim | null = this.current;
    if(name) anim = this._getAnim(name);

    if (anim != null) {
      anim.pause();
    }
  }

  public resume(name?: string) {
    let anim : Anim | null = this.current;
    if(name) anim = this._getAnim(name);

    if (anim != null) {
      anim.resume();
    }
  }

  //max has to be dynamic
  //-1 for nothing, single frame

  public addAnimation(name: string, frames: string[], fps: number = 24) {
    let prevAnim = this._getAnim(name);
    let anim: Anim = this._anim.createNew();

    if (prevAnim == null) {
      anim.init(name, frames, fps);
      this._animations.push(anim);
    } else {
      Debug.info(`Animation "${name}" already added to ${this._go.textureName}, skipping...`);
    }
  }

  /**
   * @description a helper function to generate frames based on a max value etc. Badly written (Rudra), will look at again in the future
   * @param name the prefix
   * @param base an optional base value. base + name + index.
   * @param max from 0 to max
   */
  public genFramesNumerically(name: string, base: string = '', max: number): string[] {
    let arr: string[] = [];

    for (let c = 0; c < max; c++) {
      arr.push(base + name + (c + 1).toString());
    }
    return arr;
  }

  /**
   * @description returns the array of animation objects
   */
  get animations() {
    return this._animations;
  }

  /**
   * @description returns a list of all the animation names pulled using REGEX from the json file (These animations must be added seperately using addAnimation, 
   * or importAnimations)
   */
  get animationNames(): string[] {
    return this._animationNames;
  }

  /**
   * @description import all animations from the atlas .json based on the _animationNames array (used as prefixes to identify the various frames i.e 'idle, idle1, idle_2' etc)
   */
  private _importAnimationNames() {
    let animationNames: string[] = [];
    let atlasName = this._core.atlas;
   // Debug.info('atlasName: ', atlasName);
    if(!this.hasAtlas) return [];
    let res = this._loader.getImgResource(atlasName, true);
    if (res !== null) {
      let json = res.data.data;
      // Debug.info('json: ', res);
      let frames = json.frames;
      let frameNames: string[] = [];
      let reg = new RegExp('([a-zA-Z-])+');

      for (let x = 0; x < frames.length; x++) {
        let fname: string = frames[x].filename;
        let prefix = fname.match(reg)![0];

        if (animationNames.indexOf(prefix) == -1) {
          animationNames.push(prefix);
        }
      }
    }

    return animationNames;
  }

  /***
   * @description automatically import all animations from atlas json file. Simply call play(animName) to trigger after this step.
   */
  public importAnimations() {
    let atlasName = this._core.atlas;
    let animationNames = this.animationNames;
    for (let a = 0; a < animationNames.length; a++) {
      this.addAnimation(animationNames[a], this.autoGenFrames(animationNames[a]));
    }
  }

  public autoGenFrames(name: string): string[] {
    // Debug.info('trying to gen frames for %s on %s', name, this._go.textureName);
    let atlasName = this._core.atlas;
    let res = this._loader.getResource(atlasName, true);
    if (res !== null) {
      let json = res.data.data;
      // Debug.info('json: ', res);
      let frames = json.frames;
      let frameNames: string[] = [];

      for (let x = 0; x < frames.length; x++) {
        let fname: string = frames[x].filename;
        let reg = new RegExp(name + '[-_]' + '[0-9]|' + name + '[0-9]');

        if (fname == name) {
          frameNames.push(fname);
        }
        else if (fname.match(reg)) {

          frameNames.push(fname);
        }
      }
      // Debug.info('frames: ', frameNames);
      return frameNames;
    }
    Debug.error('no resource in resList with name ', atlasName);
    return [];
  }

  public createNew(): FrameAnimationManager {
    return new FrameAnimationManager(this._anim.createNew(), this._loader);
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

  public update() {
    if (!this._core.initialized) return;

    let updatedFrame = this.getUpdatedFrame();
    // monitor if update is called
    /*  if (this._core.atlas == 'continue_button') {
       Debug.info('AnimManager.update called for %s at %s', this._core.atlas, new Date().getTime());
     } */
    if (updatedFrame != null) {
      if (this._core.atlas != null) {
        this._core.screen.changeTexture(this._core.data, this._core.atlas, updatedFrame);
        // monitor if the texture is being updated
        /*  if (this._core.atlas == 'continue_button') {
           Debug.info('changeTexture called for', this._core.atlas);
         } */
      } else {
        this._core.screen.changeTexture(this._core.data, updatedFrame);
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
    // Debug.info('frames: ', anim.frames)
    this._activeAnimation = anim;
  }

  private _getAnim(name: string): Anim | null {
    for (let c = 0; c < this._animations.length; c++) {
      let anim = this._animations[c];
      if (anim.name == name) return anim;
    }

   // Debug.error('no animation with name %s', name);
    return null;
  }
}

export default FrameAnimationManager;