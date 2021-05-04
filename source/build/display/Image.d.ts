import { Sprite } from "cc";
import { FillMethod, FillOrigin, FlipType } from "../FieldTypes";
export declare class Image extends Sprite {
    private _flip;
    private _fillMethod;
    private _fillOrigin;
    private _fillAmount;
    private _fillClockwise;
    constructor();
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
    private setupFill;
}
