import { BrowserWindow, MessageBoxReturnValue, SaveDialogReturnValue, OpenDialogReturnValue } from 'electron';
import { SelectDialogOptions, MessageDialogOptions } from './public/interface';
export declare const Dialog: {
    /**
     * 选择文件弹窗
     * Select the file popover
     *
     * @param options 选择弹窗参数 Select popover parameters
     * @param window 依附于哪个窗口（插件主进程才可使用） Which window it is attached to (only available to the plugin's main process)
     */
    select(options?: SelectDialogOptions, window?: BrowserWindow): Promise<OpenDialogReturnValue>;
    /**
     * 保存文件弹窗
     * Save the file popup
     *
     * @param options 保存文件窗口参数 Save the file window parameters
     * @param window 依附于哪个窗口（插件主进程才可使用） Which window it is attached to (only available to the plugin's main process)
     */
    save(options?: SelectDialogOptions, window?: BrowserWindow): Promise<SaveDialogReturnValue>;
    /**
     * 信息弹窗
     * Information popup window
     *
     * @param message 显示的消息 Displayed message
     * @param options 信息弹窗可选参数 Information popup optional parameter
     * @param window 依附于哪个窗口（插件主进程才可使用） Which window it is attached to (only available to the plugin's main process)
     */
    info(message: string, options?: MessageDialogOptions, window?: BrowserWindow): Promise<MessageBoxReturnValue>;
    /**
     * 警告弹窗
     * Warning popup
     *
     * @param message 警告信息 Warning message
     * @param options 警告弹窗可选参数 Warning popover optional parameter
     * @param window 依附于哪个窗口（插件主进程才可使用） Which window it is attached to (only available to the plugin's main process)
     */
    warn(message: string, options?: MessageDialogOptions, window?: BrowserWindow): Promise<MessageBoxReturnValue>;
    /**
     * 错误弹窗
     * Error popup window
     *
     * @param message 错误信息 The error message
     * @param options 错误弹窗可选参数 Error popover optional parameter
     * @param window 依附于哪个窗口（插件主进程才可使用） Which window it is attached to (only available to the plugin's main process)
     */
    error(message: string, options?: MessageDialogOptions, window?: BrowserWindow): Promise<MessageBoxReturnValue>;
};
