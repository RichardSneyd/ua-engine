import { match } from "assert";

class Logger {
    private _source: string = '';

    public readonly ERROR = 0;
    public readonly WARNING = 1;
    public readonly INFO = 2;
    private _level: number = this.INFO;

    private constructor() { }

    private _identifyLogSource(): string {
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

    public source(origin: string): Logger {
        this._source = origin;

        return this;
    }

    public setLevel(level: number) {
        this._level = level;
    }

    private _log(consoleF: Function, ...args: any[]) {
        console.group(this._identifyLogSource())
        consoleF(...args);
        console.groupEnd();
    }

    public info(...args: any[]) {
        if (this._level <= this.INFO) {
            this._log(console.log, ...args);
        }
    }

    public error(...args: any[]) {
        if (this._level <= this.ERROR) {
            this._log(console.error, ...args);
        }
    }

    public warn(...args: any[]) {
        if (this._level <= this.WARNING) {
            this._log(console.warn, ...args);
        }
    }
}

export default Logger;
