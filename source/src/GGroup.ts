import { GroupLayoutType } from "./FieldTypes";
import { GObject } from "./GObject";
import { ByteBuffer } from "./utils/ByteBuffer";

export class GGroup extends GObject {
    private _layout: number = 0;
    private _lineGap: number = 0;
    private _columnGap: number = 0;
    private _excludeInvisibles: boolean;
    private _autoSizeDisabled: boolean;
    private _mainGridIndex: number = -1;
    private _mainGridMinSize: number = 50;

    private _boundsChanged: boolean;
    private _percentReady: boolean;
    private _mainChildIndex: number = -1;
    private _totalSize: number = 0;
    private _numChildren: number = 0;

    public _updating: number = 0;

    constructor() {
        super();

        this._node.name = "GGroup";
        this._touchDisabled = true;
    }

    public dispose(): void {
        this._boundsChanged = false;

        super.dispose();
    }

    public get layout(): number {
        return this._layout;
    }

    public set layout(value: number) {
        if (this._layout != value) {
            this._layout = value;
            this.setBoundsChangedFlag();
        }
    }

    public get lineGap(): number {
        return this._lineGap;
    }

    public set lineGap(value: number) {
        if (this._lineGap != value) {
            this._lineGap = value;
            this.setBoundsChangedFlag(true);
        }
    }

    public get columnGap(): number {
        return this._columnGap;
    }

    public set columnGap(value: number) {
        if (this._columnGap != value) {
            this._columnGap = value;
            this.setBoundsChangedFlag(true);
        }
    }

    public get excludeInvisibles(): boolean {
        return this._excludeInvisibles;
    }

    public set excludeInvisibles(value: boolean) {
        if (this._excludeInvisibles != value) {
            this._excludeInvisibles = value;
            this.setBoundsChangedFlag();
        }
    }

    public get autoSizeDisabled(): boolean {
        return this._autoSizeDisabled;
    }

    public set autoSizeDisabled(value: boolean) {
        this._autoSizeDisabled = value;
    }

    public get mainGridMinSize(): number {
        return this._mainGridMinSize;
    }

    public set mainGridMinSize(value: number) {
        if (this._mainGridMinSize != value) {
            this._mainGridMinSize = value;
            this.setBoundsChangedFlag();
        }
    }

    public get mainGridIndex(): number {
        return this._mainGridIndex;
    }

    public set mainGridIndex(value: number) {
        if (this._mainGridIndex != value) {
            this._mainGridIndex = value;
            this.setBoundsChangedFlag();
        }
    }

    public setBoundsChangedFlag(positionChangedOnly: boolean = false): void {
        if (this._updating == 0 && this._parent) {
            if (!positionChangedOnly)
                this._percentReady = false;

            if (!this._boundsChanged) {
                this._boundsChanged = true;
                if (this._layout != GroupLayoutType.None)
                    this._partner.callLater(this._ensureBoundsCorrect);
            }
        }
    }

    private _ensureBoundsCorrect(): void {
        let _t = <GGroup>GObject.cast(this.node);
        _t.ensureBoundsCorrect();
    }

    public ensureSizeCorrect(): void {
        if (this._parent == null || !this._boundsChanged || this._layout == 0)
            return;

        this._boundsChanged = false;
        if (this._autoSizeDisabled)
            this.resizeChildren(0, 0);
        else {
            this.handleLayout();
            this.updateBounds();
        }
    }

    public ensureBoundsCorrect(): void {
        if (this._parent == null || !this._boundsChanged)
            return;

        this._boundsChanged = false;
        if (this._layout == 0)
            this.updateBounds();
        else {
            if (this._autoSizeDisabled)
                this.resizeChildren(0, 0);
            else {
                this.handleLayout();
                this.updateBounds();
            }
        }
    }

    private updateBounds(): void {
        this._partner.unschedule(this._ensureBoundsCorrect);

        var cnt: number = this._parent.numChildren;
        var i: number;
        var child: GObject;
        var ax: number = Number.POSITIVE_INFINITY, ay: number = Number.POSITIVE_INFINITY;
        var ar: number = Number.NEGATIVE_INFINITY, ab: number = Number.NEGATIVE_INFINITY;
        var tmp: number;
        var empty: boolean = true;
        for (i = 0; i < cnt; i++) {
            child = this._parent.getChildAt(i);
            if (child.group != this || this._excludeInvisibles && !child.internalVisible3)
                continue;

            tmp = child.xMin;
            if (tmp < ax)
                ax = tmp;
            tmp = child.yMin;
            if (tmp < ay)
                ay = tmp;
            tmp = child.xMin + child.width;
            if (tmp > ar)
                ar = tmp;
            tmp = child.yMin + child.height;
            if (tmp > ab)
                ab = tmp;
            empty = false;
        }

        var w: number = 0, h: number = 0;
        if (!empty) {
            this._updating |= 1;
            this.setPosition(ax, ay);
            this._updating &= 2;

            w = ar - ax;
            h = ab - ay;
        }

        if ((this._updating & 2) == 0) {
            this._updating |= 2;
            this.setSize(w, h);
            this._updating &= 1;
        }
        else {
            this._updating &= 1;
            this.resizeChildren(this._width - w, this._height - h);
        }
    }

    private handleLayout(): void {
        this._updating |= 1;

        var child: GObject;
        var i: number;
        var cnt: number;

        if (this._layout == GroupLayoutType.Horizontal) {
            var curX: number = this.x;
            cnt = this._parent.numChildren;
            for (i = 0; i < cnt; i++) {
                child = this._parent.getChildAt(i);
                if (child.group != this)
                    continue;
                if (this._excludeInvisibles && !child.internalVisible3)
                    continue;

                child.xMin = curX;
                if (child.width != 0)
                    curX += child.width + this._columnGap;
            }
        }
        else if (this._layout == GroupLayoutType.Vertical) {
            var curY: number = this.y;
            cnt = this._parent.numChildren;
            for (i = 0; i < cnt; i++) {
                child = this._parent.getChildAt(i);
                if (child.group != this)
                    continue;
                if (this._excludeInvisibles && !child.internalVisible3)
                    continue;

                child.yMin = curY;
                if (child.height != 0)
                    curY += child.height + this._lineGap;
            }
        }

        this._updating &= 2;
    }

    public moveChildren(dx: number, dy: number): void {
        if ((this._updating & 1) != 0 || this._parent == null)
            return;

        this._updating |= 1;

        var cnt: number = this._parent.numChildren;
        var i: number
        var child: GObject;
        for (i = 0; i < cnt; i++) {
            child = this._parent.getChildAt(i);
            if (child.group == this) {
                child.setPosition(child.x + dx, child.y + dy);
            }
        }

        this._updating &= 2;
    }

    public resizeChildren(dw: number, dh: number): void {
        if (this._layout == GroupLayoutType.None || (this._updating & 2) != 0 || this._parent == null)
            return;

        this._updating |= 2;

        if (this._boundsChanged) {
            this._boundsChanged = false;
            if (!this._autoSizeDisabled) {
                this.updateBounds();
                return;
            }
        }

        var cnt: number = this._parent.numChildren;
        var i: number;
        var child: GObject;

        if (!this._percentReady) {
            this._percentReady = true;
            this._numChildren = 0;
            this._totalSize = 0;
            this._mainChildIndex = -1;

            var j: number = 0;
            for (i = 0; i < cnt; i++) {
                child = this._parent.getChildAt(i);
                if (child.group != this)
                    continue;

                if (!this._excludeInvisibles || child.internalVisible3) {
                    if (j == this._mainGridIndex)
                        this._mainChildIndex = i;

                    this._numChildren++;

                    if (this._layout == 1)
                        this._totalSize += child.width;
                    else
                        this._totalSize += child.height;
                }

                j++;
            }

            if (this._mainChildIndex != -1) {
                if (this._layout == 1) {
                    child = this._parent.getChildAt(this._mainChildIndex);
                    this._totalSize += this._mainGridMinSize - child.width;
                    child._sizePercentInGroup = this._mainGridMinSize / this._totalSize;
                }
                else {
                    child = this._parent.getChildAt(this._mainChildIndex);
                    this._totalSize += this._mainGridMinSize - child.height;
                    child._sizePercentInGroup = this._mainGridMinSize / this._totalSize;
                }
            }

            for (i = 0; i < cnt; i++) {
                child = this._parent.getChildAt(i);
                if (child.group != this)
                    continue;

                if (i == this._mainChildIndex)
                    continue;

                if (this._totalSize > 0)
                    child._sizePercentInGroup = (this._layout == 1 ? child.width : child.height) / this._totalSize;
                else
                    child._sizePercentInGroup = 0;
            }
        }

        var remainSize: number = 0;
        var remainPercent: number = 1;
        var priorHandled: boolean = false;

        if (this._layout == 1) {
            remainSize = this.width - (this._numChildren - 1) * this._columnGap;
            if (this._mainChildIndex != -1 && remainSize >= this._totalSize) {
                child = this._parent.getChildAt(this._mainChildIndex);
                child.setSize(remainSize - (this._totalSize - this._mainGridMinSize), child._rawHeight + dh, true);
                remainSize -= child.width;
                remainPercent -= child._sizePercentInGroup;
                priorHandled = true;
            }

            var curX: number = this.x;
            for (i = 0; i < cnt; i++) {
                child = this._parent.getChildAt(i);
                if (child.group != this)
                    continue;

                if (this._excludeInvisibles && !child.internalVisible3) {
                    child.setSize(child._rawWidth, child._rawHeight + dh, true);
                    continue;
                }

                if (!priorHandled || i != this._mainChildIndex) {
                    child.setSize(Math.round(child._sizePercentInGroup / remainPercent * remainSize), child._rawHeight + dh, true);
                    remainPercent -= child._sizePercentInGroup;
                    remainSize -= child.width;
                }

                child.xMin = curX;
                if (child.width != 0)
                    curX += child.width + this._columnGap;
            }
        }
        else {
            remainSize = this.height - (this._numChildren - 1) * this._lineGap;
            if (this._mainChildIndex != -1 && remainSize >= this._totalSize) {
                child = this._parent.getChildAt(this._mainChildIndex);
                child.setSize(child._rawWidth + dw, remainSize - (this._totalSize - this._mainGridMinSize), true);
                remainSize -= child.height;
                remainPercent -= child._sizePercentInGroup;
                priorHandled = true;
            }

            var curY: number = this.y;
            for (i = 0; i < cnt; i++) {
                child = this._parent.getChildAt(i);
                if (child.group != this)
                    continue;

                if (this._excludeInvisibles && !child.internalVisible3) {
                    child.setSize(child._rawWidth + dw, child._rawHeight, true);
                    continue;
                }

                if (!priorHandled || i != this._mainChildIndex) {
                    child.setSize(child._rawWidth + dw, Math.round(child._sizePercentInGroup / remainPercent * remainSize), true);
                    remainPercent -= child._sizePercentInGroup;
                    remainSize -= child.height;
                }

                child.yMin = curY;
                if (child.height != 0)
                    curY += child.height + this._lineGap;
            }
        }

        this._updating &= 1;
    }

    public handleAlphaChanged(): void {
        if (this._underConstruct)
            return;

        var cnt: number = this._parent.numChildren;
        for (var i: number = 0; i < cnt; i++) {
            var child: GObject = this._parent.getChildAt(i);
            if (child.group == this)
                child.alpha = this.alpha;
        }
    }

    public handleVisibleChanged(): void {
        if (!this._parent)
            return;

        var cnt: number = this._parent.numChildren;
        for (var i: number = 0; i < cnt; i++) {
            var child: GObject = this._parent.getChildAt(i);
            if (child.group == this)
                child.handleVisibleChanged();
        }
    }

    public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
        super.setup_beforeAdd(buffer, beginPos);

        buffer.seek(beginPos, 5);

        this._layout = buffer.readByte();
        this._lineGap = buffer.readInt();
        this._columnGap = buffer.readInt();
        if (buffer.version >= 2) {
            this._excludeInvisibles = buffer.readBool();
            this._autoSizeDisabled = buffer.readBool();
            this._mainGridIndex = buffer.readShort();
        }
    }

    public setup_afterAdd(buffer: ByteBuffer, beginPos: number): void {
        super.setup_afterAdd(buffer, beginPos);

        if (!this.visible)
            this.handleVisibleChanged();
    }
}