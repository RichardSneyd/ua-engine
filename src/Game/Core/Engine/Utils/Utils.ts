import ActScripts from './ActScripts';
import Collections from './Collections';
import Mixins from './Mixins';
import Colors from './Colors';
import MathUtils from './MathUtils';
import Text from './Text';
import Vectors from './Vectors';
import Logger from './Logger';

class Utils {
    private _scripts: ActScripts;
    private _collections: Collections;
    private _colors: Colors;
    private _mixins: Mixins;
    private _math: MathUtils;
    private _Text: Text;
    private _Vectors: Vectors;
    private _logger: Logger;
    
    constructor(actScripts: ActScripts, collections: Collections, colors: Colors, mixins: Mixins, math: MathUtils, text: Text, vectors: Vectors, logger: Logger){
        this._scripts = actScripts; 
        this._collections = collections;
        this._colors = colors;
        this._mixins = mixins;
        this._math = math;
        this._Text = text;
        this._Vectors = vectors;
        this._logger = logger;
    }

    get script(){
        return this._scripts;
    }

    get coll(){
        return this._collections;
    }

    get color(){
        return this._scripts;
    }

    get mixin(){
        return this._mixins;
    }

    get math(){
        return this._math;
    }

    get text() {
        return this._Text;
    }

    get vector() {
        return this._Vectors;
    }

    get log() {
        return this._logger;
    }
}

export default Utils;