import { Color } from "cc";
import { ObjectPropID } from "./FieldTypes";
import { Decls } from "./GObject";
import { EaseType } from "./tween/EaseType";
import { GPath } from "./tween/GPath";
import { GPathPoint, CurveType } from "./tween/GPathPoint";
import { GTween } from "./tween/GTween";
import { UIPackage } from "./UIPackage";
export class Transition {
    constructor(owner) {
        this._ownerBaseX = 0;
        this._ownerBaseY = 0;
        this._totalTimes = 0;
        this._totalTasks = 0;
        this._options = 0;
        this._totalDuration = 0;
        this._autoPlayTimes = 1;
        this._autoPlayDelay = 0;
        this._timeScale = 1;
        this._startTime = 0;
        this._endTime = 0;
        this._owner = owner;
        this._items = new Array();
    }
    play(onComplete, times, delay, startTime, endTime) {
        this._play(onComplete, times, delay, startTime, endTime, false);
    }
    playReverse(onComplete, times, delay) {
        this._play(onComplete, times, delay, 0, -1, true);
    }
    changePlayTimes(value) {
        this._totalTimes = value;
    }
    setAutoPlay(value, times, delay) {
        if (times == undefined)
            times = -1;
        if (delay == undefined)
            delay = 0;
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
    _play(onComplete, times, delay, startTime, endTime, reversed) {
        if (times == undefined)
            times = 1;
        if (delay == undefined)
            delay = 0;
        if (startTime == undefined)
            startTime = 0;
        if (endTime == undefined)
            endTime = -1;
        this.stop(true, true);
        this._totalTimes = times;
        this._reversed = reversed;
        this._startTime = startTime;
        this._endTime = endTime;
        this._playing = true;
        this._paused = false;
        this._onComplete = onComplete;
        var cnt = this._items.length;
        for (var i = 0; i < cnt; i++) {
            var item = this._items[i];
            if (item.target == null) {
                if (item.targetId)
                    item.target = this._owner.getChildById(item.targetId);
                else
                    item.target = this._owner;
            }
            else if (item.target != this._owner && item.target.parent != this._owner)
                item.target = null;
            if (item.target && item.type == ActionType.Transition) {
                var trans = item.target.getTransition(item.value.transName);
                if (trans == this)
                    trans = null;
                if (trans) {
                    if (item.value.playTimes == 0) //stop
                     {
                        var j;
                        for (j = i - 1; j >= 0; j--) {
                            var item2 = this._items[j];
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
                            trans = null; //no need to handle stop anymore
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
    stop(setToComplete, processCallback) {
        if (setToComplete == undefined)
            setToComplete = true;
        if (!this._playing)
            return;
        this._playing = false;
        this._totalTasks = 0;
        this._totalTimes = 0;
        var func = this._onComplete;
        this._onComplete = null;
        GTween.kill(this); //delay start
        var cnt = this._items.length;
        if (this._reversed) {
            for (var i = cnt - 1; i >= 0; i--) {
                var item = this._items[i];
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
    stopItem(item, setToComplete) {
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
            var trans = item.value.trans;
            if (trans)
                trans.stop(setToComplete, false);
        }
    }
    setPaused(paused) {
        if (!this._playing || this._paused == paused)
            return;
        this._paused = paused;
        var tweener = GTween.getTween(this);
        if (tweener)
            tweener.setPaused(paused);
        var cnt = this._items.length;
        for (var i = 0; i < cnt; i++) {
            var item = this._items[i];
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
    dispose() {
        if (this._playing)
            GTween.kill(this); //delay start
        var cnt = this._items.length;
        for (var i = 0; i < cnt; i++) {
            var item = this._items[i];
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
    get playing() {
        return this._playing;
    }
    setValue(label, ...args) {
        var cnt = this._items.length;
        var value;
        for (var i = 0; i < cnt; i++) {
            var item = this._items[i];
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
    setHook(label, callback) {
        var cnt = this._items.length;
        for (var i = 0; i < cnt; i++) {
            var item = this._items[i];
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
    clearHooks() {
        var cnt = this._items.length;
        for (var i = 0; i < cnt; i++) {
            var item = this._items[i];
            item.hook = null;
            if (item.tweenConfig)
                item.tweenConfig.endHook = null;
        }
    }
    setTarget(label, newTarget) {
        var cnt = this._items.length;
        for (var i = 0; i < cnt; i++) {
            var item = this._items[i];
            if (item.label == label) {
                item.targetId = newTarget.id;
                item.target = null;
            }
        }
    }
    setDuration(label, value) {
        var cnt = this._items.length;
        for (var i = 0; i < cnt; i++) {
            var item = this._items[i];
            if (item.tweenConfig && item.label == label)
                item.tweenConfig.duration = value;
        }
    }
    getLabelTime(label) {
        var cnt = this._items.length;
        for (var i = 0; i < cnt; i++) {
            var item = this._items[i];
            if (item.label == label)
                return item.time;
            else if (item.tweenConfig && item.tweenConfig.endLabel == label)
                return item.time + item.tweenConfig.duration;
        }
        return Number.NaN;
    }
    get timeScale() {
        return this._timeScale;
    }
    set timeScale(value) {
        if (this._timeScale != value) {
            this._timeScale = value;
            if (this._playing) {
                var cnt = this._items.length;
                for (var i = 0; i < cnt; i++) {
                    var item = this._items[i];
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
    updateFromRelations(targetId, dx, dy) {
        var cnt = this._items.length;
        if (cnt == 0)
            return;
        for (var i = 0; i < cnt; i++) {
            var item = this._items[i];
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
    onEnable() {
        if (this._autoPlay && !this._playing)
            this.play(null, this._autoPlayTimes, this._autoPlayDelay);
    }
    onDisable() {
        if ((this._options & OPTION_AUTO_STOP_DISABLED) == 0)
            this.stop((this._options & OPTION_AUTO_STOP_AT_END) != 0 ? true : false, false);
    }
    onDelayedPlay() {
        this.internalPlay();
        this._playing = this._totalTasks > 0;
        if (this._playing) {
            if ((this._options & OPTION_IGNORE_DISPLAY_CONTROLLER) != 0) {
                var cnt = this._items.length;
                for (var i = 0; i < cnt; i++) {
                    var item = this._items[i];
                    if (item.target && item.target != this._owner)
                        item.displayLockToken = item.target.addDisplayLock();
                }
            }
        }
        else if (this._onComplete != null) {
            var func = this._onComplete;
            this._onComplete = null;
            func();
        }
    }
    internalPlay() {
        this._ownerBaseX = this._owner.x;
        this._ownerBaseY = this._owner.y;
        this._totalTasks = 1;
        var cnt = this._items.length;
        var item;
        var needSkipAnimations = false;
        var i;
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
    playItem(item) {
        var time;
        if (item.tweenConfig) {
            if (this._reversed)
                time = (this._totalDuration - item.time - item.tweenConfig.duration);
            else
                time = item.time;
            if (this._endTime == -1 || time <= this._endTime) {
                var startValue;
                var endValue;
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
                        item.tweener = GTween.to4(startValue.f1, startValue.f2, startValue.f3, startValue.f4, endValue.f1, endValue.f2, endValue.f3, endValue.f4, item.tweenConfig.duration);
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
    skipAnimations() {
        var frame;
        var playStartTime;
        var playTotalTime;
        var value;
        var target;
        var item;
        var cnt = this._items.length;
        for (var i = 0; i < cnt; i++) {
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
            for (var j = i; j < cnt; j++) {
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
    onDelayedPlayItem(tweener) {
        var item = tweener.target;
        item.tweener = null;
        this._totalTasks--;
        this.applyValue(item);
        this.callHook(item, false);
        this.checkAllComplete();
    }
    onTweenStart(tweener) {
        var item = tweener.target;
        if (item.type == ActionType.XY || item.type == ActionType.Size) //位置和大小要到start才最终确认起始值
         {
            var startValue;
            var endValue;
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
    onTweenUpdate(tweener) {
        var item = tweener.target;
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
    onTweenComplete(tweener) {
        var item = tweener.target;
        item.tweener = null;
        this._totalTasks--;
        if (tweener.allCompleted) //当整体播放结束时间在这个tween的中间时不应该调用结尾钩子
            this.callHook(item, true);
        this.checkAllComplete();
    }
    onPlayTransCompleted(item) {
        this._totalTasks--;
        this.checkAllComplete();
    }
    callHook(item, tweenEnd) {
        if (tweenEnd) {
            if (item.tweenConfig && item.tweenConfig.endHook != null)
                item.tweenConfig.endHook(item.label);
        }
        else {
            if (item.time >= this._startTime && item.hook != null)
                item.hook(item.label);
        }
    }
    checkAllComplete() {
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
                    var cnt = this._items.length;
                    for (var i = 0; i < cnt; i++) {
                        var item = this._items[i];
                        if (item.target && item.displayLockToken != 0) {
                            item.target.releaseDisplayLock(item.displayLockToken);
                            item.displayLockToken = 0;
                        }
                    }
                    if (this._onComplete != null) {
                        var func = this._onComplete;
                        this._onComplete = null;
                        func();
                    }
                }
            }
        }
    }
    applyValue(item) {
        item.target._gearLocked = true;
        var value = item.value;
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
                let color = item.target.getProp(ObjectPropID.Color);
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
                    var trans = value.trans;
                    if (trans) {
                        this._totalTasks++;
                        var startTime = this._startTime > item.time ? (this._startTime - item.time) : 0;
                        var endTime = this._endTime >= 0 ? (this._endTime - item.time) : -1;
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
                        var pi = UIPackage.getItemByURL(value.sound);
                        if (pi)
                            value.audioClip = pi.owner.getItemAsset(pi);
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
    setup(buffer) {
        this.name = buffer.readS();
        this._options = buffer.readInt();
        this._autoPlay = buffer.readBool();
        this._autoPlayTimes = buffer.readInt();
        this._autoPlayDelay = buffer.readFloat();
        var cnt = buffer.readShort();
        for (var i = 0; i < cnt; i++) {
            var dataLen = buffer.readShort();
            var curPos = buffer.position;
            buffer.seek(curPos, 0);
            var item = new Item(buffer.readByte());
            this._items[i] = item;
            item.time = buffer.readFloat();
            var targetId = buffer.readShort();
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
                    var pathLen = buffer.readInt();
                    if (pathLen > 0) {
                        item.tweenConfig.path = new GPath();
                        var pts = new Array();
                        for (var j = 0; j < pathLen; j++) {
                            var curveType = buffer.readByte();
                            switch (curveType) {
                                case CurveType.Bezier:
                                    pts.push(GPathPoint.newBezierPoint(buffer.readFloat(), buffer.readFloat(), buffer.readFloat(), buffer.readFloat()));
                                    break;
                                case CurveType.CubicBezier:
                                    pts.push(GPathPoint.newCubicBezierPoint(buffer.readFloat(), buffer.readFloat(), buffer.readFloat(), buffer.readFloat(), buffer.readFloat(), buffer.readFloat()));
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
    decodeValue(item, buffer, value) {
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
}
const OPTION_IGNORE_DISPLAY_CONTROLLER = 1;
const OPTION_AUTO_STOP_DISABLED = 2;
const OPTION_AUTO_STOP_AT_END = 4;
var ActionType;
(function (ActionType) {
    ActionType[ActionType["XY"] = 0] = "XY";
    ActionType[ActionType["Size"] = 1] = "Size";
    ActionType[ActionType["Scale"] = 2] = "Scale";
    ActionType[ActionType["Pivot"] = 3] = "Pivot";
    ActionType[ActionType["Alpha"] = 4] = "Alpha";
    ActionType[ActionType["Rotation"] = 5] = "Rotation";
    ActionType[ActionType["Color"] = 6] = "Color";
    ActionType[ActionType["Animation"] = 7] = "Animation";
    ActionType[ActionType["Visible"] = 8] = "Visible";
    ActionType[ActionType["Sound"] = 9] = "Sound";
    ActionType[ActionType["Transition"] = 10] = "Transition";
    ActionType[ActionType["Shake"] = 11] = "Shake";
    ActionType[ActionType["ColorFilter"] = 12] = "ColorFilter";
    ActionType[ActionType["Skew"] = 13] = "Skew";
    ActionType[ActionType["Text"] = 14] = "Text";
    ActionType[ActionType["Icon"] = 15] = "Icon";
    ActionType[ActionType["Unknown"] = 16] = "Unknown";
})(ActionType || (ActionType = {}));
class Item {
    constructor(type) {
        this.type = type;
        this.value = {};
        this.displayLockToken = 0;
    }
}
class TweenConfig {
    constructor() {
        this.easeType = EaseType.QuadOut;
        this.startValue = { b1: true, b2: true };
        this.endValue = { b1: true, b2: true };
    }
}
