import { sp, dragonBones, assetManager, Color, isValid, resources, Node, UITransform, math } from "cc";
import { AlignType, LoaderFillType, ObjectPropID, PackageItemType, VertAlignType } from "./FieldTypes";
import { GObject } from "./GObject";
import { UIPackage } from "./UIPackage";
export class GLoader3D extends GObject {
    constructor() {
        super();
        this._frame = 0;
        this._node.name = "GLoader3D";
        this._playing = true;
        this._url = "";
        this._fill = LoaderFillType.None;
        this._align = AlignType.Left;
        this._verticalAlign = VertAlignType.Top;
        this._color = new Color(255, 255, 255, 255);
        this._container = new Node("Wrapper");
        this._container.addComponent(UITransform).setAnchorPoint(0, 1);
        this._node.addChild(this._container);
    }
    dispose() {
        super.dispose();
    }
    get url() {
        return this._url;
    }
    set url(value) {
        if (this._url == value)
            return;
        this._url = value;
        this.loadContent();
        this.updateGear(7);
    }
    get icon() {
        return this._url;
    }
    set icon(value) {
        this.url = value;
    }
    get align() {
        return this._align;
    }
    set align(value) {
        if (this._align != value) {
            this._align = value;
            this.updateLayout();
        }
    }
    get verticalAlign() {
        return this._verticalAlign;
    }
    set verticalAlign(value) {
        if (this._verticalAlign != value) {
            this._verticalAlign = value;
            this.updateLayout();
        }
    }
    get fill() {
        return this._fill;
    }
    set fill(value) {
        if (this._fill != value) {
            this._fill = value;
            this.updateLayout();
        }
    }
    get shrinkOnly() {
        return this._shrinkOnly;
    }
    set shrinkOnly(value) {
        if (this._shrinkOnly != value) {
            this._shrinkOnly = value;
            this.updateLayout();
        }
    }
    get autoSize() {
        return this._autoSize;
    }
    set autoSize(value) {
        if (this._autoSize != value) {
            this._autoSize = value;
            this.updateLayout();
        }
    }
    get playing() {
        return this._playing;
    }
    set playing(value) {
        if (this._playing != value) {
            this._playing = value;
            this.updateGear(5);
            this.onChange();
        }
    }
    get frame() {
        return this._frame;
    }
    set frame(value) {
        if (this._frame != value) {
            this._frame = value;
            this.updateGear(5);
            this.onChange();
        }
    }
    get animationName() {
        return this._animationName;
    }
    set animationName(value) {
        if (this._animationName != value) {
            this._animationName = value;
            this.onChange();
        }
    }
    get skinName() {
        return this._skinName;
    }
    set skinName(value) {
        if (this._skinName != value) {
            this._skinName = value;
            this.onChange();
        }
    }
    get loop() {
        return this._loop;
    }
    set loop(value) {
        if (this._loop != value) {
            this._loop = value;
            this.onChange();
        }
    }
    get color() {
        return this._color;
    }
    set color(value) {
        this._color.set(value);
        this.updateGear(4);
        if (this._content)
            this._content.color = value;
    }
    get content() {
        return this._content;
    }
    loadContent() {
        this.clearContent();
        if (!this._url)
            return;
        if (this._url.startsWith("ui://"))
            this.loadFromPackage(this._url);
        else
            this.loadExternal();
    }
    loadFromPackage(itemURL) {
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
    onLoaded(err, item) {
        if (this._contentItem != item)
            return;
        if (err)
            console.warn(err);
        if (!this._contentItem.asset)
            return;
        if (this._contentItem.type == PackageItemType.Spine)
            this.setSpine(this._contentItem.asset, this._contentItem.skeletonAnchor);
        else if (this._contentItem.type == PackageItemType.DragonBones)
            this.setDragonBones(this._contentItem.asset, this._contentItem.atlasAsset, this._contentItem.skeletonAnchor);
    }
    setSpine(asset, anchor, pma) {
        this.url = null;
        this.clearContent();
        let node = new Node();
        this._container.addChild(node);
        node.setPosition(anchor.x, -anchor.y);
        this._content = node.addComponent(sp.Skeleton);
        this._content.premultipliedAlpha = pma;
        this._content.skeletonData = asset;
        this._content.color = this._color;
        this.onChangeSpine();
        this.updateLayout();
    }
    setDragonBones(asset, atlasAsset, anchor, pma) {
        this.url = null;
        this.clearContent();
        let node = new Node();
        this._container.addChild(node);
        node.setPosition(anchor.x, -anchor.y);
        this._content = node.addComponent(dragonBones.ArmatureDisplay);
        this._content.premultipliedAlpha = pma;
        this._content.dragonAsset = asset;
        this._content.dragonAtlasAsset = atlasAsset;
        this._content.color = this._color;
        let armatureKey = asset["init"](dragonBones.CCFactory.getInstance(), atlasAsset["_uuid"]);
        let dragonBonesData = this._content["_factory"].getDragonBonesData(armatureKey);
        this._content.armatureName = dragonBonesData.armatureNames[0];
        this.onChangeDragonBones();
        this.updateLayout();
    }
    onChange() {
        this.onChangeSpine();
        this.onChangeDragonBones();
    }
    onChangeSpine() {
        if (!(this._content instanceof sp.Skeleton))
            return;
        if (this._animationName) {
            let trackEntry = this._content.getCurrent(0);
            if (!trackEntry || trackEntry.animation.name != this._animationName || trackEntry.isComplete() && !trackEntry.loop) {
                this._content.animation = this._animationName;
                trackEntry = this._content.setAnimation(0, this._animationName, this._loop);
            }
            if (this._playing)
                this._content.paused = false;
            else {
                this._content.paused = true;
                trackEntry.trackTime = math.lerp(0, trackEntry.animationEnd - trackEntry.animationStart, this._frame / 100);
            }
        }
        else
            this._content.clearTrack(0);
        let skin = this._skinName || this._content.skeletonData.getRuntimeData().skins[0].name;
        if (this._content["_skeleton"].skin != skin)
            this._content.setSkin(skin);
    }
    onChangeDragonBones() {
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
    loadExternal() {
        if (this._url.startsWith("http://")
            || this._url.startsWith("https://")
            || this._url.startsWith('/'))
            assetManager.loadRemote(this._url, sp.SkeletonData, this.onLoaded2.bind(this));
        else
            resources.load(this._url, sp.SkeletonData, this.onLoaded2.bind(this));
    }
    onLoaded2(err, asset) {
        //因为是异步返回的，而这时可能url已经被改变，所以不能直接用返回的结果
        if (!this._url || !isValid(this._node))
            return;
        if (err)
            console.warn(err);
    }
    updateLayout() {
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
        var sx = 1, sy = 1;
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
        var nx, ny;
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
    clearContent() {
        this._contentItem = null;
        if (this._content) {
            this._content.node.destroy();
            this._content = null;
        }
    }
    handleSizeChanged() {
        super.handleSizeChanged();
        if (!this._updatingLayout)
            this.updateLayout();
    }
    handleAnchorChanged() {
        super.handleAnchorChanged();
        if (!this._updatingLayout)
            this.updateLayout();
    }
    handleGrayedChanged() {
    }
    getProp(index) {
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
    setProp(index, value) {
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
    setup_beforeAdd(buffer, beginPos) {
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
