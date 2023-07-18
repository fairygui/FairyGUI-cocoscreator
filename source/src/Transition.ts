import { Color, AudioClip } from "cc";
import { ObjectPropID } from "./FieldTypes";
import { GComponent } from "./GComponent";
import { Decls, GObject } from "./GObject";
import { PackageItem } from "./PackageItem";
import { EaseType } from "./tween/EaseType";
import { GPath } from "./tween/GPath";
import { GPathPoint, CurveType } from "./tween/GPathPoint";
import { GTween } from "./tween/GTween";
import { GTweener } from "./tween/GTweener";
import { UIPackage } from "./UIPackage";
import { ByteBuffer } from "./utils/ByteBuffer";

export class Transition {
    public name: string;

    private _owner: GComponent;
    private _ownerBaseX: number = 0;
    private _ownerBaseY: number = 0;
    private _items: Array<Item>;
    private _totalTimes: number = 0;
    private _totalTasks: number = 0;
    private _playing: boolean;
    private _paused?: boolean;
    private _onComplete?: () => void;
    private _options: number = 0;
    private _reversed?: boolean;
    private _totalDuration: number = 0;
    private _autoPlay?: boolean;
    private _autoPlayTimes: number = 1;
    private _autoPlayDelay: number = 0;
    private _timeScale: number = 1;
    private _startTime: number = 0;
    private _endTime: number = 0;

    public constructor(owner: GComponent) {
        this._owner = owner;
        this._items = new Array<Item>();
    }

    public play(onComplete?: (() => void) | null, times?: number, delay?: number, startTime?: number, endTime?: number) {
        this._play(onComplete, times, delay, startTime, endTime, false);
    }

    public playReverse(onComplete?: (() => void) | null, times?: number, delay?: number) {
        this._play(onComplete, times, delay, 0, -1, true);
    }

    public changePlayTimes(value: number): void {
        this._totalTimes = value;
    }

    public setAutoPlay(value: boolean, times?: number, delay?: number) {
        if (times == undefined) times = -1;
        if (delay == undefined) delay = 0;
        if (this._autoPlay != value) {
            this._autoPlay = value;
            this._autoPlayTimes = times;
            this._autoPlayDelay = delay;

            if (this._autoPlay) {
                if (this._owner.onStage)
                    this.play(null, this._autoPlayTimes, this._autoPlayDelay);
            }
            else {
                if (!this._owner.onStage)
                    this.stop(false, true);
            }
        }
    }

    private _play(onComplete?: () => void, times?: number, delay?: number, startTime?: number, endTime?: number, reversed?: boolean) {
        if (times == undefined) times = 1;
        if (delay == undefined) delay = 0;
        if (startTime == undefined) startTime = 0;
        if (endTime == undefined) endTime = -1;

        this.stop(true, true);

        this._totalTimes = times;
        this._reversed = reversed;
        this._startTime = startTime;
        this._endTime = endTime;
        this._playing = true;
        this._paused = false;
        this._onComplete = onComplete;

        var cnt: number = this._items.length;
        for (var i: number = 0; i < cnt; i++) {
            var item: Item = this._items[i];
            if (item.target == null) {
                if (item.targetId)
                    item.target = this._owner.getChildById(item.targetId);
                else
                    item.target = this._owner;
            }
            else if (item.target != this._owner && item.target.parent != this._owner)
                item.target = null;

            if (item.target && item.type == ActionType.Transition) {
                var trans: Transition = (<GComponent>item.target).getTransition(item.value.transName);
                if (trans == this)
                    trans = null;
                if (trans) {
                    if (item.value.playTimes == 0) //stop
                    {
                        var j: number;
                        for (j = i - 1; j >= 0; j--) {
                            var item2: Item = this._items[j];
                            if (item2.type == ActionType.Transition) {
                                if (item2.value.trans == trans) {
                                    item2.value.stopTime = item.time - item2.time;
                                    break;
                                }
                            }
                        }
                        if (j < 0)
                            item.value.stopTime = 0;
                        else
                            trans = null;//no need to handle stop anymore
                    }
                    else
                        item.value.stopTime = -1;
                }
                item.value.trans = trans;
            }
        }

        if (delay == 0)
            this.onDelayedPlay();
        else
            GTween.delayedCall(delay).setTarget(this).onComplete(this.onDelayedPlay, this);
    }

    public stop(setToComplete?: boolean, processCallback?: boolean): void {
        if (setToComplete == undefined) setToComplete = true;
        if (!this._playing)
            return;

        this._playing = false;
        this._totalTasks = 0;
        this._totalTimes = 0;
        var func: () => void = this._onComplete;
        this._onComplete = null;

        GTween.kill(this);//delay start

        var cnt: number = this._items.length;
        if (this._reversed) {
            for (var i: number = cnt - 1; i >= 0; i--) {
                var item: Item = this._items[i];
                if (item.target == null)
                    continue;

                this.stopItem(item, setToComplete);
            }
        }
        else {
            for (i = 0; i < cnt; i++) {
                item = this._items[i];
                if (item.target == null)
                    continue;

                this.stopItem(item, setToComplete);
            }
        }

        if (processCallback && func != null) {
            func();
        }
    }

    private stopItem(item: Item, setToComplete: boolean): void {
        if (item.displayLockToken != 0) {
            item.target.releaseDisplayLock(item.displayLockToken);
            item.displayLockToken = 0;
        }

        if (item.tweener) {
            item.tweener.kill(setToComplete);
            item.tweener = null;

            if (item.type == ActionType.Shake && !setToComplete) //震动必须归位，否则下次就越震越远了。
            {
                item.target._gearLocked = true;
                item.target.setPosition(item.target.x - item.value.lastOffsetX, item.target.y - item.value.lastOffsetY);
                item.target._gearLocked = false;
            }
        }

        if (item.type == ActionType.Transition) {
            var trans: Transition = item.value.trans;
            if (trans)
                trans.stop(setToComplete, false);
        }
    }

    public setPaused(paused: boolean): void {
        if (!this._playing || this._paused == paused)
            return;

        this._paused = paused;
        var tweener: GTweener = GTween.getTween(this);
        if (tweener)
            tweener.setPaused(paused);

        var cnt: number = this._items.length;
        for (var i: number = 0; i < cnt; i++) {
            var item: Item = this._items[i];
            if (item.target == null)
                continue;

            if (item.type == ActionType.Transition) {
                if (item.value.trans)
                    item.value.trans.setPaused(paused);
            }
            else if (item.type == ActionType.Animation) {
                if (paused) {
                    item.value.flag = item.target.getProp(ObjectPropID.Playing);
                    item.target.setProp(ObjectPropID.Playing, false);
                }
                else
                    item.target.setProp(ObjectPropID.Playing, item.value.flag);
            }

            if (item.tweener)
                item.tweener.setPaused(paused);
        }
    }

    public dispose(): void {
        if (this._playing)
            GTween.kill(this);//delay start

        var cnt: number = this._items.length;
        for (var i: number = 0; i < cnt; i++) {
            var item: Item = this._items[i];
            if (item.tweener) {
                item.tweener.kill();
                item.tweener = null;
            }

            item.target = null;
            item.hook = null;
            if (item.tweenConfig)
                item.tweenConfig.endHook = null;
        }

        this._items.length = 0;
        this._playing = false;
        this._onComplete = null;
    }

    public get playing(): boolean {
        return this._playing;
    }

    public setValue(label: string, ...args: any[]): void {
        var cnt: number = this._items.length;
        var value: TValue;
        for (var i: number = 0; i < cnt; i++) {
            var item: Item = this._items[i];
            if (item.label == label) {
                if (item.tweenConfig)
                    value = item.tweenConfig.startValue;
                else
                    value = item.value;
            }
            else if (item.tweenConfig && item.tweenConfig.endLabel == label) {
                value = item.tweenConfig.endValue;
            }
            else
                continue;

            switch (item.type) {
                case ActionType.XY:
                case ActionType.Size:
                case ActionType.Pivot:
                case ActionType.Scale:
                case ActionType.Skew:
                    value.b1 = true;
                    value.b2 = true;
                    value.f1 = parseFloat(args[0]);
                    value.f2 = parseFloat(args[1]);
                    break;

                case ActionType.Alpha:
                    value.f1 = parseFloat(args[0]);
                    break;

                case ActionType.Rotation:
                    value.f1 = parseFloat(args[0]);
                    break;

                case ActionType.Color:
                    value.f1 = parseFloat(args[0]);
                    break;

                case ActionType.Animation:
                    value.frame = parseInt(args[0]);
                    if (args.length > 1)
                        value.playing = args[1];
                    break;

                case ActionType.Visible:
                    value.visible = args[0];
                    break;

                case ActionType.Sound:
                    value.sound = args[0];
                    if (args.length > 1)
                        value.volume = parseFloat(args[1]);
                    break;

                case ActionType.Transition:
                    value.transName = args[0];
                    if (args.length > 1)
                        value.playTimes = parseInt(args[1]);
                    break;

                case ActionType.Shake:
                    value.amplitude = parseFloat(args[0]);
                    if (args.length > 1)
                        value.duration = parseFloat(args[1]);
                    break;

                case ActionType.ColorFilter:
                    value.f1 = parseFloat(args[0]);
                    value.f2 = parseFloat(args[1]);
                    value.f3 = parseFloat(args[2]);
                    value.f4 = parseFloat(args[3]);
                    break;

                case ActionType.Text:
                case ActionType.Icon:
                    value.text = args[0];
                    break;
            }
        }
    }

    public setHook(label: string, callback: (label?: string) => void): void {
        var cnt: number = this._items.length;
        for (var i: number = 0; i < cnt; i++) {
            var item: Item = this._items[i];
            if (item.label == label) {
                item.hook = callback;
                break;
            }
            else if (item.tweenConfig && item.tweenConfig.endLabel == label) {
                item.tweenConfig.endHook = callback;
                break;
            }
        }
    }

    public clearHooks(): void {
        var cnt: number = this._items.length;
        for (var i: number = 0; i < cnt; i++) {
            var item: Item = this._items[i];
            item.hook = null;
            if (item.tweenConfig)
                item.tweenConfig.endHook = null;
        }
    }

    public setTarget(label: string, newTarget: GObject): void {
        var cnt: number = this._items.length;
        for (var i: number = 0; i < cnt; i++) {
            var item: Item = this._items[i];
            if (item.label == label) {
                item.targetId = newTarget.id;
                item.target = null;
            }
        }
    }

    public setDuration(label: string, value: number): void {
        var cnt: number = this._items.length;
        for (var i: number = 0; i < cnt; i++) {
            var item: Item = this._items[i];
            if (item.tweenConfig && item.label == label)
                item.tweenConfig.duration = value;
        }
    }

    public getLabelTime(label: string): number {
        var cnt: number = this._items.length;
        for (var i: number = 0; i < cnt; i++) {
            var item: Item = this._items[i];
            if (item.label == label)
                return item.time;
            else if (item.tweenConfig && item.tweenConfig.endLabel == label)
                return item.time + item.tweenConfig.duration;
        }

        return Number.NaN;
    }

    public get timeScale(): number {
        return this._timeScale;
    }

    public set timeScale(value: number) {
        if (this._timeScale != value) {
            this._timeScale = value;
            if (this._playing) {
                var cnt: number = this._items.length;
                for (var i: number = 0; i < cnt; i++) {
                    var item: Item = this._items[i];
                    if (item.tweener)
                        item.tweener.setTimeScale(value);
                    else if (item.type == ActionType.Transition) {
                        if (item.value.trans)
                            item.value.trans.timeScale = value;
                    }
                    else if (item.type == ActionType.Animation) {
                        if (item.target)
                            item.target.setProp(ObjectPropID.TimeScale, value);
                    }
                }
            }
        }
    }

    public updateFromRelations(targetId: string, dx: number, dy: number): void {
        var cnt: number = this._items.length;
        if (cnt == 0)
            return;

        for (var i: number = 0; i < cnt; i++) {
            var item: Item = this._items[i];
            if (item.type == ActionType.XY && item.targetId == targetId) {
                if (item.tweenConfig) {
                    item.tweenConfig.startValue.f1 += dx;
                    item.tweenConfig.startValue.f2 += dy;
                    item.tweenConfig.endValue.f1 += dx;
                    item.tweenConfig.endValue.f2 += dy;
                }
                else {
                    item.value.f1 += dx;
                    item.value.f2 += dy;
                }
            }
        }
    }

    public onEnable(): void {
        if (this._autoPlay && !this._playing)
            this.play(null, this._autoPlayTimes, this._autoPlayDelay);
    }

    public onDisable(): void {
        if ((this._options & OPTION_AUTO_STOP_DISABLED) == 0)
            this.stop((this._options & OPTION_AUTO_STOP_AT_END) != 0 ? true : false, false);
    }

    private onDelayedPlay(): void {
        this.internalPlay();

        this._playing = this._totalTasks > 0;
        if (this._playing) {
            if ((this._options & OPTION_IGNORE_DISPLAY_CONTROLLER) != 0) {
                var cnt: number = this._items.length;
                for (var i: number = 0; i < cnt; i++) {
                    var item: Item = this._items[i];
                    if (item.target && item.target != this._owner)
                        item.displayLockToken = item.target.addDisplayLock();
                }
            }
        }
        else if (this._onComplete != null) {
            var func: () => void = this._onComplete;
            this._onComplete = null;
            func();
        }
    }

    private internalPlay(): void {
        this._ownerBaseX = this._owner.x;
        this._ownerBaseY = this._owner.y;

        this._totalTasks = 1;

        var cnt: number = this._items.length;
        var item: Item;
        var needSkipAnimations: boolean = false;
        var i: number;

        if (!this._reversed) {
            for (i = 0; i < cnt; i++) {
                item = this._items[i];
                if (item.target == null)
                    continue;

                if (item.type == ActionType.Animation && this._startTime != 0 && item.time <= this._startTime) {
                    needSkipAnimations = true;
                    item.value.flag = false;
                }
                else
                    this.playItem(item);
            }
        }
        else {
            for (i = cnt - 1; i >= 0; i--) {
                item = this._items[i];
                if (item.target == null)
                    continue;

                this.playItem(item);
            }
        }

        if (needSkipAnimations)
            this.skipAnimations();

        this._totalTasks--;
    }

    private playItem(item: Item): void {
        var time: number;
        if (item.tweenConfig) {
            if (this._reversed)
                time = (this._totalDuration - item.time - item.tweenConfig.duration);
            else
                time = item.time;
            if (this._endTime == -1 || time <= this._endTime) {
                var startValue: TValue;
                var endValue: TValue;
                if (this._reversed) {
                    startValue = item.tweenConfig.endValue;
                    endValue = item.tweenConfig.startValue;
                }
                else {
                    startValue = item.tweenConfig.startValue;
                    endValue = item.tweenConfig.endValue;
                }

                item.value.b1 = startValue.b1 || endValue.b1;
                item.value.b2 = startValue.b2 || endValue.b2;

                switch (item.type) {
                    case ActionType.XY:
                    case ActionType.Size:
                    case ActionType.Scale:
                    case ActionType.Skew:
                        item.tweener = GTween.to2(startValue.f1, startValue.f2, endValue.f1, endValue.f2, item.tweenConfig.duration);
                        break;

                    case ActionType.Alpha:
                    case ActionType.Rotation:
                        item.tweener = GTween.to(startValue.f1, endValue.f1, item.tweenConfig.duration);
                        break;

                    case ActionType.Color:
                        item.tweener = GTween.toColor(startValue.f1, endValue.f1, item.tweenConfig.duration);
                        break;

                    case ActionType.ColorFilter:
                        item.tweener = GTween.to4(startValue.f1, startValue.f2, startValue.f3, startValue.f4,
                            endValue.f1, endValue.f2, endValue.f3, endValue.f4, item.tweenConfig.duration);
                        break;
                }

                item.tweener.setDelay(time)
                    .setEase(item.tweenConfig.easeType)
                    .setRepeat(item.tweenConfig.repeat, item.tweenConfig.yoyo)
                    .setTimeScale(this._timeScale)
                    .setTarget(item)
                    .onStart(this.onTweenStart, this)
                    .onUpdate(this.onTweenUpdate, this)
                    .onComplete(this.onTweenComplete, this);

                if (this._endTime >= 0)
                    item.tweener.setBreakpoint(this._endTime - time);

                this._totalTasks++;
            }
        }
        else if (item.type == ActionType.Shake) {
            if (this._reversed)
                time = (this._totalDuration - item.time - item.value.duration);
            else
                time = item.time;

            item.value.offsetX = item.value.offsetY = 0;
            item.value.lastOffsetX = item.value.lastOffsetY = 0;
            item.tweener = GTween.shake(0, 0, item.value.amplitude, item.value.duration)
                .setDelay(time)
                .setTimeScale(this._timeScale)
                .setTarget(item)
                .onUpdate(this.onTweenUpdate, this)
                .onComplete(this.onTweenComplete, this);

            if (this._endTime >= 0)
                item.tweener.setBreakpoint(this._endTime - item.time);

            this._totalTasks++;
        }
        else {
            if (this._reversed)
                time = (this._totalDuration - item.time);
            else
                time = item.time;

            if (time <= this._startTime) {
                this.applyValue(item);
                this.callHook(item, false);
            }
            else if (this._endTime == -1 || time <= this._endTime) {
                this._totalTasks++;
                item.tweener = GTween.delayedCall(time)
                    .setTimeScale(this._timeScale)
                    .setTarget(item)
                    .onComplete(this.onDelayedPlayItem, this);
            }
        }

        if (item.tweener)
            item.tweener.seek(this._startTime);
    }

    private skipAnimations(): void {
        var frame: number;
        var playStartTime: number;
        var playTotalTime: number;
        var value: TValue;
        var target: GObject;
        var item: Item;

        var cnt: number = this._items.length;
        for (var i: number = 0; i < cnt; i++) {
            item = this._items[i];
            if (item.type != ActionType.Animation || item.time > this._startTime)
                continue;

            value = item.value;
            if (value.flag)
                continue;

            target = item.target;
            frame = target.getProp(ObjectPropID.Frame);
            playStartTime = target.getProp(ObjectPropID.Playing) ? 0 : -1;
            playTotalTime = 0;

            for (var j: number = i; j < cnt; j++) {
                item = this._items[j];
                if (item.type != ActionType.Animation || item.target != target || item.time > this._startTime)
                    continue;

                value = item.value;
                value.flag = true;

                if (value.frame != -1) {
                    frame = value.frame;
                    if (value.playing)
                        playStartTime = item.time;
                    else
                        playStartTime = -1;
                    playTotalTime = 0;
                }
                else {
                    if (value.playing) {
                        if (playStartTime < 0)
                            playStartTime = item.time;
                    }
                    else {
                        if (playStartTime >= 0)
                            playTotalTime += (item.time - playStartTime);
                        playStartTime = -1;
                    }
                }

                this.callHook(item, false);
            }

            if (playStartTime >= 0)
                playTotalTime += (this._startTime - playStartTime);

            target.setProp(ObjectPropID.Playing, playStartTime >= 0);
            target.setProp(ObjectPropID.Frame, frame);
            if (playTotalTime > 0)
                target.setProp(ObjectPropID.DeltaTime, playTotalTime);
        }
    }

    private onDelayedPlayItem(tweener: GTweener): void {
        var item: Item = <Item>tweener.target;
        item.tweener = null;
        this._totalTasks--;

        this.applyValue(item);
        this.callHook(item, false);

        this.checkAllComplete();
    }

    private onTweenStart(tweener: GTweener): void {
        var item: Item = <Item>tweener.target;

        if (item.type == ActionType.XY || item.type == ActionType.Size) //位置和大小要到start才最终确认起始值
        {
            var startValue: TValue;
            var endValue: TValue;

            if (this._reversed) {
                startValue = item.tweenConfig.endValue;
                endValue = item.tweenConfig.startValue;
            }
            else {
                startValue = item.tweenConfig.startValue;
                endValue = item.tweenConfig.endValue;
            }

            if (item.type == ActionType.XY) {
                if (item.target != this._owner) {
                    if (!startValue.b1)
                        tweener.startValue.x = item.target.x;
                    else if (startValue.b3) //percent
                        tweener.startValue.x = startValue.f1 * this._owner.width;

                    if (!startValue.b2)
                        tweener.startValue.y = item.target.y;
                    else if (startValue.b3) //percent
                        tweener.startValue.y = startValue.f2 * this._owner.height;

                    if (!endValue.b1)
                        tweener.endValue.x = tweener.startValue.x;
                    else if (endValue.b3)
                        tweener.endValue.x = endValue.f1 * this._owner.width;

                    if (!endValue.b2)
                        tweener.endValue.y = tweener.startValue.y;
                    else if (endValue.b3)
                        tweener.endValue.y = endValue.f2 * this._owner.height;
                }
                else {
                    if (!startValue.b1)
                        tweener.startValue.x = item.target.x - this._ownerBaseX;
                    if (!startValue.b2)
                        tweener.startValue.y = item.target.y - this._ownerBaseY;

                    if (!endValue.b1)
                        tweener.endValue.x = tweener.startValue.x;
                    if (!endValue.b2)
                        tweener.endValue.y = tweener.startValue.y;
                }
            }
            else {
                if (!startValue.b1)
                    tweener.startValue.x = item.target.width;
                if (!startValue.b2)
                    tweener.startValue.y = item.target.height;

                if (!endValue.b1)
                    tweener.endValue.x = tweener.startValue.x;
                if (!endValue.b2)
                    tweener.endValue.y = tweener.startValue.y;
            }

            if (item.tweenConfig.path) {
                item.value.b1 = item.value.b2 = true;
                tweener.setPath(item.tweenConfig.path);
            }
        }

        this.callHook(item, false);
    }

    private onTweenUpdate(tweener: GTweener): void {
        var item: Item = <Item>tweener.target;
        switch (item.type) {
            case ActionType.XY:
            case ActionType.Size:
            case ActionType.Scale:
            case ActionType.Skew:
                item.value.f1 = tweener.value.x;
                item.value.f2 = tweener.value.y;
                if (item.tweenConfig.path) {
                    item.value.f1 += tweener.startValue.x;
                    item.value.f2 += tweener.startValue.y;
                }
                break;

            case ActionType.Alpha:
            case ActionType.Rotation:
                item.value.f1 = tweener.value.x;
                break;

            case ActionType.Color:
                item.value.f1 = tweener.value.color;
                break;

            case ActionType.ColorFilter:
                item.value.f1 = tweener.value.x;
                item.value.f2 = tweener.value.y;
                item.value.f3 = tweener.value.z;
                item.value.f4 = tweener.value.w;
                break;

            case ActionType.Shake:
                item.value.offsetX = tweener.deltaValue.x;
                item.value.offsetY = tweener.deltaValue.y;
                break;
        }

        this.applyValue(item);
    }

    private onTweenComplete(tweener: GTweener): void {
        var item: Item = <Item>tweener.target;
        item.tweener = null;
        this._totalTasks--;

        if (tweener.allCompleted) //当整体播放结束时间在这个tween的中间时不应该调用结尾钩子
            this.callHook(item, true);

        this.checkAllComplete();
    }

    private onPlayTransCompleted(item: Item): void {
        this._totalTasks--;

        this.checkAllComplete();
    }

    private callHook(item: Item, tweenEnd: boolean): void {
        if (tweenEnd) {
            if (item.tweenConfig && item.tweenConfig.endHook != null)
                item.tweenConfig.endHook(item.label);
        }
        else {
            if (item.time >= this._startTime && item.hook != null)
                item.hook(item.label);
        }
    }

    private checkAllComplete(): void {
        if (this._playing && this._totalTasks == 0) {
            if (this._totalTimes < 0) {
                this.internalPlay();
                if (this._totalTasks == 0)
                    GTween.delayedCall(0).setTarget(this).onComplete(this.checkAllComplete, this);
            }
            else {
                this._totalTimes--;
                if (this._totalTimes > 0) {
                    this.internalPlay();
                    if (this._totalTasks == 0)
                        GTween.delayedCall(0).setTarget(this).onComplete(this.checkAllComplete, this);
                }
                else {
                    this._playing = false;

                    var cnt: number = this._items.length;
                    for (var i: number = 0; i < cnt; i++) {
                        var item: Item = this._items[i];
                        if (item.target && item.displayLockToken != 0) {
                            item.target.releaseDisplayLock(item.displayLockToken);
                            item.displayLockToken = 0;
                        }
                    }

                    if (this._onComplete != null) {
                        var func: () => void = this._onComplete;
                        this._onComplete = null;
                        func();
                    }
                }
            }
        }
    }

    private applyValue(item: Item): void {
        item.target._gearLocked = true;
        var value: TValue = item.value;

        switch (item.type) {
            case ActionType.XY:
                if (item.target == this._owner) {
                    if (value.b1 && value.b2)
                        item.target.setPosition(value.f1 + this._ownerBaseX, value.f2 + this._ownerBaseY);
                    else if (value.b1)
                        item.target.x = value.f1 + this._ownerBaseX;
                    else
                        item.target.y = value.f2 + this._ownerBaseY;
                }
                else {
                    if (value.b3) //position in percent
                    {
                        if (value.b1 && value.b2)
                            item.target.setPosition(value.f1 * this._owner.width, value.f2 * this._owner.height);
                        else if (value.b1)
                            item.target.x = value.f1 * this._owner.width;
                        else if (value.b2)
                            item.target.y = value.f2 * this._owner.height;
                    }
                    else {
                        if (value.b1 && value.b2)
                            item.target.setPosition(value.f1, value.f2);
                        else if (value.b1)
                            item.target.x = value.f1;
                        else if (value.b2)
                            item.target.y = value.f2;
                    }
                }
                break;

            case ActionType.Size:
                if (!value.b1)
                    value.f1 = item.target.width;
                if (!value.b2)
                    value.f2 = item.target.height;
                item.target.setSize(value.f1, value.f2);
                break;

            case ActionType.Pivot:
                item.target.setPivot(value.f1, value.f2, item.target.pivotAsAnchor);
                break;

            case ActionType.Alpha:
                item.target.alpha = value.f1;
                break;

            case ActionType.Rotation:
                item.target.rotation = value.f1;
                break;

            case ActionType.Scale:
                item.target.setScale(value.f1, value.f2);
                break;

            case ActionType.Skew:
                //item.target.setSkew(value.f1, value.f2);
                break;

            case ActionType.Color:
                let color: any = item.target.getProp(ObjectPropID.Color);
                if (color instanceof Color) {
                    let i = Math.floor(value.f1);
                    color.r = ((i >> 16) & 0xFF);
                    color.g = (i >> 8) & 0xFF;
                    color.b = i & 0xFF;
                    item.target.setProp(ObjectPropID.Color, color);
                }
                break;

            case ActionType.Animation:
                if (value.frame >= 0)
                    item.target.setProp(ObjectPropID.Frame, value.frame);
                item.target.setProp(ObjectPropID.Playing, value.playing);
                item.target.setProp(ObjectPropID.TimeScale, this._timeScale);
                break;

            case ActionType.Visible:
                item.target.visible = value.visible;
                break;

            case ActionType.Transition:
                if (this._playing) {
                    var trans: Transition = value.trans;
                    if (trans) {
                        this._totalTasks++;
                        var startTime: number = this._startTime > item.time ? (this._startTime - item.time) : 0;
                        var endTime: number = this._endTime >= 0 ? (this._endTime - item.time) : -1;
                        if (value.stopTime >= 0 && (endTime < 0 || endTime > value.stopTime))
                            endTime = value.stopTime;
                        trans.timeScale = this._timeScale;
                        let localThis = this;
                        trans._play(() => { localThis.onPlayTransCompleted(item); }, value.playTimes, 0, startTime, endTime, this._reversed);
                    }
                }
                break;

            case ActionType.Sound:
                if (this._playing && item.time >= this._startTime) {
                    if (value.audioClip == null) {
                        var pi: PackageItem = UIPackage.getItemByURL(value.sound);
                        if (pi)
                            value.audioClip = <AudioClip>pi.owner.getItemAsset(pi);
                    }
                    if (value.audioClip)
                        Decls.GRoot.inst.playOneShotSound(value.audioClip, value.volume);
                }
                break;

            case ActionType.Shake:
                item.target.setPosition(item.target.x - value.lastOffsetX + value.offsetX, item.target.y - value.lastOffsetY + value.offsetY);
                value.lastOffsetX = value.offsetX;
                value.lastOffsetY = value.offsetY;
                break;

            case ActionType.ColorFilter:
                {
                    //TODO: filter support
                    break;
                }
            case ActionType.Text:
                item.target.text = value.text;
                break;

            case ActionType.Icon:
                item.target.icon = value.text;
                break;
        }

        item.target._gearLocked = false;
    }

    public setup(buffer: ByteBuffer): void {
        this.name = buffer.readS();
        this._options = buffer.readInt();
        this._autoPlay = buffer.readBool();
        this._autoPlayTimes = buffer.readInt();
        this._autoPlayDelay = buffer.readFloat();

        var cnt: number = buffer.readShort();
        for (var i: number = 0; i < cnt; i++) {
            var dataLen: number = buffer.readShort();
            var curPos: number = buffer.position;

            buffer.seek(curPos, 0);

            var item: Item = new Item(buffer.readByte());
            this._items[i] = item;

            item.time = buffer.readFloat();
            var targetId: number = buffer.readShort();
            if (targetId < 0)
                item.targetId = "";
            else
                item.targetId = this._owner.getChildAt(targetId).id;
            item.label = buffer.readS();

            if (buffer.readBool()) {
                buffer.seek(curPos, 1);

                item.tweenConfig = new TweenConfig();
                item.tweenConfig.duration = buffer.readFloat();
                if (item.time + item.tweenConfig.duration > this._totalDuration)
                    this._totalDuration = item.time + item.tweenConfig.duration;
                item.tweenConfig.easeType = buffer.readByte();
                item.tweenConfig.repeat = buffer.readInt();
                item.tweenConfig.yoyo = buffer.readBool();
                item.tweenConfig.endLabel = buffer.readS();

                buffer.seek(curPos, 2);

                this.decodeValue(item, buffer, item.tweenConfig.startValue);

                buffer.seek(curPos, 3);

                this.decodeValue(item, buffer, item.tweenConfig.endValue);

                if (buffer.version >= 2) {
                    var pathLen: number = buffer.readInt();
                    if (pathLen > 0) {
                        item.tweenConfig.path = new GPath();
                        var pts: Array<GPathPoint> = new Array<GPathPoint>();

                        for (var j: number = 0; j < pathLen; j++) {
                            var curveType: number = buffer.readByte();
                            switch (curveType) {
                                case CurveType.Bezier:
                                    pts.push(GPathPoint.newBezierPoint(buffer.readFloat(), buffer.readFloat(),
                                        buffer.readFloat(), buffer.readFloat()));
                                    break;

                                case CurveType.CubicBezier:
                                    pts.push(GPathPoint.newCubicBezierPoint(buffer.readFloat(), buffer.readFloat(),
                                        buffer.readFloat(), buffer.readFloat(),
                                        buffer.readFloat(), buffer.readFloat()));
                                    break;

                                default:
                                    pts.push(GPathPoint.newPoint(buffer.readFloat(), buffer.readFloat(), curveType));
                                    break;
                            }
                        }

                        item.tweenConfig.path.create(pts);
                    }
                }
            }
            else {
                if (item.time > this._totalDuration)
                    this._totalDuration = item.time;

                buffer.seek(curPos, 2);

                this.decodeValue(item, buffer, item.value);
            }

            buffer.position = curPos + dataLen;
        }
    }

    private decodeValue(item: Item, buffer: ByteBuffer, value: TValue): void {
        switch (item.type) {
            case ActionType.XY:
            case ActionType.Size:
            case ActionType.Pivot:
            case ActionType.Skew:
                value.b1 = buffer.readBool();
                value.b2 = buffer.readBool();
                value.f1 = buffer.readFloat();
                value.f2 = buffer.readFloat();

                if (buffer.version >= 2 && item.type == ActionType.XY)
                    value.b3 = buffer.readBool(); //percent
                break;

            case ActionType.Alpha:
            case ActionType.Rotation:
                value.f1 = buffer.readFloat();
                break;

            case ActionType.Scale:
                value.f1 = buffer.readFloat();
                value.f2 = buffer.readFloat();
                break;

            case ActionType.Color:
                let color = buffer.readColor();
                value.f1 = (color.r << 16) + (color.g << 8) + color.b;
                break;

            case ActionType.Animation:
                value.playing = buffer.readBool();
                value.frame = buffer.readInt();
                break;

            case ActionType.Visible:
                value.visible = buffer.readBool();
                break;

            case ActionType.Sound:
                value.sound = buffer.readS();
                value.volume = buffer.readFloat();
                break;

            case ActionType.Transition:
                value.transName = buffer.readS();
                value.playTimes = buffer.readInt();
                break;

            case ActionType.Shake:
                value.amplitude = buffer.readFloat();
                value.duration = buffer.readFloat();
                break;

            case ActionType.ColorFilter:
                value.f1 = buffer.readFloat();
                value.f2 = buffer.readFloat();
                value.f3 = buffer.readFloat();
                value.f4 = buffer.readFloat();
                break;

            case ActionType.Text:
            case ActionType.Icon:
                value.text = buffer.readS();
                break;
        }
    }

    copyFrom(source: Transition): void {
        let cnt: number = source._items.length;
        this.name = source.name;
        this._options = source._options;
        this._autoPlay = source._autoPlay;
        this._autoPlayTimes = source._autoPlayTimes;
        this._autoPlayDelay = source._autoPlayDelay;
        this._totalDuration = source._totalDuration;

        for (let i: number = 0; i < cnt; i++) {
            this._items.push(source._items[i].clone());
        }
    }
}

const OPTION_IGNORE_DISPLAY_CONTROLLER: number = 1;
const OPTION_AUTO_STOP_DISABLED: number = 2;
const OPTION_AUTO_STOP_AT_END: number = 4;

enum ActionType {
    XY = 0,
    Size = 1,
    Scale = 2,
    Pivot = 3,
    Alpha = 4,
    Rotation = 5,
    Color = 6,
    Animation = 7,
    Visible = 8,
    Sound = 9,
    Transition = 10,
    Shake = 11,
    ColorFilter = 12,
    Skew = 13,
    Text = 14,
    Icon = 15,
    Unknown = 16
}

class Item {
    public time: number;
    public targetId: string;
    public type: ActionType;
    public tweenConfig?: TweenConfig;
    public label?: string;
    public value: TValue;
    public hook?: (label?: string) => void;

    public tweener?: GTweener;
    public target: GObject;
    public displayLockToken: number;

    constructor(type: number) {
        this.type = type;
        this.value = {};
        this.displayLockToken = 0;
    }

    clone(): Item {
        let item = new Item(this.type);
        item.time = this.time;
        item.targetId = this.targetId;
        if (this.tweenConfig)
            item.tweenConfig = this.tweenConfig.clone();
        item.label = this.label;
        item.value = Object.assign({}, this.value);
        return item;
    }        
}

class TweenConfig {
    public duration: number;
    public easeType: number;
    public repeat: number;
    public yoyo?: boolean;
    public startValue: TValue;
    public endValue: TValue;
    public endLabel: string;
    public endHook?: (label?: string) => void;
    public path?: GPath;

    constructor() {
        this.easeType = EaseType.QuadOut;
        this.startValue = { b1: true, b2: true };
        this.endValue = { b1: true, b2: true };
    }

    clone(): TweenConfig {
        let keys = Object.keys(this);
        let tc = new TweenConfig() as any;
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            // @ts-ignore
            let value = this[k];
            if(value == null) {
                continue;
            }

            if(k == "endHook") {
                continue;
            }

            tc[k] = value;
        }
        return tc;
    }
}

interface TValue {
    visible?: boolean;

    frame?: number;
    playing?: boolean;
    flag?: boolean;

    sound?: string;
    volume?: number;
    audioClip?: AudioClip;

    transName?: string;
    playTimes?: number;
    trans?: Transition;
    stopTime?: number;

    amplitude?: number;
    duration?: number;
    offsetX?: number;
    offsetY?: number;
    lastOffsetX?: number;
    lastOffsetY?: number;

    text?: string;

    f1?: number;
    f2?: number;
    f3?: number;
    f4?: number;

    b1?: boolean;
    b2?: boolean;
    b3?: boolean;
}