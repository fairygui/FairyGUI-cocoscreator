import { GComponent } from "./GComponent";
import { ScrollPane } from "./ScrollPane";
import { ByteBuffer } from "./utils/ByteBuffer";
export declare class GScrollBar extends GComponent {
    private _grip;
    private _arrowButton1;
    private _arrowButton2;
    private _bar;
    private _target;
    private _vertical;
    private _scrollPerc;
    private _fixedGripSize;
    private _dragOffset;
    private _gripDragging;
    constructor();
    setScrollPane(target: ScrollPane, vertical: boolean): void;
    setDisplayPerc(value: number): void;
    setScrollPerc(val: number): void;
    get minSize(): number;
    get gripDragging(): boolean;
    protected constructExtension(buffer: ByteBuffer): void;
    private onGripTouchDown;
    private onGripTouchMove;
    private onGripTouchEnd;
    private onClickArrow1;
    private onClickArrow2;
    private onBarTouchBegin;
}
