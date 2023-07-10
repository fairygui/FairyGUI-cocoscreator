import { Asset, AssetManager } from "cc";
import { GObject } from "./GObject";
import { PackageItem } from "./PackageItem";
type PackageDependency = {
    id: string;
    name: string;
};
export declare class UIPackage {
    private _id;
    private _name;
    private _path;
    private _items;
    private _itemsById;
    private _itemsByName;
    private _sprites;
    private _dependencies;
    private _branches;
    _branchIndex: number;
    private _bundle;
    constructor();
    static get branch(): string | null;
    static set branch(value: string | null);
    static getVar(key: string): string | null;
    static setVar(key: string, value: string | null): void;
    static getById(id: string): UIPackage;
    static getByName(name: string): UIPackage;
    /**
     * 注册一个包。包的所有资源必须放在resources下，且已经预加载。
     * @param path 相对 resources 的路径。
     */
    static addPackage(path: string): UIPackage;
    /**
     * 载入一个包。包的资源从Asset Bundle加载.
     * @param bundle Asset Bundle 对象.
     * @param path 资源相对 Asset Bundle 目录的路径.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(bundle: AssetManager.Bundle, path: string, onComplete?: (error: any, pkg: UIPackage) => void): void;
    /**
     * 载入一个包。包的资源从Asset Bundle加载.
     * @param bundle Asset Bundle 对象.
     * @param path 资源相对 Asset Bundle 目录的路径.
     * @param onProgress 加载进度回调.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(bundle: AssetManager.Bundle, path: string, onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void, onComplete?: (error: any, pkg: UIPackage) => void): void;
    /**
     * 载入一个包。包的资源从resources加载.
     * @param path 资源相对 resources 的路径.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(path: string, onComplete?: (error: any, pkg: UIPackage) => void): void;
    /**
     * 载入一个包。包的资源从resources加载.
     * @param path 资源相对 resources 的路径.
     * @param onProgress 加载进度回调.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(path: string, onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void, onComplete?: (error: Error, pkg: UIPackage) => void): void;
    static removePackage(packageIdOrName: string): void;
    static createObject(pkgName: string, resName: string, userClass?: new () => GObject): GObject;
    static createObjectFromURL(url: string, userClass?: new () => GObject): GObject;
    static getItemURL(pkgName: string, resName: string): string;
    static getItemByURL(url: string): PackageItem;
    static normalizeURL(url: string): string;
    static setStringsSource(source: string): void;
    private loadPackage;
    dispose(): void;
    get id(): string;
    get name(): string;
    get path(): string;
    get dependencies(): Array<PackageDependency>;
    createObject(resName: string, userClass?: new () => GObject): GObject;
    internalCreateObject(item: PackageItem, userClass?: new () => GObject): GObject;
    getItemById(itemId: string): PackageItem;
    getItemByName(resName: string): PackageItem;
    getItemAssetByName(resName: string): Asset;
    getItemAsset(item: PackageItem): Asset;
    getItemAssetAsync(item: PackageItem, onComplete?: (err: Error, item: PackageItem) => void): void;
    loadAllAssets(): void;
    private loadMovieClip;
    private loadFont;
    private loadSpine;
    private loadDragonBones;
}
export interface IObjectFactoryType {
    resolveExtension(pi: PackageItem): void;
    newObject(type: number | PackageItem, userClass?: new () => GObject): GObject;
}
export declare var Decls: {
    UIObjectFactory?: IObjectFactoryType;
};
export {};
