
namespace fgui {

    export class InputProcessor extends cc.Component {
        private _owner: GComponent;
        private _touchListener: any;
        private _touchPos: cc.Vec2;
        private _touches: Array<TouchInfo>;
        private _rollOutChain: Array<GObject>;
        private _rollOverChain: Array<GObject>;

        public _captureCallback: (evt: Event) => void;

        public constructor() {
            super();

            this._touches = new Array<TouchInfo>();
            this._rollOutChain = new Array<GObject>();
            this._rollOverChain = new Array<GObject>();
            this._touchPos = new cc.Vec2();
        }

        onLoad() {
            this._owner = <GComponent>this.node["$gobj"];
        }

        onEnable() {
            let node: cc.Node = this.node;
            node.on(cc.Node.EventType.TOUCH_START, this.touchBeginHandler, this);
            node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveHandler, this);
            node.on(cc.Node.EventType.TOUCH_END, this.touchEndHandler, this);
            node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancelHandler, this);

            node.on(cc.Node.EventType.MOUSE_DOWN, this.mouseDownHandler, this);
            node.on(cc.Node.EventType.MOUSE_MOVE, this.mouseMoveHandler, this);
            node.on(cc.Node.EventType.MOUSE_UP, this.mouseUpHandler, this);
            node.on(cc.Node.EventType.MOUSE_WHEEL, this.mouseWheelHandler, this);

            this._touchListener = this.node["_touchListener"];
        }

        onDisable() {
            let node: cc.Node = this.node;
            node.off(cc.Node.EventType.TOUCH_START, this.touchBeginHandler, this);
            node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoveHandler, this);
            node.off(cc.Node.EventType.TOUCH_END, this.touchEndHandler, this);
            node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancelHandler, this);

            node.off(cc.Node.EventType.MOUSE_DOWN, this.mouseDownHandler, this);
            node.off(cc.Node.EventType.MOUSE_MOVE, this.mouseMoveHandler, this);
            node.off(cc.Node.EventType.MOUSE_UP, this.mouseUpHandler, this);
            node.off(cc.Node.EventType.MOUSE_WHEEL, this.mouseWheelHandler, this);

            this._touchListener = null;
        }

        public getAllTouches(touchIds?: Array<number>): Array<number> {
            touchIds = touchIds || new Array<number>();
            let cnt = this._touches.length;
            for (let i = 0; i < cnt; i++) {
                let ti = this._touches[i];
                if (ti.touchId != -1)
                    touchIds.push(ti.touchId);
            }
            return touchIds;
        }

        public getTouchPosition(touchId?: number): cc.Vec2 {
            if (touchId === undefined) touchId = -1;
            let cnt = this._touches.length;
            for (let i = 0; i < cnt; i++) {
                let ti = this._touches[i];
                if (ti.touchId != -1 && (touchId == -1 || ti.touchId == touchId))
                    return ti.pos;
            }
            return cc.Vec2.ZERO;
        }

        public getTouchTarget(): GObject {
            let cnt = this._touches.length;
            for (let i = 0; i < cnt; i++) {
                let ti = this._touches[i];
                if (ti.touchId != -1)
                    return ti.target;
            }
            return null;
        }


        public addTouchMonitor(touchId: number, target: GObject) {
            let ti = this.getInfo(touchId, false);
            if (!ti)
                return;

            let index = ti.touchMonitors.indexOf(target);
            if (index == -1)
                ti.touchMonitors.push(target);
        }

        public removeTouchMonitor(target: GObject) {
            let cnt = this._touches.length;
            for (let i = 0; i < cnt; i++) {
                let ti: TouchInfo = this._touches[i];
                let index = ti.touchMonitors.indexOf(target);
                if (index != -1)
                    ti.touchMonitors.splice(index, 1);
            }
        }

        public cancelClick(touchId: number) {
            let ti = this.getInfo(touchId, false);
            if (ti)
                ti.clickCancelled = true;
        }

        public simulateClick(target: GObject) {
            let evt;

            evt = Event._borrow(Event.TOUCH_BEGIN, true);

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
            evt.type = Event.TOUCH_END;
            evt.bubbles = true;

            target.node.dispatchEvent(evt);

            evt.unuse();
            evt.type = Event.CLICK;
            evt.bubbles = true;

            target.node.dispatchEvent(evt);

            Event._return(evt);
        }

        private touchBeginHandler(touch: cc.Touch, evt: cc.Event): Boolean {
            let ti: TouchInfo = this.updateInfo(touch.getID(), touch.getLocation(), touch);
            this._touchListener.setSwallowTouches(ti.target != this._owner);
            this.setBegin(ti);

            let evt2 = this.getEvent(ti, ti.target, Event.TOUCH_BEGIN, true);

            if (this._captureCallback)
                this._captureCallback.call(this._owner, evt2);

            ti.target.node.dispatchEvent(evt2);

            this.handleRollOver(ti, ti.target);

            return true;
        }

        private touchMoveHandler(touch: cc.Touch, evt: cc.Event): void {
            let ti = this.updateInfo(touch.getID(), touch.getLocation(), touch);
            this.handleRollOver(ti, ti.target);

            if (ti.began) {
                let evt2 = this.getEvent(ti, ti.target, Event.TOUCH_MOVE, false);

                let done = false;
                let cnt = ti.touchMonitors.length;
                for (let i = 0; i < cnt; i++) {
                    let mm = ti.touchMonitors[i];
                    if (mm.node == null || !mm.node.activeInHierarchy)
                        continue;

                    evt2.unuse();
                    evt2.type = Event.TOUCH_MOVE;
                    mm.node.dispatchEvent(evt2);
                    if (mm == this._owner)
                        done = true;
                }

                if (!done && this.node != null) {
                    evt2.unuse();
                    evt2.type = Event.TOUCH_MOVE;
                    this.node.dispatchEvent(evt2);
                }

                Event._return(evt2);
            }
        }

        private touchEndHandler(touch: cc.Touch, evt: cc.Event): void {
            let ti = this.updateInfo(touch.getID(), touch.getLocation(), touch);
            this.setEnd(ti);

            let evt2 = this.getEvent(ti, ti.target, Event.TOUCH_END, false);

            let cnt = ti.touchMonitors.length;
            for (let i = 0; i < cnt; i++) {
                let mm = ti.touchMonitors[i];
                if (mm == ti.target || mm.node == null || !mm.node.activeInHierarchy
                    || (mm instanceof GComponent) && (<GComponent>mm).isAncestorOf(ti.target))
                    continue;

                evt2.unuse();
                evt2.type = Event.TOUCH_END;
                mm.node.dispatchEvent(evt2);
            }
            ti.touchMonitors.length = 0;

            if (ti.target && ti.target.node != null) {
                if (ti.target instanceof GRichTextField)
                    ti.target.node.getComponent(cc.RichText)["_onTouchEnded"](evt2);

                evt2.unuse();
                evt2.type = Event.TOUCH_END;
                evt2.bubbles = true;
                ti.target.node.dispatchEvent(evt2);
            }

            Event._return(evt2);

            ti.target = this.clickTest(ti);
            if (ti.target) {
                evt2 = this.getEvent(ti, ti.target, Event.CLICK, true);
                ti.target.node.dispatchEvent(evt2);
                Event._return(evt2);
            }

            if (cc.sys.isMobile)     //on mobile platform, trigger RollOut on up event, but not on PC
                this.handleRollOver(ti, null);
            else
                this.handleRollOver(ti, ti.target);

            ti.target = null;
            ti.touchId = -1;
            ti.button = -1;
        }

        private touchCancelHandler(touch: cc.Touch, evt: cc.Event): void {
            let ti = this.updateInfo(touch.getID(), touch.getLocation(), touch);

            let evt2 = this.getEvent(ti, ti.target, Event.TOUCH_END, false);

            let cnt = ti.touchMonitors.length;
            for (let i = 0; i < cnt; i++) {
                let mm = ti.touchMonitors[i];
                if (mm == ti.target || mm.node == null || !mm.node.activeInHierarchy
                    || (mm instanceof GComponent) && (<GComponent>mm).isAncestorOf(ti.target))
                    continue;

                evt2.initiator = mm;
                mm.node.dispatchEvent(evt2);
            }
            ti.touchMonitors.length = 0;

            if (ti.target && ti.target.node != null) {
                evt2.bubbles = true;
                ti.target.node.dispatchEvent(evt2);
            }

            Event._return(evt2);

            this.handleRollOver(ti, null);

            ti.target = null;
            ti.touchId = -1;
            ti.button = -1;
        }

        private mouseDownHandler(evt: cc.Event.EventMouse) {
            let ti = this.getInfo(0, true);
            ti.button = evt.getButton();
        }

        private mouseUpHandler(evt: cc.Event.EventMouse) {
            let ti = this.getInfo(0, true);
            ti.button = evt.getButton();
        }

        private mouseMoveHandler(evt: cc.Event.EventMouse) {
            let ti = this.getInfo(0, false);
            if (ti
                && Math.abs(ti.pos.x - evt.getLocationX()) < 1
                && Math.abs(ti.pos.y - (GRoot.inst.height - evt.getLocationY())) < 1)
                return;

            ti = this.updateInfo(0, evt.getLocation());
            this.handleRollOver(ti, ti.target);

            if (ti.began) {
                let evt2 = this.getEvent(ti, ti.target, Event.TOUCH_MOVE, false);

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

                if (!done && this.node != null) {
                    evt2.initiator = this._owner;
                    this.node.dispatchEvent(evt2);
                    Event._return(evt2);
                }

                Event._return(evt2);
            }
        }

        private mouseWheelHandler(evt: cc.Event.EventMouse) {
            let ti = this.updateInfo(0, evt.getLocation());
            ti.mouseWheelDelta = Math.max(evt.getScrollX(), evt.getScrollY());

            let evt2 = this.getEvent(ti, ti.target, Event.MOUSE_WHEEL, false);
            ti.target.node.dispatchEvent(evt2);
            Event._return(evt2);
        }

        private updateInfo(touchId: number, pos: cc.Vec2, touch?: cc.Touch): TouchInfo {
            let camera = cc.Camera.findCamera(this.node);
            if (camera)
                camera.getCameraToWorldPoint(pos, this._touchPos);
            else
                this._touchPos.set(pos);
            let target = this._owner.hitTest(this._touchPos);
            if (!target)
                target = this._owner;

            let ti = this.getInfo(touchId);
            ti.target = target;
            ti.pos.x = pos.x;
            ti.pos.y = GRoot.inst.height - pos.y;
            ti.button = cc.Event.EventMouse.BUTTON_LEFT;
            ti.touch = touch;

            return ti;
        }

        private getInfo(touchId: number, createIfNotExisits?: boolean): TouchInfo {
            if (createIfNotExisits === undefined) createIfNotExisits = true;
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

        private setBegin(ti: TouchInfo) {
            ti.began = true;
            ti.clickCancelled = false;
            ti.downPos.set(ti.pos);

            ti.downTargets.length = 0;
            let obj: GObject = ti.target;
            while (obj != null) {
                ti.downTargets.push(obj);
                obj = obj.findParent();
            }
        }

        private setEnd(ti: TouchInfo) {
            ti.began = false;

            let now = ToolSet.getTime();
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

        private clickTest(ti: TouchInfo): GObject {
            if (ti.downTargets.length == 0
                || ti.clickCancelled
                || Math.abs(ti.pos.x - ti.downPos.x) > 50 || Math.abs(ti.pos.y - ti.downPos.y) > 50)
                return null;

            let obj = ti.downTargets[0];
            if (obj && obj.node != null && obj.node.activeInHierarchy)
                return obj;

            obj = ti.target;
            while (obj != null) {
                let index = ti.downTargets.indexOf(obj);
                if (index != -1 && obj.node != null && obj.node.activeInHierarchy)
                    break;

                obj = obj.findParent();
            }

            return obj;
        }

        private handleRollOver(ti: TouchInfo, target: GObject) {
            if (ti.lastRollOver == target)
                return;

            let element: GObject = ti.lastRollOver;
            while (element != null && element.node != null) {
                this._rollOutChain.push(element);
                element = element.findParent();
            }

            element = target;
            while (element != null && element.node != null) {
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
                if (element.node != null && element.node.activeInHierarchy) {
                    let evt = this.getEvent(ti, element, Event.ROLL_OUT, false);
                    element.node.dispatchEvent(evt);
                    Event._return(evt);
                }
            }

            cnt = this._rollOverChain.length;
            for (let i = 0; i < cnt; i++) {
                element = this._rollOverChain[i];
                if (element.node != null && element.node.activeInHierarchy) {
                    let evt = this.getEvent(ti, element, Event.ROLL_OVER, false);
                    element.node.dispatchEvent(evt);
                    Event._return(evt);
                }
            }

            this._rollOutChain.length = 0;
            this._rollOverChain.length = 0;
        }

        private getEvent(ti: TouchInfo, target: GObject, type: string, bubbles: boolean): Event {
            let evt = Event._borrow(type, bubbles);
            evt.initiator = target;
            evt.touch = ti.touch;
            evt.pos.set(ti.pos);
            evt.touchId = ti.touch ? ti.touch.getID() : 0;
            evt.clickCount = ti.clickCount;
            evt.button = ti.button;
            evt.mouseWheelDelta = ti.mouseWheelDelta;
            evt._processor = this;

            return evt;
        }
    }

    class TouchInfo {
        constructor() {
        }

        public target: GObject;
        public touch: cc.Touch;
        public pos: cc.Vec2 = new cc.Vec2();
        public touchId: number = 0;
        public clickCount: number = 0;
        public mouseWheelDelta: number = 0;
        public button: number = -1;
        public downPos: cc.Vec2 = new cc.Vec2();
        public began: boolean = false;
        public clickCancelled: boolean = false;
        public lastClickTime: number = 0;
        public lastRollOver: GObject;
        public downTargets: Array<GObject> = new Array<GObject>();
        public touchMonitors: Array<GObject> = new Array<GObject>();
    };
}