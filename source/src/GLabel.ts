import { AudioClip, Color } from "cc";
import { ObjectPropID } from "./FieldTypes";
import { GComponent } from "./GComponent";
import { GObject } from "./GObject";
import { GRoot } from "./GRoot";
import { GTextField } from "./GTextField";
import { GTextInput } from "./GTextInput";
import { PackageItem } from "./PackageItem";
import { UIPackage } from "./UIPackage";
import { ByteBuffer } from "./utils/ByteBuffer";
import { Event as FUIEvent } from "./event/Event";

export class GLabel extends GComponent {
    protected _titleObject: GObject;
    protected _iconObject: GObject;
    private _sound: string;
    private _soundVolumeScale: number;

    public constructor() {
        super();

        this._node.name = "GLabel";
    }

    public get icon(): string | null {
        if (this._iconObject)
            return this._iconObject.icon;
    }

    public set icon(value: string | null) {
        if (this._iconObject)
            this._iconObject.icon = value;
        this.updateGear(7);
    }

    public get title(): string | null {
        if (this._titleObject)
            return this._titleObject.text;
        else
            return null;
    }

    public set title(value: string | null) {
        if (this._titleObject)
            this._titleObject.text = value;
        this.updateGear(6);
    }

    public get text(): string | null {
        return this.title;
    }

    public set text(value: string | null) {
        this.title = value;
    }

    public get titleColor(): Color {
        var tf: GTextField = this.getTextField();
        if (tf)
            return tf.color;
        else
            return Color.WHITE;
    }

    public set titleColor(value: Color) {
        var tf: GTextField = this.getTextField();
        if (tf)
            tf.color = value;
        this.updateGear(4);
    }

    public get titleFontSize(): number {
        var tf: GTextField = this.getTextField();
        if (tf)
            return tf.fontSize;
        else
            return 0;
    }

    public set titleFontSize(value: number) {
        var tf: GTextField = this.getTextField();
        if (tf)
            tf.fontSize = value;
    }

    public set editable(val: boolean) {
        if (this._titleObject && (this._titleObject instanceof GTextInput))
            this._titleObject.editable = val;
    }

    public get editable(): boolean {
        if (this._titleObject && (this._titleObject instanceof GTextInput))
            return this._titleObject.editable;
        else
            return false;
    }

    public getTextField(): GTextField {
        if (this._titleObject instanceof GTextField)
            return this._titleObject;
        else if ('getTextField' in this._titleObject)
            return (<any>this._titleObject).getTextField();
        else
            return null;
    }

    public getProp(index: number): any {
        switch (index) {
            case ObjectPropID.Color:
                return this.titleColor;
            case ObjectPropID.OutlineColor:
                {
                    var tf: GTextField = this.getTextField();
                    if (tf)
                        return tf.strokeColor;
                    else
                        return 0;
                }
            case ObjectPropID.FontSize:
                return this.titleFontSize;
            default:
                return super.getProp(index);
        }
    }

    public setProp(index: number, value: any): void {
        switch (index) {
            case ObjectPropID.Color:
                this.titleColor = value;
                break;
            case ObjectPropID.OutlineColor:
                {
                    var tf: GTextField = this.getTextField();
                    if (tf)
                        tf.strokeColor = value;
                }
                break;
            case ObjectPropID.FontSize:
                this.titleFontSize = value;
                break;
            default:
                super.setProp(index, value);
                break;
        }
    }

    protected constructExtension(buffer: ByteBuffer): void {
        this._titleObject = this.getChild("title");
        this._iconObject = this.getChild("icon");
    }

    public setup_afterAdd(buffer: ByteBuffer, beginPos: number): void {
        super.setup_afterAdd(buffer, beginPos);

        if (!buffer.seek(beginPos, 6))
            return;

        if (buffer.readByte() != this.packageItem.objectType)
            return;

        var str: string;
        str = buffer.readS();
        if (str != null)
            this.title = str;
        str = buffer.readS();
        if (str != null)
            this.icon = str;
        if (buffer.readBool())
            this.titleColor = buffer.readColor();
        var iv: number = buffer.readInt();
        if (iv != 0)
            this.titleFontSize = iv;

        if (buffer.readBool()) {
            var input: GTextField = this.getTextField();
            if (input instanceof GTextInput) {
                str = buffer.readS();
                if (str != null)
                    input.promptText = str;

                str = buffer.readS();
                if (str != null)
                    input.restrict = str;

                iv = buffer.readInt();
                if (iv != 0)
                    input.maxLength = iv;
                iv = buffer.readInt();
                if (iv != 0) {
                    //keyboardType
                }
                if (buffer.readBool())
                    input.password = true;
            }
            else
                buffer.skip(13);
        }
        str = buffer.readS();
        if (str != null) {
            this._sound = str;
            if (buffer.readBool()){
                this._soundVolumeScale = buffer.readFloat();
            }
            this._node.on(FUIEvent.CLICK, this.onClick_1, this);
        }

    }

    private onClick_1():void{
        if(this._sound){
            var pi: PackageItem = UIPackage.getItemByURL(this._sound);
            if (pi) {
                var sound: AudioClip = <AudioClip>pi.owner.getItemAsset(pi);
                if (sound)
                    GRoot.inst.playOneShotSound(sound, this._soundVolumeScale);
            }
        }
    }
}