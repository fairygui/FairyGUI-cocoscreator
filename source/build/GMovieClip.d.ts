import { Color } from "cc";
import { MovieClip } from "./display/MovieClip";
import { GObject } from "./GObject";
import { ByteBuffer } from "./utils/ByteBuffer";
export declare class GMovieClip extends GObject {
    _content: MovieClip;
    constructor();
    get color(): Color;
    set color(value: Color);
    get playing(): boolean;
    set playing(value: boolean);
    get frame(): number;
    set frame(value: number);
    get timeScale(): number;
    set timeScale(value: number);
    rewind(): void;
    syncStatus(anotherMc: GMovieClip): void;
    advance(timeInSeconds: number): void;
    setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: (() => void) | null): void;
    protected handleGrayedChanged(): void;
    protected handleSizeChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    constructFromResource(): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}
