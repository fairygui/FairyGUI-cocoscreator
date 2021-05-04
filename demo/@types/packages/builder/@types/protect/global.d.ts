import { IInternalBuild } from ".";

// 定义 builder 进程内的全局变量
declare global {
    // @ts-ignore
    const Build: IInternalBuild;
    const __manager: {
        taskManager: any;
        currentCompileTask: any;
        currentBuildTask: any;
        __taskId: string;
    };
}
