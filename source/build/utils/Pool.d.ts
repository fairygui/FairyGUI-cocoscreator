export declare class Pool<T extends Object> {
    pool: Array<T>;
    _init?: (arg0: T, ...argArray: any[]) => void;
    _reset?: (arg0: T) => void;
    _ct: new () => T;
    constructor(type: new () => T, init?: (arg0: T) => void, reset?: (arg0: T) => void);
    borrow(...argArray: any[]): T;
    returns(element: T | Array<T>): void;
}
