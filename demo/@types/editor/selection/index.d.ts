export declare const Selection: {
    /**
     * 选中一个或者一组元素
     * Select one or a group of elements
     *
     * @param type
     * @param uuid
     */
    select(type: string, uuid: string | string[]): any;
    /**
     * 取消一个或者一组元素的选中状态
     * To deselect one or a group of elements
     *
     * @param type
     * @param uuid
     */
    unselect(type: string, uuid: string | string[]): any;
    /**
     * 清空一个类型的所有选中元素
     * Clears all selected elements of a type
     *
     * @param type
     */
    clear(type: string): any;
    /**
     * 更新当前选中的类型数据
     * Updates the currently selected type data
     *
     * @param type
     * @param uuids
     */
    update(type: string, uuids: string[]): any;
    /**
     * 悬停触碰了某个元素
     * Hover touches an element
     * 会发出 selection:hover 的广播消息
     * A broadcast message for selection:hover is issued
     *
     * @param type
     * @param uuid
     */
    hover(type: string, uuid?: string): any;
    /**
     * 获取最后选中的元素的类型
     * Gets the type of the last selected element
     */
    getLastSelectedType(): string;
    /**
     * 获取某个类型内，最后选中的元素
     * Gets the last selected element of a type
     *
     * @param type
     */
    getLastSelected(type: string): string;
    /**
     * 获取一个类型选中的所有元素数组
     * Gets an array of all elements selected for a type
     *
     * @param type
     */
    getSelected(type: string): string[];
};
