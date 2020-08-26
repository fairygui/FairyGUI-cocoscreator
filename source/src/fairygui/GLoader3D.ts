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
        private _skinName: string;
        private _color: cc.Color;
        private _contentItem: PackageItem;
        private _container: cc.Node;
        private _content: sp.Skeleton | dragonBones.ArmatureDisplay;
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

                this.onChange();
            }
        }

        public get frame(): number {
            return this._frame;
        }

        public set frame(value: number) {
            if (this._frame != value) {
                this._frame = value;
                this.updateGear(5);

                this.onChange();
            }
        }

        public get animationName(): string {
            return this._animationName;
        }

        public set animationName(value: string) {
            if (this._animationName != value) {
                this._animationName = value;
                this.onChange();
            }
        }

        public get skinName(): string {
            return this._skinName;
        }

        public set skinName(value: string) {
            if (this._skinName != value) {
                this._skinName = value;
                this.onChange();
            }
        }

        public get loop(): boolean {
            return this._loop;
        }

        public set loop(value: boolean) {
            if (this._loop != value) {
                this._loop = value;
                this.onChange();
            }
        }

        public get color(): cc.Color {
            return this._color;
        }

        public set color(value: cc.Color) {
            this._color.set(value);
            this.updateGear(4);

            if (this._content)
                this._content.node.color = value;
        }

        public get content(): sp.Skeleton | dragonBones.DragonBones {
            return
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

                if (this._autoSize)
                    this.setSize(this.sourceWidth, this.sourceHeight);

                if (this._contentItem.type == PackageItemType.Spine || this._contentItem.type == PackageItemType.DragonBones)
                    this._contentItem.owner.getItemAssetAsync(this._contentItem, this.onLoaded.bind(this));
            }
        }

        private onLoaded(err: Error, item: PackageItem): void {
            if (this._contentItem != item)
                return;

            if (err)
                console.warn(err);

            if (!this._contentItem.asset)
                return;

            if (this._contentItem.type == PackageItemType.Spine)
                this.setSpine(<sp.SkeletonData>this._contentItem.asset, this._contentItem.skeletonAnchor);
            else if (this._contentItem.type == PackageItemType.DragonBones)
                this.setDragonBones(<dragonBones.DragonBonesAsset>this._contentItem.asset, this._contentItem.atlasAsset, this._contentItem.skeletonAnchor);
        }

        public setSpine(asset: sp.SkeletonData, anchor: cc.Vec2, pma?: boolean): void {
            this.url = null;
            this.clearContent();

            let node = new cc.Node();
            node.color = this._color;
            this._container.addChild(node);
            node.setPosition(anchor.x, -anchor.y);

            this._content = node.addComponent(sp.Skeleton);
            this._content.premultipliedAlpha = pma;
            this._content.skeletonData = asset;
            this.onChangeSpine();

            this.updateLayout();
        }

        public setDragonBones(asset: dragonBones.DragonBonesAsset, atlasAsset: dragonBones.DragonBonesAtlasAsset, anchor: cc.Vec2, pma?: boolean): void {
            this.url = null;
            this.clearContent();

            let node = new cc.Node();
            node.color = this._color;
            this._container.addChild(node);
            node.setPosition(anchor.x, -anchor.y);

            this._content = node.addComponent(dragonBones.ArmatureDisplay);
            this._content.premultipliedAlpha = pma;
            this._content.dragonAsset = asset;
            this._content.dragonAtlasAsset = atlasAsset;

            let armatureKey = asset["init"](dragonBones.CCFactory.getInstance(), atlasAsset["_uuid"]);
            let dragonBonesData = this._content["_factory"].getDragonBonesData(armatureKey);
            this._content.armatureName = dragonBonesData.armatureNames[0];

            this.onChangeDragonBones();

            this.updateLayout();
        }

        private onChange(): void {
            this.onChangeSpine();
            this.onChangeDragonBones();
        }

        private onChangeSpine(): void {
            if (!(this._content instanceof sp.Skeleton))
                return;

            if (this._animationName) {
                let trackEntry = this._content.getCurrent(0);
                if (!trackEntry || trackEntry.animation.name != this._animationName || trackEntry.isComplete() && !trackEntry.loop) {
                    this._content.defaultAnimation = this._animationName;
                    trackEntry = this._content.setAnimation(0, this._animationName, this._loop);
                }

                if (this._playing)
                    this._content.paused = false;
                else {
                    this._content.paused = true;
                    trackEntry.trackTime = ToolSet.lerp(0, trackEntry.animationEnd - trackEntry.animationStart, this._frame / 100);
                }
            }
            else
                this._content.clearTrack(0);

            let skin = this._skinName || this._content.skeletonData.getRuntimeData().skins[0].name;
            if (this._content["_skeleton"].skin != skin)
                this._content.setSkin(skin);
        }

        private onChangeDragonBones(): void {
            if (!(this._content instanceof dragonBones.ArmatureDisplay))
                return;

            if (this._animationName) {
                if (this._playing)
                    this._content.playAnimation(this._animationName, this._loop ? 0 : 1);
                else
                    this._content.armature().animation.gotoAndStopByFrame(this._animationName, this._frame);
            }
            else
                this._content.armature().animation.reset();
        }

        protected loadExternal(): void {
            if (ToolSet.startsWith(this._url, "http://")
                || ToolSet.startsWith(this._url, "https://")
                || ToolSet.startsWith(this._url, '/'))
                cc.assetManager.loadRemote(this._url, sp.SkeletonData, this.onLoaded2.bind(this));
            else
                cc.resources.load(this._url, sp.SkeletonData, this.onLoaded2.bind(this));
        }

        private onLoaded2(err, asset): void {
            //因为是异步返回的，而这时可能url已经被改变，所以不能直接用返回的结果

            if (!this._url || !cc.isValid(this._node))
                return;

            if (err)
                console.warn(err);
        }

        private updateLayout(): void {
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

                if (cw == this._width && ch == this._height) {
                    this._container.setScale(1, 1);
                    this._container.setPosition(pivotCorrectX, pivotCorrectY);

                    return;
                }
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

            this._container.setScale(sx, sy);

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
            this._contentItem = null;
            if (this._content) {
                this._content.node.destroy();
                this._content = null;
            }
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
            this._skinName = buffer.readS();
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