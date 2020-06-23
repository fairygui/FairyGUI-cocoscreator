namespace fgui {
    export class GLoader3D extends GObject {
        private _url: string;
        private _align: AlignType;
        private _verticalAlign: VertAlignType;
        private _autoSize: boolean;
        private _fill: LoaderFillType;
        private _shrinkOnly: boolean;
        private _playing: boolean;
        private _frame: number = 0;
        private _loop: boolean;
        private _animationName: string;
        private _color: cc.Color;
        private _contentItem: PackageItem;
        private _container: cc.Node;
        private _content: cc.Component;
        private _updatingLayout: boolean;

        public constructor() {
            super();

            this._node.name = "GLoader3D";
            this._playing = true;
            this._url = "";
            this._fill = LoaderFillType.None;
            this._align = AlignType.Left;
            this._verticalAlign = VertAlignType.Top;
            this._color = new cc.Color(255, 255, 255, 255);

            this._container = new cc.Node("Wrapper");
            this._container.setAnchorPoint(0, 1);
            this._node.addChild(this._container);
        }

        public dispose(): void {
            super.dispose();
        }

        public get url(): string {
            return this._url;
        }

        public set url(value: string) {
            if (this._url == value)
                return;

            this._url = value;
            this.loadContent();
            this.updateGear(7);
        }

        public get icon(): string {
            return this._url;
        }

        public set icon(value: string) {
            this.url = value;
        }

        public get align(): AlignType {
            return this._align;
        }

        public set align(value: AlignType) {
            if (this._align != value) {
                this._align = value;
                this.updateLayout();
            }
        }

        public get verticalAlign(): VertAlignType {
            return this._verticalAlign;
        }

        public set verticalAlign(value: VertAlignType) {
            if (this._verticalAlign != value) {
                this._verticalAlign = value;
                this.updateLayout();
            }
        }

        public get fill(): LoaderFillType {
            return this._fill;
        }

        public set fill(value: LoaderFillType) {
            if (this._fill != value) {
                this._fill = value;
                this.updateLayout();
            }
        }

        public get shrinkOnly(): boolean {
            return this._shrinkOnly;
        }

        public set shrinkOnly(value: boolean) {
            if (this._shrinkOnly != value) {
                this._shrinkOnly = value;
                this.updateLayout();
            }
        }

        public get autoSize(): boolean {
            return this._autoSize;
        }

        public set autoSize(value: boolean) {
            if (this._autoSize != value) {
                this._autoSize = value;
                this.updateLayout();
            }
        }

        public get playing(): boolean {
            return this._playing;
        }

        public set playing(value: boolean) {
            if (this._playing != value) {
                this._playing = value;
                this.updateGear(5);
            }
        }

        public get frame(): number {
            return this._frame;
        }

        public set frame(value: number) {
            if (this._frame != value) {
                this._frame = value;
                this.updateGear(5);
            }
        }

        public get color(): cc.Color {
            return this._color;
        }

        public set color(value: cc.Color) {
            if (!this._color.equals(value)) {
                this._color.set(value);
                this.updateGear(4);
                this._container.color = value;
            }
        }

        protected loadContent(): void {
            this.clearContent();

            if (!this._url)
                return;

            if (ToolSet.startsWith(this._url, "ui://"))
                this.loadFromPackage(this._url);
            else
                this.loadExternal();
        }

        protected loadFromPackage(itemURL: string) {
            this._contentItem = UIPackage.getItemByURL(itemURL);
            if (this._contentItem) {
                this._contentItem = this._contentItem.getBranch();
                this.sourceWidth = this._contentItem.width;
                this.sourceHeight = this._contentItem.height;
                this._contentItem = this._contentItem.getHighResolution();
                this._contentItem.load();

                if (this._autoSize)
                    this.setSize(this.sourceWidth, this.sourceHeight);

                if (this._contentItem.type == PackageItemType.Spine) {
                    if (this._contentItem.asset) {
                        this.updateLayout();
                    }
                }
                else if (this._contentItem.type == PackageItemType.DragonBones) {
                }
            }
        }

        protected loadExternal(): void {
            if (ToolSet.startsWith(this._url, "http://")
                || ToolSet.startsWith(this._url, "https://")
                || ToolSet.startsWith(this._url, '/'))
                cc.assetManager.loadRemote(this._url, this.onLoaded.bind(this));
            else
                cc.resources.load(this._url, cc.Asset, this.onLoaded.bind(this));
        }

        private onLoaded(err, asset): void {
            //因为是异步返回的，而这时可能url已经被改变，所以不能直接用返回的结果

            if (!this._url || !cc.isValid(this._node))
                return;

            if (err)
                console.warn(err);
        }

        private updateLayout(): void {
            if (this._content == null) {
                if (this._autoSize) {
                    this._updatingLayout = true;
                    this.setSize(50, 30);
                    this._updatingLayout = false;
                }
                return;
            }

            let contentWidth = this.sourceWidth;
            let contentHeight = this.sourceHeight;

            let pivotCorrectX = -this.pivotX * this._width;
            let pivotCorrectY = this.pivotY * this._height;

            if (this._autoSize) {
                this._updatingLayout = true;
                if (contentWidth == 0)
                    contentWidth = 50;
                if (contentHeight == 0)
                    contentHeight = 30;

                this.setSize(contentWidth, contentHeight);
                this._updatingLayout = false;

                this._container.setContentSize(this._width, this._height);
                this._container.setPosition(pivotCorrectX, pivotCorrectY);

                if (contentWidth == this._width && contentHeight == this._height)
                    return;
            }

            var sx: number = 1, sy: number = 1;
            if (this._fill != LoaderFillType.None) {
                sx = this.width / this.sourceWidth;
                sy = this.height / this.sourceHeight;

                if (sx != 1 || sy != 1) {
                    if (this._fill == LoaderFillType.ScaleMatchHeight)
                        sx = sy;
                    else if (this._fill == LoaderFillType.ScaleMatchWidth)
                        sy = sx;
                    else if (this._fill == LoaderFillType.Scale) {
                        if (sx > sy)
                            sx = sy;
                        else
                            sy = sx;
                    }
                    else if (this._fill == LoaderFillType.ScaleNoBorder) {
                        if (sx > sy)
                            sy = sx;
                        else
                            sx = sy;
                    }
                    if (this._shrinkOnly) {
                        if (sx > 1)
                            sx = 1;
                        if (sy > 1)
                            sy = 1;
                    }
                    contentWidth = this.sourceWidth * sx;
                    contentHeight = this.sourceHeight * sy;
                }
            }

            this._container.setContentSize(contentWidth, contentHeight);

            var nx: number, ny: number;
            if (this._align == AlignType.Left)
                nx = 0;
            else if (this._align == AlignType.Center)
                nx = Math.floor((this._width - contentWidth) / 2);
            else
                nx = this._width - contentWidth;
            if (this._verticalAlign == VertAlignType.Top)
                ny = 0;
            else if (this._verticalAlign == VertAlignType.Middle)
                ny = Math.floor((this._height - contentHeight) / 2);
            else
                ny = this._height - contentHeight;
            ny = -ny;
            this._container.setPosition(pivotCorrectX + nx, pivotCorrectY + ny);
        }

        private clearContent(): void {
            this._contentItem = null;
        }

        protected handleSizeChanged(): void {
            super.handleSizeChanged();

            if (!this._updatingLayout)
                this.updateLayout();
        }

        protected handleAnchorChanged(): void {
            super.handleAnchorChanged();

            if (!this._updatingLayout)
                this.updateLayout();
        }

        protected handleGrayedChanged(): void {
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
                    return 1;
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
                    break;
                case ObjectPropID.DeltaTime:
                    break;
                default:
                    super.setProp(index, value);
                    break;
            }
        }

        public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
            super.setup_beforeAdd(buffer, beginPos);

            buffer.seek(beginPos, 5);

            this._url = buffer.readS();
            this._align = buffer.readByte();
            this._verticalAlign = buffer.readByte();
            this._fill = buffer.readByte();
            this._shrinkOnly = buffer.readBool();
            this._autoSize = buffer.readBool();
            this._animationName = buffer.readS();
            this._playing = buffer.readBool();
            this._frame = buffer.readInt();
            this._loop = buffer.readBool();

            if (buffer.readBool())
                this.color = buffer.readColor();

            if (this._url)
                this.loadContent();
        }
    }
}