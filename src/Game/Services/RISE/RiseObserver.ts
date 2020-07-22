

interface RiseObserver {
    on(event: string, listener: Function): void;
    once(event: string, listener: Function): void;
    emit(event: string): void;
    listeners(event: string): void;
    setMaxListeners(num: number): void;
    removeListener(event: string, listener: Function): void;
    removeAllListener(event: string): void;
}

export default RiseObserver;