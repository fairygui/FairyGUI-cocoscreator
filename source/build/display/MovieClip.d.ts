/// <reference path="../../lib/cc.d.ts" />
import { Rect, SpriteFrame } from "cc";
import { Image } from "./Image";
export interface Frame {
    rect: Rect;
    addDelay: number;
    texture: SpriteFrame | null;
}
export declare class MovieClip extends Image {
    interval: number;
    swing: boolean;
    repeatDelay: number;
    timeScale: number;
    private _playing;
    private _frameCount;
    private _frames;
    private _frame;
    private _start;
    private _end;
    private _times;
    private _endAt;
    private _status;
    private _callback;
    private _smoothing;
    private _frameElapsed;
    private _reversed;
    private _repeatedCount;
    constructor();
    get frames(): Array<Frame>;
    set frames(value: Array<Frame>);
    get frameCount(): number;
    get frame(): number;
    set frame(value: number);
    get playing(): boolean;
    set playing(value: boolean);
    get smoothing(): boolean;
    set smoothing(value: boolean);
    rewind(): void;
    syncStatus(anotherMc: MovieClip): void;
    advance(timeInSeconds: number): void;
    setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: (() => void) | null): void;
    protected update(dt: number): void;
    private drawFrame;
}
