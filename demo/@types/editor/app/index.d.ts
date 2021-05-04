export declare const App: {
    userAgent: string;
    /**
     * 是否是开发模式
     * Development mode
     */
    readonly dev: boolean;
    /**
     * 编辑器版本号
     * Editor version
     */
    readonly version: string;
    /**
     * 主目录
     * Home directory
     */
    readonly home: string;
    /**
     * 编辑器程序文件夹
     * Program folder
     */
    readonly path: string;
    /**
     * 获取当前编辑器的临时缓存目录
     * Temporary cache directory
     */
    readonly temp: string;
    /**
     * 获取当前编辑器 icon 地址
     * Gets the icon address of the current editor
     */
    readonly icon: string;
    /**
     * 获取当前编辑器使用的 url 地址
     * Gets the URL used by the current editor
     */
    readonly urls: {
        manual: string;
        api: string;
        forum: string;
    };
    /**
     * 退出程序
     * Exit the program
     */
    quit(): void;
};
