import { Controller } from "../Controller";
import { GObject } from "../GObject";
import { GTweener } from "../tween/GTweener";
import { ByteBuffer } from "../utils/ByteBuffer";
export declare class GearBase {
    static disableAllTweenEffect?: boolean;
    _owner: GObject;
    protected _controller: Controller;
    protected _tweenConfig: GearTweenConfig;
    dispose(): void;
    get controller(): Controller;
    set controller(val: Controller);
    get tweenConfig(): GearTweenConfig;
    protected get allowTween(): boolean;
    setup(buffer: ByteBuffer): void;
    updateFromRelations(dx: number, dy: number): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    protected init(): void;
    apply(): void;
    updateState(): void;
}
export declare class GearTweenConfig {
    tween: boolean;
    easeType: number;
    duration: number;
    delay: number;
    _displayLockToken: number;
    _tweener: GTweener;
    constructor();
}
export interface IGearXY {
}
