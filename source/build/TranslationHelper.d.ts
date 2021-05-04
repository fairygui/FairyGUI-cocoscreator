import { PackageItem } from "./PackageItem";
export declare class TranslationHelper {
    static strings: {
        [index: string]: {
            [index: string]: string;
        };
    };
    static loadFromXML(source: string): void;
    static translateComponent(item: PackageItem): void;
}
