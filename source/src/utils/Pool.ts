export class Pool<T extends Object>
{
    pool: Array<T> = [];
    _init?: (arg0: T, ...argArray: any[]) => void;
    _reset?: (arg0: T) => void;
    _ct: new () => T;

    public constructor(type: new () => T, init?: (arg0: T) => void, reset?: (arg0: T) => void) {
        this._init = init;
        this._reset = reset;
        this._ct = type;
    }

    public borrow(...argArray: any[]): T {
        let ret: T;
        if (this.pool.length > 0)
            ret = this.pool.pop();
        else
            ret = new this._ct();

        if (this._init)
            this._init(ret, ...argArray);

        return ret;
    }

    public returns(element: T | Array<T>) {
        if (Array.isArray(element)) {
            let count = element.length;
            for (let i = 0; i < count; i++) {
                let element2 = element[i];
                if (this._reset)
                    this._reset(element2);
                this.pool.push(element2);
            }
            element.length = 0;
        }
        else {
            if (this._reset)
                this._reset(element);
            this.pool.push(element);
        }
    }
}