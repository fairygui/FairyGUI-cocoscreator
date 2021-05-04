import { Sprite, Color, SpriteFrame } from "cc";
import { Image } from "./display/Image";
import { FlipType, FillMethod, FillOrigin, ObjectPropID } from "./FieldTypes";
import { GObject } from "./GObject";
import { PackageItem } from "./PackageItem";
import { ByteBuffer } from "./utils/ByteBuffer";

export class GImage extends GObject {
    public _content: Image;

    public constructor() {
        super();

        this._node.name = "GImage";
        this._touchDisabled = true;
        this._content = this._node.addComponent(Image);
        this._content.sizeMode = Sprite.SizeMode.CUSTOM;
        this._content.trim = false;
    }

    public get color(): Color {
        return this._content.color;
    }

    public set color(value: Color) {
        this._content.color = value;
        this.updateGear(4);
    }

    public get flip(): FlipType {
        return this._content.flip;
    }

    public set flip(value: FlipType) {
        this._content.flip = value;
    }

    public get fillMethod(): FillMethod {
        return this._content.fillMethod;
    }

    public set fillMethod(value: FillMethod) {
        this._content.fillMethod = value;
    }

    public get fillOrigin(): FillOrigin {
        return this._content.fillOrigin;
    }

    public set fillOrigin(value: FillOrigin) {
        this._content.fillOrigin = value;
    }

    public get fillClockwise(): boolean {
        return this._content.fillClockwise;
    }

    public set fillClockwise(value: boolean) {
        this._content.fillClockwise = value;
    }

    public get fillAmount(): number {
        return this._content.fillAmount;
    }

    public set fillAmount(value: number) {
        this._content.fillAmount = value;
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

        if (contentItem.scale9Grid)
            this._content.type = Sprite.Type.SLICED;
        else if (contentItem.scaleByTile)
            this._content.type = Sprite.Type.TILED;
        this._content.spriteFrame = <SpriteFrame>contentItem.asset;
    }

    protected handleGrayedChanged(): void {
        this._content.grayscale = this._grayed;
    }

    public getProp(index: number): any {
        if (index == ObjectPropID.Color)
            return this.color;
        else
            return super.getProp(index);
    }

    public setProp(index: number, value: any): void {
        if (index == ObjectPropID.Color)
            this.color = value;
        else
            super.setProp(index, value);
    }

    public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
        super.setup_beforeAdd(buffer, beginPos);

        buffer.seek(beginPos, 5);

        if (buffer.readBool())
            this.color = buffer.readColor();
        this._content.flip = buffer.readByte();
        this._content.fillMethod = buffer.readByte();
        if (this._content.fillMethod != 0) {
            this._content.fillOrigin = buffer.readByte();
            this._content.fillClockwise = buffer.readBool();
            this._content.fillAmount = buffer.readFloat();
        }
    }
}