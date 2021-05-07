import ActScripts from './Utils/ActScripts';
import Events from './Events';
import Debug from './Debug';
//import SceneEvents from './Activities/SceneEvents';
//import ILevel from './Activities/ILevel';

/**
 * @description An activity script preprocessor and wrapper. 
 */
class ScriptHandler {
    private _events: Events;
    private _utils: ActScripts;
    private _name: string;
    private _initialized: boolean;
    private _raw: any[];
    private _rows: any[];
    private _active: any;
    private _last: any;
    private _levelFile: any;

    constructor(utils: ActScripts, events: Events) {
        this._utils = utils;
        this._events = events;
        this._name = '';
        this._initialized = false;
        this._raw = [];
        this._rows = [];
        this._active = [];
        this._last = [];
        Debug.exposeGlobal(this, 'script');
    }

    /**
      * @description Initialize the level manager.
      * @param scriptName the name of the script to initialize the script handler with
      * @param scriptRaw the raw script data for the script handler
      * @param parseCols the names of the columns to be parsed into arrays of names (i.e 'horse,dog,cat' => ['horse,' 'dog', 'cat'])
      * @param objectifyCols the names of the columns to be converted into objects with key-value pairs. For example:
      * 'bgd: bgd_1\noverlay: overlay_1'
      * => {bgd: 'bgd_1', overlay: 'overlay_1'}
      * @param processText (optional) the column names to convert into lines and _words of text. Mainly useful in passage (reading) types.
      */
    init(name: string, raw: any[], parseCols: string[], objectifyCols: string[], processText?: string[]) {
        this._name = name;
        this._raw = raw;
       // this._checkIfColumnNamesValid(parseCols.concat(objectifyCols)); // check if column names provided for processing are valid before proceeding
        this._forceString(); // force label values to be strings (they can be generated as numbers if they only contain numerical characters)
        this._convertRowsFromRaw(parseCols, objectifyCols, processText);
        this._parseNumbers(['id', 'page', 'auto_next', 'round']);
        this._initialized = true;
        this._active = this._rows[0];
    }

    protected _forceString(){
        this._raw.forEach(function (row: any, index: number){
           if(row.hasOwnProperty('label') && typeof row.label !== 'string') row.label = String(row.label);
        });
    }

    private _checkIfColumnNamesValid(columns: string[]){
       let list = [];
        let configRow = this._raw[0];
        for(let x = 0; x < columns.length; x++){
            if(!configRow.hasOwnProperty(columns[x])) list.push(columns[x]);
        }
        if(list.length > 0) Debug.error('these columns do not exist in script: ', list);
    }

    /**
     * @description Searches for an object on the Level File
     * @param rootObject Type of object being looked for. 'sprites', 'spines', 'dropzones', etc.
     * @param value String value the object must have for the given key
     * @param key Property that identifies the object, 'name' by default
     */
    getLevelFileObject(rootObject: string, value: string, key: string = 'name'): any {
        if(!this.levelFile) Debug.error('There is no levelfile named %s', this.name + '_level');
        else if(!this.levelFile.hasOwnProperty(rootObject)) Debug.error('No rootObject called %s in levelFile', rootObject);
    
        for(let object of this.levelFile[rootObject]) {
            if(object[key] == value) {
                return object;
            }
        }

        Debug.error('no object with - %s: %s', key, value);
    }

    get levelFile(): any {
        return this._levelFile;
    }

    get name(): string {
        return this._name;
    }

    get initialized(): boolean {
        return this._initialized;
    }

    get raw(): any[] {
        return this._raw;
    }

    get rows(): any[] {
        return this._rows;
    }

    /**
     * @description Get the active row.
     */
    get active(): any {
        return this._active;
    }

    set levelFile(content: any) {
        this._levelFile = content;
    }

    /**
     * @description Set the active row. 
     */
    set active(row: any) {
        this._last = this.active;
        this._active = row;
        this._events.emit('newRow'); // this event can be listened for anywhere you need to respond to a row change (goTo)
    }

    /**
     * @description Get the last row (the previous value of active)
     */
    get last(): any {
        return this._last;
    }

    /**
     * @description switches the active row to the one specified
     * @param row the row object to switch to
     */
    public goTo(row: any) {
        if (row == null) {
            console.error('cannot goTo a null row argument: ', row);
        }
        this.active = row;
    }

    /**
     * @description Switches the active row to the one with the id the auto_next field points to
     */
    public goToAutoNext() {
        let row = this.getFromAutoNext();
        if (row !== null) {
            this.goTo(this.getFromAutoNext());
        }
    }

    /**
     * @description Will return the row which the auto_next field for the current row points to. If falsy, logs warning. 
     */
    public getFromAutoNext(): any {
        let row = this.rowByCellVals(['id'], [this.active.auto_next]);
        if (row == null) {
            Debug.warn('auto_next has no value for active row %s', this.active.id);
        }
        return row;
    }

    /**
     * @description Searches through all arrays in the specified columns, and returns every unique value. Duplicates
     * are removed.
     * @param cols the columns to search for files in i.e ['images', 'correct_image']; you may also specify a property within an 'object' 
     * cell with dot syntax; i.e ['config.bgd'] will find all values of the bgd field for all pre-converted config cells.
      * 
     */
    public fileList(cols: string[]): string[] {
        return this._fileList(cols);
    }

    /**
     * @description Searches through all arrays in the specified columns, and returns every unique value. Duplicates
     * are removed.
     * @param cols the columns to search for files in i.e ['images', 'correct_image']; you may also specify a property within an 'object' 
     * cell with dot syntax; i.e ['config.bgd'] will find all values of the bgd field for all pre-converted config cells.
      * 
     */
    public valueList(cols: string[]): number[] {
        return this._fileList(cols);
    }

    /**
     * @description Find the first row whose cells contain the specified vals
     * @param colnames the columns (properties) to search for the respective vals in
     * @param vals the vals to search for. The order of this array must match colname.
     */
    public rowByCellVals(colnames: string[], vals: any[]): any | null {
        return this._rowByCellVals(colnames, vals);
    }

    public isFalsy(val: any): boolean {
        if (val !== null && val !== undefined && val !== '') return false; else return true;
    }

    /**
   * @description To be used at init, to convert raw json data into a more functional script, with arrays and objects 
   * instead of stringified lists and cells with 'stringified' key-value pairs into objects. The converted data is stored in the 
   * rows[] array. rows, rather than raw, should be accessed for almost every subsequent task involving the activity script. 
   * @param parseCols the columns which contain 'stringified' lists which should be converted into arrays of text vals
   * @param objectifyCols the columns which contain stringified key-value pairs. These are converted into objects.
   * @param processText [optional] if there are columns which contain portions of text which must be decoded into arrays of lines, words etc,
   * specify them here.
   */
    private _convertRowsFromRaw(parseCols: string[], objectifyCols: string[], processText?: string[]) {
        this._rows = this._utils.clone(this._raw);
        for (let x = 0; x < this._rows.length; x++) {
            for (let y = 0; y < parseCols.length; y++) {
                if (this._rows[x][parseCols[y]] !== undefined) {
                    let rawVal: string = this.rows[x][parseCols[y]];
                    if (rawVal !== '') {
                        let lines = rawVal.split('\n');
                        if (lines.length > 1) {
                            let arrs = [];
                            for (let l = 0; l < lines.length; l++) {
                                arrs.push(this._parseList(lines[l]));
                            }
                            this._rows[x][parseCols[y]] = arrs;
                        }
                        else {
                            this._rows[x][parseCols[y]] = this._parseList(this._raw[x][parseCols[y]]);
                        }
                    }
                }
            }
            for (let z = 0; z < objectifyCols.length; z++) {
                if (this._rows[x][objectifyCols[z]] !== undefined) {
                    if (this._rows[x][objectifyCols[z]] !== '') {
                        this._rows[x][objectifyCols[z]] = this._getKeyValPairs(this._raw[x][objectifyCols[z]]);
                    }
                }
            }

            if (processText !== undefined) {
                for (let s = 0; s < processText.length; s++) {
                    if (this._rows[x][processText[s]] !== undefined) {
                        if (this._rows[x][processText[s]] !== '') {
                            let lines = this._processText(this._raw[x][processText[s]]);
                            //  this._rows[x][processText[s]]['lines'] = lines;
                            this._rows[x][processText[s]] = [];

                            for (let u = 0; u < lines.length; u++) {
                                let obj = {};
                                let line = lines[u];
                                let _chunks = this._chunks(line);
                                let _words = this._words(line);
                                // let _words
                                obj = { line: line, chunks: _chunks, words: _words };
                                this._rows[x][processText[s]][u] = obj;
                            }
                        }
                    }
                }
            }
        }
    }

    private _parseNumbers(cols: string[]) {
        for (let x = 0; x < this.rows.length; x++) {
            let row = this.rows[x];
            for (let c = 0; c < cols.length; c++) {
                if (row[cols[c]] !== undefined) {
                    row[cols[c]] = parseInt(row[cols[c]]);
                }
            }
        }
    }

    private _rowByCellVals(colnames: string[], vals: any[]): any[] | null {

        let result = this._utils.rowByColsWithVals(this.rows, colnames, vals);
        return result;
    }

    private _getKeyValPairs(text: string): any {
        return this._utils.objectifyCell(text);
    }

    private _parseList(text: string): string[] | string{
     //   if(this._utils.getValsFromCell(text).length > 1)  return this._utils.getValsFromCell(text);
        if(text.split(',').length > 1)  return text.split(',');
        return text; // if there is only one element, skip this step and just return the original value
    }

    private _fileList(cols: string[]): any[] {
        let files: any[] = [];
        for (let x = 0; x < this.rows.length; x++) {
            let row = this.rows[x];

            for (let y = 0; y < cols.length; y++) {
                // Debug.info('files in %s of row %s: ', cols[y], x, Array(this.rows[x][cols[y]]));
                let col = cols[y];
                let split = col.split('.');
                if (split.length > 1) {
                    let val = ((row[split[0]])) ? row[split[0]][split[1]] : null;
                    if (!this.isFalsy(val)) {
                        files = files.concat(row[split[0]][split[1]]);
                    }
                }
                else {
                    let val = row[col];
                    if (!this.isFalsy(val)) {
                        files = files.concat(val);
                    }
                }
            }
        }
        // Debug.info('files found: ', files);
        return this._utils.getUniq(files);
    }

    private _chunks(text: string) {
        return text.split(' ');
    }

    private _words(text: string) {
        return this._utils.words(text);
    }

    private _processText(text: string): string[] {
        return this._utils.toLines(text);
    }
}

export default ScriptHandler;