/**
 * 取给定边界范围的值
 * Take the value of the given boundary range
 * @param {number} val
 * @param {number} min
 * @param {number} max
 */
export declare function clamp(val: number, min: number, max: number): any;
/**
 * @function clamp01
 * @param {number} val
 * @returns {number}
 *
 * Clamps a value between 0 and 1.
 */
export declare function clamp01(val: number): number;
/**
 * 加法函数
 * 入参：函数内部转化时会先转字符串再转数值，因而传入字符串或 number 均可
 * 返回值：arg1 加上 arg2 的精确结果
 * @param {number|string} arg1
 * @param {number|string} arg2
 */
export declare function add(arg1: number | string, arg2: number | string): number;
/**
 * 减法函数
 * 入参：函数内部转化时会先转字符串再转数值，因而传入字符串或number均可
 * 返回值：arg1 减 arg2的精确结果
 * @param {number|string} arg1
 * @param {number|string} arg2
 */
export declare function sub(arg1: number | string, arg2: number | string): number;
