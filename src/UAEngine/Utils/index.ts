import * as _ from 'lodash';
import Text from './Text';
import Numbers from './Numbers';
import Scenes from './Scenes';
import Mixins from './Mixins';
import ActivityScripts from './ActivityScripts';
import Colors from './Colors';
import { GameObjects } from 'phaser';
import Points from './Points';
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
const Utils = {
    ActivityScripts: ActivityScripts,
    Collections: Collections,
    Colors: Colors,
    GameObjects: GameObjects,
    Mixins: Mixins,
    Numbers: Numbers,
    Points: Points,
    Scenes: Scenes,
    Text: Text,
}
class UtilsOld {
    
    private constructor() { }


}

export default Utils;
