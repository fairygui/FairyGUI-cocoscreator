
namespace fgui {

    export class GTextInput extends GTextField {
        public _editBox: cc.EditBox;

        private _promptText: string;

        public constructor() {
            super();

            this._node.name = "GTextInput";
        }

        protected createRenderer() {
            this._editBox = this._node.addComponent(cc.EditBox);
            this._editBox.placeholder = "";
            this._editBox.maxLength = -1;

            this._node.on('text-changed', this.onTextChanged, this);
            this._node.on('editing-did-began', this.onEditingBegan, this);

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
            this._editBox.placeholder = UBBParser.inst.parse(this._promptText, true);

            if (UBBParser.inst.lastColor) {
                let c = this._editBox.placeholderFontColor;
                if (!c)
                    c = new cc.Color();
                c.fromHEX(UBBParser.inst.lastColor);
                this._editBox.placeholderFontColor = c;
            }
            if (UBBParser.inst.lastSize)
                this._editBox.placeholderFontSize = parseInt(UBBParser.inst.lastSize);
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
            this._editBox.inputFlag = cc.EditBox.InputFlag.PASSWORD;
        }

        public get align(): cc.Label.HorizontalAlign {
            return cc.Label.HorizontalAlign.LEFT;
        }

        public set align(value: cc.Label.HorizontalAlign) {
            //not supported
        }

        public get verticalAlign(): cc.Label.VerticalAlign {
            return cc.Label.VerticalAlign.TOP;
        }

        public set verticalAlign(value: cc.Label.VerticalAlign) {
            //not supported
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

        protected updateFont(value: string | cc.Font) {
            //not supported
        }

        protected updateFontColor() {
            this._editBox.fontColor = this._color;
        }

        protected updateFontSize() {
            this._editBox.fontSize = this._fontSize;
            this._editBox.lineHeight = this._fontSize + this._leading;
        }

        protected updateOverflow() {
            //not supported
        }

        private onTextChanged() {
            this._text = this._editBox.string;
        }

        private onEditingBegan() {
            //点击输入框时，竟然不会产生点击事件，这里模拟一个
            GRoot.inst.inputProcessor.simulateClick(this);
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
}