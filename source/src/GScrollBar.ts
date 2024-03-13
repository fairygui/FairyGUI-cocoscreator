import { Vec2 } from "cc";
import { Event as FUIEvent } from "./event/Event";
import { GComponent } from "./GComponent";
import { GObject } from "./GObject";
import { ScrollPane } from "./ScrollPane";
import { ByteBuffer } from "./utils/ByteBuffer";

export class GScrollBar extends GComponent {
    private _grip: GObject;
    private _arrowButton1: GObject;
    private _arrowButton2: GObject;
    private _bar: GObject;
    private _target: ScrollPane;

    private _vertical: boolean;
    private _scrollPerc: number;
    private _fixedGripSize: boolean;

    private _dragOffset: Vec2;
    private _gripDragging: boolean;

    public constructor() {
        super();

        this._node.name = "GScrollBar";
        this._dragOffset = new Vec2();
        this._scrollPerc = 0;
    }

    public setScrollPane(target: ScrollPane, vertical: boolean): void {
        this._target = target;
        this._vertical = vertical;
    }

    public setDisplayPerc(value: number) {
        if (this._vertical) {
            if (!this._fixedGripSize)
                this._grip.height = Math.floor(value * this._bar.height);
            this._grip.y = this._bar.y + (this._bar.height - this._grip.height) * this._scrollPerc;

        }
        else {
            if (!this._fixedGripSize)
                this._grip.width = Math.floor(value * this._bar.width);
            this._grip.x = this._bar.x + (this._bar.width - this._grip.width) * this._scrollPerc;
        }
        this._grip.visible = value != 0 && value != 1;
    }

    public setScrollPerc(val: number) {
        this._scrollPerc = val;
        if (this._vertical)
            this._grip.y = this._bar.y + (this._bar.height - this._grip.height) * this._scrollPerc;
        else
            this._grip.x = this._bar.x + (this._bar.width - this._grip.width) * this._scrollPerc;
    }

    public get minSize(): number {
        if (this._vertical)
            return (this._arrowButton1 ? this._arrowButton1.height : 0) + (this._arrowButton2 ? this._arrowButton2.height : 0);
        else
            return (this._arrowButton1 ? this._arrowButton1.width : 0) + (this._arrowButton2 ? this._arrowButton2.width : 0);
    }

    public get gripDragging(): boolean {
        return this._gripDragging;
    }

    protected constructExtension(buffer: ByteBuffer): void {
        buffer.seek(0, 6);

        this._fixedGripSize = buffer.readBool();

        this._grip = this.getChild("grip");
        if (!this._grip) {
            console.error("需要定义grip");
            return;
        }

        this._bar = this.getChild("bar");
        if (!this._bar) {
            console.error("需要定义bar");
            return;
        }

        this._arrowButton1 = this.getChild("arrow1");
        this._arrowButton2 = this.getChild("arrow2");

        this._grip.on(FUIEvent.TOUCH_BEGIN, this.onGripTouchDown, this);
        this._grip.on(FUIEvent.TOUCH_MOVE, this.onGripTouchMove, this);
        this._grip.on(FUIEvent.TOUCH_END, this.onGripTouchEnd, this);

        if (this._arrowButton1)
            this._arrowButton1.on(FUIEvent.TOUCH_BEGIN, this.onClickArrow1, this);
        if (this._arrowButton2)
            this._arrowButton2.on(FUIEvent.TOUCH_BEGIN, this.onClickArrow2, this);

        this.on(FUIEvent.TOUCH_BEGIN, this.onBarTouchBegin, this);
    }

    private onGripTouchDown(evt: FUIEvent): void {
        evt.propagationStopped = true;
        evt.captureTouch();

        this._gripDragging = true;
        this._target.updateScrollBarVisible();

        this.globalToLocal(evt.pos.x, evt.pos.y, this._dragOffset);
        this._dragOffset.x -= this._grip.x;
        this._dragOffset.y -= this._grip.y;
    }

    private onGripTouchMove(evt: FUIEvent): void {
        if (!this.onStage)
            return;

        var pt: Vec2 = this.globalToLocal(evt.pos.x, evt.pos.y, s_vec2);
        if (this._vertical) {
            var curY: number = pt.y - this._dragOffset.y;
            this._target.setPercY((curY - this._bar.y) / (this._bar.height - this._grip.height), false);
        }
        else {
            var curX: number = pt.x - this._dragOffset.x;
            this._target.setPercX((curX - this._bar.x) / (this._bar.width - this._grip.width), false);
        }
    }

    private onGripTouchEnd(evt: FUIEvent): void {
        if (!this.onStage)
            return;

        this._gripDragging = false;
        this._target.updateScrollBarVisible();
    }

    private onClickArrow1(evt: FUIEvent): void {
        evt.propagationStopped = true;

        if (this._vertical)
            this._target.scrollUp();
        else
            this._target.scrollLeft();
    }

    private onClickArrow2(evt: FUIEvent): void {
        evt.propagationStopped = true;

        if (this._vertical)
            this._target.scrollDown();
        else
            this._target.scrollRight();
    }

    private onBarTouchBegin(evt: FUIEvent): void {
        evt.propagationStopped = true;
        var pt: Vec2 = this._grip.globalToLocal(evt.pos.x, evt.pos.y, s_vec2);
        if (this._vertical) {
            if (pt.y < 0)
                this._target.scrollUp(4);
            else
                this._target.scrollDown(4);
        }
        else {
            if (pt.x < 0)
                this._target.scrollLeft(4);
            else
                this._target.scrollRight(4);
        }
    }
}

var s_vec2: Vec2 = new Vec2();