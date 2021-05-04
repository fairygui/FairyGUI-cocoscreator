/// <reference types="node" />
import * as Path from 'path';
/**
 * 返回一个不含扩展名的文件名
 * @param path
 */
export declare function basenameNoExt(path: string): string;
/**
 * 将 \ 统一换成 /
 * @param path
 */
export declare function slash(path: string): string;
/**
 * 去除路径最后的斜杆，返回一个不带斜杆的路径
 * @param path
 */
export declare function stripSep(path: string): string;
/**
 * 删除一个路径的扩展名
 * @param path
 */
export declare function stripExt(path: string): string;
/**
 * 判断路径 pathA 是否包含 pathB
 * pathA = foo/bar,         pathB = foo/bar/foobar, return true
 * pathA = foo/bar,         pathB = foo/bar,        return true
 * pathA = foo/bar/foobar,  pathB = foo/bar,        return false
 * pathA = foo/bar/foobar,  pathB = foobar/bar/foo, return false
 * @param pathA
 * @param pathB
 */
export declare function contains(pathA: string, pathB: string): boolean;
/**
 * 格式化路径
 * 如果是 Windows 平台，需要将盘符转成小写进行判断
 * @param path
 */
export declare function normalize(path: string): string;
export declare const join: typeof Path.join;
export declare const resolve: typeof Path.resolve;
export declare const isAbsolute: typeof Path.isAbsolute;
export declare const relative: typeof Path.relative;
export declare const dirname: typeof Path.dirname;
export declare const basename: typeof Path.basename;
export declare const extname: typeof Path.extname;
export declare const sep: "\\" | "/";
export declare const delimiter: ";" | ":";
export declare const parse: typeof Path.parse;
export declare const format: typeof Path.format;
