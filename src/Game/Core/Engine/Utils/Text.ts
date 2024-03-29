import * as _ from 'lodash';
import Debug from '../Debug';

/**
 * @description a wrapper for string (text) utility functions
 */
class Text {

    private constructor() { }

    /**
      * @description concatenate an array of strings, with a seperator substring. For no seperator, use ""
      * @param array the array of strings to combine
      * @param seperator the seperator substring to insert between entries, like underscore. For no seperator, use ""
      */

    public concat(array: string[], seperator: string): string {
        let result: string = array[0];
        for (let x = 1; x < array.length; x++) {
            result = result + seperator + array[x];
        }
        // Debug.info(result);

        return result;
    }

    public getUniq(vals: string[]): string[]{
        let uVals = _.uniq(vals);
        return uVals;
    }

    /**
     * @description break a string into a string array, based on the provided seperator substring, and remove falsy values
     * @param text the string to break into a string array
     * @param seperator the seperator substring
     */
    public unstringifyArray(txt: string, seperator: string): string[] {
        // may revise to a simple split(), causes issues now, and illegal characters are stripped my macros now anyway
        //return _.compact(txt.replace(' ', '').split(seperator)); 
        return txt.split(seperator); 
    }

    public propertiesFromString(rawText: string, lineSeperator: string, valueAssigner: string, valueSeperator: string): object {
        let obj: any = {};
        let lines: string[] = rawText.trim().split(lineSeperator);
        for (let x = 0; x < lines.length; x++) {
            let sublines : string[] = lines[x].split(valueAssigner);

            if (sublines.length < 2) Debug.error("error in assigning key value in line: %s", lines[x]);

            let vals = sublines[1].trim().split(valueSeperator);
            if (vals.length <= 1) {
                let asNumber: number = Number(vals[0]);
                obj[sublines[0]] = (isNaN(asNumber)) ? vals[0]: asNumber;
            }
            else {
                obj[sublines[0]] = vals;
            }
        }

        return obj;
    }

    public split(text: string, seperator: string) : string[] {
        return _.split(text, seperator);
    }

}

export default Text;