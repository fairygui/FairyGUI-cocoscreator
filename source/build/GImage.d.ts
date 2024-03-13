/// <reference path="../lib/cc.d.ts" />
import { Color } from "cc";
import { Image } from "./display/Image";
import { FlipType, FillMethod, FillOrigin } from "./FieldTypes";
import { GObject } from "./GObject";
import { ByteBuffer } from "./utils/ByteBuffer";
export declare class GImage extends GObject {
    _content: Image;
    constructor();
    get color(): Color;
    set color(value: Color);
    get flip(): FlipType;
    set flip(value: FlipType);
    get fillMethod(): FillMethod;
    set fillMethod(value: FillMethod);
    get fillOrigin(): FillOrigin;
    set fillOrigin(value: FillOrigin);
    get fillClockwise(): boolean;
    set fillClockwise(value: boolean);
    get fillAmount(): number;
    set fillAmount(value: number);
    constructFromResource(): void;
    protected handleGrayedChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}
