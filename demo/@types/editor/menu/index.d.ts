import { BaseMenuItem, MenuTemplateItem, PopupOptions } from './public/interface';
export declare const Menu: {
    /**
     * 添加一个菜单
     * Add a menu
     * 只有主进程可以使用
     * Only the main process can use it
     *
     * @param path
     * @param options
     */
    add(path: string, options: BaseMenuItem): any;
    /**
     * 删除一个菜单
     * Delete a menu
     * 只有主进程可以使用
     * Only the main process can use it
     *
     * @param path
     * @param options
     */
    remove(path: string, options: BaseMenuItem): any;
    /**
     * 获取一个菜单对象
     * Gets a menu object
     * 只有主进程可以使用
     * Only the main process can use it
     *
     * @param path
     */
    get(path: string): any;
    /**
     * 应用之前的菜单修改
     * Apply the previous menu changes
     * 只有主进程可以使用
     * Only the main process can use it
     */
    apply(): any;
    /**
     * 右键弹窗
     * Right-click pop-up
     * 只有面板进程可以使用
     * Only panel processes can be used
     *
     * @param json
     */
    popup(json: PopupOptions): any;
    /**
     * 添加分组信息
     * Add grouping information
     *
     * @param path
     * @param name
     * @param order
     */
    addGroup(path: string, name: string, order: number): any;
    /**
     * 删除分组信息
     * Delete grouping information
     *
     * @param path
     * @param name
     */
    removeGroup(path: string, name: string): any;
    /**
     * 注册菜单模版
     * Register the menu template
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param name
     * @param template
     */
    registerTemplate(name: string, template: MenuTemplateItem[]): any;
    /**
     * 移除菜单模版
     * Remove menu template
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param name
     */
    unregisterTemplate(name: string): any;
};
