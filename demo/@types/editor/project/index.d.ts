export declare const Project: {
    /**
     * 创建一个项目
     * Creating a project
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     */
    create(): any;
    /**
     * 打开一个项目
     * Open a project
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param path
     */
    open(path?: string): Promise<any>;
    /**
     * 添加一个项目
     * Add a project
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     *
     * @param path
     */
    add(path: string): any;
    /**
     * 当前项目路径
     * Current project path
     */
    readonly path: string;
    /**
     * 当前项目 uuid
     * The current project UUID
     */
    readonly uuid: string;
    /**
     * 当前项目临时文件夹
     * Temporary folder for current project
     */
    readonly tmpDir: string;
    /**
     * 当前项目类型
     * 谨慎使用，之后会被移除
     * Use with caution and it will be removed later
     */
    readonly type: "2d" | "3d";
};
