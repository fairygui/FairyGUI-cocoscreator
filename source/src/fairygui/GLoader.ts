/// <reference path="GObjectPool.ts" />

namespace fgui {

    export class GLoader extends GObject {
        public _content: MovieClip;

        private _url: string;
        private _align: AlignType;
        private _verticalAlign: VertAlignType;
        private _autoSize: boolean;
        private _fill: LoaderFillType;
        private _shrinkOnly: boolean;
        private _showErrorSign: boolean;
        private _playing: boolean;
        private _frame: number = 0;
        private _color: cc.Color;

        private _contentItem: PackageItem;
        private _contentSourceWidth: number = 0;
        private _contentSourceHeight: number = 0;
        private _contentWidth: number = 0;
        private _contentHeight: number = 0;

        private _container: cc.Node;
        private _errorSign: GObject;
        private _content2: GComponent;

        private _updatingLayout: boolean;

        private static _errorSignPool: GObjectPool = new GObjectPool();

        public constructor() {
            super();

            this._node.name = "GLoader";
            this._playing = true;
            this._url = "";
            this._fill = LoaderFillType.None;
            this._align = AlignType.Left;
            this._verticalAlign = VertAlignType.Top;
            this._showErrorSign = true;
            this._color = cc.Color.WHITE;

            this._container = new cc.Node("Image");
            this._container.setAnchorPoint(0, 1);
            this._node.addChild(this._container);

            this._content = this._container.addComponent(MovieClip);
        }

        public dispose(): void {
            if (this._contentItem == null) {
                if (this._content.spriteFrame != null)
                    this.freeExternal(this._content.spriteFrame);
            }
            if (this._content2 != null)
                this._content2.dispose();
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
                if (this._content instanceof MovieClip)
                    (<MovieClip>this._content).playing = value;
                this.updateGear(5);
            }
        }

        public get frame(): number {
            return this._frame;
        }

        public set frame(value: number) {
            if (this._frame != value) {
                this._frame = value;
                if (this._content instanceof MovieClip)
                    (<MovieClip>this._content).frame = value;
                this.updateGear(5);
            }
        }

        public get color(): cc.Color {
            return this._color;
        }

        public set color(value: cc.Color) {
            if (this._color != value) {
                this._color = value;
                this.updateGear(4);
                this._container.color = value;
            }
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

        public get showErrorSign(): boolean {
            return this._showErrorSign;
        }

        public set showErrorSign(value: boolean) {
            this._showErrorSign = value;
        }

        public get component(): GComponent {
            return this._content2;
        }

        public get texture(): cc.SpriteFrame {
            return this._content.spriteFrame;
        }

        public set texture(value: cc.SpriteFrame) {
            this.url = null;

            this._content.spriteFrame = value;
            this._content.type = cc.Sprite.Type.SIMPLE;
            if (value != null) {
                this._contentSourceWidth = value.getRect().width;
                this._contentSourceHeight = value.getRect().height;
            }
            else {
                this._contentSourceWidth = this._contentHeight = 0;
            }

            this.updateLayout();
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
            if (this._contentItem != null) {
                this._contentItem = this._contentItem.getBranch();
                this._contentSourceWidth = this._contentItem.width;
                this._contentSourceHeight = this._contentItem.height;
                this._contentItem = this._contentItem.getHighResolution();
                this._contentItem.load();

                if (this._autoSize)
                    this.setSize(this._contentSourceWidth, this._contentSourceHeight);

                if (this._contentItem.type == PackageItemType.Image) {
                    if (!this._contentItem.asset) {
                        this.setErrorState();
                    }
                    else {
                        this._content.spriteFrame = <cc.SpriteFrame>this._contentItem.asset;
                        if (this._content.fillMethod == 0) {
                            if (this._contentItem.scale9Grid)
                                this._content.type = cc.Sprite.Type.SLICED;
                            else if (this._contentItem.scaleByTile)
                                this._content.type = cc.Sprite.Type.TILED;
                            else
                                this._content.type = cc.Sprite.Type.SIMPLE;
                        }
                        this.updateLayout();
                    }
                }
                else if (this._contentItem.type == PackageItemType.MovieClip) {
                    this._content.interval = this._contentItem.interval;
                    this._content.swing = this._contentItem.swing;
                    this._content.repeatDelay = this._contentItem.repeatDelay;
                    this._content.frames = this._contentItem.frames;
                    this.updateLayout();
                }
                else if (this._contentItem.type == PackageItemType.Component) {
                    var obj: GObject = UIPackage.createObjectFromURL(itemURL);
                    if (!obj)
                        this.setErrorState();
                    else if (!(obj instanceof GComponent)) {
                        obj.dispose();
                        this.setErrorState();
                    }
                    else {
                        this._content2 = obj.asCom;
                        this._container.addChild(this._content2.node);
                        this.updateLayout();
                    }
                }
                else
                    this.setErrorState();
            }
            else
                this.setErrorState();
        }

        protected loadExternal(): void {
            if (ToolSet.startsWith(this._url, "http://") || ToolSet.startsWith(this._url, "https://"))
                cc.loader.load(this._url, this.onLoaded.bind(this));
            else
                cc.loader.loadRes(this._url, cc.Asset, this.onLoaded.bind(this));
        }

        private onLoaded(err, asset): void {
            //因为是异步返回的，而这时可能url已经被改变，所以不能直接用返回的结果

            if (!this._url || !cc.isValid(this._node))
                return;

            asset = cc.loader.getRes(this._url);
            if (!asset)
                return;

            if (asset instanceof cc.SpriteFrame)
                this.onExternalLoadSuccess(<cc.SpriteFrame>asset);
            else if (asset instanceof cc.Texture2D)
                this.onExternalLoadSuccess(new cc.SpriteFrame(asset));
        }

        protected freeExternal(texture: cc.SpriteFrame): void {
        }

        protected onExternalLoadSuccess(texture: cc.SpriteFrame): void {
            this._content.spriteFrame = texture;
            this._content.type = cc.Sprite.Type.SIMPLE;
            this._contentSourceWidth = texture.getRect().width;
            this._contentSourceHeight = texture.getRect().height;
            if (this._autoSize)
                this.setSize(this._contentSourceWidth, this._contentSourceHeight);
            this.updateLayout();
        }

        protected onExternalLoadFailed(): void {
            this.setErrorState();
        }

        private setErrorState(): void {
            if (!this._showErrorSign)
                return;

            if (this._errorSign == null) {
                if (UIConfig.loaderErrorSign != null) {
                    this._errorSign = GLoader._errorSignPool.getObject(UIConfig.loaderErrorSign);
                }
            }

            if (this._errorSign != null) {
                this._errorSign.setSize(this.width, this.height);
                this._container.addChild(this._errorSign.node);
            }
        }

        private clearErrorState(): void {
            if (this._errorSign != null) {
                this._container.removeChild(this._errorSign.node);
                GLoader._errorSignPool.returnObject(this._errorSign);
                this._errorSign = null;
            }
        }

        private updateLayout(): void {
            if (this._content2 == null && this._content == null) {
                if (this._autoSize) {
                    this._updatingLayout = true;
                    this.setSize(50, 30);
                    this._updatingLayout = false;
                }
                return;
            }

            this._contentWidth = this._contentSourceWidth;
            this._contentHeight = this._contentSourceHeight;

            let pivotCorrectX = -this.pivotX * this._width;
            let pivotCorrectY = this.pivotY * this._height;

            if (this._autoSize) {
                this._updatingLayout = true;
                if (this._contentWidth == 0)
                    this._contentWidth = 50;
                if (this._contentHeight == 0)
                    this._contentHeight = 30;

                this.setSize(this._contentWidth, this._contentHeight);
                this._updatingLayout = false;

                this._container.setContentSize(this._width, this._height);
                this._container.setPosition(pivotCorrectX, pivotCorrectY);
                if (this._content2 != null) {
                    this._content2.setPosition(pivotCorrectX - this._width / 2, pivotCorrectY - this._height / 2);
                    this._content2.setScale(1, 1);
                }
                if (this._contentWidth == this._width && this._contentHeight == this._height)
                    return;
            }

            var sx: number = 1, sy: number = 1;
            if (this._fill != LoaderFillType.None) {
                sx = this.width / this._contentSourceWidth;
                sy = this.height / this._contentSourceHeight;

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
                    this._contentWidth = this._contentSourceWidth * sx;
                    this._contentHeight = this._contentSourceHeight * sy;
                }
            }

            this._container.setContentSize(this._contentWidth, this._contentHeight);
            if (this._content2 != null) {
                this._content2.setPosition(pivotCorrectX - this._width / 2, pivotCorrectY - this._height / 2);
                this._content2.setScale(sx, sy);
            }

            var nx: number, ny: number;
            if (this._align == AlignType.Left)
                nx = 0;
            else if (this._align == AlignType.Center)
                nx = Math.floor((this._width - this._contentWidth) / 2);
            else
                nx = this._width - this._contentWidth;
            if (this._verticalAlign == VertAlignType.Top)
                ny = 0;
            else if (this._verticalAlign == VertAlignType.Middle)
                ny = Math.floor((this._height - this._contentHeight) / 2);
            else
                ny = this._height - this._contentHeight;
            ny = -ny;
            this._container.setPosition(pivotCorrectX + nx, pivotCorrectY + ny);
        }

        private clearContent(): void {
            this.clearErrorState();

            if (this._contentItem == null) {
                var texture: cc.SpriteFrame = this._content.spriteFrame;
                if (texture != null)
                    this.freeExternal(texture);
            }
            if (this._content2 != null) {
                this._container.removeChild(this._content2.node);
                this._content2.dispose();
                this._content2 = null;
            }
            this._content.frames = null;
            this._content.spriteFrame = null;
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
            this._content.grayed = this._grayed;
        }

        public hitTest(globalPt: cc.Vec2): GObject {
            if (this._touchDisabled || !this._touchable || !this._node.activeInHierarchy)
                return null;

            if (this._content2) {
                let obj: GObject = this._content2.hitTest(globalPt);
                if (obj)
                    return obj;
            }

            let pt: cc.Vec3 = this._node.convertToNodeSpaceAR(globalPt);
            pt.x += this._node.anchorX * this._width;
            pt.y += this._node.anchorY * this._height;
            if (pt.x >= 0 && pt.y >= 0 && pt.x < this._width && pt.y < this._height)
                return this;
            else
                return null;
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
                    return this._content.timeScale;
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
                    this._content.timeScale = value;
                    break;
                case ObjectPropID.DeltaTime:
                    this._content.advance(value);
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
            this._showErrorSign = buffer.readBool();
            this._playing = buffer.readBool();
            this._frame = buffer.readInt();

            if (buffer.readBool())
                this.color = buffer.readColor();
            this._content.fillMethod = buffer.readByte();
            if (this._content.fillMethod != 0) {

                this._content.fillOrigin = buffer.readByte();
                this._content.fillClockwise = buffer.readBool();
                this._content.fillAmount = buffer.readFloat();
            }

            if (this._url)
                this.loadContent();
        }
    }
}