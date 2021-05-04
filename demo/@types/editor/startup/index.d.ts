export declare const Startup: {
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
