export class Pool {
    constructor(type, init, reset) {
        this.pool = [];
        this._init = init;
        this._reset = reset;
        this._ct = type;
    }
    borrow(...argArray) {
        let ret;
        if (this.pool.length > 0)
            ret = this.pool.pop();
        else
            ret = new this._ct();
        if (this._init)
            this._init(ret, ...argArray);
        return ret;
    }
    returns(element) {
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
