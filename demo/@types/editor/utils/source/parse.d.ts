interface WhenParam {
    PanelName?: string;
    EditMode?: string;
}
/**
 * 解析 when 参数
 * when 的格式：
 *     PanelName === '' && EditMode === ''
 * 整理后的数据格式：
 *     {
 *         PanelName: '',
 *         EditMode: '',
 *     }
 */
export declare function when(when: string): WhenParam;
/**
 * 判断一个 when 数据是否符合当前条件
 * @param when
 */
export declare function checkWhen(when: string): boolean;
export {};
