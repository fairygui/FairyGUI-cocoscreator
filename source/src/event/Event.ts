import { Event as CCEvent, Node, Touch, Vec2 } from 'cc';
import { GObject } from '../GObject';
import { InputProcessor } from './InputProcessor';

export class Event extends CCEvent {
    public static TOUCH_BEGIN: string = "fui_touch_begin";
    public static TOUCH_MOVE: string = "fui_touch_move";
    public static TOUCH_END: string = "fui_touch_end";
    public static CLICK: string = "fui_click";
    public static ROLL_OVER: string = "fui_roll_over";
    public static ROLL_OUT: string = "fui_roll_out";
    public static MOUSE_WHEEL: string = "fui_mouse_wheel"

    public static DISPLAY: string = "fui_display";
    public static UNDISPLAY: string = "fui_undisplay";
    public static GEAR_STOP: string = "fui_gear_stop";
    public static LINK: string = "fui_text_link";
    public static Submit: string = "editing-return";
    public static TEXT_CHANGE: string = "text-changed";

    public static STATUS_CHANGED: string = "fui_status_changed";
    public static XY_CHANGED: string = "fui_xy_changed";
    public static SIZE_CHANGED: string = "fui_size_changed";
    public static SIZE_DELAY_CHANGE: string = "fui_size_delay_change";

    public static DRAG_START: string = "fui_drag_start";
    public static DRAG_MOVE: string = "fui_drag_move";
    public static DRAG_END: string = "fui_drag_end";
    public static DROP: string = "fui_drop";

    public static SCROLL: string = "fui_scroll";
    public static SCROLL_END: string = "fui_scroll_end";
    public static PULL_DOWN_RELEASE: string = "fui_pull_down_release";
    public static PULL_UP_RELEASE: string = "fui_pull_up_release";

    public static CLICK_ITEM: string = "fui_click_item";

    public initiator: GObject;
    public pos: Vec2 = new Vec2();
    public touchId: number = 0;
    public clickCount: number = 0;
    public button: number = 0;
    public keyModifiers: number = 0;
    public mouseWheelDelta: number = 0;
    public _processor: InputProcessor;

    constructor(type: string, bubbles: boolean) {
        super(type, bubbles);
    }

    public get sender(): GObject | null {
        return GObject.cast(<Node>this.currentTarget);
    }

    public get isShiftDown(): boolean {
        return false;
    }

    public get isCtrlDown(): boolean {
        return false;
    }

    public captureTouch() {
        let obj = GObject.cast(<Node>this.currentTarget);
        if (obj)
            this._processor.addTouchMonitor(this.touchId, obj);
    }
}

var eventPool: Array<Event> = new Array<Event>();

export function borrowEvent(type: string, bubbles?: boolean): Event {
    let evt: Event;
    if (eventPool.length) {
        evt = eventPool.pop();
        evt.type = type;
        evt.bubbles = bubbles;
    }
    else {
        evt = new Event(type, bubbles);
    }
    return evt;
}

export function returnEvent(evt: Event) {
    evt.initiator = null;
    evt.unuse();

    eventPool.push(evt);
}