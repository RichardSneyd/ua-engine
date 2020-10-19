import LogLevel from "./LogLevel";

class Logger {
    private static _LEVELS = LogLevel;
    private static _source: string = '';
    private static _previousSource: string = '';
    private static _level: number = LogLevel.INFO;

    private static _identifyLogSource(): string {
        if (!Logger._source) {
            let stack = Error().stack + '';
            let files = stack.match(/\w+\.ts|\w+\.js/g);
            files = (files) ? files : [];

            if (files.length > 2) {
                Logger._source = files[2];
            }
        }

        let source = Logger._source;
        Logger._source = '';
        return source;
    }

    /**
     * @description Returns all levels this Logger can be set to
     */
    public static get LEVELS() {
        return Logger._LEVELS;
    }

    /**
     * @description Set a group text instead of the default one
     * @param source string to set as message group
     * @returns Logger, to allow chain a print method after
     */
    public static source(source: string): Logger {
        Logger._source = source;

        return Logger;
    }

    /**
     * @description Change the highest log level that can be printed.
     * @param level from the LogLevel enum, ERROR, WARNING or INFO
     */
    public static setLevel(level: number) {
        Logger._level = level;

        Logger.info
    }

    private static _setGroup() {
        let groupName = Logger._identifyLogSource();
        if (groupName != Logger._previousSource) {
            console.groupEnd();
            console.group(groupName);
            Logger._previousSource = groupName;
        }
    }

    /**
     * @description Logs a message in the browser console using console.log
     * @param args one or more arguments, any type
     */
    static get info() {
        if (Logger._level >= LogLevel.INFO) {
            Logger._setGroup();
            return console.log.bind(console);
        }
        return () => {};
    }

    /**
     * @description Logs a message in the browser console using console.error
     * @param args one or more arguments, any type
     */
    static get error() {
        if (Logger._level >= LogLevel.ERROR) {
            Logger._setGroup();
            return console.error.bind(console);
        }
        return () => {};
    };

    /**
     * @description Logs a message in the browser console using console.warn
     * @param args one or more arguments, any type
     */
    static get warn() {
        if (Logger._level >= LogLevel.WARNING) {
            Logger._setGroup();
            return console.warn.bind(console);
        }
        return () => {};
    };

    /**
     * @description Logs a message in the browser console using console.trace
     * @param args one or more arguments, any type
     */
    static get trace() {
        if (Logger._level >= LogLevel.INFO) {
            Logger._setGroup();
            return console.trace.bind(console);
        }
        return () => {};
    };

    /**
     * @description The environment is development if the loglevel is higher that ERROR
     * @returns boolean, true if log level is greater than error
     */
    public static get devEnvironment() {
        return (Logger._level > LogLevel.ERROR);
    }

    /**
     * @description Expose object on the window, for debugging purposes
     * @param object object to expose
     * @param label key to locate the object on the window
     */
    public static exposeGlobal(object: any, label: string) {
        if (Logger.devEnvironment) {
            (<any>window)[label] = object;
        }
    }

    /**
     * @description Call the 'debugger' keyword/function (if available. effectively a breakpoint)
     */
    public static breakpoint() {
        if (Logger.devEnvironment) {
            debugger;
        }
    }

    // From here onward all static methods are repeated as non-static.
    // This is to allow instantiation in the UAE API.


    /**
     * @description Returns all levels this Logger can be set to
     */
    public get LEVELS() {
        return Logger.LEVELS;
    }

    /**
     * @description Set a group text instead of the default one
     * @param source string to set as message group
     * @returns Logger, to allow chain a print method after
     */
    public source(source: string): Logger {
        Logger.source(source);

        return this;
    }

    /**
     * @description Change the highest log level that can be printed.
     * @param level from the LogLevel enum, ERROR, WARNING or INFO
     */
    public setLevel(level: number) {
        Logger.setLevel(level);
    }

    /**
     * @description Logs a message in the browser console using console.log
     * @param args one or more arguments, any type
     */
    get info() {
        return Logger.info;
    };

    /**
     * @description Logs a message in the browser console using console.error
     * @param args one or more arguments, any type
     */
    get error() {
        return Logger.error;
    };

    /**
     * @description Logs a message in the browser console using console.warn
     * @param args one or more arguments, any type
     */
    get warn() {
        return Logger.warn;
    };

    /**
     * @description Logs a message in the browser console using console.trace
     * @param args one or more arguments, any type
     */
    get trace() {
        return Logger.trace;
    }

    /**
     * @description The environment is development if the loglevel is higher that ERROR
     * @returns boolean, true if log level is greater than error
     */
    public get devEnvironment() {
        return Logger.devEnvironment;
    }

    /**
     * @description Expose object on the window, for debugging purposes
     * @param object object to expose
     * @param label key for the object on the window
     */
    public exposeGlobal(object: any, label: string) {
        Logger.exposeGlobal(object, label);
    }

    /**
     * @description Call the debugging function (if available)
     */
    public breakpoint() {
        Logger.breakpoint();
    }
}

export default Logger;