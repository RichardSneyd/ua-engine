
/**
 * @description The basic contract for any Animation Manager.
 */
interface IAnimationManager {
    play(...args: any[]): void;
    update(...args: any[]): void;
    init(...args: any[]): void;
    createNew(...args: any[]): any;
}