import { Size, Vec2, Rect, Node, Constructor } from "cc";
import { Controller } from "./Controller";
import { Event as FUIEvent } from "./event/Event";
import { ListLayoutType, ListSelectionMode, AlignType, VertAlignType, ChildrenRenderOrder, OverflowType } from "./FieldTypes";
import { GButton } from "./GButton";
import { GComponent } from "./GComponent";
import { GObject } from "./GObject";
import { GObjectPool } from "./GObjectPool";
import { UIPackage } from "./UIPackage";
import { ByteBuffer } from "./utils/ByteBuffer";

export type ListItemRenderer = (index: number, item: GObject) => void;

export class GList extends GComponent {
    public itemRenderer: ListItemRenderer;
    public itemProvider: (index: number) => string;

    public scrollItemToViewOnClick: boolean = true;
    public foldInvisibleItems: boolean = false;

    private _layout: ListLayoutType;
    private _lineCount: number = 0;
    private _columnCount: number = 0;
    private _lineGap: number = 0;
    private _columnGap: number = 0;
    private _defaultItem: string;
    private _autoResizeItem: boolean;
    private _selectionMode: ListSelectionMode;
    private _align: AlignType;
    private _verticalAlign: VertAlignType;
    private _selectionController?: Controller;

    private _lastSelectedIndex: number = 0;
    private _pool: GObjectPool;

    //Virtual List support
    private _virtual?: boolean;
    private _loop?: boolean;
    private _numItems: number = 0;
    private _realNumItems: number = 0;
    private _firstIndex: number = 0; //the top left index
    private _curLineItemCount: number = 0; //item count in one line
    private _curLineItemCount2: number = 0; //只用在页面模式，表示垂直方向的项目数
    private _itemSize?: Size;
    private _virtualListChanged: number = 0; //1-content changed, 2-size changed
    private _virtualItems?: Array<ItemInfo>;
    private _eventLocked?: boolean;
    private itemInfoVer: number = 0; //用来标志item是否在本次处理中已经被重用了

    public constructor() {
        super();

        this._node.name = "GList";
        this._trackBounds = true;
        this._pool = new GObjectPool();
        this._layout = ListLayoutType.SingleColumn;
        this._autoResizeItem = true;
        this._lastSelectedIndex = -1;
        this._selectionMode = ListSelectionMode.Single;
        this.opaque = true;
        this._align = AlignType.Left;
        this._verticalAlign = VertAlignType.Top;
    }

    public dispose(): void {
        this._partner.unschedule(this._refreshVirtualList);
        this._pool.clear();
        super.dispose();
    }

    public get layout(): ListLayoutType {
        return this._layout;
    }

    public set layout(value: ListLayoutType) {
        if (this._layout != value) {
            this._layout = value;
            this.setBoundsChangedFlag();
            if (this._virtual)
                this.setVirtualListChangedFlag(true);
        }
    }

    public get lineCount(): number {
        return this._lineCount;
    }

    public set lineCount(value: number) {
        if (this._lineCount != value) {
            this._lineCount = value;
            this.setBoundsChangedFlag();
            if (this._virtual)
                this.setVirtualListChangedFlag(true);
        }
    }

    public get columnCount(): number {
        return this._columnCount;
    }

    public set columnCount(value: number) {
        if (this._columnCount != value) {
            this._columnCount = value;
            this.setBoundsChangedFlag();
            if (this._virtual)
                this.setVirtualListChangedFlag(true);
        }
    }

    public get lineGap(): number {
        return this._lineGap;
    }

    public set lineGap(value: number) {
        if (this._lineGap != value) {
            this._lineGap = value;
            this.setBoundsChangedFlag();
            if (this._virtual)
                this.setVirtualListChangedFlag(true);
        }
    }

    public get columnGap(): number {
        return this._columnGap;
    }

    public set columnGap(value: number) {
        if (this._columnGap != value) {
            this._columnGap = value;
            this.setBoundsChangedFlag();
            if (this._virtual)
                this.setVirtualListChangedFlag(true);
        }
    }

    public get align(): AlignType {
        return this._align;
    }

    public set align(value: AlignType) {
        if (this._align != value) {
            this._align = value;
            this.setBoundsChangedFlag();
            if (this._virtual)
                this.setVirtualListChangedFlag(true);
        }
    }

    public get verticalAlign(): VertAlignType {
        return this._verticalAlign;
    }

    public set verticalAlign(value: VertAlignType) {
        if (this._verticalAlign != value) {
            this._verticalAlign = value;
            this.setBoundsChangedFlag();
            if (this._virtual)
                this.setVirtualListChangedFlag(true);
        }
    }

    public get virtualItemSize(): Size {
        return this._itemSize;
    }

    public set virtualItemSize(value: Size) {
        if (this._virtual) {
            if (this._itemSize == null)
                this._itemSize = new Size(0, 0);
            this._itemSize.width = value.width;
            this._itemSize.height = value.height;
            this.setVirtualListChangedFlag(true);
        }
    }

    public get defaultItem(): string | null {
        return this._defaultItem;
    }

    public set defaultItem(val: string | null) {
        this._defaultItem = UIPackage.normalizeURL(val);
    }

    public get autoResizeItem(): boolean {
        return this._autoResizeItem;
    }

    public set autoResizeItem(value: boolean) {
        if (this._autoResizeItem != value) {
            this._autoResizeItem = value;
            this.setBoundsChangedFlag();
            if (this._virtual)
                this.setVirtualListChangedFlag(true);
        }
    }

    public get selectionMode(): ListSelectionMode {
        return this._selectionMode;
    }

    public set selectionMode(value: ListSelectionMode) {
        this._selectionMode = value;
    }

    public get selectionController(): Controller {
        return this._selectionController;
    }

    public set selectionController(value: Controller) {
        this._selectionController = value;
    }

    public get itemPool(): GObjectPool {
        return this._pool;
    }

    public getFromPool(url?: string): GObject {
        if (!url)
            url = this._defaultItem;

        var obj: GObject = this._pool.getObject(url);
        if (obj)
            obj.visible = true;
        return obj;
    }

    public returnToPool(obj: GObject): void {
        this._pool.returnObject(obj);
    }

    public addChildAt(child: GObject, index: number): GObject {
        super.addChildAt(child, index);

        if (child instanceof GButton) {
            child.selected = false;
            child.changeStateOnClick = false;
        }
        child.on(FUIEvent.CLICK, this.onClickItem, this);

        return child;
    }

    public addItem(url?: string): GObject {
        if (!url)
            url = this._defaultItem;

        return this.addChild(UIPackage.createObjectFromURL(url));
    }

    public addItemFromPool(url?: string): GObject {
        return this.addChild(this.getFromPool(url));
    }

    public removeChildAt(index: number, dispose?: boolean): GObject {
        var child: GObject = super.removeChildAt(index, dispose);
        if (!dispose)
            child.off(FUIEvent.CLICK, this.onClickItem, this);

        return child;
    }

    public removeChildToPoolAt(index: number): void {
        var child: GObject = super.removeChildAt(index);
        this.returnToPool(child);
    }

    public removeChildToPool(child: GObject): void {
        super.removeChild(child);
        this.returnToPool(child);
    }

    public removeChildrenToPool(beginIndex?: number, endIndex?: number): void {
        if (beginIndex == undefined) beginIndex = 0;
        if (endIndex == undefined) endIndex = -1;
        if (endIndex < 0 || endIndex >= this._children.length)
            endIndex = this._children.length - 1;

        for (var i: number = beginIndex; i <= endIndex; ++i)
            this.removeChildToPoolAt(beginIndex);
    }

    public get selectedIndex(): number {
        var i: number;
        if (this._virtual) {
            for (i = 0; i < this._realNumItems; i++) {
                var ii: ItemInfo = this._virtualItems[i];
                if ((ii.obj instanceof GButton) && ii.obj.selected || !ii.obj && ii.selected) {
                    if (this._loop)
                        return i % this._numItems;
                    else
                        return i;
                }
            }
        }
        else {
            var cnt: number = this._children.length;
            for (i = 0; i < cnt; i++) {
                var obj: GObject = this._children[i];
                if ((obj instanceof GButton) && obj.selected)
                    return i;
            }
        }

        return -1;
    }

    public set selectedIndex(value: number) {
        if (value >= 0 && value < this.numItems) {
            if (this._selectionMode != ListSelectionMode.Single)
                this.clearSelection();
            this.addSelection(value);
        }
        else
            this.clearSelection();
    }

    public getSelection(result?: number[]): number[] {
        if (!result)
            result = new Array<number>();
        var i: number;
        if (this._virtual) {
            for (i = 0; i < this._realNumItems; i++) {
                var ii: ItemInfo = this._virtualItems[i];
                if ((ii.obj instanceof GButton) && ii.obj.selected || !ii.obj && ii.selected) {
                    var j: number = i;
                    if (this._loop) {
                        j = i % this._numItems;
                        if (result.indexOf(j) != -1)
                            continue;
                    }
                    result.push(j);
                }
            }
        }
        else {
            var cnt: number = this._children.length;
            for (i = 0; i < cnt; i++) {
                var obj: GObject = this._children[i];
                if ((obj instanceof GButton) && obj.selected)
                    result.push(i);
            }
        }
        return result;
    }

    public addSelection(index: number, scrollItToView?: boolean): void {
        if (this._selectionMode == ListSelectionMode.None)
            return;

        this.checkVirtualList();

        if (this._selectionMode == ListSelectionMode.Single)
            this.clearSelection();

        if (scrollItToView)
            this.scrollToView(index);

        this._lastSelectedIndex = index;
        var obj: GObject;
        if (this._virtual) {
            var ii: ItemInfo = this._virtualItems[index];
            if (ii.obj)
                obj = ii.obj;
            ii.selected = true;
        }
        else
            obj = this.getChildAt(index);

        if ((obj instanceof GButton) && !obj.selected) {
            obj.selected = true;
            this.updateSelectionController(index);
        }
    }

    public removeSelection(index: number): void {
        if (this._selectionMode == ListSelectionMode.None)
            return;

        var obj: GObject;
        if (this._virtual) {
            var ii: ItemInfo = this._virtualItems[index];
            if (ii.obj)
                obj = ii.obj;
            ii.selected = false;
        }
        else
            obj = this.getChildAt(index);

        if (obj instanceof GButton)
            obj.selected = false;
    }

    public clearSelection(): void {
        var i: number;
        if (this._virtual) {
            for (i = 0; i < this._realNumItems; i++) {
                var ii: ItemInfo = this._virtualItems[i];
                if (ii.obj instanceof GButton)
                    ii.obj.selected = false;
                ii.selected = false;
            }
        }
        else {
            var cnt: number = this._children.length;
            for (i = 0; i < cnt; i++) {
                var obj = this._children[i];
                if (obj instanceof GButton)
                    obj.selected = false;
            }
        }
    }

    private clearSelectionExcept(g: GObject): void {
        var i: number;
        if (this._virtual) {
            for (i = 0; i < this._realNumItems; i++) {
                var ii: ItemInfo = this._virtualItems[i];
                if (ii.obj != g) {
                    if (ii.obj instanceof GButton)
                        ii.obj.selected = false;
                    ii.selected = false;
                }
            }
        }
        else {
            var cnt: number = this._children.length;
            for (i = 0; i < cnt; i++) {
                var obj: GObject = this._children[i];
                if ((obj instanceof GButton) && obj != g)
                    obj.selected = false;
            }
        }
    }

    public selectAll(): void {
        this.checkVirtualList();

        var last: number = -1;
        var i: number;
        if (this._virtual) {
            for (i = 0; i < this._realNumItems; i++) {
                var ii: ItemInfo = this._virtualItems[i];
                if ((ii.obj instanceof GButton) && !ii.obj.selected) {
                    ii.obj.selected = true;
                    last = i;
                }
                ii.selected = true;
            }
        }
        else {
            var cnt: number = this._children.length;
            for (i = 0; i < cnt; i++) {
                var obj: GObject = this._children[i];
                if ((obj instanceof GButton) && !obj.selected) {
                    obj.selected = true;
                    last = i;
                }
            }
        }

        if (last != -1)
            this.updateSelectionController(last);
    }

    public selectNone(): void {
        this.clearSelection();
    }

    public selectReverse(): void {
        this.checkVirtualList();

        var last: number = -1;
        var i: number;
        if (this._virtual) {
            for (i = 0; i < this._realNumItems; i++) {
                var ii: ItemInfo = this._virtualItems[i];
                if (ii.obj instanceof GButton) {
                    ii.obj.selected = !ii.obj.selected;
                    if (ii.obj.selected)
                        last = i;
                }
                ii.selected = !ii.selected;
            }
        }
        else {
            var cnt: number = this._children.length;
            for (i = 0; i < cnt; i++) {
                var obj: GObject = this._children[i];
                if (obj instanceof GButton) {
                    obj.selected = !obj.selected;
                    if (obj.selected)
                        last = i;
                }
            }
        }

        if (last != -1)
            this.updateSelectionController(last);
    }


    public handleArrowKey(dir: number): void {
        var index: number = this.selectedIndex;
        if (index == -1)
            return;

        switch (dir) {
            case 1://up
                if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.FlowVertical) {
                    index--;
                    if (index >= 0) {
                        this.clearSelection();
                        this.addSelection(index, true);
                    }
                }
                else if (this._layout == ListLayoutType.FlowHorizontal || this._layout == ListLayoutType.Pagination) {
                    var current: GObject = this._children[index];
                    var k: number = 0;
                    for (var i: number = index - 1; i >= 0; i--) {
                        var obj: GObject = this._children[i];
                        if (obj.y != current.y) {
                            current = obj;
                            break;
                        }
                        k++;
                    }
                    for (; i >= 0; i--) {
                        obj = this._children[i];
                        if (obj.y != current.y) {
                            this.clearSelection();
                            this.addSelection(i + k + 1, true);
                            break;
                        }
                    }
                }
                break;

            case 3://right
                if (this._layout == ListLayoutType.SingleRow || this._layout == ListLayoutType.FlowHorizontal || this._layout == ListLayoutType.Pagination) {
                    index++;
                    if (index < this._children.length) {
                        this.clearSelection();
                        this.addSelection(index, true);
                    }
                }
                else if (this._layout == ListLayoutType.FlowVertical) {
                    current = this._children[index];
                    k = 0;
                    var cnt: number = this._children.length;
                    for (i = index + 1; i < cnt; i++) {
                        obj = this._children[i];
                        if (obj.x != current.x) {
                            current = obj;
                            break;
                        }
                        k++;
                    }
                    for (; i < cnt; i++) {
                        obj = this._children[i];
                        if (obj.x != current.x) {
                            this.clearSelection();
                            this.addSelection(i - k - 1, true);
                            break;
                        }
                    }
                }
                break;

            case 5://down
                if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.FlowVertical) {
                    index++;
                    if (index < this._children.length) {
                        this.clearSelection();
                        this.addSelection(index, true);
                    }
                }
                else if (this._layout == ListLayoutType.FlowHorizontal || this._layout == ListLayoutType.Pagination) {
                    current = this._children[index];
                    k = 0;
                    cnt = this._children.length;
                    for (i = index + 1; i < cnt; i++) {
                        obj = this._children[i];
                        if (obj.y != current.y) {
                            current = obj;
                            break;
                        }
                        k++;
                    }
                    for (; i < cnt; i++) {
                        obj = this._children[i];
                        if (obj.y != current.y) {
                            this.clearSelection();
                            this.addSelection(i - k - 1, true);
                            break;
                        }
                    }
                }
                break;

            case 7://left
                if (this._layout == ListLayoutType.SingleRow || this._layout == ListLayoutType.FlowHorizontal || this._layout == ListLayoutType.Pagination) {
                    index--;
                    if (index >= 0) {
                        this.clearSelection();
                        this.addSelection(index, true);
                    }
                }
                else if (this._layout == ListLayoutType.FlowVertical) {
                    current = this._children[index];
                    k = 0;
                    for (i = index - 1; i >= 0; i--) {
                        obj = this._children[i];
                        if (obj.x != current.x) {
                            current = obj;
                            break;
                        }
                        k++;
                    }
                    for (; i >= 0; i--) {
                        obj = this._children[i];
                        if (obj.x != current.x) {
                            this.clearSelection();
                            this.addSelection(i + k + 1, true);
                            break;
                        }
                    }
                }
                break;
        }
    }

    private onClickItem(evt: FUIEvent): void {
        if (this._scrollPane && this._scrollPane.isDragged)
            return;

        var item: GObject = GObject.cast(<Node>evt.currentTarget);
        this.setSelectionOnEvent(item, evt);

        if (this._scrollPane && this.scrollItemToViewOnClick)
            this._scrollPane.scrollToView(item, true);

        this.dispatchItemEvent(item, evt);
    }

    protected dispatchItemEvent(item: GObject, evt: FUIEvent): void {
        this._node.emit(FUIEvent.CLICK_ITEM, item, evt);
    }

    private setSelectionOnEvent(item: GObject, evt: FUIEvent): void {
        if (!(item instanceof GButton) || this._selectionMode == ListSelectionMode.None)
            return;

        var dontChangeLastIndex: boolean = false;
        var index: number = this.childIndexToItemIndex(this.getChildIndex(item));

        if (this._selectionMode == ListSelectionMode.Single) {
            if (!item.selected) {
                this.clearSelectionExcept(item);
                item.selected = true;
            }
        }
        else {
            if (evt.isShiftDown) {
                if (!item.selected) {
                    if (this._lastSelectedIndex != -1) {
                        var min: number = Math.min(this._lastSelectedIndex, index);
                        var max: number = Math.max(this._lastSelectedIndex, index);
                        max = Math.min(max, this.numItems - 1);
                        var i: number;
                        if (this._virtual) {
                            for (i = min; i <= max; i++) {
                                var ii: ItemInfo = this._virtualItems[i];
                                if (ii.obj instanceof GButton)
                                    ii.obj.selected = true;
                                ii.selected = true;
                            }
                        }
                        else {
                            for (i = min; i <= max; i++) {
                                var obj: GObject = this.getChildAt(i);
                                if (obj instanceof GButton)
                                    obj.selected = true;
                            }
                        }

                        dontChangeLastIndex = true;
                    }
                    else {
                        item.selected = true;
                    }
                }
            }
            else if (evt.isCtrlDown || this._selectionMode == ListSelectionMode.Multiple_SingleClick) {
                item.selected = !item.selected;
            }
            else {
                if (!item.selected) {
                    this.clearSelectionExcept(item);
                    item.selected = true;
                }
                else
                    this.clearSelectionExcept(item);
            }
        }

        if (!dontChangeLastIndex)
            this._lastSelectedIndex = index;

        if (item.selected)
            this.updateSelectionController(index);
    }

    public resizeToFit(itemCount: number = Number.POSITIVE_INFINITY, minSize: number = 0): void {
        this.ensureBoundsCorrect();

        var curCount: number = this.numItems;
        if (itemCount > curCount)
            itemCount = curCount;

        if (this._virtual) {
            var lineCount: number = Math.ceil(itemCount / this._curLineItemCount);
            if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.FlowHorizontal)
                this.viewHeight = lineCount * this._itemSize.height + Math.max(0, lineCount - 1) * this._lineGap;
            else
                this.viewWidth = lineCount * this._itemSize.width + Math.max(0, lineCount - 1) * this._columnGap;
        }
        else if (itemCount == 0) {
            if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.FlowHorizontal)
                this.viewHeight = minSize;
            else
                this.viewWidth = minSize;
        }
        else {
            var i: number = itemCount - 1;
            var obj: GObject = null;
            while (i >= 0) {
                obj = this.getChildAt(i);
                if (!this.foldInvisibleItems || obj.visible)
                    break;
                i--;
            }
            if (i < 0) {
                if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.FlowHorizontal)
                    this.viewHeight = minSize;
                else
                    this.viewWidth = minSize;
            }
            else {
                var size: number = 0;
                if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.FlowHorizontal) {
                    size = obj.y + obj.height;
                    if (size < minSize)
                        size = minSize;
                    this.viewHeight = size;
                }
                else {
                    size = obj.x + obj.width;
                    if (size < minSize)
                        size = minSize;
                    this.viewWidth = size;
                }
            }
        }
    }

    public getMaxItemWidth(): number {
        var cnt: number = this._children.length;
        var max: number = 0;
        for (var i: number = 0; i < cnt; i++) {
            var child: GObject = this.getChildAt(i);
            if (child.width > max)
                max = child.width;
        }
        return max;
    }

    protected handleSizeChanged(): void {
        super.handleSizeChanged();

        this.setBoundsChangedFlag();
        if (this._virtual)
            this.setVirtualListChangedFlag(true);
    }

    public handleControllerChanged(c: Controller): void {
        super.handleControllerChanged(c);

        if (this._selectionController == c)
            this.selectedIndex = c.selectedIndex;
    }

    private updateSelectionController(index: number): void {
        if (this._selectionController && !this._selectionController.changing
            && index < this._selectionController.pageCount) {
            var c: Controller = this._selectionController;
            this._selectionController = null;
            c.selectedIndex = index;
            this._selectionController = c;
        }
    }

    public getSnappingPosition(xValue: number, yValue: number, resultPoint?: Vec2): Vec2 {
        if (this._virtual) {
            resultPoint = resultPoint || new Vec2();

            var saved: number;
            var index: number;
            if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.FlowHorizontal) {
                saved = yValue;
                s_n = yValue;
                index = this.getIndexOnPos1(false);
                yValue = s_n;
                if (index < this._virtualItems.length && saved - yValue > this._virtualItems[index].height / 2 && index < this._realNumItems)
                    yValue += this._virtualItems[index].height + this._lineGap;
            }
            else if (this._layout == ListLayoutType.SingleRow || this._layout == ListLayoutType.FlowVertical) {
                saved = xValue;
                s_n = xValue;
                index = this.getIndexOnPos2(false);
                xValue = s_n;
                if (index < this._virtualItems.length && saved - xValue > this._virtualItems[index].width / 2 && index < this._realNumItems)
                    xValue += this._virtualItems[index].width + this._columnGap;
            }
            else {
                saved = xValue;
                s_n = xValue;
                index = this.getIndexOnPos3(false);
                xValue = s_n;
                if (index < this._virtualItems.length && saved - xValue > this._virtualItems[index].width / 2 && index < this._realNumItems)
                    xValue += this._virtualItems[index].width + this._columnGap;
            }

            resultPoint.x = xValue;
            resultPoint.y = yValue;
            return resultPoint;
        }
        else {
            return super.getSnappingPosition(xValue, yValue, resultPoint);
        }
    }

    public scrollToView(index: number, ani?: boolean, setFirst?: boolean): void {
        if (this._virtual) {
            if (this._numItems == 0)
                return;

            this.checkVirtualList();

            if (index >= this._virtualItems.length)
                throw "Invalid child index: " + index + ">" + this._virtualItems.length;

            if (this._loop)
                index = Math.floor(this._firstIndex / this._numItems) * this._numItems + index;

            var rect: Rect;
            var ii: ItemInfo = this._virtualItems[index];
            var pos: number = 0;
            var i: number;
            if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.FlowHorizontal) {
                for (i = this._curLineItemCount - 1; i < index; i += this._curLineItemCount)
                    pos += this._virtualItems[i].height + this._lineGap;
                rect = new Rect(0, pos, this._itemSize.width, ii.height);
            }
            else if (this._layout == ListLayoutType.SingleRow || this._layout == ListLayoutType.FlowVertical) {
                for (i = this._curLineItemCount - 1; i < index; i += this._curLineItemCount)
                    pos += this._virtualItems[i].width + this._columnGap;
                rect = new Rect(pos, 0, ii.width, this._itemSize.height);
            }
            else {
                var page: number = index / (this._curLineItemCount * this._curLineItemCount2);
                rect = new Rect(page * this.viewWidth + (index % this._curLineItemCount) * (ii.width + this._columnGap),
                    (index / this._curLineItemCount) % this._curLineItemCount2 * (ii.height + this._lineGap),
                    ii.width, ii.height);
            }

            if (this._scrollPane)
                this._scrollPane.scrollToView(rect, ani, setFirst);
        }
        else {
            var obj: GObject = this.getChildAt(index);
            if (obj) {
                if (this._scrollPane)
                    this._scrollPane.scrollToView(obj, ani, setFirst);
                else if (this.parent && this.parent.scrollPane)
                    this.parent.scrollPane.scrollToView(obj, ani, setFirst);
            }
        }
    }

    public getFirstChildInView(): number {
        return this.childIndexToItemIndex(super.getFirstChildInView());
    }

    public childIndexToItemIndex(index: number): number {
        if (!this._virtual)
            return index;

        if (this._layout == ListLayoutType.Pagination) {
            for (var i: number = this._firstIndex; i < this._realNumItems; i++) {
                if (this._virtualItems[i].obj) {
                    index--;
                    if (index < 0)
                        return i;
                }
            }

            return index;
        }
        else {
            index += this._firstIndex;
            if (this._loop && this._numItems > 0)
                index = index % this._numItems;

            return index;
        }
    }

    public itemIndexToChildIndex(index: number): number {
        if (!this._virtual)
            return index;

        if (this._layout == ListLayoutType.Pagination) {
            return this.getChildIndex(this._virtualItems[index].obj);
        }
        else {
            if (this._loop && this._numItems > 0) {
                var j: number = this._firstIndex % this._numItems;
                if (index >= j)
                    index = index - j;
                else
                    index = this._numItems - j + index;
            }
            else
                index -= this._firstIndex;

            return index;
        }
    }

    public setVirtual(): void {
        this._setVirtual(false);
    }

    /// <summary>
    /// Set the list to be virtual list, and has loop behavior.
    /// </summary>
    public setVirtualAndLoop(): void {
        this._setVirtual(true);
    }

    /// <summary>
    /// Set the list to be virtual list.
    /// </summary>
    private _setVirtual(loop: boolean): void {
        if (!this._virtual) {
            if (!this._scrollPane)
                throw "Virtual list must be scrollable!";

            if (loop) {
                if (this._layout == ListLayoutType.FlowHorizontal || this._layout == ListLayoutType.FlowVertical)
                    throw "Loop list is not supported for FlowHorizontal or FlowVertical layout!";

                this._scrollPane.bouncebackEffect = false;
            }

            this._virtual = true;
            this._loop = loop;
            this._virtualItems = new Array<ItemInfo>();
            this.removeChildrenToPool();

            if (this._itemSize == null) {
                this._itemSize = new Size(0, 0);
                var obj: GObject = this.getFromPool(null);
                if (!obj) {
                    throw "Virtual List must have a default list item resource.";
                }
                else {
                    this._itemSize.width = obj.width;
                    this._itemSize.height = obj.height;
                }
                this.returnToPool(obj);
            }

            if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.FlowHorizontal) {
                this._scrollPane.scrollStep = this._itemSize.height;
                if (this._loop)
                    this._scrollPane._loop = 2;
            }
            else {
                this._scrollPane.scrollStep = this._itemSize.width;
                if (this._loop)
                    this._scrollPane._loop = 1;
            }

            this._node.on(FUIEvent.SCROLL, this.__scrolled, this);
            this.setVirtualListChangedFlag(true);
        }
    }

    /// <summary>
    /// Set the list item count. 
    /// If the list is not virtual, specified number of items will be created. 
    /// If the list is virtual, only items in view will be created.
    /// </summary>
    public get numItems(): number {
        if (this._virtual)
            return this._numItems;
        else
            return this._children.length;
    }

    public set numItems(value: number) {
        if (this._virtual) {
            if (this.itemRenderer == null)
                throw "Set itemRenderer first!";

            this._numItems = value;
            if (this._loop)
                this._realNumItems = this._numItems * 6;//设置6倍数量，用于循环滚动
            else
                this._realNumItems = this._numItems;

            //_virtualItems的设计是只增不减的
            var oldCount: number = this._virtualItems.length;
            if (this._realNumItems > oldCount) {
                for (i = oldCount; i < this._realNumItems; i++) {
                    var ii: ItemInfo = {
                        width: this._itemSize.width,
                        height: this._itemSize.height,
                        updateFlag: 0
                    };

                    this._virtualItems.push(ii);
                }
            }
            else {
                for (i = this._realNumItems; i < oldCount; i++)
                    this._virtualItems[i].selected = false;
            }

            if (this._virtualListChanged != 0)
                this._partner.unschedule(this._refreshVirtualList);

            //立即刷新
            this._refreshVirtualList();
        }
        else {
            var cnt: number = this._children.length;
            if (value > cnt) {
                for (var i: number = cnt; i < value; i++) {
                    if (this.itemProvider == null)
                        this.addItemFromPool();
                    else
                        this.addItemFromPool(this.itemProvider(i));
                }
            }
            else {
                this.removeChildrenToPool(value, cnt);
            }
            if (this.itemRenderer != null) {
                for (i = 0; i < value; i++)
                    this.itemRenderer(i, this.getChildAt(i));
            }
        }
    }

    public refreshVirtualList(): void {
        this.setVirtualListChangedFlag(false);
    }

    private checkVirtualList(): void {
        if (this._virtualListChanged != 0) {
            this._refreshVirtualList();
            this._partner.unschedule(this._refreshVirtualList);
        }
    }

    private setVirtualListChangedFlag(layoutChanged: boolean): void {
        if (layoutChanged)
            this._virtualListChanged = 2;
        else if (this._virtualListChanged == 0)
            this._virtualListChanged = 1;

        this._partner.callLater(this._refreshVirtualList);
    }

    private _refreshVirtualList(dt?: number): void {
        if (!isNaN(dt)) {
            let _t = <GList>GObject.cast(this.node);
            _t._refreshVirtualList();
            return;
        }

        var layoutChanged: boolean = this._virtualListChanged == 2;
        this._virtualListChanged = 0;
        this._eventLocked = true;

        if (layoutChanged) {
            if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.SingleRow)
                this._curLineItemCount = 1;
            else if (this._layout == ListLayoutType.FlowHorizontal) {
                if (this._columnCount > 0)
                    this._curLineItemCount = this._columnCount;
                else {
                    this._curLineItemCount = Math.floor((this._scrollPane.viewWidth + this._columnGap) / (this._itemSize.width + this._columnGap));
                    if (this._curLineItemCount <= 0)
                        this._curLineItemCount = 1;
                }
            }
            else if (this._layout == ListLayoutType.FlowVertical) {
                if (this._lineCount > 0)
                    this._curLineItemCount = this._lineCount;
                else {
                    this._curLineItemCount = Math.floor((this._scrollPane.viewHeight + this._lineGap) / (this._itemSize.height + this._lineGap));
                    if (this._curLineItemCount <= 0)
                        this._curLineItemCount = 1;
                }
            }
            else //pagination
            {
                if (this._columnCount > 0)
                    this._curLineItemCount = this._columnCount;
                else {
                    this._curLineItemCount = Math.floor((this._scrollPane.viewWidth + this._columnGap) / (this._itemSize.width + this._columnGap));
                    if (this._curLineItemCount <= 0)
                        this._curLineItemCount = 1;
                }

                if (this._lineCount > 0)
                    this._curLineItemCount2 = this._lineCount;
                else {
                    this._curLineItemCount2 = Math.floor((this._scrollPane.viewHeight + this._lineGap) / (this._itemSize.height + this._lineGap));
                    if (this._curLineItemCount2 <= 0)
                        this._curLineItemCount2 = 1;
                }
            }
        }

        var ch: number = 0, cw: number = 0;
        if (this._realNumItems > 0) {
            var i: number;
            var len: number = Math.ceil(this._realNumItems / this._curLineItemCount) * this._curLineItemCount;
            var len2: number = Math.min(this._curLineItemCount, this._realNumItems);
            if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.FlowHorizontal) {
                for (i = 0; i < len; i += this._curLineItemCount)
                    ch += this._virtualItems[i].height + this._lineGap;
                if (ch > 0)
                    ch -= this._lineGap;

                if (this._autoResizeItem)
                    cw = this._scrollPane.viewWidth;
                else {
                    for (i = 0; i < len2; i++)
                        cw += this._virtualItems[i].width + this._columnGap;
                    if (cw > 0)
                        cw -= this._columnGap;
                }
            }
            else if (this._layout == ListLayoutType.SingleRow || this._layout == ListLayoutType.FlowVertical) {
                for (i = 0; i < len; i += this._curLineItemCount)
                    cw += this._virtualItems[i].width + this._columnGap;
                if (cw > 0)
                    cw -= this._columnGap;

                if (this._autoResizeItem)
                    ch = this._scrollPane.viewHeight;
                else {
                    for (i = 0; i < len2; i++)
                        ch += this._virtualItems[i].height + this._lineGap;
                    if (ch > 0)
                        ch -= this._lineGap;
                }
            }
            else {
                var pageCount: number = Math.ceil(len / (this._curLineItemCount * this._curLineItemCount2));
                cw = pageCount * this.viewWidth;
                ch = this.viewHeight;
            }
        }

        this.handleAlign(cw, ch);
        this._scrollPane.setContentSize(cw, ch);

        this._eventLocked = false;

        this.handleScroll(true);
    }

    private __scrolled(evt: Event): void {
        this.handleScroll(false);
    }

    private getIndexOnPos1(forceUpdate: boolean): number {
        if (this._realNumItems < this._curLineItemCount) {
            s_n = 0;
            return 0;
        }

        var i: number;
        var pos2: number;
        var pos3: number;

        if (this.numChildren > 0 && !forceUpdate) {
            pos2 = this.getChildAt(0).y;
            if (pos2 > s_n) {
                for (i = this._firstIndex - this._curLineItemCount; i >= 0; i -= this._curLineItemCount) {
                    pos2 -= (this._virtualItems[i].height + this._lineGap);
                    if (pos2 <= s_n) {
                        s_n = pos2;
                        return i;
                    }
                }

                s_n = 0;
                return 0;
            }
            else {
                for (i = this._firstIndex; i < this._realNumItems; i += this._curLineItemCount) {
                    pos3 = pos2 + this._virtualItems[i].height + this._lineGap;
                    if (pos3 > s_n) {
                        s_n = pos2;
                        return i;
                    }
                    pos2 = pos3;
                }

                s_n = pos2;
                return this._realNumItems - this._curLineItemCount;
            }
        }
        else {
            pos2 = 0;
            for (i = 0; i < this._realNumItems; i += this._curLineItemCount) {
                pos3 = pos2 + this._virtualItems[i].height + this._lineGap;
                if (pos3 > s_n) {
                    s_n = pos2;
                    return i;
                }
                pos2 = pos3;
            }

            s_n = pos2;
            return this._realNumItems - this._curLineItemCount;
        }
    }

    private getIndexOnPos2(forceUpdate: boolean): number {
        if (this._realNumItems < this._curLineItemCount) {
            s_n = 0;
            return 0;
        }

        var i: number;
        var pos2: number;
        var pos3: number;

        if (this.numChildren > 0 && !forceUpdate) {
            pos2 = this.getChildAt(0).x;
            if (pos2 > s_n) {
                for (i = this._firstIndex - this._curLineItemCount; i >= 0; i -= this._curLineItemCount) {
                    pos2 -= (this._virtualItems[i].width + this._columnGap);
                    if (pos2 <= s_n) {
                        s_n = pos2;
                        return i;
                    }
                }

                s_n = 0;
                return 0;
            }
            else {
                for (i = this._firstIndex; i < this._realNumItems; i += this._curLineItemCount) {
                    pos3 = pos2 + this._virtualItems[i].width + this._columnGap;
                    if (pos3 > s_n) {
                        s_n = pos2;
                        return i;
                    }
                    pos2 = pos3;
                }

                s_n = pos2;
                return this._realNumItems - this._curLineItemCount;
            }
        }
        else {
            pos2 = 0;
            for (i = 0; i < this._realNumItems; i += this._curLineItemCount) {
                pos3 = pos2 + this._virtualItems[i].width + this._columnGap;
                if (pos3 > s_n) {
                    s_n = pos2;
                    return i;
                }
                pos2 = pos3;
            }

            s_n = pos2;
            return this._realNumItems - this._curLineItemCount;
        }
    }

    private getIndexOnPos3(forceUpdate: boolean): number {
        if (this._realNumItems < this._curLineItemCount) {
            s_n = 0;
            return 0;
        }

        var viewWidth: number = this.viewWidth;
        var page: number = Math.floor(s_n / viewWidth);
        var startIndex: number = page * (this._curLineItemCount * this._curLineItemCount2);
        var pos2: number = page * viewWidth;
        var i: number;
        var pos3: number;
        for (i = 0; i < this._curLineItemCount; i++) {
            pos3 = pos2 + this._virtualItems[startIndex + i].width + this._columnGap;
            if (pos3 > s_n) {
                s_n = pos2;
                return startIndex + i;
            }
            pos2 = pos3;
        }

        s_n = pos2;
        return startIndex + this._curLineItemCount - 1;
    }

    private handleScroll(forceUpdate: boolean): void {
        if (this._eventLocked)
            return;

        if (this._layout == ListLayoutType.SingleColumn || this._layout == ListLayoutType.FlowHorizontal) {
            var enterCounter: number = 0;
            while (this.handleScroll1(forceUpdate)) {
                enterCounter++;
                forceUpdate = false;
                if (enterCounter > 20) {
                    console.log("FairyGUI: list will never be filled as the item renderer function always returns a different size.");
                    break;
                }
            }
            this.handleArchOrder1();
        }
        else if (this._layout == ListLayoutType.SingleRow || this._layout == ListLayoutType.FlowVertical) {
            enterCounter = 0;
            while (this.handleScroll2(forceUpdate)) {
                enterCounter++;
                forceUpdate = false;
                if (enterCounter > 20) {
                    console.log("FairyGUI: list will never be filled as the item renderer function always returns a different size.");
                    break;
                }
            }
            this.handleArchOrder2();
        }
        else {
            this.handleScroll3(forceUpdate);
        }

        this._boundsChanged = false;
    }

    private static pos_param: number;

    private handleScroll1(forceUpdate: boolean): boolean {
        var pos: number = this._scrollPane.scrollingPosY;
        var max: number = pos + this._scrollPane.viewHeight;
        var end: boolean = max == this._scrollPane.contentHeight;//这个标志表示当前需要滚动到最末，无论内容变化大小

        //寻找当前位置的第一条项目
        s_n = pos;
        var newFirstIndex: number = this.getIndexOnPos1(forceUpdate);
        pos = s_n;
        if (newFirstIndex == this._firstIndex && !forceUpdate) {
            return false;
        }

        var oldFirstIndex: number = this._firstIndex;
        this._firstIndex = newFirstIndex;
        var curIndex: number = newFirstIndex;
        var forward: boolean = oldFirstIndex > newFirstIndex;
        var childCount: number = this.numChildren;
        var lastIndex: number = oldFirstIndex + childCount - 1;
        var reuseIndex: number = forward ? lastIndex : oldFirstIndex;
        var curX: number = 0, curY: number = pos;
        var needRender: boolean;
        var deltaSize: number = 0;
        var firstItemDeltaSize: number = 0;
        var url: string = this._defaultItem;
        var ii: ItemInfo, ii2: ItemInfo;
        var i: number, j: number;
        var partSize: number = (this._scrollPane.viewWidth - this._columnGap * (this._curLineItemCount - 1)) / this._curLineItemCount;

        this.itemInfoVer++;

        while (curIndex < this._realNumItems && (end || curY < max)) {
            ii = this._virtualItems[curIndex];

            if (!ii.obj || forceUpdate) {
                if (this.itemProvider != null) {
                    url = this.itemProvider(curIndex % this._numItems);
                    if (url == null)
                        url = this._defaultItem;
                    url = UIPackage.normalizeURL(url);
                }

                if (ii.obj && ii.obj.resourceURL != url) {
                    if (ii.obj instanceof GButton)
                        ii.selected = ii.obj.selected;
                    this.removeChildToPool(ii.obj);
                    ii.obj = null;
                }
            }

            if (!ii.obj) {
                //搜索最适合的重用item，保证每次刷新需要新建或者重新render的item最少
                if (forward) {
                    for (j = reuseIndex; j >= oldFirstIndex; j--) {
                        ii2 = this._virtualItems[j];
                        if (ii2.obj && ii2.updateFlag != this.itemInfoVer && ii2.obj.resourceURL == url) {
                            if (ii2.obj instanceof GButton)
                                ii2.selected = ii2.obj.selected;
                            ii.obj = ii2.obj;
                            ii2.obj = null;
                            if (j == reuseIndex)
                                reuseIndex--;
                            break;
                        }
                    }
                }
                else {
                    for (j = reuseIndex; j <= lastIndex; j++) {
                        ii2 = this._virtualItems[j];
                        if (ii2.obj && ii2.updateFlag != this.itemInfoVer && ii2.obj.resourceURL == url) {
                            if (ii2.obj instanceof GButton)
                                ii2.selected = ii2.obj.selected;
                            ii.obj = ii2.obj;
                            ii2.obj = null;
                            if (j == reuseIndex)
                                reuseIndex++;
                            break;
                        }
                    }
                }

                if (ii.obj) {
                    this.setChildIndex(ii.obj, forward ? curIndex - newFirstIndex : this.numChildren);
                }
                else {
                    ii.obj = this._pool.getObject(url);
                    if (forward)
                        this.addChildAt(ii.obj, curIndex - newFirstIndex);
                    else
                        this.addChild(ii.obj);
                }
                if (ii.obj instanceof GButton)
                    ii.obj.selected = ii.selected;

                needRender = true;
            }
            else
                needRender = forceUpdate;

            if (needRender) {
                if (this._autoResizeItem && (this._layout == ListLayoutType.SingleColumn || this._columnCount > 0))
                    ii.obj.setSize(partSize, ii.obj.height, true);

                this.itemRenderer(curIndex % this._numItems, ii.obj);
                if (curIndex % this._curLineItemCount == 0) {
                    deltaSize += Math.ceil(ii.obj.height) - ii.height;
                    if (curIndex == newFirstIndex && oldFirstIndex > newFirstIndex) {
                        //当内容向下滚动时，如果新出现的项目大小发生变化，需要做一个位置补偿，才不会导致滚动跳动
                        firstItemDeltaSize = Math.ceil(ii.obj.height) - ii.height;
                    }
                }
                ii.width = Math.ceil(ii.obj.width);
                ii.height = Math.ceil(ii.obj.height);
            }

            ii.updateFlag = this.itemInfoVer;
            ii.obj.setPosition(curX, curY);
            if (curIndex == newFirstIndex) //要显示多一条才不会穿帮
                max += ii.height;

            curX += ii.width + this._columnGap;

            if (curIndex % this._curLineItemCount == this._curLineItemCount - 1) {
                curX = 0;
                curY += ii.height + this._lineGap;
            }
            curIndex++;
        }

        for (i = 0; i < childCount; i++) {
            ii = this._virtualItems[oldFirstIndex + i];
            if (ii.updateFlag != this.itemInfoVer && ii.obj) {
                if (ii.obj instanceof GButton)
                    ii.selected = ii.obj.selected;
                this.removeChildToPool(ii.obj);
                ii.obj = null;
            }
        }

        childCount = this._children.length;
        for (i = 0; i < childCount; i++) {
            let obj: GObject = this._virtualItems[newFirstIndex + i].obj;
            if (this._children[i] != obj)
                this.setChildIndex(obj, i);
        }

        if (deltaSize != 0 || firstItemDeltaSize != 0)
            this._scrollPane.changeContentSizeOnScrolling(0, deltaSize, 0, firstItemDeltaSize);

        if (curIndex > 0 && this.numChildren > 0 && this._container.position.y <= 0 && this.getChildAt(0).y > -this._container.position.y)//最后一页没填满！
            return true;
        else
            return false;
    }

    private handleScroll2(forceUpdate: boolean): boolean {
        var pos: number = this._scrollPane.scrollingPosX;
        var max: number = pos + this._scrollPane.viewWidth;
        var end: boolean = pos == this._scrollPane.contentWidth;//这个标志表示当前需要滚动到最末，无论内容变化大小

        //寻找当前位置的第一条项目
        s_n = pos;
        var newFirstIndex: number = this.getIndexOnPos2(forceUpdate);
        pos = s_n;
        if (newFirstIndex == this._firstIndex && !forceUpdate) {
            return false;
        }

        var oldFirstIndex: number = this._firstIndex;
        this._firstIndex = newFirstIndex;
        var curIndex: number = newFirstIndex;
        var forward: boolean = oldFirstIndex > newFirstIndex;
        var childCount: number = this.numChildren;
        var lastIndex: number = oldFirstIndex + childCount - 1;
        var reuseIndex: number = forward ? lastIndex : oldFirstIndex;
        var curX: number = pos, curY: number = 0;
        var needRender: boolean;
        var deltaSize: number = 0;
        var firstItemDeltaSize: number = 0;
        var url: string = this._defaultItem;
        var ii: ItemInfo, ii2: ItemInfo;
        var i: number, j: number;
        var partSize: number = (this._scrollPane.viewHeight - this._lineGap * (this._curLineItemCount - 1)) / this._curLineItemCount;

        this.itemInfoVer++;

        while (curIndex < this._realNumItems && (end || curX < max)) {
            ii = this._virtualItems[curIndex];

            if (!ii.obj || forceUpdate) {
                if (this.itemProvider != null) {
                    url = this.itemProvider(curIndex % this._numItems);
                    if (url == null)
                        url = this._defaultItem;
                    url = UIPackage.normalizeURL(url);
                }

                if (ii.obj && ii.obj.resourceURL != url) {
                    if (ii.obj instanceof GButton)
                        ii.selected = ii.obj.selected;
                    this.removeChildToPool(ii.obj);
                    ii.obj = null;
                }
            }

            if (!ii.obj) {
                if (forward) {
                    for (j = reuseIndex; j >= oldFirstIndex; j--) {
                        ii2 = this._virtualItems[j];
                        if (ii2.obj && ii2.updateFlag != this.itemInfoVer && ii2.obj.resourceURL == url) {
                            if (ii2.obj instanceof GButton)
                                ii2.selected = ii2.obj.selected;
                            ii.obj = ii2.obj;
                            ii2.obj = null;
                            if (j == reuseIndex)
                                reuseIndex--;
                            break;
                        }
                    }
                }
                else {
                    for (j = reuseIndex; j <= lastIndex; j++) {
                        ii2 = this._virtualItems[j];
                        if (ii2.obj && ii2.updateFlag != this.itemInfoVer && ii2.obj.resourceURL == url) {
                            if (ii2.obj instanceof GButton)
                                ii2.selected = ii2.obj.selected;
                            ii.obj = ii2.obj;
                            ii2.obj = null;
                            if (j == reuseIndex)
                                reuseIndex++;
                            break;
                        }
                    }
                }

                if (ii.obj) {
                    this.setChildIndex(ii.obj, forward ? curIndex - newFirstIndex : this.numChildren);
                }
                else {
                    ii.obj = this._pool.getObject(url);
                    if (forward)
                        this.addChildAt(ii.obj, curIndex - newFirstIndex);
                    else
                        this.addChild(ii.obj);
                }
                if (ii.obj instanceof GButton)
                    ii.obj.selected = ii.selected;

                needRender = true;
            }
            else
                needRender = forceUpdate;

            if (needRender) {
                if (this._autoResizeItem && (this._layout == ListLayoutType.SingleRow || this._lineCount > 0))
                    ii.obj.setSize(ii.obj.width, partSize, true);


                this.itemRenderer(curIndex % this._numItems, ii.obj);
                if (curIndex % this._curLineItemCount == 0) {
                    deltaSize += Math.ceil(ii.obj.width) - ii.width;
                    if (curIndex == newFirstIndex && oldFirstIndex > newFirstIndex) {
                        //当内容向下滚动时，如果新出现的一个项目大小发生变化，需要做一个位置补偿，才不会导致滚动跳动
                        firstItemDeltaSize = Math.ceil(ii.obj.width) - ii.width;
                    }
                }
                ii.width = Math.ceil(ii.obj.width);
                ii.height = Math.ceil(ii.obj.height);
            }

            ii.updateFlag = this.itemInfoVer;
            ii.obj.setPosition(curX, curY);
            if (curIndex == newFirstIndex) //要显示多一条才不会穿帮
                max += ii.width;

            curY += ii.height + this._lineGap;

            if (curIndex % this._curLineItemCount == this._curLineItemCount - 1) {
                curY = 0;
                curX += ii.width + this._columnGap;
            }
            curIndex++;
        }

        for (i = 0; i < childCount; i++) {
            ii = this._virtualItems[oldFirstIndex + i];
            if (ii.updateFlag != this.itemInfoVer && ii.obj) {
                if (ii.obj instanceof GButton)
                    ii.selected = ii.obj.selected;
                this.removeChildToPool(ii.obj);
                ii.obj = null;
            }
        }

        childCount = this._children.length;
        for (i = 0; i < childCount; i++) {
            let obj: GObject = this._virtualItems[newFirstIndex + i].obj;
            if (this._children[i] != obj)
                this.setChildIndex(obj, i);
        }

        if (deltaSize != 0 || firstItemDeltaSize != 0)
            this._scrollPane.changeContentSizeOnScrolling(deltaSize, 0, firstItemDeltaSize, 0);

        if (curIndex > 0 && this.numChildren > 0 && this._container.position.x <= 0 && this.getChildAt(0).x > - this._container.position.x)//最后一页没填满！
            return true;
        else
            return false;
    }

    private handleScroll3(forceUpdate: boolean): void {
        var pos: number = this._scrollPane.scrollingPosX;

        //寻找当前位置的第一条项目
        s_n = pos;
        var newFirstIndex: number = this.getIndexOnPos3(forceUpdate);
        pos = s_n;
        if (newFirstIndex == this._firstIndex && !forceUpdate)
            return;

        var oldFirstIndex: number = this._firstIndex;
        this._firstIndex = newFirstIndex;

        //分页模式不支持不等高，所以渲染满一页就好了

        var reuseIndex: number = oldFirstIndex;
        var virtualItemCount: number = this._virtualItems.length;
        var pageSize: number = this._curLineItemCount * this._curLineItemCount2;
        var startCol: number = newFirstIndex % this._curLineItemCount;
        var viewWidth: number = this.viewWidth;
        var page: number = Math.floor(newFirstIndex / pageSize);
        var startIndex: number = page * pageSize;
        var lastIndex: number = startIndex + pageSize * 2; //测试两页
        var needRender: boolean;
        var i: number;
        var ii: ItemInfo, ii2: ItemInfo;
        var col: number;
        var url: string = this._defaultItem;
        var partWidth: number = (this._scrollPane.viewWidth - this._columnGap * (this._curLineItemCount - 1)) / this._curLineItemCount;
        var partHeight: number = (this._scrollPane.viewHeight - this._lineGap * (this._curLineItemCount2 - 1)) / this._curLineItemCount2;

        this.itemInfoVer++;

        //先标记这次要用到的项目
        for (i = startIndex; i < lastIndex; i++) {
            if (i >= this._realNumItems)
                continue;

            col = i % this._curLineItemCount;
            if (i - startIndex < pageSize) {
                if (col < startCol)
                    continue;
            }
            else {
                if (col > startCol)
                    continue;
            }

            ii = this._virtualItems[i];
            ii.updateFlag = this.itemInfoVer;
        }

        var lastObj: GObject = null;
        var insertIndex: number = 0;
        for (i = startIndex; i < lastIndex; i++) {
            if (i >= this._realNumItems)
                continue;

            ii = this._virtualItems[i];
            if (ii.updateFlag != this.itemInfoVer)
                continue;

            if (!ii.obj) {
                //寻找看有没有可重用的
                while (reuseIndex < virtualItemCount) {
                    ii2 = this._virtualItems[reuseIndex];
                    if (ii2.obj && ii2.updateFlag != this.itemInfoVer) {
                        if (ii2.obj instanceof GButton)
                            ii2.selected = ii2.obj.selected;
                        ii.obj = ii2.obj;
                        ii2.obj = null;
                        break;
                    }
                    reuseIndex++;
                }

                if (insertIndex == -1)
                    insertIndex = this.getChildIndex(lastObj) + 1;

                if (!ii.obj) {
                    if (this.itemProvider != null) {
                        url = this.itemProvider(i % this._numItems);
                        if (url == null)
                            url = this._defaultItem;
                        url = UIPackage.normalizeURL(url);
                    }

                    ii.obj = this._pool.getObject(url);
                    this.addChildAt(ii.obj, insertIndex);
                }
                else {
                    insertIndex = this.setChildIndexBefore(ii.obj, insertIndex);
                }
                insertIndex++;

                if (ii.obj instanceof GButton)
                    ii.obj.selected = ii.selected;

                needRender = true;
            }
            else {
                needRender = forceUpdate;
                insertIndex = -1;
                lastObj = ii.obj;
            }

            if (needRender) {
                if (this._autoResizeItem) {
                    if (this._curLineItemCount == this._columnCount && this._curLineItemCount2 == this._lineCount)
                        ii.obj.setSize(partWidth, partHeight, true);
                    else if (this._curLineItemCount == this._columnCount)
                        ii.obj.setSize(partWidth, ii.obj.height, true);
                    else if (this._curLineItemCount2 == this._lineCount)
                        ii.obj.setSize(ii.obj.width, partHeight, true);
                }

                this.itemRenderer(i % this._numItems, ii.obj);
                ii.width = Math.ceil(ii.obj.width);
                ii.height = Math.ceil(ii.obj.height);
            }
        }

        //排列item
        var borderX: number = (startIndex / pageSize) * viewWidth;
        var xx: number = borderX;
        var yy: number = 0;
        var lineHeight: number = 0;
        for (i = startIndex; i < lastIndex; i++) {
            if (i >= this._realNumItems)
                continue;

            ii = this._virtualItems[i];
            if (ii.updateFlag == this.itemInfoVer)
                ii.obj.setPosition(xx, yy);

            if (ii.height > lineHeight)
                lineHeight = ii.height;
            if (i % this._curLineItemCount == this._curLineItemCount - 1) {
                xx = borderX;
                yy += lineHeight + this._lineGap;
                lineHeight = 0;

                if (i == startIndex + pageSize - 1) {
                    borderX += viewWidth;
                    xx = borderX;
                    yy = 0;
                }
            }
            else
                xx += ii.width + this._columnGap;
        }

        //释放未使用的
        for (i = reuseIndex; i < virtualItemCount; i++) {
            ii = this._virtualItems[i];
            if (ii.updateFlag != this.itemInfoVer && ii.obj) {
                if (ii.obj instanceof GButton)
                    ii.selected = ii.obj.selected;
                this.removeChildToPool(ii.obj);
                ii.obj = null;
            }
        }
    }

    private handleArchOrder1(): void {
        if (this._childrenRenderOrder == ChildrenRenderOrder.Arch) {
            var mid: number = this._scrollPane.posY + this.viewHeight / 2;
            var minDist: number = Number.POSITIVE_INFINITY;
            var dist: number = 0;
            var apexIndex: number = 0;
            var cnt: number = this.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                var obj: GObject = this.getChildAt(i);
                if (!this.foldInvisibleItems || obj.visible) {
                    dist = Math.abs(mid - obj.y - obj.height / 2);
                    if (dist < minDist) {
                        minDist = dist;
                        apexIndex = i;
                    }
                }
            }
            this.apexIndex = apexIndex;
        }
    }

    private handleArchOrder2(): void {
        if (this._childrenRenderOrder == ChildrenRenderOrder.Arch) {
            var mid: number = this._scrollPane.posX + this.viewWidth / 2;
            var minDist: number = Number.POSITIVE_INFINITY;
            var dist: number = 0;
            var apexIndex: number = 0;
            var cnt: number = this.numChildren;
            for (var i: number = 0; i < cnt; i++) {
                var obj: GObject = this.getChildAt(i);
                if (!this.foldInvisibleItems || obj.visible) {
                    dist = Math.abs(mid - obj.x - obj.width / 2);
                    if (dist < minDist) {
                        minDist = dist;
                        apexIndex = i;
                    }
                }
            }
            this.apexIndex = apexIndex;
        }
    }

    private handleAlign(contentWidth: number, contentHeight: number): void {
        var newOffsetX: number = 0;
        var newOffsetY: number = 0;

        if (contentHeight < this.viewHeight) {
            if (this._verticalAlign == VertAlignType.Middle)
                newOffsetY = Math.floor((this.viewHeight - contentHeight) / 2);
            else if (this._verticalAlign == VertAlignType.Bottom)
                newOffsetY = this.viewHeight - contentHeight;
        }

        if (contentWidth < this.viewWidth) {
            if (this._align == AlignType.Center)
                newOffsetX = Math.floor((this.viewWidth - contentWidth) / 2);
            else if (this._align == AlignType.Right)
                newOffsetX = this.viewWidth - contentWidth;
        }


        if (newOffsetX != this._alignOffset.x || newOffsetY != this._alignOffset.y) {
            this._alignOffset.x = newOffsetX;
            this._alignOffset.y = newOffsetY;
            if (this._scrollPane)
                this._scrollPane.adjustMaskContainer();
            else
                this._container.setPosition(this._pivotCorrectX + this._alignOffset.x, this._pivotCorrectY - this._alignOffset.y);
        }
    }

    protected updateBounds(): void {
        if (this._virtual)
            return;

        var i: number;
        var child: GObject;
        var curX: number = 0;
        var curY: number = 0;
        var maxWidth: number = 0;
        var maxHeight: number = 0;
        var cw: number = 0, ch: number = 0;
        var j: number = 0;
        var page: number = 0;
        var k: number = 0;
        var cnt: number = this._children.length;
        var viewWidth: number = this.viewWidth;
        var viewHeight: number = this.viewHeight;
        var lineSize: number = 0;
        var lineStart: number = 0;
        var ratio: number = 0;

        if (this._layout == ListLayoutType.SingleColumn) {
            for (i = 0; i < cnt; i++) {
                child = this.getChildAt(i);
                if (this.foldInvisibleItems && !child.visible)
                    continue;

                if (curY != 0)
                    curY += this._lineGap;
                child.y = curY;
                if (this._autoResizeItem)
                    child.setSize(viewWidth, child.height, true);
                curY += Math.ceil(child.height);
                if (child.width > maxWidth)
                    maxWidth = child.width;
            }
            ch = curY;

            if (ch <= viewHeight && this._autoResizeItem && this._scrollPane && this._scrollPane._displayInDemand && this._scrollPane.vtScrollBar) {
                viewWidth += this._scrollPane.vtScrollBar.width;
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;

                    child.setSize(viewWidth, child.height, true);
                    if (child.width > maxWidth)
                        maxWidth = child.width;
                }
            }

            cw = Math.ceil(maxWidth);
        }
        else if (this._layout == ListLayoutType.SingleRow) {
            for (i = 0; i < cnt; i++) {
                child = this.getChildAt(i);
                if (this.foldInvisibleItems && !child.visible)
                    continue;

                if (curX != 0)
                    curX += this._columnGap;
                child.x = curX;
                if (this._autoResizeItem)
                    child.setSize(child.width, viewHeight, true);
                curX += Math.ceil(child.width);
                if (child.height > maxHeight)
                    maxHeight = child.height;
            }
            cw = curX;

            if (cw <= viewWidth && this._autoResizeItem && this._scrollPane && this._scrollPane._displayInDemand && this._scrollPane.hzScrollBar) {
                viewHeight += this._scrollPane.hzScrollBar.height;
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;

                    child.setSize(child.width, viewHeight, true);
                    if (child.height > maxHeight)
                        maxHeight = child.height;
                }
            }

            ch = Math.ceil(maxHeight);
        }
        else if (this._layout == ListLayoutType.FlowHorizontal) {
            if (this._autoResizeItem && this._columnCount > 0) {
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;

                    lineSize += child.sourceWidth;
                    j++;
                    if (j == this._columnCount || i == cnt - 1) {
                        ratio = (viewWidth - lineSize - (j - 1) * this._columnGap) / lineSize;
                        curX = 0;
                        for (j = lineStart; j <= i; j++) {
                            child = this.getChildAt(j);
                            if (this.foldInvisibleItems && !child.visible)
                                continue;

                            child.setPosition(curX, curY);

                            if (j < i) {
                                child.setSize(child.sourceWidth + Math.round(child.sourceWidth * ratio), child.height, true);
                                curX += Math.ceil(child.width) + this._columnGap;
                            }
                            else {
                                child.setSize(viewWidth - curX, child.height, true);
                            }
                            if (child.height > maxHeight)
                                maxHeight = child.height;
                        }
                        //new line
                        curY += Math.ceil(maxHeight) + this._lineGap;
                        maxHeight = 0;
                        j = 0;
                        lineStart = i + 1;
                        lineSize = 0;
                    }
                }
                ch = curY + Math.ceil(maxHeight);
                cw = viewWidth;
            }
            else {
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;

                    if (curX != 0)
                        curX += this._columnGap;

                    if (this._columnCount != 0 && j >= this._columnCount
                        || this._columnCount == 0 && curX + child.width > viewWidth && maxHeight != 0) {
                        //new line
                        curX = 0;
                        curY += Math.ceil(maxHeight) + this._lineGap;
                        maxHeight = 0;
                        j = 0;
                    }
                    child.setPosition(curX, curY);
                    curX += Math.ceil(child.width);
                    if (curX > maxWidth)
                        maxWidth = curX;
                    if (child.height > maxHeight)
                        maxHeight = child.height;
                    j++;
                }
                ch = curY + Math.ceil(maxHeight);
                cw = Math.ceil(maxWidth);
            }
        }
        else if (this._layout == ListLayoutType.FlowVertical) {
            if (this._autoResizeItem && this._lineCount > 0) {
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;

                    lineSize += child.sourceHeight;
                    j++;
                    if (j == this._lineCount || i == cnt - 1) {
                        ratio = (viewHeight - lineSize - (j - 1) * this._lineGap) / lineSize;
                        curY = 0;
                        for (j = lineStart; j <= i; j++) {
                            child = this.getChildAt(j);
                            if (this.foldInvisibleItems && !child.visible)
                                continue;

                            child.setPosition(curX, curY);

                            if (j < i) {
                                child.setSize(child.width, child.sourceHeight + Math.round(child.sourceHeight * ratio), true);
                                curY += Math.ceil(child.height) + this._lineGap;
                            }
                            else {
                                child.setSize(child.width, viewHeight - curY, true);
                            }
                            if (child.width > maxWidth)
                                maxWidth = child.width;
                        }
                        //new line
                        curX += Math.ceil(maxWidth) + this._columnGap;
                        maxWidth = 0;
                        j = 0;
                        lineStart = i + 1;
                        lineSize = 0;
                    }
                }
                cw = curX + Math.ceil(maxWidth);
                ch = viewHeight;
            }
            else {
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;

                    if (curY != 0)
                        curY += this._lineGap;

                    if (this._lineCount != 0 && j >= this._lineCount
                        || this._lineCount == 0 && curY + child.height > viewHeight && maxWidth != 0) {
                        curY = 0;
                        curX += Math.ceil(maxWidth) + this._columnGap;
                        maxWidth = 0;
                        j = 0;
                    }
                    child.setPosition(curX, curY);
                    curY += Math.ceil(child.height);
                    if (curY > maxHeight)
                        maxHeight = curY;
                    if (child.width > maxWidth)
                        maxWidth = child.width;
                    j++;
                }
                cw = curX + Math.ceil(maxWidth);
                ch = Math.ceil(maxHeight);
            }
        }
        else //pagination
        {
            var eachHeight: number;
            if (this._autoResizeItem && this._lineCount > 0)
                eachHeight = Math.floor((viewHeight - (this._lineCount - 1) * this._lineGap) / this._lineCount);

            if (this._autoResizeItem && this._columnCount > 0) {
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;


                    if (j == 0 && (this._lineCount != 0 && k >= this._lineCount
                        || this._lineCount == 0 && curY + (this._lineCount > 0 ? eachHeight : child.height) > viewHeight)) {
                        //new page
                        page++;
                        curY = 0;
                        k = 0;
                    }

                    lineSize += child.sourceWidth;
                    j++;
                    if (j == this._columnCount || i == cnt - 1) {
                        ratio = (viewWidth - lineSize - (j - 1) * this._columnGap) / lineSize;
                        curX = 0;
                        for (j = lineStart; j <= i; j++) {
                            child = this.getChildAt(j);
                            if (this.foldInvisibleItems && !child.visible)
                                continue;

                            child.setPosition(page * viewWidth + curX, curY);

                            if (j < i) {
                                child.setSize(child.sourceWidth + Math.round(child.sourceWidth * ratio),
                                    this._lineCount > 0 ? eachHeight : child.height, true);
                                curX += Math.ceil(child.width) + this._columnGap;
                            }
                            else {
                                child.setSize(viewWidth - curX, this._lineCount > 0 ? eachHeight : child.height, true);
                            }
                            if (child.height > maxHeight)
                                maxHeight = child.height;
                        }
                        //new line
                        curY += Math.ceil(maxHeight) + this._lineGap;
                        maxHeight = 0;
                        j = 0;
                        lineStart = i + 1;
                        lineSize = 0;

                        k++;
                    }
                }
            }
            else {
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;

                    if (curX != 0)
                        curX += this._columnGap;

                    if (this._autoResizeItem && this._lineCount > 0)
                        child.setSize(child.width, eachHeight, true);

                    if (this._columnCount != 0 && j >= this._columnCount
                        || this._columnCount == 0 && curX + child.width > viewWidth && maxHeight != 0) {
                        //new line
                        curX = 0;
                        curY += Math.ceil(maxHeight) + this._lineGap;
                        maxHeight = 0;
                        j = 0;
                        k++;

                        if (this._lineCount != 0 && k >= this._lineCount
                            || this._lineCount == 0 && curY + child.height > viewHeight && maxWidth != 0)//new page
                        {
                            page++;
                            curY = 0;
                            k = 0;
                        }
                    }
                    child.setPosition(page * viewWidth + curX, curY);
                    curX += Math.ceil(child.width);
                    if (curX > maxWidth)
                        maxWidth = curX;
                    if (child.height > maxHeight)
                        maxHeight = child.height;
                    j++;
                }
            }
            ch = page > 0 ? viewHeight : curY + Math.ceil(maxHeight);
            cw = (page + 1) * viewWidth;
        }

        this.handleAlign(cw, ch);
        this.setBounds(0, 0, cw, ch);
    }

    public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
        super.setup_beforeAdd(buffer, beginPos);

        buffer.seek(beginPos, 5);

        this._layout = buffer.readByte();
        this._selectionMode = buffer.readByte();
        this._align = buffer.readByte();
        this._verticalAlign = buffer.readByte();
        this._lineGap = buffer.readShort();
        this._columnGap = buffer.readShort();
        this._lineCount = buffer.readShort();
        this._columnCount = buffer.readShort();
        this._autoResizeItem = buffer.readBool();
        this._childrenRenderOrder = buffer.readByte();
        this._apexIndex = buffer.readShort();

        if (buffer.readBool()) {
            this._margin.top = buffer.readInt();
            this._margin.bottom = buffer.readInt();
            this._margin.left = buffer.readInt();
            this._margin.right = buffer.readInt();
        }

        var overflow: number = buffer.readByte();
        if (overflow == OverflowType.Scroll) {
            var savedPos: number = buffer.position;
            buffer.seek(beginPos, 7);
            this.setupScroll(buffer);
            buffer.position = savedPos;
        }
        else
            this.setupOverflow(overflow);

        if (buffer.readBool()) //clipSoftness
            buffer.skip(8);

        if (buffer.version >= 2) {
            this.scrollItemToViewOnClick = buffer.readBool();
            this.foldInvisibleItems = buffer.readBool();
        }

        buffer.seek(beginPos, 8);

        this._defaultItem = buffer.readS();
        this.readItems(buffer);
    }

    protected readItems(buffer: ByteBuffer): void {
        var cnt: number;
        var i: number;
        var nextPos: number;
        var str: string;

        cnt = buffer.readShort();
        for (i = 0; i < cnt; i++) {
            nextPos = buffer.readShort();
            nextPos += buffer.position;

            str = buffer.readS();
            if (str == null) {
                str = this._defaultItem;
                if (!str) {
                    buffer.position = nextPos;
                    continue;
                }
            }

            var obj: GObject = this.getFromPool(str);
            if (obj) {
                this.addChild(obj);
                this.setupItem(buffer, obj);
            }

            buffer.position = nextPos;
        }
    }

    protected setupItem(buffer: ByteBuffer, obj: GObject): void {
        var str: string;

        str = buffer.readS();
        if (str != null)
            obj.text = str;
        str = buffer.readS();
        if (str != null && (obj instanceof GButton))
            obj.selectedTitle = str;
        str = buffer.readS();
        if (str != null)
            obj.icon = str;
        str = buffer.readS();
        if (str != null && (obj instanceof GButton))
            obj.selectedIcon = str;
        str = buffer.readS();
        if (str != null)
            obj.name = str;

        var cnt: number;
        var i: number;

        if (obj instanceof GComponent) {
            cnt = buffer.readShort();
            for (i = 0; i < cnt; i++) {
                var cc: Controller = obj.getController(buffer.readS());
                str = buffer.readS();
                if (cc)
                    cc.selectedPageId = str;
            }

            if (buffer.version >= 2) {
                cnt = buffer.readShort();
                for (i = 0; i < cnt; i++) {
                    var target: string = buffer.readS();
                    var propertyId: number = buffer.readShort();
                    var value: String = buffer.readS();
                    var obj2: GObject = obj.getChildByPath(target);
                    if (obj2)
                        obj2.setProp(propertyId, value);
                }
            }
        }
    }

    public setup_afterAdd(buffer: ByteBuffer, beginPos: number): void {
        super.setup_afterAdd(buffer, beginPos);

        buffer.seek(beginPos, 6);

        var i: number = buffer.readShort();
        if (i != -1)
            this._selectionController = this.parent.getControllerAt(i);
    }
}

interface ItemInfo {
    width: number;
    height: number;
    obj?: GObject;
    updateFlag: number;
    selected?: boolean;
}

var s_n: number = 0;