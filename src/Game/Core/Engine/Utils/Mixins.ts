// use this to implement multiple inheritance functionality where necessary, via Mixin pattern
// use interfaces to allow resulting objects to be used as the mixin type, and intellisense

/**
 * @description a singleton for working with mixins (this design pattern is no longer used in the engine)
 */
class Mixins {
    private constructor(){}

    public static applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                Object.defineProperty(derivedCtor.prototype, name, <any>Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
            });
        });
    }
}

export default Mixins;