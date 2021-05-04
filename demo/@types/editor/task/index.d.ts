import { NoticeOptions } from './public/interface';
export declare const Task: {
    /**
     * 添加一个同步任务
     * Add a synchronous task
     * 会在主窗口显示一个遮罩层
     * A mask layer is displayed in the main window
     *
     * @param title 任务名字 The task name
     * @param describe 任务描述 Task description
     * @param message 任务内容 Content of the task
     */
    addSyncTask(title: string, describe?: string, message?: string): any;
    /**
     * 更新某一个同步任务显示的数据
     * Update the data displayed by a synchronous task
     *
     * @param title 任务名字 The task name
     * @param describe 任务描述 Task description
     * @param message 任务内容 Content of the task
     */
    updateSyncTask(title: string, describe?: string, message?: string): any;
    /**
     * 删除一个同步任务
     * Delete a synchronous task
     *
     * @param title 任务的名字 The name of the task
     */
    removeSyncTask(title: string): any;
    /**
     * 添加一个通知
     * Add a notification
     *
     * @param options 消息配置 Message configuration
     */
    addNotice(options: NoticeOptions): any;
    /**
     * 删除一个通知
     * Delete a notification
     *
     * @param id 通知 id Notification ID
     */
    removeNotice(id: number): any;
    /**
     * 修改 notice 自动移除的时间
     * Modify notice automatic removal time
     *
     * @param id 通知 id Notification ID
     * @param time 超时时间 timeout
     */
    changeNoticeTimeout(id: number, time: number): any;
    /**
     * 查询所有通知
     * Query all notifications
     */
    queryNotices(): any;
    /**
     * 页面进程立即同步一次主进程数据
     * The page process synchronizes the master process data immediately
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     */
    sync(): any;
};
