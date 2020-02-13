import * as _ from 'lodash';
import Text from './Text';
import Numbers from './Numbers';
import Scenes from './Scenes';
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

/**
 * @description A Collection of Utility classes
 */
let Utils = {
    Text: Text,
    Scenes: Scenes,
    Numbers: Numbers,

}
class UtilsOld {
    
    private constructor() { }
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
