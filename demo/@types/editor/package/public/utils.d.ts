/**
 * 比对版本号
 * A > B => 1
 * A = B => 0
 * A < B => -1
 * @param versionA 版本号
 * @param versionB 版本号
 */
export declare function compareVersion(versionA: string, versionB: string): 1 | 0 | -1;
/**
 * 给定一个插件的路径，检查路径属于全局还是项目
 * @param path 传入一个绝对地址，查询属于全局还是项目还是内置
 */
export declare function getPosition(path: string): "" | "global" | "local" | "builtin";
