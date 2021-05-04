import { Sprite, Color } from "cc";
import { MovieClip } from "./display/MovieClip";
import { ObjectPropID } from "./FieldTypes";
import { GObject } from "./GObject";
import { PackageItem } from "./PackageItem";
import { ByteBuffer } from "./utils/ByteBuffer";


export class GMovieClip extends GObject {
    public _content: MovieClip;

    public constructor() {
        super();

        this._node.name = "GMovieClip";
        this._touchDisabled = true;

        this._content = this._node.addComponent(MovieClip);
        this._content.sizeMode = Sprite.SizeMode.CUSTOM;
        this._content.trim = false;
        this._content.setPlaySettings();
    }

    public get color(): Color {
        return this._content.color;
    }

    public set color(value: Color) {
        this._content.color = value;
        this.updateGear(4);
    }

    public get playing(): boolean {
        return this._content.playing;
    }

    public set playing(value: boolean) {
        if (this._content.playing != value) {
            this._content.playing = value;
            this.updateGear(5);
        }
    }

    public get frame(): number {
        return this._content.frame;
    }

    public set frame(value: number) {
        if (this._content.frame != value) {
            this._content.frame = value;
            this.updateGear(5);
        }
    }

    public get timeScale(): number {
        return this._content.timeScale;
    }

    public set timeScale(value: number) {
        this._content.timeScale = value;
    }

    public rewind(): void {
        this._content.rewind();
    }

    public syncStatus(anotherMc: GMovieClip): void {
        this._content.syncStatus(anotherMc._content);
    }

    public advance(timeInSeconds: number): void {
        this._content.advance(timeInSeconds);
    }

    //从start帧开始，播放到end帧（-1表示结尾），重复times次（0表示无限循环），循环结束后，停止在endAt帧（-1表示参数end）
    public setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: (() => void) | null): void {
        this._content.setPlaySettings(start, end, times, endAt, endCallback);
    }

    protected handleGrayedChanged(): void {
        this._content.grayscale = this._grayed;
    }

    protected handleSizeChanged(): void {
        super.handleSizeChanged();

        //不知道原因，尺寸改变必须调用一次这个，否则大小不对
        this._content.sizeMode = Sprite.SizeMode.CUSTOM;
    }

    public getProp(index: number): any {
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

    public setProp(index: number, value: any): void {
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

    public constructFromResource(): void {
        var contentItem: PackageItem = this.packageItem.getBranch();
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

    public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
        super.setup_beforeAdd(buffer, beginPos);

        buffer.seek(beginPos, 5);

        if (buffer.readBool())
            this.color = buffer.readColor();
        buffer.readByte(); //flip
        this._content.frame = buffer.readInt();
        this._content.playing = buffer.readBool();
    }
}