/// <reference types="electron" />
/// <reference types="../message" />
/// <reference types="node" />
/// <reference types="../extension" />
export declare class BaseEditor {
    get remote(): any;
    Dialog: {
        select(options?: import("./dialog/public/interface").SelectDialogOptions, window?: Electron.BrowserWindow): Promise<Electron.OpenDialogReturnValue>;
        save(options?: import("./dialog/public/interface").SelectDialogOptions, window?: Electron.BrowserWindow): Promise<Electron.SaveDialogReturnValue>;
        info(message: string, options?: import("./dialog/public/interface").MessageDialogOptions, window?: Electron.BrowserWindow): Promise<Electron.MessageBoxReturnValue>;
        warn(message: string, options?: import("./dialog/public/interface").MessageDialogOptions, window?: Electron.BrowserWindow): Promise<Electron.MessageBoxReturnValue>;
        error(message: string, options?: import("./dialog/public/interface").MessageDialogOptions, window?: Electron.BrowserWindow): Promise<Electron.MessageBoxReturnValue>;
    };
    EditMode: {
        enter(mode: string): any;
        getMode(): string;
    };
    I18n: {
        getLanguage(): any;
        t(key: string, obj?: {
            [key: string]: string;
        }): any;
        select(language: string): any;
        register(language: string, key: string, map: import("./i18n").I18nMap): void;
    };
    Message: {
        request<J extends string, K extends keyof EditorMessageMaps[J]>(name: J, message: K, ...args: EditorMessageMaps[J][K]["params"]): Promise<EditorMessageMaps[J][K]["result"]>;
        send<M extends string, N extends keyof EditorMessageMaps[M]>(name: M, message: N, ...args: EditorMessageMaps[M][N]["params"]): void;
        broadcast(message: string, ...args: any[]): void;
        addBroadcastListener(message: string, func: Function): any;
        removeBroadcastListener(message: string, func: Function): any;
        __register__(name: string, messageInfo: {
            [message: string]: import("./message/public/interface").MessageInfo;
        }): any;
        __unregister__(name: string): any;
        __eb__: import("events").EventEmitter;
    };
    Layout: {
        apply(json: any): any;
        init(): any;
    };
    Logger: {
        clear(): any;
        query(): any;
        on(action: string, handle: Function): any;
        once(action: string, handle: Function): any;
        removeListener(action: string, handle: Function): any;
    };
    Menu: {
        add(path: string, options: import("./menu/public/interface").BaseMenuItem): any;
        remove(path: string, options: import("./menu/public/interface").BaseMenuItem): any;
        get(path: string): any;
        apply(): any;
        popup(json: import("./menu/public/interface").PopupOptions): any;
        addGroup(path: string, name: string, order: number): any;
        removeGroup(path: string, name: string): any;
        registerTemplate(name: string, template: import("./menu/public/interface").MenuTemplateItem[]): any;
        unregisterTemplate(name: string): any;
    };
    Metrics: {
        trackEvent(info: import("./metrics/public/interface").trackEventInfo): any;
        trackException(info: import("./metrics/public/interface").trackExceptionInfo): any;
    };
    Network: {
        queryIPList(): string[];
        testConnectServer(): Promise<boolean>;
        portIsOccupied(port: number): Promise<boolean>;
        testHost(ip: string): Promise<boolean>;
        get(url: string, data?: {
            [index: string]: string | string[];
        }): Promise<Buffer>;
        post(url: string, data?: {
            [index: string]: string | number | string[];
        }): Promise<Buffer>;
    };
    Package: {
        getPackages(options?: import("./package/public/interface").GetPackageOptions): Editor.Interface.PackageInfo[];
        register(path: string): any;
        unregister(path: string): any;
        enable(path: string): any;
        disable(path: string, options: any): any;
        getPath(extensionName: string, type?: import("./package/public/interface").PathType): any;
        on(action: string, handle: Function): any;
        once(action: string, handle: Function): any;
        removeListener(action: string, handle: Function): any;
    };
    Panel: {
        _kitControl: any;
        open(name: string, ...args: any[]): any;
        close(name: string): any;
        focus(name: string): any;
        has(name: string): Promise<boolean>;
    };
    Profile: {
        getConfig(name: string, key?: string, type?: import("./profile/public/interface").preferencesProtocol): Promise<any>;
        setConfig(name: string, key: string, value: any, type?: import("./profile/public/interface").preferencesProtocol): Promise<void>;
        removeConfig(name: string, key: string, type?: import("./profile/public/interface").preferencesProtocol): Promise<void>;
        getProject(name: string, key?: string, type?: import("./profile/public/interface").projectProtocol): Promise<any>;
        setProject(name: string, key: string, value: any, type?: import("./profile/public/interface").projectProtocol): Promise<void>;
        removeProject(name: string, key: string, type?: import("./profile/public/interface").projectProtocol): Promise<void>;
        getTemp(name: string, key?: string): Promise<any>;
        setTemp(name: string, key: string, value: any): Promise<void>;
        removeTemp(name: string, key: string): Promise<void>;
        on(action: string, handle: Function): any;
        once(action: string, handle: Function): any;
        removeListener(action: string, handle: Function): any;
    };
    Project: {
        create(): any;
        open(path?: string): Promise<any>;
        add(path: string): any;
        readonly path: string;
        readonly uuid: string;
        readonly tmpDir: string;
        readonly type: "2d" | "3d";
    };
    Selection: {
        select(type: string, uuid: string | string[]): any;
        unselect(type: string, uuid: string | string[]): any;
        clear(type: string): any;
        update(type: string, uuids: string[]): any;
        hover(type: string, uuid?: string): any;
        getLastSelectedType(): string;
        getLastSelected(type: string): string;
        getSelected(type: string): string[];
    };
    Task: {
        addSyncTask(title: string, describe?: string, message?: string): any;
        updateSyncTask(title: string, describe?: string, message?: string): any;
        removeSyncTask(title: string): any;
        addNotice(options: import("./task/public/interface").NoticeOptions): any;
        removeNotice(id: number): any;
        changeNoticeTimeout(id: number, time: number): any;
        queryNotices(): any;
        sync(): any;
    };
    Theme: {
        getList(): any;
        use(name?: string): any;
    };
    UI: {
        register(tagName: string, element: any): void;
        Base: any;
        Button: any;
        Input: any;
        NumInput: any;
        Loading: any;
        Checkbox: any;
        Section: any;
        Select: any;
        Bit: any;
        Slider: any;
        ColorPicker: any;
        Color: any;
        DragItem: any;
        DragArea: any;
        DragObject: any;
        Prop: any;
        Tooltip: any;
        TextArea: any;
        Progress: any;
        Label: any;
        Code: any;
        Tab: any;
        Gradient: any;
        GradientPicker: any;
        Icon: any;
        File: any;
        Link: any;
        Image: any;
        QRCode: any;
        Markdown: any;
    };
    User: {
        skip(): any;
        getData(): Promise<import("./user").UserData>;
        isLoggedIn(): Promise<boolean>;
        login(username: string, password: string): Promise<import("./user").UserData>;
        logout(): void;
        getUserToken(): Promise<string>;
        getSessionCode(extensionId: number): Promise<string>;
        showMask(): void;
        hideMask(): void;
        on(action: string, handle: Function): any;
        once(action: string, handle: Function): any;
        removeListener(action: string, handle: Function): any;
    };
    Utils: {
        File: typeof import("./utils/source/file");
        Path: typeof import("./utils/source/path");
        Math: typeof import("./utils/source/math");
        Parse: typeof import("./utils/source/parse");
        Url: typeof import("./utils/source/url");
    };
    App: {
        userAgent: string;
        readonly dev: boolean;
        readonly version: string;
        readonly home: string;
        readonly path: string;
        readonly temp: string;
        readonly icon: string;
        readonly urls: {
            manual: string;
            api: string;
            forum: string;
        };
        quit(): void;
    };
    Startup: {
        ready: {
            readonly window: any;
            readonly package: any;
        };
        window(): Promise<void>;
        manager(skipLogin: boolean): Promise<void>;
        package(): Promise<void>;
        build(options: any, debug: boolean): Promise<any>;
        on(action: string, handle: Function): any;
        removeListener(action: string, handle: Function): any;
        once(action: string, handle: Function): any;
    };
    Clipboard: {
        read(type: string): any;
        write(type: string, value: any): boolean;
        has(type: string): boolean;
        clear(): void;
    };
}
declare global {
    const Editor: BaseEditor;
}
