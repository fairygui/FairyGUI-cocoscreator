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
        private _container: cc.Node;
        private _errorSign?: GObject;
        private _content2?: GComponent;
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
            this._color = new cc.Color(255, 255, 255, 255);

            this._container = new cc.Node("Image");
            this._container.setAnchorPoint(0, 1);
            this._node.addChild(this._container);

            this._content = this._container.addComponent(MovieClip);
            this._content.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            this._content.trim = false;
            this._content.setPlaySettings();
        }

        public dispose(): void {
            if (this._contentItem == null) {
                if (this._content.spriteFrame)
                    this.freeExternal(this._content.spriteFrame);
            }
            if (this._content2)
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

        public SetUrl(value: string, onComplete: Function,onCompleteBind:any) {
            if (this._url == value)
                return;

            this._url = value;
            this.loadContent(onComplete,onCompleteBind);
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
                    this._content.playing = value;
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
                    this._content.frame = value;
                this.updateGear(5);
            }
        }

        public get color(): cc.Color {
            return this._color;
        }

        public set color(value: cc.Color) {
            this._color.set(value);
            this.updateGear(4);
            this._container.color = value;
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
                this.sourceWidth = value.getRect().width;
                this.sourceHeight = value.getRect().height;
            }
            else {
                this.sourceWidth = this.sourceHeight = 0;
            }

            this.updateLayout();
        }

        protected loadContent(onComplete:Function=null,onCompleteBind:any=null): void {
            this.clearContent();

            if (!this._url)
            {
                if(onComplete)
                onComplete.call(onCompleteBind);
                return;
            }
             

            if (ToolSet.startsWith(this._url, "ui://"))
            {
                this.loadFromPackage(this._url);
                if(onComplete)
                onComplete.call(onCompleteBind);
            }
            else
                this.loadExternal(onComplete,onCompleteBind);
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
                        this._content2 = obj;
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

        protected loadExternal(onComplete:Function=null,onCompleteBind:any=null): void {
            let url = this.url;
            let callback = (err, asset) => {
                //因为是异步返回的，而这时可能url已经被改变，所以不能直接用返回的结果

                if (this._url != url || !cc.isValid(this._node))
                    return;

                if (err)
                    console.warn(err);

                if (asset instanceof cc.SpriteFrame)
                    this.onExternalLoadSuccess(asset);
                else if (asset instanceof cc.Texture2D)
                    this.onExternalLoadSuccess(new cc.SpriteFrame(asset));

                //调用自定义结束回调 add by xc
                if(onComplete)
                onComplete.call(onCompleteBind);
            };
            if (ToolSet.startsWith(this._url, "http://")
                || ToolSet.startsWith(this._url, "https://")
                || ToolSet.startsWith(this._url, '/'))
                cc.assetManager.loadRemote(this._url, callback);
            else
                cc.resources.load(this._url, cc.Asset, callback);
        }

        protected freeExternal(texture: cc.SpriteFrame): void {
        }

        protected onExternalLoadSuccess(texture: cc.SpriteFrame): void {
            this._content.spriteFrame = texture;
            this._content.type = cc.Sprite.Type.SIMPLE;
            this.sourceWidth = texture.getRect().width;
            this.sourceHeight = texture.getRect().height;
            if (this._autoSize)
                this.setSize(this.sourceWidth, this.sourceHeight);
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

            if (this._errorSign) {
                this._errorSign.setSize(this.width, this.height);
                this._container.addChild(this._errorSign.node);
            }
        }

        private clearErrorState(): void {
            if (this._errorSign) {
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

            let cw = this.sourceWidth;
            let ch = this.sourceHeight;

            let pivotCorrectX = -this.pivotX * this._width;
            let pivotCorrectY = this.pivotY * this._height;

            if (this._autoSize) {
                this._updatingLayout = true;
                if (cw == 0)
                    cw = 50;
                if (ch == 0)
                    ch = 30;

                this.setSize(cw, ch);
                this._updatingLayout = false;

                this._container.setContentSize(this._width, this._height);
                this._container.setPosition(pivotCorrectX, pivotCorrectY);
                if (this._content2) {
                    this._content2.setPosition(pivotCorrectX + this._width * this.pivotX, pivotCorrectY - this._height * this.pivotY);
                    this._content2.setScale(1, 1);
                }
                if (cw == this._width && ch == this._height)
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
                    cw = this.sourceWidth * sx;
                    ch = this.sourceHeight * sy;
                }
            }

            this._container.setContentSize(cw, ch);
            if (this._content2) {
                this._content2.setPosition(pivotCorrectX + this._width * this.pivotX, pivotCorrectY - this._height * this.pivotY);
                this._content2.setScale(sx, sy);
            }

            var nx: number, ny: number;
            if (this._align == AlignType.Left)
                nx = 0;
            else if (this._align == AlignType.Center)
                nx = Math.floor((this._width - cw) / 2);
            else
                nx = this._width - cw;
            if (this._verticalAlign == VertAlignType.Top)
                ny = 0;
            else if (this._verticalAlign == VertAlignType.Middle)
                ny = Math.floor((this._height - ch) / 2);
            else
                ny = this._height - ch;
            ny = -ny;
            this._container.setPosition(pivotCorrectX + nx, pivotCorrectY + ny);
        }

        private clearContent(): void {
            this.clearErrorState();

            if (!this._contentItem) {
                var texture: cc.SpriteFrame = this._content.spriteFrame;
                if (texture)
                    this.freeExternal(texture);
            }
            if (this._content2) {
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

        protected _hitTest(pt: cc.Vec2, globalPt: cc.Vec2): GObject {
            if (this._content2) {
                let obj: GObject = this._content2.hitTest(globalPt);
                if (obj)
                    return obj;
            }

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