import { GObject } from "./GObject";
export declare class AsyncOperation {
    callback: (obj: GObject) => void;
    private _node;
    createObject(pkgName: string, resName: string): void;
    createObjectFromURL(url: string): void;
    cancel(): void;
    private internalCreateObject;
    private completed;
}
