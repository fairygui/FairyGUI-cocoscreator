import { Sprite } from "cc";
import { Image } from "./Image";
export class MovieClip extends Image {
    constructor() {
        super();
        this.interval = 0;
        this.swing = false;
        this.repeatDelay = 0;
        this.timeScale = 1;
        this._playing = true;
        this._frameCount = 0;
        this._frame = 0;
        this._start = 0;
        this._end = 0;
        this._times = 0;
        this._endAt = 0;
        this._status = 0; //0-none, 1-next loop, 2-ending, 3-ended
        this._smoothing = true;
        this._frameElapsed = 0; //当前帧延迟
        this._reversed = false;
        this._repeatedCount = 0;
    }
    get frames() {
        return this._frames;
    }
    set frames(value) {
        this._frames = value;
        if (this._frames) {
            this._frameCount = this._frames.length;
            if (this._end == -1 || this._end > this._frameCount - 1)
                this._end = this._frameCount - 1;
            if (this._endAt == -1 || this._endAt > this._frameCount - 1)
                this._endAt = this._frameCount - 1;
            if (this._frame < 0 || this._frame > this._frameCount - 1)
                this._frame = this._frameCount - 1;
            this.type = Sprite.Type.SIMPLE;
            this.drawFrame();
            this._frameElapsed = 0;
            this._repeatedCount = 0;
            this._reversed = false;
        }
        else {
            this._frameCount = 0;
        }
    }
    get frameCount() {
        return this._frameCount;
    }
    get frame() {
        return this._frame;
    }
    set frame(value) {
        if (this._frame != value) {
            if (this._frames && value >= this._frameCount)
                value = this._frameCount - 1;
            this._frame = value;
            this._frameElapsed = 0;
            this.drawFrame();
        }
    }
    get playing() {
        return this._playing;
    }
    set playing(value) {
        if (this._playing != value) {
            this._playing = value;
        }
    }
    get smoothing() {
        return this._smoothing;
    }
    set smoothing(value) {
        this._smoothing = value;
    }
    rewind() {
        this._frame = 0;
        this._frameElapsed = 0;
        this._reversed = false;
        this._repeatedCount = 0;
        this.drawFrame();
    }
    syncStatus(anotherMc) {
        this._frame = anotherMc._frame;
        this._frameElapsed = anotherMc._frameElapsed;
        this._reversed = anotherMc._reversed;
        this._repeatedCount = anotherMc._repeatedCount;
        this.drawFrame();
    }
    advance(timeInSeconds) {
        var beginFrame = this._frame;
        var beginReversed = this._reversed;
        var backupTime = timeInSeconds;
        while (true) {
            var tt = this.interval + this._frames[this._frame].addDelay;
            if (this._frame == 0 && this._repeatedCount > 0)
                tt += this.repeatDelay;
            if (timeInSeconds < tt) {
                this._frameElapsed = 0;
                break;
            }
            timeInSeconds -= tt;
            if (this.swing) {
                if (this._reversed) {
                    this._frame--;
                    if (this._frame <= 0) {
                        this._frame = 0;
                        this._repeatedCount++;
                        this._reversed = !this._reversed;
                    }
                }
                else {
                    this._frame++;
                    if (this._frame > this._frameCount - 1) {
                        this._frame = Math.max(0, this._frameCount - 2);
                        this._repeatedCount++;
                        this._reversed = !this._reversed;
                    }
                }
            }
            else {
                this._frame++;
                if (this._frame > this._frameCount - 1) {
                    this._frame = 0;
                    this._repeatedCount++;
                }
            }
            if (this._frame == beginFrame && this._reversed == beginReversed) //走了一轮了
             {
                var roundTime = backupTime - timeInSeconds; //这就是一轮需要的时间
                timeInSeconds -= Math.floor(timeInSeconds / roundTime) * roundTime; //跳过
            }
        }
        this.drawFrame();
    }
    //从start帧开始，播放到end帧（-1表示结尾），重复times次（0表示无限循环），循环结束后，停止在endAt帧（-1表示参数end）
    setPlaySettings(start, end, times, endAt, endCallback) {
        if (start == undefined)
            start = 0;
        if (end == undefined)
            end = -1;
        if (times == undefined)
            times = 0;
        if (endAt == undefined)
            endAt = -1;
        this._start = start;
        this._end = end;
        if (this._end == -1 || this._end > this._frameCount - 1)
            this._end = this._frameCount - 1;
        this._times = times;
        this._endAt = endAt;
        if (this._endAt == -1)
            this._endAt = this._end;
        this._status = 0;
        this._callback = endCallback;
        this.frame = start;
    }
    update(dt) {
        if (!this._playing || this._frameCount == 0 || this._status == 3)
            return;
        if (this.timeScale != 1)
            dt *= this.timeScale;
        this._frameElapsed += dt;
        var tt = this.interval + this._frames[this._frame].addDelay;
        if (this._frame == 0 && this._repeatedCount > 0)
            tt += this.repeatDelay;
        if (this._frameElapsed < tt)
            return;
        this._frameElapsed -= tt;
        if (this._frameElapsed > this.interval)
            this._frameElapsed = this.interval;
        if (this.swing) {
            if (this._reversed) {
                this._frame--;
                if (this._frame <= 0) {
                    this._frame = 0;
                    this._repeatedCount++;
                    this._reversed = !this._reversed;
                }
            }
            else {
                this._frame++;
                if (this._frame > this._frameCount - 1) {
                    this._frame = Math.max(0, this._frameCount - 2);
                    this._repeatedCount++;
                    this._reversed = !this._reversed;
                }
            }
        }
        else {
            this._frame++;
            if (this._frame > this._frameCount - 1) {
                this._frame = 0;
                this._repeatedCount++;
            }
        }
        if (this._status == 1) //new loop
         {
            this._frame = this._start;
            this._frameElapsed = 0;
            this._status = 0;
        }
        else if (this._status == 2) //ending
         {
            this._frame = this._endAt;
            this._frameElapsed = 0;
            this._status = 3; //ended
            //play end
            if (this._callback != null) {
                let callback = this._callback;
                this._callback = null;
                callback();
            }
        }
        else {
            if (this._frame == this._end) {
                if (this._times > 0) {
                    this._times--;
                    if (this._times == 0)
                        this._status = 2; //ending
                    else
                        this._status = 1; //new loop
                }
                else if (this._start != 0)
                    this._status = 1; //new loop
            }
        }
        this.drawFrame();
    }
    drawFrame() {
        if (this._frameCount > 0 && this._frame < this._frames.length) {
            var frame = this._frames[this._frame];
            this.spriteFrame = frame.texture;
        }
    }
}
