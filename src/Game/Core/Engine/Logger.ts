export enum LogLevel {
    ERROR,
    WARNING,
    INFO
}

export default class Logger {
    private static _source: string = '';

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

    public static source(source: string): Logger {
        this._source = source;

        return this;
    }

    public static setLevel(level: number) {
        this._level = level;
    }

    private static _log(consoleF: Function, ...args: any[]) {
        console.group(this._identifyLogSource())
        consoleF(...args);
        console.groupEnd();
    }

    public static info(...args: any[]) {
        if (this._level >= LogLevel.INFO) {
            this._log(console.log, ...args);
        }
    }

    public static error(...args: any[]) {
        if (this._level >= LogLevel.ERROR) {
            this._log(console.error, ...args);
        }
    }

    public static warn(...args: any[]) {
        if (this._level >= LogLevel.WARNING) {
            this._log(console.warn, ...args);
        }
    }
    public source(source: string): Logger {
        Logger.source(source);

        return this;
    }

    public setLevel(level: number) {
        Logger.setLevel(level);
    }

    public info(...args: any[]) {
        Logger.info(...args);
    }

    public error(...args: any[]) {
        Logger.error(...args);
    }

    public warn(...args: any[]) {
        Logger.warn(...args);
    }
}
