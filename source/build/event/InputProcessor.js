import { Component, Vec2, RichText, sys, Node, EventMouse, director, Vec3 } from "cc";
import { GObject } from "../GObject";
import { GRichTextField } from "../GRichTextField";
import { UIContentScaler } from "../UIContentScaler";
import { borrowEvent, Event as FUIEvent, returnEvent } from "./Event";
export class InputProcessor extends Component {
    constructor() {
        super();
        this._touches = new Array();
        this._rollOutChain = new Array();
        this._rollOverChain = new Array();
        this._touchPos = new Vec2();
    }
    onLoad() {
        this._owner = GObject.cast(this.node);
    }
    onEnable() {
        let node = this.node;
        node.on(Node.EventType.TOUCH_START, this.touchBeginHandler, this);
        node.on(Node.EventType.TOUCH_MOVE, this.touchMoveHandler, this);
        node.on(Node.EventType.TOUCH_END, this.touchEndHandler, this);
        node.on(Node.EventType.TOUCH_CANCEL, this.touchCancelHandler, this);
        node.on(Node.EventType.MOUSE_DOWN, this.mouseDownHandler, this);
        node.on(Node.EventType.MOUSE_MOVE, this.mouseMoveHandler, this);
        node.on(Node.EventType.MOUSE_UP, this.mouseUpHandler, this);
        node.on(Node.EventType.MOUSE_WHEEL, this.mouseWheelHandler, this);
        this._touchListener = this.node.eventProcessor.touchListener;
    }
    onDisable() {
        let node = this.node;
        node.off(Node.EventType.TOUCH_START, this.touchBeginHandler, this);
        node.off(Node.EventType.TOUCH_MOVE, this.touchMoveHandler, this);
        node.off(Node.EventType.TOUCH_END, this.touchEndHandler, this);
        node.off(Node.EventType.TOUCH_CANCEL, this.touchCancelHandler, this);
        node.off(Node.EventType.MOUSE_DOWN, this.mouseDownHandler, this);
        node.off(Node.EventType.MOUSE_MOVE, this.mouseMoveHandler, this);
        node.off(Node.EventType.MOUSE_UP, this.mouseUpHandler, this);
        node.off(Node.EventType.MOUSE_WHEEL, this.mouseWheelHandler, this);
        this._touchListener = null;
    }
    getAllTouches(touchIds) {
        touchIds = touchIds || new Array();
        let cnt = this._touches.length;
        for (let i = 0; i < cnt; i++) {
            let ti = this._touches[i];
            if (ti.touchId != -1)
                touchIds.push(ti.touchId);
        }
        return touchIds;
    }
    getTouchPosition(touchId) {
        if (touchId === undefined)
            touchId = -1;
        let cnt = this._touches.length;
        for (let i = 0; i < cnt; i++) {
            let ti = this._touches[i];
            if (ti.touchId != -1 && (touchId == -1 || ti.touchId == touchId))
                return ti.pos;
        }
        return Vec2.ZERO;
    }
    getTouchTarget() {
        let cnt = this._touches.length;
        for (let i = 0; i < cnt; i++) {
            let ti = this._touches[i];
            if (ti.touchId != -1)
                return ti.target;
        }
        return null;
    }
    addTouchMonitor(touchId, target) {
        let ti = this.getInfo(touchId, false);
        if (!ti)
            return;
        let index = ti.touchMonitors.indexOf(target);
        if (index == -1)
            ti.touchMonitors.push(target);
    }
    removeTouchMonitor(target) {
        let cnt = this._touches.length;
        for (let i = 0; i < cnt; i++) {
            let ti = this._touches[i];
            let index = ti.touchMonitors.indexOf(target);
            if (index != -1)
                ti.touchMonitors.splice(index, 1);
        }
    }
    cancelClick(touchId) {
        let ti = this.getInfo(touchId, false);
        if (ti)
            ti.clickCancelled = true;
    }
    simulateClick(target) {
        let evt;
        evt = borrowEvent(FUIEvent.TOUCH_BEGIN, true);
        evt.initiator = target;
        evt.pos.set(target.localToGlobal());
        evt.touchId = 0;
        evt.clickCount = 1;
        evt.button = 0;
        evt._processor = this;
        if (this._captureCallback)
            this._captureCallback.call(this._owner, evt);
        target.node.dispatchEvent(evt);
        evt.unuse();
        evt.type = FUIEvent.TOUCH_END;
        evt.bubbles = true;
        target.node.dispatchEvent(evt);
        evt.unuse();
        evt.type = FUIEvent.CLICK;
        evt.bubbles = true;
        target.node.dispatchEvent(evt);
        returnEvent(evt);
    }
    touchBeginHandler(evt) {
        let ti = this.updateInfo(evt.getID(), evt.getLocation());
        this._touchListener.setSwallowTouches(ti.target != this._owner);
        this.setBegin(ti);
        let evt2 = this.getEvent(ti, ti.target, FUIEvent.TOUCH_BEGIN, true);
        if (this._captureCallback)
            this._captureCallback.call(this._owner, evt2);
        ti.target.node.dispatchEvent(evt2);
        this.handleRollOver(ti, ti.target);
        return true;
    }
    touchMoveHandler(evt) {
        let ti = this.updateInfo(evt.getID(), evt.getLocation());
        this.handleRollOver(ti, ti.target);
        if (ti.began) {
            let evt2 = this.getEvent(ti, ti.target, FUIEvent.TOUCH_MOVE, false);
            let done = false;
            let cnt = ti.touchMonitors.length;
            for (let i = 0; i < cnt; i++) {
                let mm = ti.touchMonitors[i];
                if (mm.node == null || !mm.node.activeInHierarchy)
                    continue;
                evt2.unuse();
                evt2.type = FUIEvent.TOUCH_MOVE;
                mm.node.dispatchEvent(evt2);
                if (mm == this._owner)
                    done = true;
            }
            if (!done && this.node) {
                evt2.unuse();
                evt2.type = FUIEvent.TOUCH_MOVE;
                this.node.dispatchEvent(evt2);
            }
            returnEvent(evt2);
        }
    }
    touchEndHandler(evt) {
        let ti = this.updateInfo(evt.getID(), evt.getLocation());
        this.setEnd(ti);
        let evt2 = this.getEvent(ti, ti.target, FUIEvent.TOUCH_END, false);
        let cnt = ti.touchMonitors.length;
        for (let i = 0; i < cnt; i++) {
            let mm = ti.touchMonitors[i];
            if (mm == ti.target || mm.node == null || !mm.node.activeInHierarchy
                || ('isAncestorOf' in mm) && mm.isAncestorOf(ti.target))
                continue;
            evt2.unuse();
            evt2.type = FUIEvent.TOUCH_END;
            mm.node.dispatchEvent(evt2);
        }
        ti.touchMonitors.length = 0;
        if (ti.target && ti.target.node) {
            if (ti.target instanceof GRichTextField)
                ti.target.node.getComponent(RichText)["_onTouchEnded"](evt);
            evt2.unuse();
            evt2.type = FUIEvent.TOUCH_END;
            evt2.bubbles = true;
            ti.target.node.dispatchEvent(evt2);
        }
        returnEvent(evt2);
        ti.target = this.clickTest(ti);
        if (ti.target) {
            evt2 = this.getEvent(ti, ti.target, FUIEvent.CLICK, true);
            ti.target.node.dispatchEvent(evt2);
            returnEvent(evt2);
        }
        if (sys.isMobile) //on mobile platform, trigger RollOut on up event, but not on PC
            this.handleRollOver(ti, null);
        else
            this.handleRollOver(ti, ti.target);
        ti.target = null;
        ti.touchId = -1;
        ti.button = -1;
    }
    touchCancelHandler(evt) {
        let ti = this.updateInfo(evt.getID(), evt.getLocation());
        let evt2 = this.getEvent(ti, ti.target, FUIEvent.TOUCH_END, false);
        let cnt = ti.touchMonitors.length;
        for (let i = 0; i < cnt; i++) {
            let mm = ti.touchMonitors[i];
            if (mm == ti.target || mm.node == null || !mm.node.activeInHierarchy
                || ('isAncestorOf' in mm) && mm.isAncestorOf(ti.target))
                continue;
            evt2.initiator = mm;
            mm.node.dispatchEvent(evt2);
        }
        ti.touchMonitors.length = 0;
        if (ti.target && ti.target.node) {
            evt2.bubbles = true;
            ti.target.node.dispatchEvent(evt2);
        }
        returnEvent(evt2);
        this.handleRollOver(ti, null);
        ti.target = null;
        ti.touchId = -1;
        ti.button = -1;
    }
    mouseDownHandler(evt) {
        let ti = this.getInfo(0, true);
        ti.button = evt.getButton();
    }
    mouseUpHandler(evt) {
        let ti = this.getInfo(0, true);
        ti.button = evt.getButton();
    }
    mouseMoveHandler(evt) {
        let ti = this.getInfo(0, false);
        if (ti
            && Math.abs(ti.pos.x - evt.getLocationX()) < 1
            && Math.abs(ti.pos.y - (UIContentScaler.rootSize.height - evt.getLocationY())) < 1)
            return;
        ti = this.updateInfo(0, evt.getLocation());
        this.handleRollOver(ti, ti.target);
        if (ti.began) {
            let evt2 = this.getEvent(ti, ti.target, FUIEvent.TOUCH_MOVE, false);
            let done = false;
            let cnt = ti.touchMonitors.length;
            for (let i = 0; i < cnt; i++) {
                let mm = ti.touchMonitors[i];
                if (mm.node == null || !mm.node.activeInHierarchy)
                    continue;
                evt2.initiator = mm;
                mm.node.dispatchEvent(evt2);
                if (mm == this._owner)
                    done = true;
            }
            if (!done && this.node) {
                evt2.initiator = this._owner;
                this.node.dispatchEvent(evt2);
                returnEvent(evt2);
            }
            returnEvent(evt2);
        }
    }
    mouseWheelHandler(evt) {
        let ti = this.updateInfo(0, evt.getLocation());
        ti.mouseWheelDelta = Math.max(evt.getScrollX(), evt.getScrollY());
        let evt2 = this.getEvent(ti, ti.target, FUIEvent.MOUSE_WHEEL, true);
        ti.target.node.dispatchEvent(evt2);
        returnEvent(evt2);
    }
    updateInfo(touchId, pos) {
        const camera = director.root.batcher2D.getFirstRenderCamera(this.node);
        if (camera) {
            s_vec3.set(pos.x, pos.y);
            camera.screenToWorld(s_vec3_2, s_vec3);
            this._touchPos.set(s_vec3_2.x, s_vec3_2.y);
        }
        else
            this._touchPos.set(pos);
        this._touchPos.y = UIContentScaler.rootSize.height - this._touchPos.y;
        let target = this._owner.hitTest(this._touchPos);
        if (!target)
            target = this._owner;
        let ti = this.getInfo(touchId);
        ti.target = target;
        ti.pos.set(this._touchPos);
        ti.button = EventMouse.BUTTON_LEFT;
        ti.touchId = touchId;
        return ti;
    }
    getInfo(touchId, createIfNotExisits) {
        if (createIfNotExisits === undefined)
            createIfNotExisits = true;
        let ret = null;
        let cnt = this._touches.length;
        for (let i = 0; i < cnt; i++) {
            let ti = this._touches[i];
            if (ti.touchId == touchId)
                return ti;
            else if (ti.touchId == -1)
                ret = ti;
        }
        if (!ret) {
            if (!createIfNotExisits)
                return null;
            ret = new TouchInfo();
            this._touches.push(ret);
        }
        ret.touchId = touchId;
        return ret;
    }
    setBegin(ti) {
        ti.began = true;
        ti.clickCancelled = false;
        ti.downPos.set(ti.pos);
        ti.downTargets.length = 0;
        let obj = ti.target;
        while (obj) {
            ti.downTargets.push(obj);
            obj = obj.findParent();
        }
    }
    setEnd(ti) {
        ti.began = false;
        let now = director.getTotalTime() / 1000;
        let elapsed = now - ti.lastClickTime;
        if (elapsed < 0.45) {
            if (ti.clickCount == 2)
                ti.clickCount = 1;
            else
                ti.clickCount++;
        }
        else
            ti.clickCount = 1;
        ti.lastClickTime = now;
    }
    clickTest(ti) {
        if (ti.downTargets.length == 0
            || ti.clickCancelled
            || Math.abs(ti.pos.x - ti.downPos.x) > 50 || Math.abs(ti.pos.y - ti.downPos.y) > 50)
            return null;
        let obj = ti.downTargets[0];
        if (obj && obj.node && obj.node.activeInHierarchy)
            return obj;
        obj = ti.target;
        while (obj) {
            let index = ti.downTargets.indexOf(obj);
            if (index != -1 && obj.node && obj.node.activeInHierarchy)
                break;
            obj = obj.findParent();
        }
        return obj;
    }
    handleRollOver(ti, target) {
        if (ti.lastRollOver == target)
            return;
        let element = ti.lastRollOver;
        while (element && element.node) {
            this._rollOutChain.push(element);
            element = element.findParent();
        }
        element = target;
        while (element && element.node) {
            let i = this._rollOutChain.indexOf(element);
            if (i != -1) {
                this._rollOutChain.length = i;
                break;
            }
            this._rollOverChain.push(element);
            element = element.findParent();
        }
        ti.lastRollOver = target;
        let cnt = this._rollOutChain.length;
        for (let i = 0; i < cnt; i++) {
            element = this._rollOutChain[i];
            if (element.node && element.node.activeInHierarchy) {
                let evt = this.getEvent(ti, element, FUIEvent.ROLL_OUT, false);
                element.node.dispatchEvent(evt);
                returnEvent(evt);
            }
        }
        cnt = this._rollOverChain.length;
        for (let i = 0; i < cnt; i++) {
            element = this._rollOverChain[i];
            if (element.node && element.node.activeInHierarchy) {
                let evt = this.getEvent(ti, element, FUIEvent.ROLL_OVER, false);
                element.node.dispatchEvent(evt);
                returnEvent(evt);
            }
        }
        this._rollOutChain.length = 0;
        this._rollOverChain.length = 0;
    }
    getEvent(ti, target, type, bubbles) {
        let evt = borrowEvent(type, bubbles);
        evt.initiator = target;
        evt.pos.set(ti.pos);
        evt.touchId = ti.touchId;
        evt.clickCount = ti.clickCount;
        evt.button = ti.button;
        evt.mouseWheelDelta = ti.mouseWheelDelta;
        evt._processor = this;
        return evt;
    }
}
class TouchInfo {
    constructor() {
        this.pos = new Vec2();
        this.touchId = 0;
        this.clickCount = 0;
        this.mouseWheelDelta = 0;
        this.button = -1;
        this.downPos = new Vec2();
        this.began = false;
        this.clickCancelled = false;
        this.lastClickTime = 0;
        this.downTargets = new Array();
        this.touchMonitors = new Array();
    }
}
;
var s_vec3 = new Vec3();
var s_vec3_2 = new Vec3();
