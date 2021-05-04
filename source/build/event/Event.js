import { Event as CCEvent, Vec2 } from 'cc';
import { GObject } from '../GObject';
export class Event extends CCEvent {
    constructor(type, bubbles) {
        super(type, bubbles);
        this.pos = new Vec2();
        this.touchId = 0;
        this.clickCount = 0;
        this.button = 0;
        this.keyModifiers = 0;
        this.mouseWheelDelta = 0;
    }
    get sender() {
        return GObject.cast(this.currentTarget);
    }
    get isShiftDown() {
        return false;
    }
    get isCtrlDown() {
        return false;
    }
    captureTouch() {
        let obj = GObject.cast(this.currentTarget);
        if (obj)
            this._processor.addTouchMonitor(this.touchId, obj);
    }
}
Event.TOUCH_BEGIN = "fui_touch_begin";
Event.TOUCH_MOVE = "fui_touch_move";
Event.TOUCH_END = "fui_touch_end";
Event.CLICK = "fui_click";
Event.ROLL_OVER = "fui_roll_over";
Event.ROLL_OUT = "fui_roll_out";
Event.MOUSE_WHEEL = "fui_mouse_wheel";
Event.DISPLAY = "fui_display";
Event.UNDISPLAY = "fui_undisplay";
Event.GEAR_STOP = "fui_gear_stop";
Event.LINK = "fui_text_link";
Event.Submit = "editing-return";
Event.TEXT_CHANGE = "text-changed";
Event.STATUS_CHANGED = "fui_status_changed";
Event.XY_CHANGED = "fui_xy_changed";
Event.SIZE_CHANGED = "fui_size_changed";
Event.SIZE_DELAY_CHANGE = "fui_size_delay_change";
Event.DRAG_START = "fui_drag_start";
Event.DRAG_MOVE = "fui_drag_move";
Event.DRAG_END = "fui_drag_end";
Event.DROP = "fui_drop";
Event.SCROLL = "fui_scroll";
Event.SCROLL_END = "fui_scroll_end";
Event.PULL_DOWN_RELEASE = "fui_pull_down_release";
Event.PULL_UP_RELEASE = "fui_pull_up_release";
Event.CLICK_ITEM = "fui_click_item";
var eventPool = new Array();
export function borrowEvent(type, bubbles) {
    let evt;
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
export function returnEvent(evt) {
    evt.initiator = null;
    evt.unuse();
    eventPool.push(evt);
}
