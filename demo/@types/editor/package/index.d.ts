import { GetPackageOptions, PathType } from './public/interface';
export declare const Package: {
    /**
     * 查询插件列表
     * Query Plug-in List
     *
     * @param options
     */
    getPackages(options?: GetPackageOptions): Editor.Interface.PackageInfo[];
    /**
     * 注册一个插件
     * Register a plug-in
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param path
     */
    register(path: string): any;
    /**
     * 反注册一个插件
     * Unregister a plug-in
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param path
     */
    unregister(path: string): any;
    /**
     * 启动一个插件
     * Enable a plug-in
     *
     * @param path
     */
    enable(path: string): any;
    /**
     * 关闭一个插件
     * Disable a plug-in
     *
     * @param path
     */
    disable(path: string, options: any): any;
    /**
     * 获取一个插件的几个预制目录地址
     * Gets several prefab directory addresses for a plug-in
     *
     * @param extensionName 扩展的名字 Name of the extension
     * @param type 地址类型（temp 临时目录，data 需要同步的数据目录,不传则返回现在打开的插件路径） Address type (temp temporary directory, data need to synchronize data directory, do not pass to return the current open plug-in path)
     */
    getPath(extensionName: string, type?: PathType): any;
    /**
     * 监听插件事件
     * Listening for plug-in events
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param action
     * @param handle
     */
    on(action: string, handle: Function): any;
    /**
     * 监听一次插件事件
     * Listen for a plug-in event
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param action
     * @param handle
     */
    once(action: string, handle: Function): any;
    /**
     * 移除监听插件的事件
     * Event to remove the listener plug-in
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param action
     * @param handle
     */
    removeListener(action: string, handle: Function): any;
};
