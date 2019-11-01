
namespace fgui {

    export class GTextInput extends GTextField {
        public _editBox: cc.EditBox;

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
            this.on(Event.TOUCH_END, this.onTouchEnd1, this);

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

        public set promptText(val: string) {
            this._promptText = val;
            let newCreate: boolean = !this._editBox.placeholderLabel;
            this._editBox["_updatePlaceholderLabel"]();
            if (newCreate)
                this.assignFont(this._editBox.placeholderLabel, this._realFont);
            this._editBox.placeholderLabel.string = UBBParser.inst.parse(this._promptText, true);

            if (UBBParser.inst.lastColor) {
                let c = this._editBox.placeholderLabel.node.color;
                if (!c)
                    c = new cc.Color();
                c.fromHEX(UBBParser.inst.lastColor);
                this.assignFontColor(this._editBox.placeholderLabel, c);
            }
            else
                this.assignFontColor(this._editBox.placeholderLabel, this._color);

            if (UBBParser.inst.lastSize)
                this._editBox.placeholderLabel.fontSize = parseInt(UBBParser.inst.lastSize);
            else
                this._editBox.placeholderLabel.fontSize = this._fontSize;
        }

        public get promptText(): string {
            return this._promptText;
        }

        public set restrict(value: string) {
            //not supported
        }

        public get restrict(): string {
            return "";
        }

        public get password(): boolean {
            return this._editBox.inputFlag == cc.EditBox.InputFlag.PASSWORD;;
        }

        public set password(val: boolean) {
            this._editBox.inputFlag = val ? cc.EditBox.InputFlag.PASSWORD : cc.EditBox.InputFlag.DEFAULT;
        }

        public get align(): cc.Label.HorizontalAlign {
            return this._editBox.textLabel.horizontalAlign;
        }

        public set align(value: cc.Label.HorizontalAlign) {
            this._editBox.textLabel.horizontalAlign = value;
        }

        public get verticalAlign(): cc.Label.VerticalAlign {
            return this._editBox.textLabel.verticalAlign;
        }

        public set verticalAlign(value: cc.Label.VerticalAlign) {
            this._editBox.textLabel.verticalAlign = value;
        }

        public get letterSpacing(): number {
            return 0;
        }

        public set letterSpacing(value: number) {
            //not supported
        }

        public get singleLine(): boolean {
            return this._editBox.inputMode != cc.EditBox.InputMode.ANY;
        }

        public set singleLine(value: boolean) {
            this._editBox.inputMode = value ? cc.EditBox.InputMode.SINGLE_LINE : cc.EditBox.InputMode.ANY;
        }

        public requestFocus(): void {
            this._editBox.setFocus();
        }

        protected markSizeChanged(): void {
            //不支持自动大小，所以这里空
        }

        protected updateText(): void {
            var text2: string = this._text;

            if (this._templateVars != null)
                text2 = this.parseTemplate(text2);

            if (this._ubbEnabled) //不支持同一个文本不同样式
                text2 = UBBParser.inst.parse(ToolSet.encodeHTML(text2), true);

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

        private onTouchEnd1(evt: Event) {
            (<MyEditBox>this._editBox).openKeyboard(evt.touch);
        }

        public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
            super.setup_beforeAdd(buffer, beginPos);

            buffer.seek(beginPos, 4);

            var str: string = buffer.readS();
            if (str != null)
                this.promptText = str;

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
        }
    }

    class MyEditBox extends cc.EditBox {
        _registerEvent() {
            //取消掉原来的事件处理
        }

        _syncSize() {
            let size = this.node.getContentSize();
            let impl = this["_impl"];

            impl.setSize(size.width, size.height);

            if (this.textLabel)
                this.textLabel.node.setContentSize(size.width, size.height);
            if (this.placeholderLabel)
                this.placeholderLabel.node.setContentSize(size.width, size.height);
        }

        public openKeyboard(touch: any) {
            let impl = this["_impl"];
            if (impl) {
                impl.beginEditing();
            }
        }
    }
}