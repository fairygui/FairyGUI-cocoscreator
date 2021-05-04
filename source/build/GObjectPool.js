import { UIPackage } from "./UIPackage";
export class GObjectPool {
    constructor() {
        this._count = 0;
        this._pool = {};
    }
    clear() {
        for (var i1 in this._pool) {
            var arr = this._pool[i1];
            var cnt = arr.length;
            for (var i = 0; i < cnt; i++)
                arr[i].dispose();
        }
        this._pool = {};
        this._count = 0;
    }
    get count() {
        return this._count;
    }
    getObject(url) {
        url = UIPackage.normalizeURL(url);
        if (url == null)
            return null;
        var arr = this._pool[url];
        if (arr && arr.length) {
            this._count--;
            return arr.shift();
        }
        var child = UIPackage.createObjectFromURL(url);
        return child;
    }
    returnObject(obj) {
        var url = obj.resourceURL;
        if (!url)
            return;
        var arr = this._pool[url];
        if (arr == null) {
            arr = new Array();
            this._pool[url] = arr;
        }
        this._count++;
        arr.push(obj);
    }
}
