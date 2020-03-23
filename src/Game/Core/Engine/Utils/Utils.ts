import ActScripts from './ActScripts';
import Collections from './Collections';
import Mixins from './Mixins';
import Colors from './Colors';
import Numbers from './Numbers';
import Text from './Text';
import Vectors from './Vectors';

class Utils {
    private _ActScripts: ActScripts;
    private _Collections: Collections;
    private _Colors: Colors;
    private _Mixins: Mixins;
    private _Numbers: Numbers;
    private _Text: Text;
    private _Vectors: Vectors;
    
    constructor(actScripts: ActScripts, collections: Collections, colors: Colors, mixins: Mixins, numbers: Numbers, text: Text, vectors: Vectors){
        this._ActScripts = actScripts; 
        this._Collections = collections;
        this._Colors = colors;
        this._Mixins = mixins;
        this._Numbers = numbers;
        this._Text = text;
        this._Vectors = vectors;

    }

    get script(){
        return this._ActScripts;
    }

    get coll(){
        return this._Collections;
    }

    get color(){
        return this._ActScripts;
    }

    get mixin(){
        return this._Mixins;
    }

    get number(){
        return this._Numbers;
    }

    get text() {
        return this._Text;
    }

    get vector() {
        return this._Vectors;
    }
}

export default Utils;