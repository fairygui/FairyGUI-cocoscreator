import { GTweener } from "./GTweener";
export declare class GTween {
    static catchCallbackExceptions: boolean;
    static to(start: number, end: number, duration: number): GTweener;
    static to2(start: number, start2: number, end: number, end2: number, duration: number): GTweener;
    static to3(start: number, start2: number, start3: number, end: number, end2: number, end3: number, duration: number): GTweener;
    static to4(start: number, start2: number, start3: number, start4: number, end: number, end2: number, end3: number, end4: number, duration: number): GTweener;
    static toColor(start: number, end: number, duration: number): GTweener;
    static delayedCall(delay: number): GTweener;
    static shake(startX: number, startY: number, amplitude: number, duration: number): GTweener;
    static isTweening(target: any, propType?: any): Boolean;
    static kill(target: any, complete?: boolean, propType?: any): void;
    static getTween(target: any, propType?: any): GTweener;
}
