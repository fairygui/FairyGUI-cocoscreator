import { BitmapFont, Color, Font, Label, LabelOutline, LabelShadow, Node, Vec2 } from "cc";
import { Event as FUIEvent } from "./event/Event";
import { AutoSizeType, ObjectPropID } from "./FieldTypes";
import { GObject } from "./GObject";
import { UIConfig, getFontByName } from "./UIConfig";
import { UIPackage } from "./UIPackage";
import { toGrayedColor } from "./utils/ToolSet";
import { defaultParser } from "./utils/UBBParser";
export class GTextField extends GObject {
    constructor() {
        super();
        this._fontSize = 0;
        this._leading = 0;
        this._node.name = "GTextField";
        this._touchDisabled = true;
        this._text = "";
        this._color = new Color(255, 255, 255, 255);
        this.createRenderer();
        this.fontSize = 12;
        this.leading = 3;
        this.singleLine = false;
        this._sizeDirty = false;
        this._node.on(Node.EventType.SIZE_CHANGED, this.onLabelSizeChanged, this);
    }
    createRenderer() {
        this._label = this._node.addComponent(Label);
        this._label.string = "";
        this.autoSize = AutoSizeType.Both;
    }
    set text(value) {
        this._text = value;
        if (this._text == null)
            this._text = "";
        this.updateGear(6);
        this.markSizeChanged();
        this.updateText();
    }
    get text() {
        return this._text;
    }
    get font() {
        return this._font;
    }
    set font(value) {
        if (this._font != value || !value) {
            this._font = value;
            this.markSizeChanged();
            let newFont = value ? value : UIConfig.defaultFont;
            if (newFont.startsWith("ui://")) {
                var pi = UIPackage.getItemByURL(newFont);
                if (pi)
                    newFont = pi.owner.getItemAsset(pi);
                else
                    newFont = UIConfig.defaultFont;
            }
            this._realFont = newFont;
            this.updateFont();
        }
    }
    get fontSize() {
        return this._fontSize;
    }
    set fontSize(value) {
        if (value < 0)
            return;
        if (this._fontSize != value) {
            this._fontSize = value;
            this.markSizeChanged();
            this.updateFontSize();
        }
    }
    get color() {
        return this._color;
    }
    set color(value) {
        this._color.set(value);
        this.updateGear(4);
        this.updateFontColor();
    }
    get align() {
        return this._label ? this._label.horizontalAlign : 0;
    }
    set align(value) {
        if (this._label)
            this._label.horizontalAlign = value;
    }
    get verticalAlign() {
        return this._label ? this._label.verticalAlign : 0;
    }
    set verticalAlign(value) {
        if (this._label)
            this._label.verticalAlign = value;
    }
    get leading() {
        return this._leading;
    }
    set leading(value) {
        if (this._leading != value) {
            this._leading = value;
            this.markSizeChanged();
            this.updateFontSize();
        }
    }
    get letterSpacing() {
        return this._label ? this._label.spacingX : 0;
    }
    set letterSpacing(value) {
        if (this._label && this._label.spacingX != value) {
            this.markSizeChanged();
            this._label.spacingX = value;
        }
    }
    get underline() {
        return this._label ? this._label.isUnderline : false;
    }
    set underline(value) {
        if (this._label)
            this._label.isUnderline = value;
    }
    get bold() {
        return this._label ? this._label.isBold : false;
    }
    set bold(value) {
        if (this._label)
            this._label.isBold = value;
    }
    get italic() {
        return this._label ? this._label.isItalic : false;
    }
    set italic(value) {
        if (this._label)
            this._label.isItalic = value;
    }
    get singleLine() {
        return this._label ? !this._label.enableWrapText : false;
    }
    set singleLine(value) {
        if (this._label)
            this._label.enableWrapText = !value;
    }
    get stroke() {
        return (this._outline && this._outline.enabled) ? this._outline.width : 0;
    }
    set stroke(value) {
        if (value == 0) {
            if (this._outline)
                this._outline.enabled = false;
        }
        else {
            if (!this._outline) {
                this._outline = this._node.addComponent(LabelOutline);
                this.updateStrokeColor();
            }
            else
                this._outline.enabled = true;
            this._outline.width = value;
        }
    }
    get strokeColor() {
        return this._strokeColor;
    }
    set strokeColor(value) {
        if (!this._strokeColor)
            this._strokeColor = new Color();
        this._strokeColor.set(value);
        this.updateGear(4);
        this.updateStrokeColor();
    }
    get shadowOffset() {
        return this._shadowOffset;
    }
    set shadowOffset(value) {
        if (!this._shadowOffset)
            this._shadowOffset = new Vec2();
        this._shadowOffset.set(value);
        if (this._shadowOffset.x != 0 || this._shadowOffset.y != 0) {
            if (!this._shadow) {
                this._shadow = this._node.addComponent(LabelShadow);
                this.updateShadowColor();
            }
            else
                this._shadow.enabled = true;
            this._shadow.offset.x = value.x;
            this._shadow.offset.y = -value.y;
        }
        else if (this._shadow)
            this._shadow.enabled = false;
    }
    get shadowColor() {
        return this._shadowColor;
    }
    set shadowColor(value) {
        if (!this._shadowColor)
            this._shadowColor = new Color();
        this._shadowColor.set(value);
        this.updateShadowColor();
    }
    set ubbEnabled(value) {
        if (this._ubbEnabled != value) {
            this._ubbEnabled = value;
            this.markSizeChanged();
            this.updateText();
        }
    }
    get ubbEnabled() {
        return this._ubbEnabled;
    }
    set autoSize(value) {
        if (this._autoSize != value) {
            this._autoSize = value;
            this.markSizeChanged();
            this.updateOverflow();
        }
    }
    get autoSize() {
        return this._autoSize;
    }
    parseTemplate(template) {
        var pos1 = 0, pos2, pos3;
        var tag;
        var value;
        var result = "";
        while ((pos2 = template.indexOf("{", pos1)) != -1) {
            if (pos2 > 0 && template.charCodeAt(pos2 - 1) == 92) //\
             {
                result += template.substring(pos1, pos2 - 1);
                result += "{";
                pos1 = pos2 + 1;
                continue;
            }
            result += template.substring(pos1, pos2);
            pos1 = pos2;
            pos2 = template.indexOf("}", pos1);
            if (pos2 == -1)
                break;
            if (pos2 == pos1 + 1) {
                result += template.substr(pos1, 2);
                pos1 = pos2 + 1;
                continue;
            }
            tag = template.substring(pos1 + 1, pos2);
            pos3 = tag.indexOf("=");
            if (pos3 != -1) {
                value = this._templateVars[tag.substring(0, pos3)];
                if (value == null)
                    result += tag.substring(pos3 + 1);
                else
                    result += value;
            }
            else {
                value = this._templateVars[tag];
                if (value != null)
                    result += value;
            }
            pos1 = pos2 + 1;
        }
        if (pos1 < template.length)
            result += template.substr(pos1);
        return result;
    }
    get templateVars() {
        return this._templateVars;
    }
    set templateVars(value) {
        if (this._templateVars == null && value == null)
            return;
        this._templateVars = value;
        this.flushVars();
    }
    setVar(name, value) {
        if (!this._templateVars)
            this._templateVars = {};
        this._templateVars[name] = value;
        return this;
    }
    flushVars() {
        this.markSizeChanged();
        this.updateText();
    }
    get textWidth() {
        this.ensureSizeCorrect();
        return this._node._uiProps.uiTransformComp.width;
    }
    ensureSizeCorrect() {
        if (this._sizeDirty) {
            this._label.updateRenderData(true);
            this._sizeDirty = false;
        }
    }
    updateText() {
        var text2 = this._text;
        if (this._templateVars)
            text2 = this.parseTemplate(text2);
        if (this._ubbEnabled) //不支持同一个文本不同样式
            text2 = defaultParser.parse(text2, true);
        this._label.string = text2;
    }
    assignFont(label, value) {
        if (value instanceof Font)
            label.font = value;
        else {
            let font = getFontByName(value);
            if (!font) {
                label.fontFamily = value;
                label.useSystemFont = true;
            }
            else
                label.font = font;
        }
    }
    assignFontColor(label, value) {
        let font = label.font;
        if ((font instanceof BitmapFont) && !(font.fntConfig.canTint))
            value = Color.WHITE;
        if (this._grayed)
            value = toGrayedColor(value);
        label.color = value;
    }
    updateFont() {
        this.assignFont(this._label, this._realFont);
    }
    updateFontColor() {
        this.assignFontColor(this._label, this._color);
    }
    updateStrokeColor() {
        if (!this._outline)
            return;
        if (!this._strokeColor)
            this._strokeColor = new Color();
        if (this._grayed)
            this._outline.color = toGrayedColor(this._strokeColor);
        else
            this._outline.color = this._strokeColor;
    }
    updateShadowColor() {
        if (!this._shadow)
            return;
        if (!this._shadowColor)
            this._shadowColor = new Color();
        if (this._grayed)
            this._shadow.color = toGrayedColor(this._shadowColor);
        else
            this._shadow.color = this._shadowColor;
    }
    updateFontSize() {
        let font = this._label.font;
        if (font instanceof BitmapFont) {
            let fntConfig = font.fntConfig;
            if (fntConfig.resizable)
                this._label.fontSize = this._fontSize;
            else
                this._label.fontSize = fntConfig.fontSize;
            this._label.lineHeight = fntConfig.fontSize + (this._leading + 4) * fntConfig.fontSize / this._label.fontSize;
        }
        else {
            this._label.fontSize = this._fontSize;
            this._label.lineHeight = this._fontSize + this._leading;
        }
    }
    updateOverflow() {
        if (this._autoSize == AutoSizeType.Both)
            this._label.overflow = Label.Overflow.NONE;
        else if (this._autoSize == AutoSizeType.Height) {
            this._label.overflow = Label.Overflow.RESIZE_HEIGHT;
            this._node._uiProps.uiTransformComp.width = this._width;
        }
        else if (this._autoSize == AutoSizeType.Shrink) {
            this._label.overflow = Label.Overflow.SHRINK;
            this._node._uiProps.uiTransformComp.setContentSize(this._width, this._height);
        }
        else {
            this._label.overflow = Label.Overflow.CLAMP;
            this._node._uiProps.uiTransformComp.setContentSize(this._width, this._height);
        }
    }
    markSizeChanged() {
        if (this._underConstruct)
            return;
        if (this._autoSize == AutoSizeType.Both || this._autoSize == AutoSizeType.Height) {
            if (!this._sizeDirty) {
                this._node.emit(FUIEvent.SIZE_DELAY_CHANGE);
                this._sizeDirty = true;
            }
        }
    }
    onLabelSizeChanged() {
        this._sizeDirty = false;
        if (this._underConstruct)
            return;
        if (this._autoSize == AutoSizeType.Both || this._autoSize == AutoSizeType.Height) {
            this._updatingSize = true;
            this.setSize(this._node._uiProps.uiTransformComp.width, this._node._uiProps.uiTransformComp.height);
            this._updatingSize = false;
        }
    }
    handleSizeChanged() {
        if (this._updatingSize)
            return;
        if (this._autoSize == AutoSizeType.None || this._autoSize == AutoSizeType.Shrink) {
            this._node._uiProps.uiTransformComp.setContentSize(this._width, this._height);
        }
        else if (this._autoSize == AutoSizeType.Height)
            this._node._uiProps.uiTransformComp.width = this._width;
    }
    handleGrayedChanged() {
        this.updateFontColor();
        this.updateStrokeColor();
    }
    getProp(index) {
        switch (index) {
            case ObjectPropID.Color:
                return this.color;
            case ObjectPropID.OutlineColor:
                return this.strokeColor;
            case ObjectPropID.FontSize:
                return this.fontSize;
            default:
                return super.getProp(index);
        }
    }
    setProp(index, value) {
        switch (index) {
            case ObjectPropID.Color:
                this.color = value;
                break;
            case ObjectPropID.OutlineColor:
                this.strokeColor = value;
                break;
            case ObjectPropID.FontSize:
                this.fontSize = value;
                break;
            default:
                super.setProp(index, value);
                break;
        }
    }
    setup_beforeAdd(buffer, beginPos) {
        super.setup_beforeAdd(buffer, beginPos);
        buffer.seek(beginPos, 5);
        this.font = buffer.readS();
        this.fontSize = buffer.readShort();
        this.color = buffer.readColor();
        this.align = buffer.readByte();
        this.verticalAlign = buffer.readByte();
        this.leading = buffer.readShort();
        this.letterSpacing = buffer.readShort();
        this._ubbEnabled = buffer.readBool();
        this.autoSize = buffer.readByte();
        this.underline = buffer.readBool();
        this.italic = buffer.readBool();
        this.bold = buffer.readBool();
        this.singleLine = buffer.readBool();
        if (buffer.readBool()) {
            this.strokeColor = buffer.readColor();
            this.stroke = buffer.readFloat();
        }
        if (buffer.readBool()) {
            this.shadowColor = buffer.readColor();
            let f1 = buffer.readFloat();
            let f2 = buffer.readFloat();
            this.shadowOffset = new Vec2(f1, f2);
        }
        if (buffer.readBool())
            this._templateVars = {};
    }
    setup_afterAdd(buffer, beginPos) {
        super.setup_afterAdd(buffer, beginPos);
        buffer.seek(beginPos, 6);
        var str = buffer.readS();
        if (str != null)
            this.text = str;
    }
}
