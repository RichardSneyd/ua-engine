
///<reference path='./spine.d.ts' />
///<reference path='./phaser.d.ts' />

// Type definitions for the Phaser 3 SpinePlugin (https://github.com/photonstorm/phaser/tree/master/plugins/spine), as of Phaser 3.19
// this file also requires the spine.d.ts declaration file to work
// this is a preliminary version, and requires refinement. Contributions welcome.

// Definitions by: Richard Sneyd <https://github.com/RichardSneyd/>,
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
//

declare class SpineGameObject extends Phaser.GameObjects.GameObject {
  /**
   *
   * @param scene A reference to the Scene that this Game Object belongs to.
   * @param pluginManager A reference to the Phaser Spine Plugin.
   * @param x The horizontal position of this Game Object in the world.
   * @param y The vertical position of this Game Object in the world.
   * @param key The key of the Spine Skeleton this Game Object will use, as stored in the Spine Plugin.
   * @param animationName The name of the animation to set on this Skeleton.
   * @param loop Should the animation playback be looped or not? Default false.
   */
  constructor(scene: Phaser.Scene, pluginManager: SpinePlugin, x: number, y: number, key?: string, animationName?: string, loop?: boolean);

  /**
   * A reference to the Spine Plugin.
   */
  plugin: SpinePlugin;

  /**
   * The Spine Skeleton this Game Object is using.
   */
  skeleton: spine.Skeleton;

  /**
   * The Spine Skeleton Data associated with the Skeleton this Game Object is using.
   */
  skeletonData: spine.SkeletonData;

  /**
   * The Spine Animation State this Game Object is using.
   */
  state: spine.AnimationState;

  /**
   * The Spine Animation State Data associated with the Animation State this Game Object is using.
   */
  stateData: spine.AnimationStateData;

  /**
   * A reference to the root bone of the Skeleton.
   */
  root: spine.Bone;

  /**
   * This object holds the calculated bounds of the current
   * pose, as set when a new Skeleton is applied.
   */
  bounds: any;

  /**
   * A Game Object level flag that allows you to enable debug drawing
   * to the Skeleton Debug Renderer by toggling it.
   */
  drawDebug: boolean;

  /**
   * The factor to scale the Animation update time by.
   */
  timeScale: number;

  /**
   * The calculated Display Origin of this Game Object.
   */
  displayOriginX: number;

  /**
   * The calculated Display Origin of this Game Object.
   */
  displayOriginY: number;

  /**
   * A flag that stores if the texture associated with the current
   * Skin being used by this Game Object, has its alpha pre-multiplied
   * into it, or not.
   */
  preMultipliedAlpha: boolean;

  /**
   * A default Blend Mode. You cannot change the blend mode of a
   * Spine Game Object.
   */
  readonly blendMode: number;

  /**
   * Overrides the default Game Object method and always returns true.
   * Rendering is decided in the renderer functions.
   */
  willRender(): boolean;

  /**
   * Set the Alpha level for the whole Skeleton of this Game Object.
   *
   * The alpha controls the opacity of the Game Object as it renders.
   *
   * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
   * @param value The alpha value used for the whole Skeleton. Default 1.
   */
  setAlpha(value?: number): this;

  /**
   * The alpha value of the Skeleton.
   *
   * A value between 0 and 1.
   *
   * This is a global value, impacting the entire Skeleton, not just a region of it.
   */
  alpha: number;

  /**
   * The amount of red used when rendering the Skeleton.
   *
   * A value between 0 and 1.
   *
   * This is a global value, impacting the entire Skeleton, not just a region of it.
   */
  red: number;

  /**
   * The amount of green used when rendering the Skeleton.
   *
   * A value between 0 and 1.
   *
   * This is a global value, impacting the entire Skeleton, not just a region of it.
   */
  green: number;

  /**
   * The amount of blue used when rendering the Skeleton.
   *
   * A value between 0 and 1.
   *
   * This is a global value, impacting the entire Skeleton, not just a region of it.
   */
  blue: number;

  /**
   * Sets the color on the given attachment slot. Or, if no slot is given, on the whole skeleton.
   * @param color The color being applied to the Skeleton or named Slot. Set to white to disable any previously set color. Default 0xffffff.
   * @param slotName The name of the slot to set the color on. If not give, will be set on the whole skeleton.
   */
  setColor(color?: integer, slotName?: string): this;

  /**
   * Sets this Game Object to use the given Skeleton based on the Atlas Data Key and a provided JSON object
   * that contains the Skeleton data.
   * @param atlasDataKey The key of the Spine data to use for this Skeleton.
   * @param skeletonJSON The JSON data for the Skeleton.
   * @param animationName Optional name of the animation to set on the Skeleton.
   * @param loop Should the animation, if set, loop or not? Default false.
   */
  setSkeletonFromJSON(atlasDataKey: string, skeletonJSON: object, animationName?: string, loop?: boolean): this;

  /**
   * Sets this Game Object to use the given Skeleton based on its cache key.
   *
   * Typically, once set, the Skeleton doesn't change. Instead, you change the skin,
   * or slot attachment, or any other property to adjust it.
   * @param atlasDataKey The key of the Spine data to use for this Skeleton.
   * @param skeletonJSON The JSON data for the Skeleton.
   * @param animationName Optional name of the animation to set on the Skeleton.
   * @param loop Should the animation, if set, loop or not? Default false.
   */
  setSkeleton(atlasDataKey: string, skeletonJSON: object, animationName?: string, loop?: boolean): this;

  /**
   * Refreshes the data about the current Skeleton.
   *
   * This will reset the rotation, position and size of the Skeleton to match this Game Object.
   *
   * Call this method if you need to access the Skeleton data directly, and it may have changed
   * recently.
   */
  refresh(): this;

  /**
   * Sets the size of this Game Object.
   *
   * If no arguments are given it uses the current skeleton data dimensions.
   *
   * You can use this method to set a fixed size of this Game Object, such as for input detection,
   * when the skeleton data doesn't match what is required in-game.
   * @param width The width of the Skeleton. If not given it defaults to the Skeleton Data width.
   * @param height The height of the Skeleton. If not given it defaults to the Skeleton Data height.
   * @param offsetX The horizontal offset of the Skeleton from its x and y coordinate. Default 0.
   * @param offsetY The vertical offset of the Skeleton from its x and y coordinate. Default 0.
   */
  setSize(width?: number, height?: number, offsetX?: number, offsetY?: number): this;

  /**
   * Sets the offset of this Game Object from the Skeleton position.
   *
   * You can use this method to adjust how the position of this Game Object relates to the Skeleton it is using.
   * @param offsetX The horizontal offset of the Skeleton from its x and y coordinate. Default 0.
   * @param offsetY The vertical offset of the Skeleton from its x and y coordinate. Default 0.
   */
  setOffset(offsetX?: number, offsetY?: number): this;

  /**
   * Internal method that syncs all of the Game Object position and scale data to the Skeleton.
   * It then syncs the skeleton bounds back to this Game Object.
   *
   * This method is called automatically as needed internally, however, it's also exposed should
   * you require overriding the size settings.
   */
  updateSize(): this;

  /**
   * The horizontal scale of this Game Object, as applied to the Skeleton it is using.
   */
  scaleX: number;

  /**
   * The vertical scale of this Game Object, as applied to the Skeleton it is using.
   */
  scaleY: number;

  /**
   * Returns an array containing the names of all the bones in the Skeleton Data.
   */
  getBoneList(): string[];

  /**
   * Returns an array containing the names of all the skins in the Skeleton Data.
   */
  getSkinList(): string[];

  /**
   * Returns an array containing the names of all the slots in the Skeleton.
   */
  getSlotList(): string[];

  /**
   * Returns an array containing the names of all the animations in the Skeleton Data.
   */
  getAnimationList(): string[];

  /**
   * Returns the current animation being played on the given track, if any.
   * @param trackIndex The track to return the current animation on. Default 0.
   */
  getCurrentAnimation(trackIndex?: integer): spine.Animation;

  /**
   * Sets the current animation for a track, discarding any queued animations.
   * If the formerly current track entry was never applied to a skeleton, it is replaced (not mixed from).
   *
   * Animations are referenced by a unique string-based key, as defined in the Spine software.
   * @param animationName The string-based key of the animation to play.
   * @param loop Should the animation be looped when played? Default false.
   * @param ignoreIfPlaying If this animation is already playing then ignore this call. Default false.
   */
  play(animationName: string, loop?: boolean, ignoreIfPlaying?: boolean): this;

  /**
   * Sets the current animation for a track, discarding any queued animations.
   * If the formerly current track entry was never applied to a skeleton, it is replaced (not mixed from).
   *
   * Animations are referenced by a unique string-based key, as defined in the Spine software.
   * @param trackIndex The track index to play the animation on.
   * @param animationName The string-based key of the animation to play.
   * @param loop Should the animation be looped when played? Default false.
   * @param ignoreIfPlaying If this animation is already playing then ignore this call. Default false.
   */
  setAnimation(trackIndex: integer, animationName: string, loop?: boolean, ignoreIfPlaying?: boolean): spine.TrackEntry;

  /**
   * Adds an animation to be played after the current or last queued animation for a track.
   * If the track is empty, it is equivalent to calling setAnimation.
   *
   * Animations are referenced by a unique string-based key, as defined in the Spine software.
   *
   * The delay is a float. If > 0, sets delay. If <= 0, the delay set is the duration of the previous
   * track entry minus any mix duration (from the AnimationStateData) plus the specified delay
   * (ie the mix ends at (delay = 0) or before (delay < 0) the previous track entry duration).
   * If the previous entry is looping, its next loop completion is used instead of its duration.
   * @param trackIndex The track index to add the animation to.
   * @param animationName The string-based key of the animation to add.
   * @param loop Should the animation be looped when played? Default false.
   * @param delay A delay, in ms, before which this animation will start when played. Default 0.
   */
  addAnimation(trackIndex: integer, animationName: string, loop?: boolean, delay?: integer): spine.TrackEntry;

  /**
   * Sets an empty animation for a track, discarding any queued animations, and sets the track
   * entry's mixDuration. An empty animation has no timelines and serves as a placeholder for mixing in or out.
   *
   * Mixing out is done by setting an empty animation with a mix duration using either setEmptyAnimation,
   * setEmptyAnimations, or addEmptyAnimation. Mixing to an empty animation causes the previous animation to be
   * applied less and less over the mix duration. Properties keyed in the previous animation transition to
   * the value from lower tracks or to the setup pose value if no lower tracks key the property.
   * A mix duration of 0 still mixes out over one frame.
   *
   * Mixing in is done by first setting an empty animation, then adding an animation using addAnimation
   * and on the returned track entry, set the mixDuration. Mixing from an empty animation causes the new
   * animation to be applied more and more over the mix duration. Properties keyed in the new animation
   * transition from the value from lower tracks or from the setup pose value if no lower tracks key the
   * property to the value keyed in the new animation.
   * @param trackIndex The track index to add the animation to.
   * @param mixDuration Seconds for mixing from the previous animation to this animation. Defaults to the value provided by AnimationStateData getMix based on the animation before this animation (if any).
   */
  setEmptyAnimation(trackIndex: integer, mixDuration?: integer): spine.TrackEntry;

  /**
   * Removes all animations from the track, leaving skeletons in their current pose.
   *
   * It may be desired to use setEmptyAnimation to mix the skeletons back to the setup pose,
   * rather than leaving them in their current pose.
   * @param trackIndex The track index to add the animation to.
   */
  clearTrack(trackIndex: integer): this;

  /**
   * Removes all animations from all tracks, leaving skeletons in their current pose.
   *
   * It may be desired to use setEmptyAnimation to mix the skeletons back to the setup pose,
   * rather than leaving them in their current pose.
   */
  clearTracks(): this;

  /**
   * Sets the skin used to look up attachments before looking in the defaultSkin.
   *
   * Attachments from the new skin are attached if the corresponding attachment from the
   * old skin was attached. If there was no old skin, each slot's setup mode attachment is
   * attached from the new skin.
   *
   * After changing the skin, the visible attachments can be reset to those attached in the
   * setup pose by calling setSlotsToSetupPose. Also, often apply is called before the next time
   * the skeleton is rendered to allow any attachment keys in the current animation(s) to hide
   * or show attachments from the new skin.
   * @param skinName The name of the skin to set.
   */
  setSkinByName(skinName: string): this;

  /**
   * Sets the skin used to look up attachments before looking in the defaultSkin.
   *
   * Attachments from the new skin are attached if the corresponding attachment from the
   * old skin was attached. If there was no old skin, each slot's setup mode attachment is
   * attached from the new skin.
   *
   * After changing the skin, the visible attachments can be reset to those attached in the
   * setup pose by calling setSlotsToSetupPose. Also, often apply is called before the next time
   * the skeleton is rendered to allow any attachment keys in the current animation(s) to hide
   * or show attachments from the new skin.
   * @param newSkin The Skin to set. May be `null`.
   */
  setSkin(newSkin: spine.Skin): this;

  /**
   * Sets the mix duration when changing from the specified animation to the other.
   * @param fromName The animation to mix from.
   * @param toName The animation to mix to.
   * @param duration Seconds for mixing from the previous animation to this animation. Defaults to the value provided by AnimationStateData getMix based on the animation before this animation (if any).
   */
  setMix(fromName: string, toName: string, duration?: number): this;

  /**
   * Finds an attachment by looking in the skin and defaultSkin using the slot
   * index and attachment name. First the skin is checked and if the attachment was not found,
   * the default skin is checked.
   * @param slotIndex The slot index to search.
   * @param attachmentName The attachment name to look for.
   */
  getAttachment(slotIndex: integer, attachmentName: string): spine.Attachment;

  /**
   * Finds an attachment by looking in the skin and defaultSkin using the slot name and attachment name.
   * @param slotName The slot name to search.
   * @param attachmentName The attachment name to look for.
   */
  getAttachmentByName(slotName: string, attachmentName: string): spine.Attachment;

  /**
   * A convenience method to set an attachment by finding the slot with findSlot,
   * finding the attachment with getAttachment, then setting the slot's attachment.
   * @param slotName The slot name to add the attachment to.
   * @param attachmentName The attachment name to add.
   */
  setAttachment(slotName: string, attachmentName: string): this;

  /**
   * Sets the bones, constraints, slots, and draw order to their setup pose values.
   */
  setToSetupPose(): this;

  /**
   * Sets the slots and draw order to their setup pose values.
   */
  setSlotsToSetupPose(): this;

  /**
   * Sets the bones and constraints to their setup pose values.
   */
  setBonesToSetupPose(): this;

  /**
   * Gets the root bone, or null.
   */
  getRootBone(): spine.Bone;

  /**
   * Takes a Bone object and a position in world space and rotates the Bone so it is angled
   * towards the given position. You can set an optional angle offset, should the bone be
   * designed at a specific angle already. You can also set a minimum and maximum range for the angle.
   * @param bone The bone to rotate towards the world position.
   * @param worldX The world x coordinate to rotate the bone towards.
   * @param worldY The world y coordinate to rotate the bone towards.
   * @param offset An offset to add to the rotation angle. Default 0.
   * @param minAngle The minimum range of the rotation angle. Default 0.
   * @param maxAngle The maximum range of the rotation angle. Default 360.
   */
  angleBoneToXY(bone: spine.Bone, worldX: number, worldY: number, offset?: number, minAngle?: number, maxAngle?: number): this;

  /**
   * Finds a bone by comparing each bone's name. It is more efficient to cache the results
   * of this method than to call it multiple times.
   * @param boneName The name of the bone to find.
   */
  findBone(boneName: string): spine.Bone;

  /**
   * Finds the index of a bone by comparing each bone's name. It is more efficient to cache the results
   * of this method than to call it multiple times.
   * @param boneName The name of the bone to find.
   */
  findBoneIndex(boneName: string): integer;

  /**
   * Finds a slot by comparing each slot's name. It is more efficient to cache the results
   * of this method than to call it multiple times.
   * @param slotName The name of the slot to find.
   */
  findSlot(slotName: string): spine.Slot;

  /**
   * Finds the index of a slot by comparing each slot's name. It is more efficient to cache the results
   * of this method than to call it multiple times.
   * @param slotName The name of the slot to find.
   */
  findSlotIndex(slotName: string): integer;

  /**
   * Finds a skin by comparing each skin's name. It is more efficient to cache the results of
   * this method than to call it multiple times.
   * @param skinName The name of the skin to find.
   */
  findSkin(skinName: string): spine.Skin;

  /**
   * Finds an event by comparing each events's name. It is more efficient to cache the results
   * of this method than to call it multiple times.
   * @param eventDataName The name of the event to find.
   */
  findEvent(eventDataName: string): spine.EventData;

  /**
   * Finds an animation by comparing each animation's name. It is more efficient to cache the results
   * of this method than to call it multiple times.
   * @param animationName The name of the animation to find.
   */
  findAnimation(animationName: string): spine.Animation;

  /**
   * Finds an IK constraint by comparing each IK constraint's name. It is more efficient to cache the results
   * of this method than to call it multiple times.
   * @param constraintName The name of the constraint to find.
   */
  findIkConstraint(constraintName: string): spine.IkConstraintData;

  /**
   * Finds an transform constraint by comparing each transform constraint's name.
   * It is more efficient to cache the results of this method than to call it multiple times.
   * @param constraintName The name of the constraint to find.
   */
  findTransformConstraint(constraintName: string): spine.TransformConstraintData;

  /**
   * Finds a path constraint by comparing each path constraint's name.
   * It is more efficient to cache the results of this method than to call it multiple times.
   * @param constraintName The name of the constraint to find.
   */
  findPathConstraint(constraintName: string): spine.PathConstraintData;

  /**
   * Finds the index of a path constraint by comparing each path constraint's name.
   * It is more efficient to cache the results of this method than to call it multiple times.
   * @param constraintName The name of the constraint to find.
   */
  findPathConstraintIndex(constraintName: string): integer;

  /**
   * Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the current pose.
   *
   * The returned object contains two properties: `offset` and `size`:
   *
   * `offset` - The distance from the skeleton origin to the bottom left corner of the AABB.
   * `size` - The width and height of the AABB.
   */
  getBounds(): any;

  /**
   * Internal update handler.
   * @param time The current timestamp.
   * @param delta The delta time, in ms, elapsed since the last frame.
   */
  protected preUpdate(time: number, delta: number): void;

  /**
   * Internal destroy handler, called as part of the destroy process.
   */
  protected preDestroy(): void;

}
  

declare namespace Phaser {
    namespace Loader {

        export interface LoaderPlugin {

            /** 
            * this loader will only work if the spine plugin has been added to the project
            * @param key The key to use for this file
            * @param json URL to the json file
            * @param atlas URL to to the atlas file.
            * @param animation optional set animation to start with.
            * @param loop optional param to loop the animation.
            */
            spine(key: string, json?: string, atlas?: string, animation?: string, loop?: boolean): Phaser.Loader.LoaderPlugin;
        }


    }

    namespace GameObjects {
        export interface GameObjectFactory {
            /**
             * 
             * @param x the x coordinate for the game object
             * @param y the y coordinate for the game object
             * @param key the key for the game object
             * @param animation optional, the animation to play
             * @param loop optional, whether or not to loop the animation
             */
            spine(x: number, y: number, key: string, animation?: string, loop?: boolean): Phaser.GameObjects.SpineGameObject;
        }

     
  

    }

      
    
}

   
