export interface UserData {
    session_id: string;
    session_key: string;
    cocos_uid: string;
    email: string;
    nickname: string;
}
export declare const User: {
    /**
     * 跳过 User
     * Skip the User
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     */
    skip(): any;
    /**
     * 获取 user 数据
     * Get user data
     */
    getData(): Promise<UserData>;
    /**
     * 检查用户是否登陆
     * Check if the user is logged in
     */
    isLoggedIn(): Promise<boolean>;
    /**
     * 用户登陆
     * The user login
     * 失败会抛出异常
     * Failure throws an exception
     *
     * @param username
     * @param password
     */
    login(username: string, password: string): Promise<UserData>;
    /**
     * 退出登陆
     * Logged out
     * 失败会抛出异常
     * Failure throws an exception
     */
    logout(): void;
    /**
     * 获取用户 token
     * Get user token
     * 失败会抛出异常
     * Failure throws an exception
     */
    getUserToken(): Promise<string>;
    /**
     * 根据插件 id 返回 session code
     * Returns the session code based on the plug-in ID
     *
     * @param extensionId
     */
    getSessionCode(extensionId: number): Promise<string>;
    /**
     * 显示用户登陆遮罩层
     * Shows user login mask layer
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     */
    showMask(): void;
    /**
     * 隐藏用户登陆遮罩层
     * Hide user login mask layer
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     */
    hideMask(): void;
    /**
     * 监听事件
     * Listen for an event
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     * @param action
     * @param handle
     */
    on(action: string, handle: Function): any;
    /**
     * 监听一次事件
     * Listening for one event
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     * @param action
     * @param handle
     */
    once(action: string, handle: Function): any;
    /**
     * 取消已经监听的事件
     * Cancels the event you are listening for
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     * @param action
     * @param handle
     */
    removeListener(action: string, handle: Function): any;
};
