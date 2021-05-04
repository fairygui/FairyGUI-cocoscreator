import { Vec2 } from "cc";
import { GObject } from "../GObject";
import { ByteBuffer } from "../utils/ByteBuffer";
export interface IHitTest {
    hitTest(pt: Vec2, globalPt: Vec2): boolean;
}
export declare class PixelHitTest implements IHitTest {
    private _data;
    offsetX: number;
    offsetY: number;
    scaleX: number;
    scaleY: number;
    constructor(data: PixelHitTestData, offsetX?: number, offsetY?: number);
    hitTest(pt: Vec2): boolean;
}
export declare class PixelHitTestData {
    pixelWidth: number;
    scale: number;
    pixels: Uint8Array;
    constructor(ba: ByteBuffer);
}
export declare class ChildHitArea implements IHitTest {
    private _child;
    constructor(child: GObject);
    hitTest(pt: Vec2, globalPt: Vec2): boolean;
}
