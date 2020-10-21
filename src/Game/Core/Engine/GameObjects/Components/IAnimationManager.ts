
/**
 * @description The basic contract for any Animation Manager.
 */
interface IAnimationManager {
    play(...args: any[]): void;
    update(time: any): void;
}