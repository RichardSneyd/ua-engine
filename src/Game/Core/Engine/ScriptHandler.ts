import ActScripts from './Utils/ActScripts';
import Events from './Events';

class ScriptHandler {
    private _utils: ActScripts;
    private _events: Events;
    private _name: string;
    private _initialized: boolean;
    private _raw: any[];
    private _rows: any[];
    private _active: any;
    private _last: any;

    constructor(utils: ActScripts, events: Events) {
        this._utils = utils;
        this._events = events;
        this._name = '';
        this._initialized = false;
        this._raw = [];
        this._rows = [];
        this._active = [];
        this._last = [];
    }

    /**
      * @description initialize the level manager.
      * @param scriptName the name of the script to initialize the script handler with
      * @param scriptRaw the raw script data for the script handler
      * @param parseCols the names of the columns to be parsed into arrays of names (i.e 'horse,dog,cat' => [horse, dog, cat])
      * @param objectifyCols the names of the columns to be converted into objects with key-value pairs. For example:
      * 'bgd: bgd_1\noverlay: overlay_1'
      * => {bgd: 'bgd_1', overlay: 'overlay_1'}
      * @param processText (optional) the column names to convert into lines and _words of text. Mainly useful in passage (reading) types.
      */
    init(name: string, raw: any[], parseCols: string[], objectifyCols: string[], processText?: string[]) {
        this._name = name;
        this._raw = raw;
        console.log(this._raw);
        this._convertRowsFromRaw(parseCols, objectifyCols, processText);
        this._initialized = true;
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
     * @description get the active row.
     */
    get active(): any {
        return this._active;
    }

    /**
     * @description set the active row. 
     */
    set active(row: any) {
        this._last = this.active;
        this._active = row;
    }

    /**
     * @description get the last row (the previous value of active)
     */
    get last(): any {
        return this._last;
    }

    /**
     * @description switches the active row to the one specified
     * @param row the row object to switch to
     */
    public goTo(row: any) {
        this.active = row;
        this._events.fire('newRow'); // this event can be listened for anywhere you need to respond to a newRow
    }

    /**
     * @description switches the active row to the one with the id the auto_next field points to
     */
    public goToAutoNext() {
        let row = this.getFromAutoNext();
        if (row !== null) {
            this.goTo(this.getFromAutoNext());
        }
    }

    /**
     * @description will return the row which the auto_next field for the current row points to. If falsy, logs warning. 
     */
    public getFromAutoNext(): any {
        let row = this.rowByCellVals(['id'], [this.active.auto_next]);
        if (row == null) {
            console.warn('auto_next has no value for row %s', this.active.id);
        }
        return row;
    }

    /**
     * @description searches through all arrays in the specified columns, and returns every unique value. Duplicates
     * are removed.
     * @param cols the columns to search for files in
     */
    public fileList(cols: string[]): string[] {
        return this._fileList(cols);
    }

    /**
     * @description find the first row whose cells contain the specified vals
     * @param colname the columns (properties) to search for the respective vals in
     * @param val the vals to search for. The order of this array must match colname.
     */
    public rowByCellVals(colname: string[], val: string[]): any[] | null {
        return this._rowByCellVals(colname, val);
    }

    public isFalsy(val: any): boolean {
        if(val !== null && val !== undefined && val !== '') return false; return true;
    }

     /**
    * @description to be used at init, to convert raw json data into a more functional script, with arrays and objects 
    * instead of stringified lists and cells with 'stringified' key-value pairs into objects. The converted data is stored in the 
    * rows[] array. rows, rather than raw, should be accessed for almost every subsequent task involving the activity script. 
    * @param parseCols the columns which contain 'stringified' lists which should be converted into arrays of text vals
    * @param objectifyCols the columns which contain stringified key-value pairs. These are converted into objects.
    */
   private _convertRowsFromRaw(parseCols: string[], objectifyCols: string[], processText?: string[]) {
    this._rows = this._utils.clone(this._raw);
    for (let x = 0; x < this._rows.length; x++) {
        for (let y = 0; y < parseCols.length; y++) {
            if (this._rows[x][parseCols[y]] !== '') {
                this._rows[x][parseCols[y]] = this._parseList(this._raw[x][parseCols[y]]);
            }
        }
        for (let z = 0; z < objectifyCols.length; z++) {
            if (this._rows[x][objectifyCols[z]] !== '') {
                this._rows[x][objectifyCols[z]] = this._getKeyValPairs(this._raw[x][objectifyCols[z]]);
            }
        }

        if (processText !== undefined) {
            for (let s = 0; s < processText.length; s++) {
                if (this._rows[x][processText[s]] !== '') {
                    let lines = this._processText(this._raw[x][processText[s]]);
                    //  this._rows[x][processText[s]]['lines'] = lines;
                    this._rows[x][processText[s]] = [];

                    for (let u = 0; u < lines.length; u++) {
                        let arr = [];
                        let line = lines[u];
                        let _chunks = this._chunks(line);
                        let _words = this._words(line);
                        // let _words
                        arr = [line, _chunks, _words];
                        this._rows[x][processText[s]][u] = arr;
                    }
                }
            }
        }
    }
}

    private _rowByCellVals(colname: string[], val: string[]): any[] | null {

        let result = this._utils.rowByColsWithVals(this.rows, colname, val);
        return result;
    }

    private _getKeyValPairs(text: string): any {
        return this._utils.objectifyCell(text);
    }

    private _parseList(text: string): string[] {
        return this._utils.getValsFromCell(text);
    }

    private _fileList(cols: string[]): string[] {
        let files: any[] = [];
        for (let x = 0; x < this.rows.length; x++) {
            let row = this.rows[x];

            for (let y = 0; y < cols.length; y++) {
                //    console.log('files in %s of row %s: ', cols[y], x, Array(this.rows[x][cols[y]]));
                let col = cols[y];
                let split = col.split('.');
                if(split.length > 1){
                    let val = row[split[0]][split[1]];
                    if(!this.isFalsy(val)){
                        files = files.concat(row[split[0]][split[1]]);
                    }
                }
                else {
                    files = files.concat(row[col]);
                }
            }
        }
        //  console.log('files found: ', files);
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