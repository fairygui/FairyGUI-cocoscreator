import { EaseType } from "./EaseType";
import { GPath } from "./GPath";
import { evaluateEase } from "./EaseManager";
import { Vec2 } from "cc";
import { TweenValue } from "./TweenValue";

var s_vec2: Vec2 = new Vec2();

export class GTweener {
    public _target: any;
    public _propType: any;
    public _killed: boolean;
    public _paused: boolean;

    private _delay: number = 0;
    private _duration: number = 0;
    private _breakpoint: number = 0;
    private _easeType: number = 0;
    private _easeOvershootOrAmplitude: number = 0;
    private _easePeriod: number = 0;
    private _repeat: number = 0;
    private _yoyo: boolean = false;
    private _timeScale: number = 1;
    private _snapping: boolean = false;
    private _userData: any;
    private _path: GPath | null;

    private _onUpdate: Function | null;
    private _onStart: Function | null;
    private _onComplete: Function | null;
    private _onUpdateCaller: any | null;
    private _onStartCaller: any | null;
    private _onCompleteCaller: any | null;

    private _startValue: TweenValue;
    private _endValue: TweenValue;
    private _value: TweenValue;
    private _deltaValue: TweenValue;
    private _valueSize: number;

    private _started: boolean;
    private _ended: number;
    private _elapsedTime: number;
    private _normalizedTime: number;

    public constructor() {
        this._startValue = new TweenValue();
        this._endValue = new TweenValue();
        this._value = new TweenValue();
        this._deltaValue = new TweenValue();

        this._reset();
    }

    public setDelay(value: number): GTweener {
        this._delay = value;
        return this;
    }

    public get delay(): number {
        return this._delay;
    }

    public setDuration(value: number): GTweener {
        this._duration = value;
        return this;
    }

    public get duration(): number {
        return this._duration;
    }

    public setBreakpoint(value: number): GTweener {
        this._breakpoint = value;
        return this;
    }

    public setEase(value: number): GTweener {
        this._easeType = value;
        return this;
    }

    public setEasePeriod(value: number): GTweener {
        this._easePeriod = value;
        return this;
    }

    public setEaseOvershootOrAmplitude(value: number): GTweener {
        this._easeOvershootOrAmplitude = value;
        return this;
    }

    public setRepeat(repeat: number, yoyo?: boolean): GTweener {
        this._repeat = repeat;
        this._yoyo = yoyo;
        return this;
    }

    public get repeat(): number {
        return this._repeat;
    }

    public setTimeScale(value: number): GTweener {
        this._timeScale = value;
        return this;
    }

    public setSnapping(value: boolean): GTweener {
        this._snapping = value;
        return this;
    }

    public setTarget(value: any, propType?: any): GTweener {
        this._target = value;
        this._propType = propType;
        return this;
    }

    public get target(): any {
        return this._target;
    }

    public setPath(value: GPath): GTweener {
        this._path = value;
        return this;
    }

    public setUserData(value: any): GTweener {
        this._userData = value;
        return this;
    }

    public get userData(): any {
        return this._userData;
    }

    public onUpdate(callback: Function, target?: any): GTweener {
        this._onUpdate = callback;
        this._onUpdateCaller = target;
        return this;
    }

    public onStart(callback: Function, target?: any): GTweener {
        this._onStart = callback;
        this._onStartCaller = target;
        return this;
    }

    public onComplete(callback: Function, target?: any): GTweener {
        this._onComplete = callback;
        this._onCompleteCaller = target;
        return this;
    }

    public get startValue(): TweenValue {
        return this._startValue;
    }

    public get endValue(): TweenValue {
        return this._endValue;
    }

    public get value(): TweenValue {
        return this._value;
    }

    public get deltaValue(): TweenValue {
        return this._deltaValue;
    }

    public get normalizedTime(): number {
        return this._normalizedTime;
    }

    public get completed(): boolean {
        return this._ended != 0;
    }

    public get allCompleted(): boolean {
        return this._ended == 1;
    }

    public setPaused(paused: boolean): GTweener {
        this._paused = paused;
        return this;
    }

    /**
     * seek position of the tween, in seconds.
     */
    public seek(time: number): void {
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

    public kill(complete?: boolean): void {
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

    public _to(start: number, end: number, duration: number): GTweener {
        this._valueSize = 1;
        this._startValue.x = start;
        this._endValue.x = end;
        this._value.x = start;
        this._duration = duration;
        return this;
    }

    public _to2(start: number, start2: number, end: number, end2: number, duration: number): GTweener {
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

    public _to3(start: number, start2: number, start3: number,
        end: number, end2: number, end3: number, duration: number): GTweener {
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

    public _to4(start: number, start2: number, start3: number, start4: number,
        end: number, end2: number, end3: number, end4: number, duration: number): GTweener {
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

    public _toColor(start: number, end: number, duration: number): GTweener {
        this._valueSize = 5;
        this._startValue.color = start;
        this._endValue.color = end;
        this._value.color = start;
        this._duration = duration;
        return this;
    }

    public _shake(startX: number, startY: number, amplitude: number, duration: number): GTweener {
        this._valueSize = 6;
        this._startValue.x = startX;
        this._startValue.y = startY;
        this._startValue.w = amplitude;
        this._duration = duration;
        return this;
    }

    public _init(): void {
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

    public _reset(): void {
        this._target = null;
        this._propType = null;
        this._userData = null;
        this._path = null;
        this._onStart = this._onUpdate = this._onComplete = null;
        this._onStartCaller = this._onUpdateCaller = this._onCompleteCaller = null;
    }

    public _update(dt: number): void {
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

    private update(): void {
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

        var reversed: boolean = false;
        var tt: number = this._elapsedTime - this._delay;
        if (this._breakpoint >= 0 && tt >= this._breakpoint) {
            tt = this._breakpoint;
            this._ended = 2;
        }

        if (this._repeat != 0) {
            var round: number = Math.floor(tt / this._duration);
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

        this._normalizedTime = evaluateEase(this._easeType, reversed ? (this._duration - tt) : tt, this._duration,
            this._easeOvershootOrAmplitude, this._easePeriod);

        this._value.setZero();
        this._deltaValue.setZero();

        if (this._valueSize == 6) {
            if (this._ended == 0) {
                var r: number = this._startValue.w * (1 - this._normalizedTime);
                var rx: number = r * (Math.random() > 0.5 ? 1 : -1);
                var ry: number = r * (Math.random() > 0.5 ? 1 : -1);

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
            for (var i: number = 0; i < this._valueSize; i++) {
                var n1: number = this._startValue.getField(i);
                var n2: number = this._endValue.getField(i);
                var f: number = n1 + (n2 - n1) * this._normalizedTime;
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

    private callStartCallback(): void {
        if (this._onStart) {
            try {
                this._onStart.call(this._onStartCaller, this);
            }
            catch (err) {
                console.log("error in start callback > " + err);
            }
        }
    }

    private callUpdateCallback(): void {
        if (this._onUpdate) {
            try {
                this._onUpdate.call(this._onUpdateCaller, this);
            }
            catch (err) {
                console.log("error in update callback > " + err);
            }
        }
    }

    private callCompleteCallback(): void {
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

