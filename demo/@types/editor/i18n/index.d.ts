export declare type I18nMap = {
    [key: string]: I18nMap | string;
};
export declare const I18n: {
    /**
     * 获取当前的语言
     * Get the current language
     */
    getLanguage(): any;
    /**
     * 传入 key，翻译成当前语言
     * Passing in the key translates into the current language
     * 允许翻译变量 {a}，传入的第二个参数 obj 内定义 a
     * The translation variable {a} is allowed, and a is defined in the second argument passed in obj
     *
     * @param key 用于翻译的 key 值 The key value for translation
     * @param obj 翻译字段内如果有 {key} 等可以在这里传入替换字段 If you have {key} in the translation field, you can pass in the replacement field here
     */
    t(key: string, obj?: {
        [key: string]: string;
    }): any;
    /**
     * 选择一种翻译语言
     * Choose a translation language
     *
     * @param language 选择当前使用的语言 Select the language currently in use
     */
    select(language: string): any;
    /**
     * 动态注册 i18n 数据
     * Dynamic registration of i18n data
     *
     * @param language 语言 language
     * @param key 翻译路径 Translation path
     * @param map 翻译表 Translation table
     */
    register(language: string, key: string, map: I18nMap): void;
};
