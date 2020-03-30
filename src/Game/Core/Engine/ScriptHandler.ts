import ScriptUtils from './Utils/ActScripts';
import Events from './Events';

class ScriptHandler {
    private _utils: ScriptUtils;
    private _events: Events;
    private _name: string;
    private _initialized: boolean;
    private _raw: any[];
    private _rows: any[];
    private _active: any;
    private _last: any;

    constructor(utils: ScriptUtils, events: Events) {
        this._utils = utils;
        this._events = events;
        this._name = '';
        this._initialized = false;
        this._raw = [];
        this._rows = [];
        this._active = [];
        this._last = [];
    }

    init(name: string, raw: any[], parseCols: string[], objectifyCols: string[], processText?: string[]) {
        this._name = name;
        this._raw = raw;
        console.log(this._raw);
        this.convertRowsFromRaw(parseCols, objectifyCols, processText);
        this._initialized = true;
    }

    /**
    * @description to be used at init, to convert raw json data into a more functional script, with arrays and objects 
    * instead of stringified lists and cells with 'stringified' key-value pairs into objects. The converted data is stored in the 
    * rows[] array. rows, rather than raw, should be accessed for almost every subsequent task involving the activity script. 
    * @param parseCols the columns which contain 'stringified' lists which should be converted into arrays of text vals
    * @param objectifyCols the columns which contain stringified key-value pairs. These are converted into objects.
    */
    convertRowsFromRaw(parseCols: string[], objectifyCols: string[], processText?: string[]) {
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
                            let chunks = this.chunks(line);
                            let words = this.words(line);
                            // let words
                            arr = [line, chunks, words];
                            this._rows[x][processText[s]][u] = arr;
                        }
                    }
                }
            }
        }
    }

    chunks(text: string) {
        return text.split(' ');
    }

    words(text: string){
        return this._utils.words(text);
    }

    private _processText(text: string): string[] {
        return this._utils.toLines(text);
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

    goTo(row: any) {
        this.active = row;
        this._events.fire('newRow'); // this event can be listened for anywhere you need to respond to a newRow
    }

    goToAutoNext() {
        let row = this.getFromAutoNext();
        if (row !== null) {
            this.goTo(this.getFromAutoNext());
        }
    }

    getFromAutoNext(): any {
        let row = this.rowByCellVals(['id'], [this.active.auto_next]);
        if (row == null) {
            console.warn('auto_next has no value for row %s', this.active.id);
        }
        return row;
    }

    /**
     * @description find the first row whose cells contain the specified vals
     * @param colname the columns (properties) to search for the respective vals in
     * @param val the vals to search for. The order of this array must match colname.
     */
    public rowByCellVals(colname: string[], val: string[]): any[] | null {
        return this._rowByCellVals(colname, val);
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

    /**
     * @description searches through all arrays in the specified columns, and returns every unique value. Duplicates
     * are removed.
     * @param cols the columns to search for files in
     */
    public fileList(cols: string[]): string[] {
        return this._fileList(cols);
    }

    private _fileList(cols: string[]): string[] {
        let files: any[] = [];
        for (let x = 0; x < this.rows.length; x++) {
            for (let y = 0; y < cols.length; y++) {
                //    console.log('files in %s of row %s: ', cols[y], x, Array(this.rows[x][cols[y]]));
                files = files.concat(this.rows[x][cols[y]]);
            }
        }
        //  console.log('files found: ', files);
        return this._utils.getUniq(files);
    }
}

export default ScriptHandler;