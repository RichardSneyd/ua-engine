import DebugStyles from "./DebugStyles";
import GameConfig from "./GameConfig";
import LogLevel from "./LogLevel";

/**
 * @description The Debug class is used for all console debugging, as a wrapper for console.log, console.warn etc. It also allows the exposing of objects
 * on the window (globally) in a controlled way when in development mode, via exposeGlobal(). Can be accessed via static members within the engine, or via
 * UAE.debug in the API.
 */
class Debug {
    private static _LEVELS = LogLevel;
    private static _source: string = '';
    private static _previousSource: string = '';
    private static _level: number = LogLevel.INFO; // 1 is errors, 2 is warnings, 3 is info
    private static _fillerAudio: string = 'missing_audio_file'
    private static _STYLES = DebugStyles;
   // private static _pageLogging: boolean = false;

    constructor() {
   
    }

    private static _identifyLogSource(): string {
        if (!Debug._source) {
            let stack = Error().stack + '';
            let files = stack.match(/\w+\.ts|\w+\.js/g);
            files = (files) ? files : [];

            if (files.length > 4) {
                Debug._source = files[4];
            }
        }

        let source = Debug._source;
        Debug._source = '';
        return source;
    }

    private static _simpleSerialize(obj: any) {
        let keys = Object.keys(obj);
        //   alert(' simple serialize: ' + keys);
        let simpleObj: any = {};
        for (let x = 0; x < keys.length; x++) {
            if (obj.hasOwnProperty(keys[x])) {
                simpleObj[keys[x]] = obj[keys[x]].toString();
            }
        }

        return '[object signature: ' + JSON.stringify(simpleObj) + ']';
    }

    private static _enableDocumentErrorReports() {

        let logger = document.createElement('div');
        logger.id = 'logger';
        logger.style.color = 'red';
        logger.style.textAlign = 'left';
        document.body.prepend(logger);
        var old = console.error;
        // @ts-ignore
        console.customErrors = [];
        console.error = function (this: any) {
            let message = '';
            for (var i = 0; i < arguments.length; i++) {
                if (i > 0) message += ' ';
                if (typeof arguments[i] == 'object') {
                    if ((<any>window).isSerializable(arguments[i])) {
                        message += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]);
                    }
                    else {
                        //  message += arguments[i].toString();
                        //   message += typeof arguments[i];
                        message += Debug._simpleSerialize(arguments[i]);
                    }
                } else {
                    message += arguments[i];
                }
            }
            //  let final = "<p style = 'border-bottom: 1px dotted red; margin 2px'> " + '[' + (console.customErrors.length+1) + ']  ' + message + '</p>';
            // @ts-ignore
            let index = '[' + (console.customErrors.length + 1) + ']  ';
            message = index + message;
            arguments[0] = index + arguments[0];;
            let final = "<p> " + message + '</p>';
            logger.innerHTML += final;
            // @ts-ignore
            console.customErrors.push(message);

            //@ts-ignore
            old.apply(this, arguments);
        }


    }

    /*    static toPage() {
           alert(arguments[1]);
           let logger = document.getElementById('logger');
           if (logger) {
               for (var i = 0; i < arguments.length; i++) {
   
                   if (typeof arguments[i] == 'object') {
                       logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
                   } else {
                       logger.innerHTML += arguments[i] + '<br />';
                   }
               }
           }
       } */


    static get STYLES() {
        return Debug._STYLES;
    }

    public get STYLES() {
        return Debug.STYLES;
    }

    static get fillerAudio() {
        return this._fillerAudio;
    }

    /**
     * @description Returns all levels this Debug can be set to
     */
    public static get LEVELS() {
        return Debug._LEVELS;
    }

    /**
     * @description the current level that is set
     */
    public static get level() {
        return Debug._level;
    }

    /**
     * @description Set a group text instead of the default one
     * @param source string to set as message group
     * @returns Debug, to allow chain a print method after
     */
    public static source(source: string): Debug {
        Debug._source = source;

        return Debug;
    }

    /**
     * @description Change the highest log level that can be printed.
     * @param level from the LogLevel enum, ERROR, WARNING or INFO
     */
    public static setLevel(level: number) {
        Debug._level = level;
        if (level == Debug.LEVELS.PAGE) {
            this._enableDocumentErrorReports();
        }
    }

    private static _setGroup() {
        let groupName = Debug._identifyLogSource();
        if (groupName != Debug._previousSource) {
            console.groupEnd();
            console.group(groupName);
            Debug._previousSource = groupName;
        }
    }

    /**
     * @description Logs a message in the browser console using console.log
     * @param args one or more arguments, any type
     */
    static get info() {
        if (Debug._level >= LogLevel.INFO) {
            Debug._setGroup();
            return console.log.bind(console);
        }
        return () => { };
    }


    /**
     * @description Logs a message in the browser console using console.table
     * @param args one or more arguments, any type
     */
    static get table() {
        if (Debug._level >= LogLevel.INFO) {
            Debug._setGroup();
            return console.table.bind(console);
        }
        return () => { };
    }

    /**
     * @description Logs a message in the browser console using console.error
     * @param args one or more arguments, any type
     */
    static get error() {
        if (Debug._level >= LogLevel.ERROR) {
            Debug._setGroup();
            // Debug.toPage();
            return console.error.bind(console);
        }
        return () => { };
    };

    /**
     * @description Logs a message in the browser console using console.warn
     * @param args one or more arguments, any type
     */
    static get warn() {
        if (Debug._level >= LogLevel.WARNING) {
            Debug._setGroup();
            return console.warn.bind(console);
        }
        return () => { };
    };

    /**
     * @description Logs a message in the browser console using console.trace
     * @param args one or more arguments, any type
     */
    static get trace() {
        if (Debug._level >= LogLevel.INFO) {
            Debug._setGroup();
            return console.trace.bind(console);
        }
        return () => { };
    };

    /**
     * @description The environment is development if the loglevel is higher that ERROR
     * @returns boolean, true if log level is greater than error
     */
    public static get devEnvironment() {
        return (Debug._level > LogLevel.ERROR);
    }

    /**
     * @description Expose object on the window, for debugging purposes
     * @param object object to expose
     * @param label key to locate the object on the window
     */
    public static exposeGlobal(object: any, label: string) {
        if (Debug.devEnvironment) {
            (<any>window)[label] = object;
        }
    }

    /**
     * @description Call the 'debugger' keyword/function (if available. effectively a breakpoint)
     */
    public static breakpoint() {
        if (Debug.devEnvironment) {
            debugger;
        }
    }

    /**
     * @description clear the console
     */
    public static clear() {
        console.clear();
    }

    /**
     * @description clear the console
     */
    public clear() {
        Debug.clear();
    }

    // From here onward all static methods are repeated as non-static.
    // This is to allow instantiation in the UAE API.


    /**
     * @description Returns all levels this Debug can be set to
     */
    public get LEVELS() {
        return Debug.LEVELS;
    }

    /**
     * @description Set a group text instead of the default one
     * @param source string to set as message group
     * @returns Debug, to allow chain a print method after
     */
    public source(source: string): Debug {
        Debug.source(source);

        return this;
    }

    /**
     * @description Change the highest log level that can be printed.
     * @param level from the LogLevel enum, ERROR, WARNING or INFO
     */
    public setLevel(level: number) {
        Debug.setLevel(level);
    }

    /**
     * @description Logs a message in the browser console using console.log
     * @param args one or more arguments, any type
     */
    get info() {
        return Debug.info;
    };

    /**
    * @description Logs a message in the browser console using console.table
    * @param args one or more arguments, any type
    */
    get table() {
        return Debug.table;
    };

    /**
     * @description Logs a message in the browser console using console.error
     * @param args one or more arguments, any type
     */
    get error() {
        return Debug.error;
    };

    /**
     * @description Logs a message in the browser console using console.warn
     * @param args one or more arguments, any type
     */
    get warn() {
        return Debug.warn;
    };

    /**
     * @description Logs a message in the browser console using console.trace
     * @param args one or more arguments, any type
     */
    get trace() {
        return Debug.trace;
    }

    /**
     * @description The environment is development if the loglevel is higher that ERROR
     * @returns boolean, true if log level is greater than error
     */
    public get devEnvironment() {
        return Debug.devEnvironment;
    }

    /**
     * @description Expose object on the window, for debugging purposes
     * @param object object to expose
     * @param label key for the object on the window
     */
    public exposeGlobal(object: any, label: string) {
        Debug.exposeGlobal(object, label);
    }

    /**
     * @description Call the debugging function (if available)
     */
    public breakpoint() {
        Debug.breakpoint();
    }

}

export default Debug;