enum LogLevel {
    ERROR,
    WARNING,
    INFO
}

class Logger {
    static LEVELS = LogLevel;
    private static _source: string = '';
    private static _previousSource: string = '';
    private static _level: number = LogLevel.INFO;

    private static _identifyLogSource(): string {
        if (!this._source) {
            let stack = Error().stack + '';
            let files = stack.match(/\w+\.ts|\w+\.js/g);
            files = (files) ? files : [];

            if (files.length > 3) {
                this._source = files[3];
            }
        }

        let source = this._source;
        this._source = '';
        return source;
    }

    /**
     * @description Set a group text instead of the default one
     * @param source string to set as message group
     * @returns Logger, to allow chain a print method after
     */
    public static source(source: string): Logger {
        this._source = source;

        return this;
    }

    /**
     * @description Change the highest log level that can be printed.
     * @param level from the LogLevel enum, ERROR, WARNING or INFO
     */
    public static setLevel(level: number) {
        this._level = level;
    }

    private static _log(consoleF: Function, ...args: any[]) {
        let groupName = this._identifyLogSource();
        if(groupName != this._previousSource) {
            console.groupEnd();
            console.group(groupName);
            this._previousSource = groupName;
        }
        consoleF(...args);
    }

    /**
     * @description Logs a message in the browser console using console.log
     * @param args one or more arguments, any type
     */
    public static info(...args: any[]) {
        if (this._level >= LogLevel.INFO) {
            this._log(console.log, ...args);
        }
    }

    /**
     * @description Logs a message in the browser console using console.error
     * @param args one or more arguments, any type
     */
    public static error(...args: any[]) {
        if (this._level >= LogLevel.ERROR) {
            this._log(console.error, ...args);
        }
    }

    /**
     * @description Logs a message in the browser console using console.warn
     * @param args one or more arguments, any type
     */
    public static warn(...args: any[]) {
        if (this._level >= LogLevel.WARNING) {
            this._log(console.warn, ...args);
        }
    }

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
        if(this.devEnvironment) {
            (<any>window)[label] = object;
        }
    }

    /**
     * @description Call the debugging function (if available)
     */
    public static breakpoint() {
        if(this.devEnvironment) {
            debugger;
        }
    }

    // From here onward all static methods are repeated as non-static ones.
    // This is to allow its use in other projects by doing UAE.log...

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
    public info(...args: any[]) {
        Logger.info(...args);
    }

    /**
     * @description Logs a message in the browser console using console.error
     * @param args one or more arguments, any type
     */
    public error(...args: any[]) {
        Logger.error(...args);
    }

    /**
     * @description Logs a message in the browser console using console.warn
     * @param args one or more arguments, any type
     */
    public warn(...args: any[]) {
        Logger.warn(...args);
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
        if(this.devEnvironment) {
            debugger;
        }
    }
}

export default Logger;