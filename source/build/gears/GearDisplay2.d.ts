import { GearBase } from "./GearBase";
export declare class GearDisplay2 extends GearBase {
    pages: string[];
    condition: number;
    private _visible;
    protected init(): void;
    apply(): void;
    evaluate(connected: boolean): boolean;
}
