export interface GetPackageOptions {
    name?: string;
    debug?: boolean;
    path?: string;
    enable?: boolean;
    invalid?: boolean;
}
export interface PackageJson {
    author?: string;
    debug?: boolean;
    description?: string;
    main?: string;
    menu?: any;
    name: string;
    version: string;
    windows: string;
    editor?: string;
    panel?: any;
}
export declare type PathType = 'home' | 'data' | 'temp';
