class Collections {

    private constructor() {} // make it instantiatable

     // return object in array OR array-like object (Object.keys implementation) with properties of specified values
     public static findArrElWithPropVal(array: any[] | object, properties: string[], values: any[]): any {
        let row: any = null;
        if (Array.isArray(array)) {
            //  console.trace('isArray');
            elements: for (let x = 0; x < array.length; x++) {
                props: for (let y = 0; y < properties.length; y++) {
                    // console.trace(array[x][properties[y]] + ', ' + values[y]);
                    if (array[x][properties[y]] === values[y]) {
                        //   console.trace('matching pair at ' + y);
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
        else if (Object(array)) {
            elements: for (let x = 0; x < Object.keys(array).length; x++) {
                for (let y = 0; y < properties.length; y++) {

                    if (array[x][properties[y]] == values[y]) {
                        //   console.trace('matching pair at ' + y);
                        if (y == properties.length - 1) {
                            //   console.trace('found FULL match!');
                            row = array[x];
                            break elements;
                        }
                    }
                }
            }
        } else {
            //  console.trace('wrong type provided; array or object required');
        }

        if (row == null) {
            console.trace('no match found for ' + properties.toString() + " & " + values.toString());
        }

        return row;
    }

    // return the number of rows that match the criteria
    public static numElementsWithPropVal(array: any[] | object, properties: string[], values: any[]): number {
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
            console.error('wrong type provided; array or object required');
        }
        return count;
    }

    public static allElementsWithPropVal(array: any[] | object, properties: string[], values: any[]): any[] {
        let all: any[] = [];
        if (Array.isArray(array)) {
           // console.log('isArray');
            elements: for (let x = 0; x < array.length; x++) {
                props: for (let y = 0; y < properties.length; y++) {
                   // console.log(array[x][properties[y]] + ', ' + values[y]);
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
            console.error('wrong type provided; array or object required');
        }
        return all;
    }

}