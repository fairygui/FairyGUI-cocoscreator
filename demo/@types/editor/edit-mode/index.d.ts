export declare const EditMode: {
    /**
     * 标记编辑器进入了一种编辑模式
     * The tag editor goes into an edit mode
     *
     * @param mode 编辑模式的名字 The name of the edit mode
     */
    enter(mode: string): any;
    /**
     * 当前所处的编辑模式
     * The current editing mode
     *
     */
    getMode(): string;
};
