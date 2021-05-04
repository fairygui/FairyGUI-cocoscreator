declare type ICopyType = 'image' | 'text' | 'files' | string;
export declare const Clipboard: {
    /**
     * 获取剪贴板内容
     * @param type
     */
    read(type: ICopyType): any;
    /**
     * 写入剪贴板内容
     * @param type
     * @param value
     */
    write(type: ICopyType, value: any): boolean;
    /**
     * 判断当前剪贴板内是否是指定类型
     * @param type
     */
    has(type: ICopyType): boolean;
    /**
     * 清空剪贴板
     */
    clear(): void;
};
export {};
