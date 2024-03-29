/**
 * @description used by InputManager to listen for key events.
 */

class KeyListener {
    protected _callback: Function;
    protected _context: any;
    protected _keyCode: number;

    constructor() {

    }

    init(callback: Function, context: any, keyCode: number) {
        this._callback = callback; this._context = context; this._keyCode = keyCode;
    }

    createNew(callback: Function, context: any, keyCode: number) {
        let keyListener = this.createEmpty();
        keyListener.init(callback, context, keyCode);
        return keyListener;
    }

    createEmpty() {
        return new KeyListener();
    }

    get callback() {
        return this._callback;
    }

    get context() {
        return this._context;
    }

    get keyCode() {
        return this._keyCode;
    }

    public call(data: { evt: any }) {
        this._callback.bind(this._context)(data);
    }

    public callIfMatch(data: { evt: any }) {
        /* Debug.info('KeyListener.callIfMatch...');
        Debug.info('match: ', this.match(data));
        Debug.info('evt.keyCode: ', data.evt.keyCode);
        Debug.info('this.keyCode: ', this.keyCode); */
        if (this.match(data)) this.call(data);
    }

    public match(data: { evt: any }) : boolean {
        return (data.evt.keyCode == this._keyCode) ? true : false;
    }
}

export default KeyListener;