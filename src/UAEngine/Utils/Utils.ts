import * as _ from 'lodash';
export const Transitions = {
    In: {
        SlideRight: {
            intro: true,
            props: {
                x: function (game) {
                    return game.width
                }
            }
        },
        SlideLeft: {
            intro: true,
            props: {
                x: function (game) {
                    return -game.width
                }
            }
        },
        SlideDown: {
            intro: true,
            props: {
                y: function (game) {
                    return game.height
                }
            }
        },
        SlideUp: {
            intro: true,
            props: {
                y: function (game) {
                    return -game.height
                }
            }
        }
    },
    Out: {
        SlideRight: {
            props: {
                x: function (game) {
                    return -game.width
                }
            }
        },
        SlideLeft: {
            props: {
                x: function (game) {
                    return game.width
                }
            }
        },
        SlideDown: {
            props: {
                y: function (game) {
                    return -game.height
                }
            }
        },
        SlideUp: {
            props: function (game) {
                return {
                    y: game.height
                }
            }
        }
    }
}

export enum Direction {
    UP, DOWN, LEFT, RIGHT, BUBBLE_JUMP, STAR_JUMP, JUMP
}
export enum SubType {
    IMAGES, TEXT, IMAGES_TEXT
}

class Utils {
   

   

    /**
     * @description concatenate an array of strings, with a spacer substring. For no spacer, use ""
     * @param array the array of strings to combine
     * @param seperator the seperator substring to insert between entries. For no seperator, use ""
     */
    public static concatStrings(array: string[], seperator: string) : string {
        let result: string = array[0];
        for(let x = 1; x < array.length; x++) {
            result = result + seperator + array[x];
        }
    //    console.log(result);
        
        return result;
    }

    public static getSceneKeys(scene: Phaser.Scene) : string[]{
        let scenes = scene.scene.manager.getScenes(false);
        let keys: string[] = [];
        for(let x = 0; x < scenes.length; x++){
            keys.push(scenes[x].scene.key);
        }

        return keys;
    }

    // tween tint a sprite from color X to color Y
    public static tweenTint(spriteToTween: Phaser.GameObjects.Sprite, startColor: Phaser.Display.Color, endColor: Phaser.Display.Color, duration: number, scene: Phaser.Scene): void {
        var colorBlend = { step: 0 };
        let rgb = Phaser.Display.Color.Interpolate.ColorWithColor(startColor, endColor, 100);
        let seed = "" + rgb.r + rgb.g + rgb.b;
        scene.tweens.add({
            tint: Number(seed),
            targets: spriteToTween,
            duration: duration
        });
    }



    public static cleanUnravel(text: string, seperator: string): string[] {
        return _.compact(text.replace(' ', '').split(seperator));
    }

    public static numberArray(start: number, finish: number): number[] {
        let arr: number[] = [];

        for (let x = start; x <= finish; x++)
            arr.push(x);

        return arr;
    }

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

    /**
     * @description a function to generate an array of objects from a column with 'stringified' tabular data. Use this for activity scripts with cells in columns which contain
     * more than one property, all baked into one string, with a : delineated, one line per property
     * @param array the array to pull the column from -- intended for object arrays generated from CSV files (tabular)
     * @param column the name of the column to generate objects from in the array
     */
    public static objectizeColumn(array: any, column: string): any[] {
        let arr: any[] = [];
        for (let x = 0; x < array.length; x++) {
            let text =array[x][column];
            if(text != ""){
                arr.push(Utils.getObjFromRawText(text));
            }
            else {
                arr.push({});
            }
        }
        return arr;
    }

    // convert raw text into a javascript object, like properties in cell
    public static getObjFromRawText(rawText: any): any {
        let obj: object = {};
        let lines: string[] = rawText.trim().split('\n');
        for (let x = 0; x < lines.length; x++) {
            let sublines = lines[x].split(':');
            let vals = sublines[1].trim().split(',');
            if (vals.length <= 1) {
                obj[sublines[0]] = vals[0]
            }
            else {
                obj[sublines[0]] = vals;
            }
        }

        return obj;
    }

    // get the maximum fontSize to fit the with of the sprite object and set it such
    public static reduceTextToFit(text: Phaser.GameObjects.Text, obj: any, padding: number) {
        let metrics: any = text.getTextMetrics();
        while (text.width > (obj.width - padding) && metrics.fontSize > 0) { metrics.fontSize-- }
    }

    // return whether two display objects bounds overlap
    public static checkOverlap(displayObjA: any, displayObjB: any): boolean {
        let boundsA = displayObjA.getBounds();
        let boundsB = displayObjB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }

    // shuffle any array and return
    public static shuffle(a) {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    // tween alpha from - to - for array of display objects
    static fadeAllFromToAlpha(scene: Phaser.Scene, objects: any[], startAlpha: number, endAlpha: number, time: number, callBack?: Function, callBackContext?: any) {
        for (var x = 0; x < objects.length; x++) {
            objects[x].alpha = startAlpha;
            let done = false;

            scene.tweens.add({
                alpha: endAlpha,
                duration: 1000,
                Easing: Phaser.Math.Easing.Linear.Linear,
                onComplete: function (this: any) {
                    if (!done && callBack != null) {
                        done = true;
                        callBack(callBackContext);
                    }
                }
            });

        }
    }

    // generate a grid, or matrix, of phaser points based on horizontal and vertical data
    public static getPointGrid(hor: number[], vert: number[]): Array<Phaser.Geom.Point> {
        let points: Array<Phaser.Geom.Point> = [];
        for (let y = 0; y < vert.length; y++) {
            for (let x = 0; x < hor.length; x++) {
                points.push(new Phaser.Geom.Point(hor[x], vert[y]));
            }
        }

        return points;
    }

    static getAllEntriesFromCols(rows: any, cols: string[]): string[] {
        let all: string[] = [];
        for (let x = 0; x < cols.length; x++) {
            if (_.has(rows[0], cols[x])) {
                for (let y = 0; y < rows.length; y++) {
                    all = all.concat(rows[y][cols[x]].trim().split(','));
                }
            }
            else {
                console.warn('no col with name ' + cols[x]);
            }

        }

        all = _.uniq(all);
        all = _.compact(all);

        return all;
    }

}

export default Utils;
