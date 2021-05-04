/**
 * 初始化一个可用的文件名
 * Initializes a available filename
 * 返回可用名称的文件路径
 * Returns the file path with the available name
 *
 * @param file 初始文件路径 Initial file path
 */
export declare function getName(file: string): string;
interface UnzipOptions {
    peel?: boolean;
}
/**
 * 解压文件夹
 * Unzip folder
 *
 * @param zip
 * @param target
 * @param options
 */
export declare function unzip(zip: string, target: string, options?: UnzipOptions): Promise<void>;
/**
 * 复制一个文件到另一个位置
 * Copy a file to another location
 *
 * @param source
 * @param target
 */
export declare function copy(source: string, target: string): void;
export {};
