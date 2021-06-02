import { EaseType } from "./EaseType";
import { evaluateEase } from "./EaseManager";
import { Vec2 } from "cc";
import { TweenValue } from "./TweenValue";
var s_vec2 = new Vec2();
export class GTweener {
    constructor() {
        this._delay = 0;
        this._duration = 0;
        this._breakpoint = 0;
        this._easeType = 0;
        this._easeOvershootOrAmplitude = 0;
        this._easePeriod = 0;
        this._repeat = 0;
        this._yoyo = false;
        this._timeScale = 1;
        this._snapping = false;
        this._startValue = new TweenValue();
        this._endValue = new TweenValue();
        this._value = new TweenValue();
        this._deltaValue = new TweenValue();
        this._reset();
    }
    setDelay(value) {
        this._delay = value;
        return this;
    }
    get delay() {
        return this._delay;
    }
    setDuration(value) {
        this._duration = value;
        return this;
    }
    get duration() {
        return this._duration;
    }
    setBreakpoint(value) {
        this._breakpoint = value;
        return this;
    }
    setEase(value) {
        this._easeType = value;
        return this;
    }
    setEasePeriod(value) {
        this._easePeriod = value;
        return this;
    }
    setEaseOvershootOrAmplitude(value) {
        this._easeOvershootOrAmplitude = value;
        return this;
    }
    setRepeat(repeat, yoyo) {
        this._repeat = repeat;
        this._yoyo = yoyo;
        return this;
    }
    get repeat() {
        return this._repeat;
    }
    setTimeScale(value) {
        this._timeScale = value;
        return this;
    }
    setSnapping(value) {
        this._snapping = value;
        return this;
    }
    setTarget(value, propType) {
        this._target = value;
        this._propType = propType;
        return this;
    }
    get target() {
        return this._target;
    }
    setPath(value) {
        this._path = value;
        return this;
    }
    setUserData(value) {
        this._userData = value;
        return this;
    }
    get userData() {
        return this._userData;
    }
    onUpdate(callback, target) {
        this._onUpdate = callback;
        this._onUpdateCaller = target;
        return this;
    }
    onStart(callback, target) {
        this._onStart = callback;
        this._onStartCaller = target;
        return this;
    }
    onComplete(callback, target) {
        this._onComplete = callback;
        this._onCompleteCaller = target;
        return this;
    }
    get startValue() {
        return this._startValue;
    }
    get endValue() {
        return this._endValue;
    }
    get value() {
        return this._value;
    }
    get deltaValue() {
        return this._deltaValue;
    }
    get normalizedTime() {
        return this._normalizedTime;
    }
    get completed() {
        return this._ended != 0;
    }
    get allCompleted() {
        return this._ended == 1;
    }
    setPaused(paused) {
        this._paused = paused;
        return this;
    }
    /**
     * seek position of the tween, in seconds.
     */
    seek(time) {
        if (this._killed)
            return;
        this._elapsedTime = time;
        if (this._elapsedTime < this._delay) {
            if (this._started)
                this._elapsedTime = this._delay;
            else
                return;
        }
        this.update();
    }
    kill(complete) {
        if (this._killed)
            return;
        if (complete) {
            if (this._ended == 0) {
                if (this._breakpoint >= 0)
                    this._elapsedTime = this._delay + this._breakpoint;
                else if (this._repeat >= 0)
                    this._elapsedTime = this._delay + this._duration * (this._repeat + 1);
                else
                    this._elapsedTime = this._delay + this._duration * 2;
                this.update();
            }
            this.callCompleteCallback();
        }
        this._killed = true;
    }
    _to(start, end, duration) {
        this._valueSize = 1;
        this._startValue.x = start;
        this._endValue.x = end;
        this._value.x = start;
        this._duration = duration;
        return this;
    }
    _to2(start, start2, end, end2, duration) {
        this._valueSize = 2;
        this._startValue.x = start;
        this._endValue.x = end;
        this._startValue.y = start2;
        this._endValue.y = end2;
        this._value.x = start;
        this._value.y = start2;
        this._duration = duration;
        return this;
    }
    _to3(start, start2, start3, end, end2, end3, duration) {
        this._valueSize = 3;
        this._startValue.x = start;
        this._endValue.x = end;
        this._startValue.y = start2;
        this._endValue.y = end2;
        this._startValue.z = start3;
        this._endValue.z = end3;
        this._value.x = start;
        this._value.y = start2;
        this._value.z = start3;
        this._duration = duration;
        return this;
    }
    _to4(start, start2, start3, start4, end, end2, end3, end4, duration) {
        this._valueSize = 4;
        this._startValue.x = start;
        this._endValue.x = end;
        this._startValue.y = start2;
        this._endValue.y = end2;
        this._startValue.z = start3;
        this._endValue.z = end3;
        this._startValue.w = start4;
        this._endValue.w = end4;
        this._value.x = start;
        this._value.y = start2;
        this._value.z = start3;
        this._value.w = start4;
        this._duration = duration;
        return this;
    }
    _toColor(start, end, duration) {
        this._valueSize = 5;
        this._startValue.color = start;
        this._endValue.color = end;
        this._value.color = start;
        this._duration = duration;
        return this;
    }
    _shake(startX, startY, amplitude, duration) {
        this._valueSize = 6;
        this._startValue.x = startX;
        this._startValue.y = startY;
        this._startValue.w = amplitude;
        this._duration = duration;
        return this;
    }
    _init() {
        this._delay = 0;
        this._duration = 0;
        this._breakpoint = -1;
        this._easeType = EaseType.QuadOut;
        this._timeScale = 1;
        this._easePeriod = 0;
        this._easeOvershootOrAmplitude = 1.70158;
        this._snapping = false;
        this._repeat = 0;
        this._yoyo = false;
        this._valueSize = 0;
        this._started = false;
        this._paused = false;
        this._killed = false;
        this._elapsedTime = 0;
        this._normalizedTime = 0;
        this._ended = 0;
    }
    _reset() {
        this._target = null;
        this._propType = null;
        this._userData = null;
        this._path = null;
        this._onStart = this._onUpdate = this._onComplete = null;
        this._onStartCaller = this._onUpdateCaller = this._onCompleteCaller = null;
    }
    _update(dt) {
        if (this._timeScale != 1)
            dt *= this._timeScale;
        if (dt == 0)
            return;
        if (this._ended != 0) //Maybe completed by seek
         {
            this.callCompleteCallback();
            this._killed = true;
            return;
        }
        this._elapsedTime += dt;
        this.update();
        if (this._ended != 0) {
            if (!this._killed) {
                this.callCompleteCallback();
                this._killed = true;
            }
        }
    }
    update() {
        this._ended = 0;
        if (this._valueSize == 0) //DelayedCall
         {
            if (this._elapsedTime >= this._delay + this._duration)
                this._ended = 1;
            return;
        }
        if (!this._started) {
            if (this._elapsedTime < this._delay)
                return;
            this._started = true;
            this.callStartCallback();
            if (this._killed)
                return;
        }
        var reversed = false;
        var tt = this._elapsedTime - this._delay;
        if (this._breakpoint >= 0 && tt >= this._breakpoint) {
            tt = this._breakpoint;
            this._ended = 2;
        }
        if (this._repeat != 0) {
            var round = Math.floor(tt / this._duration);
            tt -= this._duration * round;
            if (this._yoyo)
                reversed = round % 2 == 1;
            if (this._repeat > 0 && this._repeat - round < 0) {
                if (this._yoyo)
                    reversed = this._repeat % 2 == 1;
                tt = this._duration;
                this._ended = 1;
            }
        }
        else if (tt >= this._duration) {
            tt = this._duration;
            this._ended = 1;
        }
        this._normalizedTime = evaluateEase(this._easeType, reversed ? (this._duration - tt) : tt, this._duration, this._easeOvershootOrAmplitude, this._easePeriod);
        this._value.setZero();
        this._deltaValue.setZero();
        if (this._valueSize == 6) {
            if (this._ended == 0) {
                var r = this._startValue.w * (1 - this._normalizedTime);
                var rx = r * (Math.random() > 0.5 ? 1 : -1);
                var ry = r * (Math.random() > 0.5 ? 1 : -1);
                this._deltaValue.x = rx;
                this._deltaValue.y = ry;
                this._value.x = this._startValue.x + rx;
                this._value.y = this._startValue.y + ry;
            }
            else {
                this._value.x = this._startValue.x;
                this._value.y = this._startValue.y;
            }
        }
        else if (this._path) {
            let pt = this._path.getPointAt(this._normalizedTime, s_vec2);
            if (this._snapping) {
                pt.x = Math.round(pt.x);
                pt.y = Math.round(pt.y);
            }
            this._deltaValue.x = pt.x - this._value.x;
            this._deltaValue.y = pt.y - this._value.y;
            this._value.x = pt.x;
            this._value.y = pt.y;
        }
        else {
            for (var i = 0; i < this._valueSize; i++) {
                var n1 = this._startValue.getField(i);
                var n2 = this._endValue.getField(i);
                var f = n1 + (n2 - n1) * this._normalizedTime;
                if (this._snapping)
                    f = Math.round(f);
                this._deltaValue.setField(i, f - this._value.getField(i));
                this._value.setField(i, f);
            }
        }
        if (this._target && this._propType) {
            if (this._propType instanceof Function) {
                switch (this._valueSize) {
                    case 1:
                        this._propType.call(this._target, this._value.x);
                        break;
                    case 2:
                        this._propType.call(this._target, this._value.x, this._value.y);
                        break;
                    case 3:
                        this._propType.call(this._target, this._value.x, this._value.y, this._value.z);
                        break;
                    case 4:
                        this._propType.call(this._target, this._value.x, this._value.y, this._value.z, this._value.w);
                        break;
                    case 5:
                        this._propType.call(this._target, this._value.color);
                        break;
                    case 6:
                        this._propType.call(this._target, this._value.x, this._value.y);
                        break;
                }
            }
            else {
                if (this._valueSize == 5)
                    this._target[this._propType] = this._value.color;
                else
                    this._target[this._propType] = this._value.x;
            }
        }
        this.callUpdateCallback();
    }
    callStartCallback() {
        if (this._onStart) {
            try {
                this._onStart.call(this._onStartCaller, this);
            }
            catch (err) {
                console.log("error in start callback > " + err);
            }
        }
    }
    callUpdateCallback() {
        if (this._onUpdate) {
            try {
                this._onUpdate.call(this._onUpdateCaller, this);
            }
            catch (err) {
                console.log("error in update callback > " + err);
            }
        }
    }
    callCompleteCallback() {
        if (this._onComplete) {
            try {
                this._onComplete.call(this._onCompleteCaller, this);
            }
            catch (err) {
                console.log("error in complete callback > " + err);
            }
        }
    }
}
