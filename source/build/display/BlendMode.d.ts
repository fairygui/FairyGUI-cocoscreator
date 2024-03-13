/// <reference path="../../lib/cc.d.ts" />
import { Node } from "cc";
export declare enum BlendMode {
    Normal = 0,
    None = 1,
    Add = 2,
    Multiply = 3,
    Screen = 4,
    Erase = 5,
    Mask = 6,
    Below = 7,
    Off = 8,
    Custom1 = 9,
    Custom2 = 10,
    Custom3 = 11
}
export declare class BlendModeUtils {
    static apply(node: Node, blendMode: BlendMode): void;
    static override(blendMode: BlendMode, srcFactor: number, dstFactor: number): void;
}
