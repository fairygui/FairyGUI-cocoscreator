import { GroupLayoutType } from "./FieldTypes";
import { GObject } from "./GObject";
export class GGroup extends GObject {
    constructor() {
        super();
        this._layout = 0;
        this._lineGap = 0;
        this._columnGap = 0;
        this._mainGridIndex = -1;
        this._mainGridMinSize = 50;
        this._mainChildIndex = -1;
        this._totalSize = 0;
        this._numChildren = 0;
        this._updating = 0;
        this._node.name = "GGroup";
        this._touchDisabled = true;
    }
    dispose() {
        this._boundsChanged = false;
        super.dispose();
    }
    get layout() {
        return this._layout;
    }
    set layout(value) {
        if (this._layout != value) {
            this._layout = value;
            this.setBoundsChangedFlag();
        }
    }
    get lineGap() {
        return this._lineGap;
    }
    set lineGap(value) {
        if (this._lineGap != value) {
            this._lineGap = value;
            this.setBoundsChangedFlag(true);
        }
    }
    get columnGap() {
        return this._columnGap;
    }
    set columnGap(value) {
        if (this._columnGap != value) {
            this._columnGap = value;
            this.setBoundsChangedFlag(true);
        }
    }
    get excludeInvisibles() {
        return this._excludeInvisibles;
    }
    set excludeInvisibles(value) {
        if (this._excludeInvisibles != value) {
            this._excludeInvisibles = value;
            this.setBoundsChangedFlag();
        }
    }
    get autoSizeDisabled() {
        return this._autoSizeDisabled;
    }
    set autoSizeDisabled(value) {
        this._autoSizeDisabled = value;
    }
    get mainGridMinSize() {
        return this._mainGridMinSize;
    }
    set mainGridMinSize(value) {
        if (this._mainGridMinSize != value) {
            this._mainGridMinSize = value;
            this.setBoundsChangedFlag();
        }
    }
    get mainGridIndex() {
        return this._mainGridIndex;
    }
    set mainGridIndex(value) {
        if (this._mainGridIndex != value) {
            this._mainGridIndex = value;
            this.setBoundsChangedFlag();
        }
    }
    setBoundsChangedFlag(positionChangedOnly = false) {
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
    _ensureBoundsCorrect() {
        let _t = GObject.cast(this.node);
        _t.ensureBoundsCorrect();
    }
    ensureSizeCorrect() {
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
    ensureBoundsCorrect() {
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
    updateBounds() {
        this._partner.unschedule(this._ensureBoundsCorrect);
        var cnt = this._parent.numChildren;
        var i;
        var child;
        var ax = Number.POSITIVE_INFINITY, ay = Number.POSITIVE_INFINITY;
        var ar = Number.NEGATIVE_INFINITY, ab = Number.NEGATIVE_INFINITY;
        var tmp;
        var empty = true;
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
        var w = 0, h = 0;
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
    handleLayout() {
        this._updating |= 1;
        var child;
        var i;
        var cnt;
        if (this._layout == GroupLayoutType.Horizontal) {
            var curX = this.x;
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
            var curY = this.y;
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
    moveChildren(dx, dy) {
        if ((this._updating & 1) != 0 || this._parent == null)
            return;
        this._updating |= 1;
        var cnt = this._parent.numChildren;
        var i;
        var child;
        for (i = 0; i < cnt; i++) {
            child = this._parent.getChildAt(i);
            if (child.group == this) {
                child.setPosition(child.x + dx, child.y + dy);
            }
        }
        this._updating &= 2;
    }
    resizeChildren(dw, dh) {
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
        var cnt = this._parent.numChildren;
        var i;
        var child;
        if (!this._percentReady) {
            this._percentReady = true;
            this._numChildren = 0;
            this._totalSize = 0;
            this._mainChildIndex = -1;
            var j = 0;
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
        var remainSize = 0;
        var remainPercent = 1;
        var priorHandled = false;
        if (this._layout == 1) {
            remainSize = this.width - (this._numChildren - 1) * this._columnGap;
            if (this._mainChildIndex != -1 && remainSize >= this._totalSize) {
                child = this._parent.getChildAt(this._mainChildIndex);
                child.setSize(remainSize - (this._totalSize - this._mainGridMinSize), child._rawHeight + dh, true);
                remainSize -= child.width;
                remainPercent -= child._sizePercentInGroup;
                priorHandled = true;
            }
            var curX = this.x;
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
            var curY = this.y;
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
    handleAlphaChanged() {
        if (this._underConstruct)
            return;
        var cnt = this._parent.numChildren;
        for (var i = 0; i < cnt; i++) {
            var child = this._parent.getChildAt(i);
            if (child.group == this)
                child.alpha = this.alpha;
        }
    }
    handleVisibleChanged() {
        if (!this._parent)
            return;
        var cnt = this._parent.numChildren;
        for (var i = 0; i < cnt; i++) {
            var child = this._parent.getChildAt(i);
            if (child.group == this)
                child.handleVisibleChanged();
        }
    }
    setup_beforeAdd(buffer, beginPos) {
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
    setup_afterAdd(buffer, beginPos) {
        super.setup_afterAdd(buffer, beginPos);
        if (!this.visible)
            this.handleVisibleChanged();
    }
}
