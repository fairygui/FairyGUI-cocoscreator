import { GComponent } from "./GComponent";
import { GLoader } from "./GLoader";
import { GObject } from "./GObject";
import { PackageItem } from "./PackageItem";
export declare class UIObjectFactory {
    static counter: number;
    static extensions: {
        [index: string]: new () => GComponent;
    };
    static loaderType: new () => GLoader;
    constructor();
    static setExtension(url: string, type: new () => GComponent): void;
    static setLoaderExtension(type: new () => GLoader): void;
    static resolveExtension(pi: PackageItem): void;
    static newObject(type: number | PackageItem, userClass?: new () => GObject): GObject;
}
