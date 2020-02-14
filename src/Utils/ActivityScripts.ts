import Text from './Text';

class ActivityScripts {
    private constructor() { }

    /**
   * @description a function to generate an array of objects from a column with 'stringified' tabular data. Use this for activity scripts with cells in columns which contain
   * more than one property, all baked into one string, with a : delineated, one line per property
   * @param array the array to pull the column from -- intended for object arrays generated from CSV files (tabular)
   * @param column the name of the column to generate objects from in the array
   */
    public static objectArrayifyScriptColumn(array: any, column: string): any[] {
        let arr: any[] = [];
        for (let x = 0; x < array.length; x++) {
            let text = array[x][column];
            if (text != "") {
                arr.push(ActivityScripts.objectifyScriptCell(text));
            }
            else {
                arr.push({});
            }
        }
        return arr;
    }

    /**
     * @description generates an object with properties from a string, where each key-value pair is on a new line, colon assigns a value, and
     * comma seperates multiple values.
     * @param cellString the string that the cell was converted to from the Activity Script
     */
    public static objectifyScriptCell(cellString: string): object {
        return Text.propertiesFromString(cellString, '\n', ':', ',');
    }


}

export default ActivityScripts;