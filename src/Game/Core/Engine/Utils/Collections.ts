import * as _ from 'lodash';
import Debug from '../Debug';

/**
 * @description A utility method for dealing with collections, such as arrays 
 */
class Collections {

    private constructor() { } // make it instantiatable

    // return object in array OR array-like object (Object.keys implementation) with properties of specified values
    public findArrElWithPropVal(array: any[], properties: string[], values: string | number[]): any {
        let row: any = null;
        if (Array.isArray(array)) {
            // Debug.warn('isArray');
            elements: for (let x = 0; x < array.length; x++) {
                props: for (let y = 0; y < properties.length; y++) {
                    // Debug.warn(array[x][properties[y]] + ', ' + values[y]);
                    if (array[x][properties[y]] === values[y]) {
                        // Debug.warn('matching pair at ' + y);
                        if (y == properties.length - 1) {
                            row = array[x];
                            break elements;
                        }
                    }
                    else {

                        break props;
                    }
                }
            }
        }
        else if (Object(array)){
            elements: for (let x = 0; x < Object.keys(array).length; x++) {
                for (let y = 0; y < properties.length; y++) {
    
                    if (array[x][properties[y]] == values[y]) {
                        // Debug.warn('matching pair at ' + y);
                        if (y == properties.length - 1) {
                            // Debug.warn('found FULL match!');
                            row = array[x];
                            break elements;
                        }
                    }
                }
            }
        }

        if (row == null) {
            Debug.warn('no match found for ' + properties.toString() + " & " + values.toString());
        }

        return row;
    }

    /**
     * @description checks if the provided object is serializable (good, for example, to check this before passing to JSON.stringify, to avoid exceptions)
     * @param obj the object to evaluate for serialabilitys
     */
    public isSerializable(obj: any) : boolean {
        var isNestedSerializable;
        function isPlain(val: any) {
          return (typeof val === 'undefined' || typeof val === 'string' || typeof val === 'boolean' || typeof val === 'number' || Array.isArray(val) || _.isPlainObject(val));
        }
        if (!isPlain(obj)) {
          return false;
        }
        for (var property in obj) {
          if (obj.hasOwnProperty(property)) {
            if (!isPlain(obj[property])) {
              return false;
            }
            if (typeof obj[property] == "object") {
              isNestedSerializable = this.isSerializable(obj[property]);
              if (!isNestedSerializable) {
                return false;
              }
            }
          }
        }
        return true;
      }

  /*   public findObjElWithPropVal(array: any | object, properties: string[], values: any[]): any {
        let row: any = null;
        
        elements: for (let x = 0; x < Object.keys(array).length; x++) {
            for (let y = 0; y < properties.length; y++) {

                if (array[x][properties[y]] == values[y]) {
                    // Debug.warn('matching pair at ' + y);
                    if (y == properties.length - 1) {
                        // Debug.warn('found FULL match!');
                        row = array[x];
                        break elements;
                    }
                }
         
            }
        }

        if (row == null) {
            Debug.warn('no match found for ' + properties.toString() + " & " + values.toString());
        }

        return row;
    } */

    // return the number of rows that match the criteria
    public numElementsWithPropVal(array: any[], properties: string[], values: any[]): number {
        let count: number = 0;
        if (Array.isArray(array)) {
            elements: for (let x = 0; x < array.length; x++) {
                props: for (let y = 0; y < properties.length; y++) {
                    if (array[x][properties[y]] === values[y]) {
                        if (y == properties.length - 1) {
                            count++;
                        }
                    }
                    else {
                        break props;
                    }
                }
            }
        }
        else if (Object(array)) {
            elements: for (let x = 0; x < Object.keys(array).length; x++) {
                for (let y = 0; y < properties.length; y++) {

                    if (array[x][properties[y]] == values[y]) {
                        if (y == properties.length - 1) {
                            count++;
                        }
                    }
                }
            }
        } else {
            Debug.error('wrong type provided; array or object required');
        }
        return count;
    }

    public allElementsWithPropVal(array: any[], properties: string[], values: any[]): any[] {
        let all: any[] = [];
        if (Array.isArray(array)) {
            // Debug.info('isArray');
            elements: for (let x = 0; x < array.length; x++) {
                props: for (let y = 0; y < properties.length; y++) {
                    // Debug.info(array[x][properties[y]] + ', ' + values[y]);
                    if (array[x][properties[y]] === values[y]) {
                        if (y == properties.length - 1) {
                            all.push(array[x]);
                        }
                    }
                    else {
                        break props;
                    }
                }
            }
        }
        else if (Object(array)) {
            elements: for (let x = 0; x < Object.keys(array).length; x++) {
                for (let y = 0; y < properties.length; y++) {

                    if (array[x][properties[y]] == values[y]) {
                        if (y == properties.length - 1) {
                            all.push(array[x]);
                        }
                    }
                }
            }
        } else {
            Debug.error('wrong type provided; array or object required');
        }
        return all;
    }

    public getUniqValsFromArrays(rows: any, arrs: string[]): string[] {
        let all: string[] = [];
        for (let x = 0; x < arrs.length; x++) {
            if (_.has(rows[0], arrs[x])) {
                for (let y = 0; y < rows.length; y++) {
                    all = all.concat(rows[y][arrs[x]].trim().split(','));
                }
            }
            else {
                Debug.warn('no col with name ' + arrs[x]);
            }
        }

        all = _.uniq(all);
        all = _.compact(all);
        return all;
    }

    /**
     * @description shuffle and return an array
     * @param a array to be shuffled
     */
    public shuffle(a: any): any[] {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

}

export default Collections;