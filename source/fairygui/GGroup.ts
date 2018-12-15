namespace fgui {

    export class GGroup extends GObject {
        private _layout: number = 0;
        private _lineGap: number = 0;
        private _columnGap: number = 0;
        private _percentReady: boolean = false;
        private _boundsChanged: boolean = false;

        public _updating: number = 0;

        public constructor() {
            super();

            this._node.name = "GGroup";
            this._touchDisabled = true;
        }

        public get layout(): number {
            return this._layout;
        }

        public set layout(value: number) {
            if (this._layout != value) {
                this._layout = value;
                this.setBoundsChangedFlag(true);
            }
        }

        public get lineGap(): number {
            return this._lineGap;
        }

        public set lineGap(value: number) {
            if (this._lineGap != value) {
                this._lineGap = value;
                this.setBoundsChangedFlag();
            }
        }

        public get columnGap(): number {
            return this._columnGap;
        }

        public set columnGap(value: number) {
            if (this._columnGap != value) {
                this._columnGap = value;
                this.setBoundsChangedFlag();
            }
        }

        public setBoundsChangedFlag(childSizeChanged?: boolean): void {
            if (this._updating == 0 && this._parent != null) {
                if (childSizeChanged)
                    this._percentReady = false;

                if (!this._boundsChanged) {
                    this._boundsChanged = true;
                    if (this._layout != GroupLayoutType.None)
                        this._partner.callLater(this._ensureBoundsCorrect);
                }
            }
        }

        private _ensureBoundsCorrect(): void {
            let _t = <GGroup>(this.node["$gobj"]);
            _t.ensureBoundsCorrect();
        }

        public ensureBoundsCorrect(): void {
            if (this._boundsChanged)
                this.updateBounds();
        }

        private updateBounds(): void {
            this._boundsChanged = false;

            if (this._parent == null)
                return;

            this.handleLayout();

            var cnt: number = this._parent.numChildren;
            var i: number;
            var child: GObject;
            var ax: number = Number.POSITIVE_INFINITY, ay: number = Number.POSITIVE_INFINITY;
            var ar: number = Number.NEGATIVE_INFINITY, ab: number = Number.NEGATIVE_INFINITY;
            var tmp: number;
            var empty: boolean = true;
            for (i = 0; i < cnt; i++) {
                child = this._parent.getChildAt(i);
                if (child.group == this) {
                    tmp = child.x;
                    if (tmp < ax)
                        ax = tmp;
                    tmp = child.y;
                    if (tmp < ay)
                        ay = tmp;
                    tmp = child.x + child.width;
                    if (tmp > ar)
                        ar = tmp;
                    tmp = child.y + child.height;
                    if (tmp > ab)
                        ab = tmp;
                    empty = false;
                }
            }

            if (!empty) {
                this._updating = 1;
                this.setPosition(ax, ay);
                this._updating = 2;
                this.setSize(ar - ax, ab - ay);
            }
            else {
                this._updating = 2;
                this.setSize(0, 0);
            }

            this._updating = 0;
        }

        private handleLayout(): void {
            this._updating |= 1;

            var child: GObject;
            var i: number;
            var cnt: number;

            if (this._layout == GroupLayoutType.Horizontal) {
                var curX: number = NaN;
                cnt = this._parent.numChildren;
                for (i = 0; i < cnt; i++) {
                    child = this._parent.getChildAt(i);
                    if (child.group != this)
                        continue;

                    if (isNaN(curX))
                        curX = Math.floor(child.x);
                    else
                        child.x = curX;
                    if (child.width != 0)
                        curX += Math.floor(child.width + this._columnGap);
                }
                if (!this._percentReady)
                    this.updatePercent();
            }
            else if (this._layout == GroupLayoutType.Vertical) {
                var curY: number = NaN;
                cnt = this._parent.numChildren;
                for (i = 0; i < cnt; i++) {
                    child = this._parent.getChildAt(i);
                    if (child.group != this)
                        continue;

                    if (isNaN(curY))
                        curY = Math.floor(child.y);
                    else
                        child.y = curY;
                    if (child.height != 0)
                        curY += Math.floor(child.height + this._lineGap);
                }
                if (!this._percentReady)
                    this.updatePercent();
            }

            this._updating &= 2;
        }

        private updatePercent(): void {
            this._percentReady = true;

            var cnt: number = this._parent.numChildren;
            var i: number;
            var child: GObject;
            var size: number = 0;
            if (this._layout == GroupLayoutType.Horizontal) {
                for (i = 0; i < cnt; i++) {
                    child = this._parent.getChildAt(i);
                    if (child.group != this)
                        continue;

                    size += child.width;
                }

                for (i = 0; i < cnt; i++) {
                    child = this._parent.getChildAt(i);
                    if (child.group != this)
                        continue;

                    if (size > 0)
                        child._sizePercentInGroup = child.width / size;
                    else
                        child._sizePercentInGroup = 0;
                }
            }
            else {
                for (i = 0; i < cnt; i++) {
                    child = this._parent.getChildAt(i);
                    if (child.group != this)
                        continue;

                    size += child.height;
                }

                for (i = 0; i < cnt; i++) {
                    child = this._parent.getChildAt(i);
                    if (child.group != this)
                        continue;

                    if (size > 0)
                        child._sizePercentInGroup = child.height / size;
                    else
                        child._sizePercentInGroup = 0;
                }
            }
        }

        public moveChildren(dx: number, dy: number): void {
            if ((this._updating & 1) != 0 || !this._parent)
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
            if (this._layout == GroupLayoutType.None || (this._updating & 2) != 0 || !this._parent)
                return;

            this._updating |= 2;

            if (!this._percentReady)
                this.updatePercent();

            var cnt: number = this._parent.numChildren;
            var i: number;
            var j: number;
            var child: GObject;
            var last: number = -1;
            var numChildren: number = 0;
            var lineSize: number = 0;
            var remainSize: number = 0;
            var found: boolean = false;

            for (i = 0; i < cnt; i++) {
                child = this._parent.getChildAt(i);
                if (child.group != this)
                    continue;

                last = i;
                numChildren++;
            }

            if (this._layout == GroupLayoutType.Horizontal) {
                remainSize = lineSize = this._width - (numChildren - 1) * this._columnGap;
                var curX: number = NaN;
                var nw: number;
                for (i = 0; i < cnt; i++) {
                    child = this._parent.getChildAt(i);
                    if (child.group != this)
                        continue;

                    if (isNaN(curX))
                        curX = Math.floor(child.x);
                    else
                        child.x = curX;
                    if (last == i)
                        nw = remainSize;
                    else
                        nw = Math.round(child._sizePercentInGroup * lineSize);
                    child.setSize(nw, child._rawHeight + dh, true);
                    remainSize -= child.width;
                    if (last == i) {
                        if (remainSize >= 1) //可能由于有些元件有宽度限制，导致无法铺满
                        {
                            for (j = 0; j <= i; j++) {
                                child = this._parent.getChildAt(j);
                                if (child.group != this)
                                    continue;

                                if (!found) {
                                    nw = child.width + remainSize;
                                    if ((child.maxWidth == 0 || nw < child.maxWidth)
                                        && (child.minWidth == 0 || nw > child.minWidth)) {
                                        child.setSize(nw, child.height, true);
                                        found = true;
                                    }
                                }
                                else
                                    child.x += remainSize;
                            }
                        }
                    }
                    else
                        curX += (child.width + this._columnGap);
                }
            }
            else if (this._layout == GroupLayoutType.Vertical) {
                remainSize = lineSize = this.height - (numChildren - 1) * this._lineGap;
                var curY: number = NaN;
                var nh: number;
                for (i = 0; i < cnt; i++) {
                    child = this._parent.getChildAt(i);
                    if (child.group != this)
                        continue;

                    if (isNaN(curY))
                        curY = Math.floor(child.y);
                    else
                        child.y = curY;
                    if (last == i)
                        nh = remainSize;
                    else
                        nh = Math.round(child._sizePercentInGroup * lineSize);
                    child.setSize(child._rawWidth + dw, nh, true);
                    remainSize -= child.height;
                    if (last == i) {
                        if (remainSize >= 1) //可能由于有些元件有宽度限制，导致无法铺满
                        {
                            for (j = 0; j <= i; j++) {
                                child = this._parent.getChildAt(j);
                                if (child.group != this)
                                    continue;

                                if (!found) {
                                    nh = child.height + remainSize;
                                    if ((child.maxHeight == 0 || nh < child.maxHeight)
                                        && (child.minHeight == 0 || nh > child.minHeight)) {
                                        child.setSize(child.width, nh, true);
                                        found = true;
                                    }
                                }
                                else
                                    child.y += remainSize;
                            }
                        }
                    }
                    else
                        curY += (child.height + this._lineGap);
                }
            }

            this._updating &= 1;
        }

        public setChildrenAlpha(): void {
            if (this._underConstruct || !this._parent)
                return;

            var cnt: number = this._parent.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                var child: GObject = this._parent.getChildAt(i);
                if (child.group == this)
                    child.alpha = this._alpha;
            }
        }

        public setChildrenVisible(): void {
            if (!this._parent)
                return;

            var cnt: number = this._parent.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                var child: GObject = this._parent.getChildAt(i);
                if (child.group == this)
                    child.node.active = child._finalVisible;
            }
        }

        public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
            super.setup_beforeAdd(buffer, beginPos);

            buffer.seek(beginPos, 5);

            this._layout = buffer.readByte();
            this._lineGap = buffer.readInt();
            this._columnGap = buffer.readInt();
        }

        public setup_afterAdd(buffer: ByteBuffer, beginPos: number): void {
            super.setup_afterAdd(buffer, beginPos);

            if (!this._visible)
                this.setChildrenVisible();
        }
    }
}