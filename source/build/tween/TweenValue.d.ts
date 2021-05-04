export declare class TweenValue {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor();
    get color(): number;
    set color(value: number);
    getField(index: number): number;
    setField(index: number, value: number): void;
    setZero(): void;
}
