import { Color, EditBox, HorizontalTextAlignment, VerticalTextAlignment } from "cc";
import { Event as FUIEvent } from "./event/Event";
import { AutoSizeType } from "./FieldTypes";
import { GTextField } from "./GTextField";
import { ByteBuffer } from "./utils/ByteBuffer";
import { defaultParser } from "./utils/UBBParser";

export class GTextInput extends GTextField {
    public _editBox: EditBox;

    private _promptText: string;

    public constructor() {
        super();

        this._node.name = "GTextInput";
        this._touchDisabled = false;
    }

    protected createRenderer() {
        this._editBox = this._node.addComponent(MyEditBox);
        this._editBox.maxLength = -1;
        this._editBox["_updateTextLabel"]();

        this._node.on('text-changed', this.onTextChanged, this);
        this.on(FUIEvent.TOUCH_END, this.onTouchEnd1, this);

        this.autoSize = AutoSizeType.None;
    }

    public set editable(val: boolean) {
        this._editBox.enabled = val;
    }

    public get editable(): boolean {
        return this._editBox.enabled;
    }

    public set maxLength(val: number) {
        if (val == 0)
            val = -1;
        this._editBox.maxLength = val;
    }

    public get maxLength(): number {
        return this._editBox.maxLength;
    }

    public set promptText(val: string | null) {
        this._promptText = val;
        let newCreate: boolean = !this._editBox.placeholderLabel;
        this._editBox["_updatePlaceholderLabel"]();
        if (newCreate)
            this.assignFont(this._editBox.placeholderLabel, this._realFont);
        this._editBox.placeholderLabel.string = defaultParser.parse(this._promptText, true);

        if (defaultParser.lastColor) {
            let c = this._editBox.placeholderLabel.color;
            if (!c)
                c = new Color();
            c.fromHEX(defaultParser.lastColor);
            this.assignFontColor(this._editBox.placeholderLabel, c);
        }
        else
            this.assignFontColor(this._editBox.placeholderLabel, this._color);

        if (defaultParser.lastSize)
            this._editBox.placeholderLabel.fontSize = parseInt(defaultParser.lastSize);
        else
            this._editBox.placeholderLabel.fontSize = this._fontSize;
    }

    public get promptText(): string | null {
        return this._promptText;
    }

    public set restrict(value: string | null) {
        //not supported
    }

    public get restrict(): string | null {
        return "";
    }

    public get password(): boolean {
        return this._editBox.inputFlag == EditBox.InputFlag.PASSWORD;;
    }

    public set password(val: boolean) {
        this._editBox.inputFlag = val ? EditBox.InputFlag.PASSWORD : EditBox.InputFlag.DEFAULT;
    }

    public get align(): HorizontalTextAlignment {
        return this._editBox.textLabel.horizontalAlign;
    }

    public set align(value: HorizontalTextAlignment) {
        this._editBox.textLabel.horizontalAlign = value;
        if (this._editBox.placeholderLabel) {
            this._editBox.placeholderLabel.horizontalAlign = value;
        }
    }

    public get verticalAlign(): VerticalTextAlignment {
        return this._editBox.textLabel.verticalAlign;
    }

    public set verticalAlign(value: VerticalTextAlignment) {
        this._editBox.textLabel.verticalAlign = value;
        if (this._editBox.placeholderLabel) {
            this._editBox.placeholderLabel.verticalAlign = value;
        }
    }

    public get singleLine(): boolean {
        return this._editBox.inputMode != EditBox.InputMode.ANY;
    }

    public set singleLine(value: boolean) {
        this._editBox.inputMode = value ? EditBox.InputMode.SINGLE_LINE : EditBox.InputMode.ANY;
    }

    public requestFocus(): void {
        this._editBox.focus();
    }

    protected markSizeChanged(): void {
        //不支持自动大小，所以这里空
    }

    protected updateText(): void {
        var text2: string = this._text;

        if (this._templateVars)
            text2 = this.parseTemplate(text2);

        if (this._ubbEnabled) //不支持同一个文本不同样式
            text2 = defaultParser.parse(text2, true);

        this._editBox.string = text2;
    }

    protected updateFont() {
        this.assignFont(this._editBox.textLabel, this._realFont);
        if (this._editBox.placeholderLabel)
            this.assignFont(this._editBox.placeholderLabel, this._realFont);
    }

    protected updateFontColor() {
        this.assignFontColor(this._editBox.textLabel, this._color);
    }

    protected updateFontSize() {
        this._editBox.textLabel.fontSize = this._fontSize;
        this._editBox.textLabel.lineHeight = this._fontSize + this._leading;
        if (this._editBox.placeholderLabel)
            this._editBox.placeholderLabel.fontSize = this._editBox.textLabel.fontSize;
    }

    protected updateOverflow() {
        //not supported
    }

    private onTextChanged() {
        this._text = this._editBox.string;
    }

    private onTouchEnd1(evt: FUIEvent) {
        (<MyEditBox>this._editBox).openKeyboard();
    }

    public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
        super.setup_beforeAdd(buffer, beginPos);

        buffer.seek(beginPos, 4);

        var str: string = buffer.readS();
        if (str != null)
            this.promptText = str;
        else if (this._editBox.placeholderLabel)
            this._editBox.placeholderLabel.string = "";

        str = buffer.readS();
        if (str != null)
            this.restrict = str;

        var iv: number = buffer.readInt();
        if (iv != 0)
            this.maxLength = iv;
        iv = buffer.readInt();
        if (iv != 0) {//keyboardType
        }
        if (buffer.readBool())
            this.password = true;

        //同步一下对齐方式

        if (this._editBox.placeholderLabel) {
            let hAlign = this._editBox.textLabel.horizontalAlign;
            this._editBox.placeholderLabel.horizontalAlign = hAlign;

            let vAlign = this._editBox.textLabel.verticalAlign;
            this._editBox.placeholderLabel.verticalAlign = vAlign;
        }
    }
}

class MyEditBox extends EditBox {
    _registerEvent() {
        //取消掉原来的事件处理
    }

    // _syncSize() {
    //     let size = this.node._uiProps.uiTransformComp.contentSize;
    //     let impl = this["_impl"];

    //     impl.setSize(size.width, size.height);

    //     if (this.textLabel)
    //         this.textLabel.node._uiProps.uiTransformComp.setContentSize(size.width, size.height);
    //     if (this.placeholderLabel)
    //         this.placeholderLabel.node._uiProps.uiTransformComp.setContentSize(size.width, size.height);
    // }

    public openKeyboard() {
        let impl = this["_impl"];
        if (impl) {
            impl.beginEditing();
        }
    }
}