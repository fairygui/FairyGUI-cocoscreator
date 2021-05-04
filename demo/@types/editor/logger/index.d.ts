export declare const Logger: {
    /**
     * 清空所有的日志
     * Clear all logs
     */
    clear(): any;
    /**
     * 查询所有日志
     * Query all logs
     */
    query(): any;
    /**
     * 监听 Logger 内发送的事件
     * Listeners for events sent in the Logger
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param action 监听动作 Monitor actions
     * @param handle 处理函数 The processing function
     */
    on(action: string, handle: Function): any;
    /**
     * 监听 Logger 内发送的事件
     * Listeners for events sent in the Logger
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param action 监听动作 Monitor actions
     * @param handle 处理函数 The processing function
     */
    once(action: string, handle: Function): any;
    /**
     * 移除监听的事件
     * Removes listener event
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param action 监听动作 Monitor actions
     * @param handle 处理函数 The processing function
     */
    removeListener(action: string, handle: Function): any;
};
