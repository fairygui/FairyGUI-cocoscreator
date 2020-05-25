namespace fgui {
    export class EventMouse extends cc.Event {
        // Inner event types of MouseEvent

        /**
         * @en The none event code of mouse event.
         * @zh 无效事件代码
         */
        public static NONE = 0;

        /**
         * @en The event code of mouse down event.
         * @zh 鼠标按下事件代码。
         */
        public static DOWN = 1;

        /**
         * @en The event code of mouse up event.
         * @zh 鼠标按下后释放事件代码。
         */
        public static UP = 2;

        /**
         * @en The event code of mouse move event.
         * @zh 鼠标移动事件。
         */
        public static MOVE = 3;

        /**
         * @en The event code of mouse scroll event.
         * @zh 鼠标滚轮事件。
         */
        public static SCROLL = 4;

        /**
         * @en The default tag when no button is pressed
         * @zh 按键默认的缺省状态
         */
        public static BUTTON_MISSING = -1;

        /**
         * @en The tag of mouse's left button.
         * @zh 鼠标左键的标签。
         */
        public static BUTTON_LEFT = 0;

        /**
         * @en The tag of mouse's right button  (The right button number is 2 on browser).
         * @zh 鼠标右键的标签。
         */
        public static BUTTON_RIGHT = 2;

        /**
         * @en The tag of mouse's middle button.
         * @zh 鼠标中键的标签。
         */
        public static BUTTON_MIDDLE = 1;

        /**
         * @en The tag of mouse's button 4.
         * @zh 鼠标按键 4 的标签。
         */
        public static BUTTON_4 = 3;

        /**
         * @en The tag of mouse's button 5.
         * @zh 鼠标按键 5 的标签。
         */
        public static BUTTON_5 = 4;

        /**
         * @en The tag of mouse's button 6.
         * @zh 鼠标按键 6 的标签。
         */
        public static BUTTON_6 = 5;

        /**
         * @en The tag of mouse's button 7.
         * @zh 鼠标按键 7 的标签。
         */
        public static BUTTON_7 = 6;

        /**
         * @en The tag of mouse's button 8.
         * @zh 鼠标按键 8 的标签。
         */
        public static BUTTON_8 = 7;

        /**
         * @en Mouse movement on x axis of the UI coordinate system.
         * @zh 鼠标在 UI 坐标系下 X 轴上的移动距离
         */
        public movementX: number = 0;

        /**
         * @en Mouse movement on y axis of the UI coordinate system.
         * @zh 鼠标在 UI 坐标系下 Y 轴上的移动距离
         */
        public movementY: number = 0;

        /**
         * @en The type of the event, possible values are UP, DOWN, MOVE, SCROLL
         * @zh 鼠标事件类型，可以是 UP, DOWN, MOVE, CANCELED。
         */
        public eventType: number;

        private _button: number = EventMouse.BUTTON_MISSING;

        private _x: number = 0;

        private _y: number = 0;

        private _prevX: number = 0;

        private _prevY: number = 0;

        private _scrollX: number = 0;

        private _scrollY: number = 0;

        /**
         * @param eventType - The type of the event, possible values are UP, DOWN, MOVE, SCROLL
         * @param bubbles - Indicate whether the event bubbles up through the hierarchy or not.
         */
        constructor(eventType: number, bubbles?: boolean, prevLoc?: cc.Vec2) {
            super(Event.MOUSE, bubbles);
            this.eventType = eventType;
            if (prevLoc) {
                this._prevX = prevLoc.x;
                this._prevY = prevLoc.y;
            }
        }

        /**
         * @en Sets scroll data of the mouse.
         * @zh 设置鼠标滚轮的滚动数据。
         * @param scrollX - The scroll value on x axis
         * @param scrollY - The scroll value on y axis
         */
        public setScrollData(scrollX: number, scrollY: number) {
            this._scrollX = scrollX;
            this._scrollY = scrollY;
        }

        /**
         * @en Returns the scroll value on x axis.
         * @zh 获取鼠标滚动的 X 轴距离，只有滚动时才有效。
         */
        public getScrollX() {
            return this._scrollX;
        }

        /**
         * @en Returns the scroll value on y axis.
         * @zh 获取滚轮滚动的 Y 轴距离，只有滚动时才有效。
         */
        public getScrollY() {
            return this._scrollY;
        }

        /**
         * @en Sets cursor location.
         * @zh 设置当前鼠标位置。
         * @param x - The location on x axis
         * @param y - The location on y axis
         */
        public setLocation(x: number, y: number) {
            this._x = x;
            this._y = y;
        }

        /**
         * @en Returns cursor location.
         * @zh 获取鼠标相对于左下角位置对象，对象包含 x 和 y 属性。
         * @param out - Pass the out object to avoid object creation, very good practice
         */
        public getLocation(out?: cc.Vec2) {
            if (!out) {
                out = new cc.Vec2();
            }

            cc.Vec2.set(out, this._x, this._y);
            return out;
        }

        /**
         * @en Returns the current cursor location in game view coordinates.
         * @zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
         * @param out - Pass the out object to avoid object creation, very good practice
         */
        public getLocationInView(out?: cc.Vec2) {
            if (!out) {
                out = new cc.Vec2();
            }

            cc.Vec2.set(out, this._x, cc.view._designResolutionSize.height - this._y);
            return out;
        }

        /**
         * @en Returns the current cursor location in ui coordinates.
         * @zh 获取当前事件在 UI 窗口内的坐标位置，对象包含 x 和 y 属性。
         * @param out - Pass the out object to avoid object creation, very good practice
         */
        public getUILocation(out?: cc.Vec2) {
            if (!out) {
                out = new cc.Vec2();
            }

            cc.Vec2.set(out, this._x, this._y);
            cc.view["_convertPointWithScale"](out);
            return out;
        }

        /**
         * @en Returns the previous touch location.
         * @zh 获取鼠标点击在上一次事件时的位置对象，对象包含 x 和 y 属性。
         * @param out - Pass the out object to avoid object creation, very good practice
         */
        public getPreviousLocation(out?: cc.Vec2) {
            if (!out) {
                out = new cc.Vec2();
            }

            cc.Vec2.set(out, this._prevX, this._prevY);
            return out;
        }

        /**
         * @en Returns the previous touch location.
         * @zh 获取鼠标点击在上一次事件时的位置对象，对象包含 x 和 y 属性。
         * @param out - Pass the out object to avoid object creation, very good practice
         */
        public getUIPreviousLocation(out?: cc.Vec2) {
            if (!out) {
                out = new cc.Vec2();
            }

            cc.Vec2.set(out, this._prevX, this._prevY);
            cc.view["_convertPointWithScale"](out);
            return out;
        }

        /**
         * @en Returns the delta distance from the previous location to current location.
         * @zh 获取鼠标距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
         * @param out - Pass the out object to avoid object creation, very good practice
         */
        public getDelta(out?: cc.Vec2) {
            if (!out) {
                out = new cc.Vec2();
            }

            cc.Vec2.set(out, this._x - this._prevX, this._y - this._prevY);
            return out;
        }

        /**
         * @en Returns the X axis delta distance from the previous location to current location.
         * @zh 获取鼠标距离上一次事件移动的 X 轴距离。
         */
        public getDeltaX() {
            return this._x - this._prevX;
        }

        /**
         * @en Returns the Y axis delta distance from the previous location to current location.
         * @zh 获取鼠标距离上一次事件移动的 Y 轴距离。
         */
        public getDeltaY() {
            return this._y - this._prevY;
        }

        /**
         * @en Returns the delta distance from the previous location to current location in the UI coordinates.
         * @zh 获取鼠标距离上一次事件移动在 UI 坐标系下的距离对象，对象包含 x 和 y 属性。
         * @param out - Pass the out object to avoid object creation, very good practice
         */
        public getUIDelta(out?: cc.Vec2) {
            if (!out) {
                out = new cc.Vec2();
            }

            cc.Vec2.set(out, (this._x - this._prevX) / cc.view.getScaleX(), (this._y - this._prevY) / cc.view.getScaleY());
            return out;
        }

        /**
         * @en Returns the X axis delta distance from the previous location to current location in the UI coordinates.
         * @zh 获取鼠标距离上一次事件移动在 UI 坐标系下的 X 轴距离。
         */
        public getUIDeltaX() {
            return (this._x - this._prevX) / cc.view.getScaleX();
        }

        /**
         * @en Returns the Y axis delta distance from the previous location to current location in the UI coordinates.
         * @zh 获取鼠标距离上一次事件移动在 UI 坐标系下的 Y 轴距离。
         */
        public getUIDeltaY() {
            return (this._y - this._prevY) / cc.view.getScaleY();
        }

        /**
         * @en Sets mouse button code.
         * @zh 设置鼠标按键。
         * @param button - The button code
         */
        public setButton(button: number) {
            this._button = button;
        }

        /**
         * @en Returns mouse button code.
         * @zh 获取鼠标按键。
         */
        public getButton() {
            return this._button;
        }

        /**
         * @en Returns location data on X axis.
         * @zh 获取鼠标当前 X 轴位置。
         */
        public getLocationX() {
            return this._x;
        }

        /**
         * @en Returns location data on Y axis.
         * @zh 获取鼠标当前 Y 轴位置。
         */
        public getLocationY() {
            return this._y;
        }

        /**
         * @en Returns location data on X axis.
         * @zh 获取鼠标当前 X 轴位置。
         */
        public getUILocationX() {
            const viewport = cc.view.getViewportRect();
            return (this._x - viewport.x) / cc.view.getScaleX();
        }

        /**
         * @en Returns location data on Y axis.
         * @zh 获取鼠标当前 Y 轴位置。
         */
        public getUILocationY() {
            const viewport = cc.view.getViewportRect();
            return (this._y - viewport.y) / cc.view.getScaleY();
        }
    }
}