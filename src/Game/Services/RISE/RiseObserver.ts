

interface RiseObserver {
    on(event: string, listener: Function): void;
    once(event: string, listener: Function): void;
    emit(event: string, data?: any): void;
    listeners(event: string): void;
    setMaxListeners(num: number): void;
    removeListener(event: string, listener: Function): void;
    removeAllListener(event: string): void;
    postToRise(data: any): void;
}

export default RiseObserver;