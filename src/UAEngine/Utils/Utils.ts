import * as _ from 'lodash';
import Text from './Text';
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
    public static Text: Text; 


    
   
    /**
     * @description a function to generate an array of objects from a column with 'stringified' tabular data. Use this for activity scripts with cells in columns which contain
     * more than one property, all baked into one string, with a : delineated, one line per property
     * @param array the array to pull the column from -- intended for object arrays generated from CSV files (tabular)
     * @param column the name of the column to generate objects from in the array
     */
    public static objectArrayifyScriptColumn(array: any, column: string): any[] {
        let arr: any[] = [];
        for (let x = 0; x < array.length; x++) {
            let text =array[x][column];
            if(text != ""){
                arr.push(Utils.objectifyScriptCell(text));
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
        return this.propertiesFromString(cellString, '\n', ':', ',');
    }


    public static propertiesFromString(rawText: string, lineSeperator: string, valueAssigner: string, valueSeperator: string): object {
        let obj: object = {};
        let lines: string[] = rawText.trim().split(lineSeperator);
        for (let x = 0; x < lines.length; x++) {
            let sublines = lines[x].split(valueAssigner);
            let vals = sublines[1].trim().split(valueSeperator);
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
