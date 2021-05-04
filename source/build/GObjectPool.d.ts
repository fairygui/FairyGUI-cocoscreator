import { GObject } from "./GObject";
export declare class GObjectPool {
    private _pool;
    private _count;
    constructor();
    clear(): void;
    get count(): number;
    getObject(url: string): GObject;
    returnObject(obj: GObject): void;
}
