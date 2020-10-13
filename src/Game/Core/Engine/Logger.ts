export enum LogLevel {
    ERROR,
    WARNING,
    INFO
}

export default class Logger {
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
     * @description set a group text instead of the default one
     * @param source string to set as message group
     * @returns Logger, to allow chain a print method after
     */
    public static source(source: string): Logger {
        this._source = source;

        return this;
    }

    /**
     * @description change the highest log level that can be printed.
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
     * @description logs a message in the browser console using console.log
     * @param args one or more arguments, any type
     */
    public static info(...args: any[]) {
        if (this._level >= LogLevel.INFO) {
            this._log(console.log, ...args);
        }
    }

    /**
     * @description logs a message in the browser console using console.error
     * @param args one or more arguments, any type
     */
    public static error(...args: any[]) {
        if (this._level >= LogLevel.ERROR) {
            this._log(console.error, ...args);
        }
    }

    /**
     * @description logs a message in the browser console using console.warn
     * @param args one or more arguments, any type
     */
    public static warn(...args: any[]) {
        if (this._level >= LogLevel.WARNING) {
            this._log(console.warn, ...args);
        }
    }

    /**
     * @description we assume we are in development environment if we can print warnings and info messages
     * @returns boolean, true if log level is greater than error
     */
    public static get inDevEnvironment() {
        return (Logger._level > LogLevel.ERROR);
    }

    /**
     * @description expose object on the window, for debugging purposes
     * @param object object we want to expose
     * @param label key for the object
     */
    public static exposeGlobal(object: any, label: string) {
        if(this.inDevEnvironment) {
            (<any>window)[label] = object;
        }
    }

    // From here onward all static methods are repeated as non-static ones.
    // This is to allow its use in other projects by doing UAE.log...

    /**
     * @description set a group text instead of the default one
     * @param source string to set as message group
     * @returns Logger, to allow chain a print method after
     */
    public source(source: string): Logger {
        Logger.source(source);

        return this;
    }

    /**
     * @description change the highest log level that can be printed.
     * @param level from the LogLevel enum, ERROR, WARNING or INFO
     */
    public setLevel(level: number) {
        Logger.setLevel(level);
    }

    /**
     * @description logs a message in the browser console using console.log
     * @param args one or more arguments, any type
     */
    public info(...args: any[]) {
        Logger.info(...args);
    }

    /**
     * @description logs a message in the browser console using console.error
     * @param args one or more arguments, any type
     */
    public error(...args: any[]) {
        Logger.error(...args);
    }

    /**
     * @description logs a message in the browser console using console.warn
     * @param args one or more arguments, any type
     */
    public warn(...args: any[]) {
        Logger.warn(...args);
    }

    /**
     * @description we assume we are in development environment if we can print warnings and info messages
     * @returns boolean, true if log level is greater than error
     */
    public get inDevEnvironment() {
        return Logger.inDevEnvironment;
    }

    /**
     * @description expose object on the window, for debugging purposes
     * @param object object we want to expose
     * @param label key for the object
     */
    public exposeGlobal(object: any, label: string) {
        Logger.exposeGlobal(object, label);
    }
}
