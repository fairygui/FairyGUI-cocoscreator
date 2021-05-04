import { IBuild, IBuildUtils, ITaskState } from '../public';
import { InternalBuildResult } from './build-result';

export * from './asset-manager';
export * from './texture-compress';
export * from './import-map';
export * from './options';
export * from './build-result';
export * from './build-plugin';
export * from '../public';

export type Physics = 'cannon' | 'ammo' | 'builtin';
export type Url = string; // 需要的是符合 url 标准的字符串
export type AssetInfoArr = Array<string | number>; // 固定两位或三位数组 [url,ccType,isSubAsset]
export type IProcessingFunc = (process: number, message: string, state?: ITaskState) => void;
export interface IBuildManager {
    taskManager: any;
    currentCompileTask: any;
    currentBuildTask: any;
    __taskId: string;
}

export interface IInternalBuildUtils extends IBuildUtils {
    /**
     * 获取构建出的所有模块或者模块包文件。
     */
    getModuleFiles(result: InternalBuildResult): Promise<string[]>;
}

export interface IInternalBuild extends IBuild {
    Utils: IInternalBuildUtils;
}

export interface IBuildProcessInfo {
    state: ITaskState; // 任务状态
    progress: number; // 任务进度
    message: string; // 最后一次更新的进度消息
    id: string; // 任务唯一标识符
    options: any; // 构建参数
}

export interface fileMap {
    src: string;
    dest: string;
}

export interface IScriptInfo {
    file: string;
    uuid: string;
}
