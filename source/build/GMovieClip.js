import { Sprite } from "cc";
import { MovieClip } from "./display/MovieClip";
import { ObjectPropID } from "./FieldTypes";
import { GObject } from "./GObject";
export class GMovieClip extends GObject {
    constructor() {
        super();
        this._node.name = "GMovieClip";
        this._touchDisabled = true;
        this._content = this._node.addComponent(MovieClip);
        this._content.sizeMode = Sprite.SizeMode.CUSTOM;
        this._content.trim = false;
        this._content.setPlaySettings();
    }
    get color() {
        return this._content.color;
    }
    set color(value) {
        this._content.color = value;
        this.updateGear(4);
    }
    get playing() {
        return this._content.playing;
    }
    set playing(value) {
        if (this._content.playing != value) {
            this._content.playing = value;
            this.updateGear(5);
        }
    }
    get frame() {
        return this._content.frame;
    }
    set frame(value) {
        if (this._content.frame != value) {
            this._content.frame = value;
            this.updateGear(5);
        }
    }
    get timeScale() {
        return this._content.timeScale;
    }
    set timeScale(value) {
        this._content.timeScale = value;
    }
    rewind() {
        this._content.rewind();
    }
    syncStatus(anotherMc) {
        this._content.syncStatus(anotherMc._content);
    }
    advance(timeInSeconds) {
        this._content.advance(timeInSeconds);
    }
    //从start帧开始，播放到end帧（-1表示结尾），重复times次（0表示无限循环），循环结束后，停止在endAt帧（-1表示参数end）
    setPlaySettings(start, end, times, endAt, endCallback) {
        this._content.setPlaySettings(start, end, times, endAt, endCallback);
    }
    handleGrayedChanged() {
        this._content.grayscale = this._grayed;
    }
    handleSizeChanged() {
        super.handleSizeChanged();
        //不知道原因，尺寸改变必须调用一次这个，否则大小不对
        this._content.sizeMode = Sprite.SizeMode.CUSTOM;
    }
    getProp(index) {
        switch (index) {
            case ObjectPropID.Color:
                return this.color;
            case ObjectPropID.Playing:
                return this.playing;
            case ObjectPropID.Frame:
                return this.frame;
            case ObjectPropID.TimeScale:
                return this.timeScale;
            default:
                return super.getProp(index);
        }
    }
    setProp(index, value) {
        switch (index) {
            case ObjectPropID.Color:
                this.color = value;
                break;
            case ObjectPropID.Playing:
                this.playing = value;
                break;
            case ObjectPropID.Frame:
                this.frame = value;
                break;
            case ObjectPropID.TimeScale:
                this.timeScale = value;
                break;
            case ObjectPropID.DeltaTime:
                this.advance(value);
                break;
            default:
                super.setProp(index, value);
                break;
        }
    }
    constructFromResource() {
        var contentItem = this.packageItem.getBranch();
        this.sourceWidth = contentItem.width;
        this.sourceHeight = contentItem.height;
        this.initWidth = this.sourceWidth;
        this.initHeight = this.sourceHeight;
        this.setSize(this.sourceWidth, this.sourceHeight);
        contentItem = contentItem.getHighResolution();
        contentItem.load();
        this._content.interval = contentItem.interval;
        this._content.swing = contentItem.swing;
        this._content.repeatDelay = contentItem.repeatDelay;
        this._content.frames = contentItem.frames;
        this._content.smoothing = contentItem.smoothing;
    }
    setup_beforeAdd(buffer, beginPos) {
        super.setup_beforeAdd(buffer, beginPos);
        buffer.seek(beginPos, 5);
        if (buffer.readBool())
            this.color = buffer.readColor();
        buffer.readByte(); //flip
        this._content.frame = buffer.readInt();
        this._content.playing = buffer.readBool();
    }
}
