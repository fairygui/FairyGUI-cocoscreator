import { Color } from "cc";
import { ObjectPropID } from "./FieldTypes";
import { GComponent } from "./GComponent";
import { GRoot } from "./GRoot";
import { GTextField } from "./GTextField";
import { GTextInput } from "./GTextInput";
import { UIPackage } from "./UIPackage";
import { Event as FUIEvent } from "./event/Event";
export class GLabel extends GComponent {
    constructor() {
        super();
        this._node.name = "GLabel";
    }
    get icon() {
        if (this._iconObject)
            return this._iconObject.icon;
    }
    set icon(value) {
        if (this._iconObject)
            this._iconObject.icon = value;
        this.updateGear(7);
    }
    get title() {
        if (this._titleObject)
            return this._titleObject.text;
        else
            return null;
    }
    set title(value) {
        if (this._titleObject)
            this._titleObject.text = value;
        this.updateGear(6);
    }
    get text() {
        return this.title;
    }
    set text(value) {
        this.title = value;
    }
    get titleColor() {
        var tf = this.getTextField();
        if (tf)
            return tf.color;
        else
            return Color.WHITE;
    }
    set titleColor(value) {
        var tf = this.getTextField();
        if (tf)
            tf.color = value;
        this.updateGear(4);
    }
    get titleFontSize() {
        var tf = this.getTextField();
        if (tf)
            return tf.fontSize;
        else
            return 0;
    }
    set titleFontSize(value) {
        var tf = this.getTextField();
        if (tf)
            tf.fontSize = value;
    }
    set editable(val) {
        if (this._titleObject && (this._titleObject instanceof GTextInput))
            this._titleObject.editable = val;
    }
    get editable() {
        if (this._titleObject && (this._titleObject instanceof GTextInput))
            return this._titleObject.editable;
        else
            return false;
    }
    getTextField() {
        if (this._titleObject instanceof GTextField)
            return this._titleObject;
        else if ('getTextField' in this._titleObject)
            return this._titleObject.getTextField();
        else
            return null;
    }
    getProp(index) {
        switch (index) {
            case ObjectPropID.Color:
                return this.titleColor;
            case ObjectPropID.OutlineColor:
                {
                    var tf = this.getTextField();
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
    setProp(index, value) {
        switch (index) {
            case ObjectPropID.Color:
                this.titleColor = value;
                break;
            case ObjectPropID.OutlineColor:
                {
                    var tf = this.getTextField();
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
    constructExtension(buffer) {
        this._titleObject = this.getChild("title");
        this._iconObject = this.getChild("icon");
    }
    setup_afterAdd(buffer, beginPos) {
        super.setup_afterAdd(buffer, beginPos);
        if (!buffer.seek(beginPos, 6))
            return;
        if (buffer.readByte() != this.packageItem.objectType)
            return;
        var str;
        str = buffer.readS();
        if (str != null)
            this.title = str;
        str = buffer.readS();
        if (str != null)
            this.icon = str;
        if (buffer.readBool())
            this.titleColor = buffer.readColor();
        var iv = buffer.readInt();
        if (iv != 0)
            this.titleFontSize = iv;
        if (buffer.readBool()) {
            var input = this.getTextField();
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
            if (buffer.readBool()) {
                this._soundVolumeScale = buffer.readFloat();
            }
            this._node.on(FUIEvent.CLICK, this.onClick_1, this);
        }
    }
    onClick_1() {
        if (this._sound) {
            var pi = UIPackage.getItemByURL(this._sound);
            if (pi) {
                var sound = pi.owner.getItemAsset(pi);
                if (sound)
                    GRoot.inst.playOneShotSound(sound, this._soundVolumeScale);
            }
        }
    }
}
