declare namespace fgui {
    class AsyncOperation {
        callback: (obj: GObject) => void;
        private _node;
        createObject(pkgName: string, resName: string): void;
        createObjectFromURL(url: string): void;
        cancel(): void;
        private internalCreateObject(item);
        private completed(result);
    }
}
declare namespace fgui {
    class Controller extends cc.EventTarget {
        private _selectedIndex;
        private _previousIndex;
        private _pageIds;
        private _pageNames;
        private _actions;
        name: string;
        parent: GComponent;
        autoRadioGroupDepth: boolean;
        changing: boolean;
        private static _nextPageId;
        constructor();
        dispose(): void;
        selectedIndex: number;
        onChanged(callback: Function, target: any): void;
        offChanged(callback: Function, target: any): void;
        setSelectedIndex(value: number): void;
        readonly previsousIndex: number;
        selectedPage: string;
        setSelectedPage(value: string): void;
        readonly previousPage: string;
        readonly pageCount: number;
        getPageName(index: number): string;
        addPage(name?: string): void;
        addPageAt(name: string, index: number): void;
        removePage(name: string): void;
        removePageAt(index: number): void;
        clearPages(): void;
        hasPage(aName: string): boolean;
        getPageIndexById(aId: string): number;
        getPageIdByName(aName: string): string;
        getPageNameById(aId: string): string;
        getPageId(index: number): string;
        selectedPageId: string;
        oppositePageId: string;
        readonly previousPageId: string;
        runActions(): void;
        setup(buffer: ByteBuffer): void;
    }
}
declare namespace fgui {
    class DragDropManager {
        private _agent;
        private _sourceData;
        private static _inst;
        static readonly inst: DragDropManager;
        constructor();
        readonly dragAgent: GObject;
        readonly dragging: boolean;
        startDrag(source: GObject, icon: string, sourceData?: any, touchId?: number): void;
        cancel(): void;
        private onDragEnd();
    }
}
declare namespace fgui {
    enum ButtonMode {
        Common = 0,
        Check = 1,
        Radio = 2,
    }
    enum AutoSizeType {
        None = 0,
        Both = 1,
        Height = 2,
        Shrink = 3,
    }
    enum AlignType {
        Left = 0,
        Center = 1,
        Right = 2,
    }
    enum VertAlignType {
        Top = 0,
        Middle = 1,
        Bottom = 2,
    }
    enum LoaderFillType {
        None = 0,
        Scale = 1,
        ScaleMatchHeight = 2,
        ScaleMatchWidth = 3,
        ScaleFree = 4,
        ScaleNoBorder = 5,
    }
    enum ListLayoutType {
        SingleColumn = 0,
        SingleRow = 1,
        FlowHorizontal = 2,
        FlowVertical = 3,
        Pagination = 4,
    }
    enum ListSelectionMode {
        Single = 0,
        Multiple = 1,
        Multiple_SingleClick = 2,
        None = 3,
    }
    enum OverflowType {
        Visible = 0,
        Hidden = 1,
        Scroll = 2,
    }
    enum PackageItemType {
        Image = 0,
        MovieClip = 1,
        Sound = 2,
        Component = 3,
        Atlas = 4,
        Font = 5,
        Swf = 6,
        Misc = 7,
        Unknown = 8,
    }
    enum ObjectType {
        Image = 0,
        MovieClip = 1,
        Swf = 2,
        Graph = 3,
        Loader = 4,
        Group = 5,
        Text = 6,
        RichText = 7,
        InputText = 8,
        Component = 9,
        List = 10,
        Label = 11,
        Button = 12,
        ComboBox = 13,
        ProgressBar = 14,
        Slider = 15,
        ScrollBar = 16,
    }
    enum ProgressTitleType {
        Percent = 0,
        ValueAndMax = 1,
        Value = 2,
        Max = 3,
    }
    enum ScrollBarDisplayType {
        Default = 0,
        Visible = 1,
        Auto = 2,
        Hidden = 3,
    }
    enum ScrollType {
        Horizontal = 0,
        Vertical = 1,
        Both = 2,
    }
    enum FlipType {
        None = 0,
        Horizontal = 1,
        Vertical = 2,
        Both = 3,
    }
    enum ChildrenRenderOrder {
        Ascent = 0,
        Descent = 1,
        Arch = 2,
    }
    enum GroupLayoutType {
        None = 0,
        Horizontal = 1,
        Vertical = 2,
    }
    enum PopupDirection {
        Auto = 0,
        Up = 1,
        Down = 2,
    }
    enum RelationType {
        Left_Left = 0,
        Left_Center = 1,
        Left_Right = 2,
        Center_Center = 3,
        Right_Left = 4,
        Right_Center = 5,
        Right_Right = 6,
        Top_Top = 7,
        Top_Middle = 8,
        Top_Bottom = 9,
        Middle_Middle = 10,
        Bottom_Top = 11,
        Bottom_Middle = 12,
        Bottom_Bottom = 13,
        Width = 14,
        Height = 15,
        LeftExt_Left = 16,
        LeftExt_Right = 17,
        RightExt_Left = 18,
        RightExt_Right = 19,
        TopExt_Top = 20,
        TopExt_Bottom = 21,
        BottomExt_Top = 22,
        BottomExt_Bottom = 23,
        Size = 24,
    }
    enum GraphType {
        PlaceHolder = 0,
        Rect = 1,
        Ellipse = 2,
    }
    enum FillMethod {
        None = 0,
        Horizontal = 1,
        Vertical = 2,
        Radial90 = 3,
        Radial180 = 4,
        Radial360 = 5,
    }
    enum FillOrigin {
        Top = 0,
        Bottom = 1,
        Left = 2,
        Right = 3,
    }
}
declare namespace fgui {
    class GObject {
        data: any;
        packageItem: PackageItem;
        static draggingObject: GObject;
        protected _x: number;
        protected _y: number;
        protected _alpha: number;
        protected _visible: boolean;
        protected _touchable: boolean;
        protected _grayed: boolean;
        protected _draggable: boolean;
        protected _skewX: number;
        protected _skewY: number;
        protected _pivotAsAnchor: boolean;
        protected _sortingOrder: number;
        protected _internalVisible: boolean;
        protected _handlingController: boolean;
        protected _tooltips: string;
        protected _blendMode: BlendMode;
        protected _pixelSnapping: boolean;
        protected _dragTesting: boolean;
        protected _dragStartPoint: cc.Vec2;
        protected _relations: Relations;
        protected _group: GGroup;
        protected _gears: GearBase[];
        protected _node: cc.Node;
        protected _dragBounds: cc.Rect;
        sourceWidth: number;
        sourceHeight: number;
        initWidth: number;
        initHeight: number;
        minWidth: number;
        minHeight: number;
        maxWidth: number;
        maxHeight: number;
        _parent: GComponent;
        _width: number;
        _height: number;
        _rawWidth: number;
        _rawHeight: number;
        _id: string;
        _name: string;
        _underConstruct: boolean;
        _gearLocked: boolean;
        _sizePercentInGroup: number;
        _touchDisabled: boolean;
        _partner: GObjectPartner;
        static _defaultGroupIndex: number;
        constructor();
        readonly id: string;
        name: string;
        x: number;
        y: number;
        setPosition(xv: number, yv: number): void;
        xMin: number;
        yMin: number;
        pixelSnapping: boolean;
        center(restraint?: boolean): void;
        width: number;
        height: number;
        setSize(wv: number, hv: number, ignorePivot?: boolean): void;
        makeFullScreen(): void;
        ensureSizeCorrect(): void;
        readonly actualWidth: number;
        readonly actualHeight: number;
        scaleX: number;
        scaleY: number;
        setScale(sx: number, sy: number): void;
        skewX: number;
        skewY: number;
        setSkew(xv: number, yv: number): void;
        pivotX: number;
        pivotY: number;
        setPivot(xv: number, yv: number, asAnchor?: boolean): void;
        readonly pivotAsAnchor: boolean;
        touchable: boolean;
        grayed: boolean;
        enabled: boolean;
        rotation: number;
        alpha: number;
        visible: boolean;
        readonly _finalVisible: boolean;
        sortingOrder: number;
        requestFocus(): void;
        tooltips: string;
        blendMode: BlendMode;
        readonly onStage: boolean;
        readonly resourceURL: string;
        group: GGroup;
        getGear(index: number): GearBase;
        protected updateGear(index: number): void;
        checkGearController(index: number, c: Controller): boolean;
        updateGearFromRelations(index: number, dx: number, dy: number): void;
        addDisplayLock(): number;
        releaseDisplayLock(token: number): void;
        private checkGearDisplay();
        readonly gearXY: GearXY;
        readonly gearSize: GearSize;
        readonly gearLook: GearLook;
        readonly relations: Relations;
        addRelation(target: GObject, relationType: number, usePercent?: boolean): void;
        removeRelation(target: GObject, relationType: number): void;
        readonly node: cc.Node;
        readonly parent: GComponent;
        removeFromParent(): void;
        readonly root: GRoot;
        readonly asCom: GComponent;
        readonly asButton: GButton;
        readonly asLabel: GLabel;
        readonly asProgress: GProgressBar;
        readonly asTextField: GTextField;
        readonly asRichTextField: GRichTextField;
        readonly asTextInput: GTextInput;
        readonly asLoader: GLoader;
        readonly asList: GList;
        readonly asGraph: GGraph;
        readonly asGroup: GGroup;
        readonly asSlider: GSlider;
        readonly asComboBox: GComboBox;
        readonly asImage: GImage;
        readonly asMovieClip: GMovieClip;
        static cast(obj: cc.Node): GObject;
        text: string;
        icon: string;
        dispose(): void;
        protected onEnable(): void;
        protected onDisable(): void;
        protected onUpdate(): void;
        protected onDestroy(): void;
        onClick(listener: Function, target: any): void;
        offClick(listener: Function, target: any): void;
        hasClickListener(): boolean;
        on(type: string, listener: Function, target: any): void;
        off(type: string, listener: Function, target: any): void;
        draggable: boolean;
        dragBounds: cc.Rect;
        startDrag(touchId?: number): void;
        stopDrag(): void;
        readonly dragging: boolean;
        localToGlobal(ax?: number, ay?: number, resultPoint?: cc.Vec2): cc.Vec2;
        globalToLocal(ax?: number, ay?: number, resultPoint?: cc.Vec2): cc.Vec2;
        localToGlobalRect(ax?: number, ay?: number, aw?: number, ah?: number, resultRect?: cc.Rect): cc.Rect;
        globalToLocalRect(ax?: number, ay?: number, aw?: number, ah?: number, resultRect?: cc.Rect): cc.Rect;
        handleControllerChanged(c: Controller): void;
        protected handleAnchorChanged(): void;
        handlePositionChanged(): void;
        protected handleSizeChanged(): void;
        protected handleGrayedChanged(): void;
        protected handleVisibleChanged(): void;
        hitTest(globalPt: cc.Vec2): GObject;
        constructFromResource(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        private static sGlobalDragStart;
        private static sGlobalRect;
        private static sHelperPoint;
        private static sDragHelperRect;
        private static sUpdateInDragging;
        private static sDragQuery;
        private initDrag();
        private dragBegin(touchId);
        private dragEnd();
        private onTouchBegin_0(evt);
        private onTouchMove_0(evt);
        private onTouchEnd_0(evt);
    }
    class GObjectPartner extends cc.Component {
        gOwner: GObject;
        _emitDisplayEvents: boolean;
        callLater(callback: Function, delay?: number): void;
        onClickLink(evt: Event, text: string): void;
        protected onEnable(): void;
        protected onDisable(): void;
        protected update(dt: any): void;
        protected onDestroy(): void;
    }
}
declare namespace fgui {
    class GComponent extends GObject {
        hitArea: IHitTest;
        private _sortingChildCount;
        private _opaque;
        private _applyingController;
        private _rectMask;
        private _maskContent;
        protected _margin: Margin;
        protected _trackBounds: boolean;
        protected _boundsChanged: boolean;
        protected _childrenRenderOrder: ChildrenRenderOrder;
        protected _apexIndex: number;
        _buildingDisplayList: boolean;
        _children: Array<GObject>;
        _controllers: Array<Controller>;
        _transitions: Array<Transition>;
        _container: cc.Node;
        _scrollPane: ScrollPane;
        _alignOffset: cc.Vec2;
        _customMask: cc.Mask;
        constructor();
        dispose(): void;
        readonly displayListContainer: cc.Node;
        addChild(child: GObject): GObject;
        addChildAt(child: GObject, index: number): GObject;
        private getInsertPosForSortingChild(target);
        removeChild(child: GObject, dispose?: boolean): GObject;
        removeChildAt(index: number, dispose?: boolean): GObject;
        removeChildren(beginIndex?: number, endIndex?: number, dispose?: boolean): void;
        getChildAt(index: number): GObject;
        getChild(name: string): GObject;
        getVisibleChild(name: string): GObject;
        getChildInGroup(name: string, group: GGroup): GObject;
        getChildById(id: string): GObject;
        getChildIndex(child: GObject): number;
        setChildIndex(child: GObject, index: number): void;
        setChildIndexBefore(child: GObject, index: number): number;
        private _setChildIndex(child, oldIndex, index);
        swapChildren(child1: GObject, child2: GObject): void;
        swapChildrenAt(index1: number, index2: number): void;
        readonly numChildren: number;
        isAncestorOf(child: GObject): boolean;
        addController(controller: Controller): void;
        getControllerAt(index: number): Controller;
        getController(name: string): Controller;
        removeController(c: Controller): void;
        readonly controllers: Array<Controller>;
        private onChildAdd(child, index);
        private buildNativeDisplayList(dt?);
        applyController(c: Controller): void;
        applyAllControllers(): void;
        adjustRadioGroupDepth(obj: GObject, c: Controller): void;
        getTransitionAt(index: number): Transition;
        getTransition(transName: string): Transition;
        isChildInView(child: GObject): boolean;
        getFirstChildInView(): number;
        readonly scrollPane: ScrollPane;
        opaque: boolean;
        margin: Margin;
        childrenRenderOrder: ChildrenRenderOrder;
        apexIndex: number;
        mask: GObject;
        setMask(value: GObject, inverted: boolean): void;
        private onMaskReady();
        private onMaskContentChanged();
        readonly _pivotCorrectX: number;
        readonly _pivotCorrectY: number;
        readonly baseUserData: string;
        protected setupScroll(buffer: ByteBuffer): void;
        protected setupOverflow(overflow: OverflowType): void;
        protected handleAnchorChanged(): void;
        protected handleSizeChanged(): void;
        protected handleGrayedChanged(): void;
        handleControllerChanged(c: Controller): void;
        hitTest(globalPt: cc.Vec2): GObject;
        setBoundsChangedFlag(): void;
        private refresh(dt?);
        ensureBoundsCorrect(): void;
        protected updateBounds(): void;
        setBounds(ax: number, ay: number, aw: number, ah?: number): void;
        viewWidth: number;
        viewHeight: number;
        getSnappingPosition(xValue: number, yValue: number, resultPoint?: cc.Vec2): cc.Vec2;
        childSortingOrderChanged(child: GObject, oldValue: number, newValue?: number): void;
        constructFromResource(): void;
        constructFromResource2(objectPool: Array<GObject>, poolIndex: number): void;
        protected constructExtension(buffer: ByteBuffer): void;
        protected onConstruct(): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        protected onEnable(): void;
        protected onDisable(): void;
    }
}
declare namespace fgui {
    class GButton extends GComponent {
        private _titleObject;
        private _iconObject;
        private _relatedController;
        private _relatedPageId;
        private _mode;
        private _selected;
        private _title;
        private _selectedTitle;
        private _icon;
        private _selectedIcon;
        private _sound;
        private _soundVolumeScale;
        private _buttonController;
        private _changeStateOnClick;
        private _linkedPopup;
        private _downEffect;
        private _downEffectValue;
        private _downScaled;
        private _down;
        private _over;
        static UP: string;
        static DOWN: string;
        static OVER: string;
        static SELECTED_OVER: string;
        static DISABLED: string;
        static SELECTED_DISABLED: string;
        constructor();
        icon: string;
        selectedIcon: string;
        title: string;
        text: string;
        selectedTitle: string;
        titleColor: cc.Color;
        titleFontSize: number;
        sound: string;
        soundVolumeScale: number;
        selected: boolean;
        mode: ButtonMode;
        relatedController: Controller;
        relatedPageId: string;
        changeStateOnClick: boolean;
        linkedPopup: GObject;
        getTextField(): GTextField;
        fireClick(): void;
        protected setState(val: string): void;
        protected setCurrentState(): void;
        handleControllerChanged(c: Controller): void;
        protected handleGrayedChanged(): void;
        protected constructExtension(buffer: ByteBuffer): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        private onRollOver_1();
        private onRollOut_1();
        private onTouchBegin_1(evt);
        private onTouchEnd_1(evt);
        private onClick_1();
    }
}
declare namespace fgui {
    class GComboBox extends GComponent {
        dropdown: GComponent;
        protected _titleObject: GObject;
        protected _iconObject: GObject;
        protected _list: GList;
        private _items;
        private _values;
        private _icons;
        private _visibleItemCount;
        private _itemsUpdated;
        private _selectedIndex;
        private _buttonController;
        private _popupDirection;
        private _selectionController;
        private _over;
        private _down;
        constructor();
        text: string;
        icon: string;
        titleColor: cc.Color;
        titleFontSize: number;
        visibleItemCount: number;
        popupDirection: PopupDirection;
        items: Array<string>;
        icons: Array<string>;
        values: Array<string>;
        selectedIndex: number;
        value: string;
        selectionController: Controller;
        getTextField(): GTextField;
        protected setState(val: string): void;
        protected constructExtension(buffer: ByteBuffer): void;
        handleControllerChanged(c: Controller): void;
        private updateSelectionController();
        dispose(): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        protected showDropdown(): void;
        private onPopupClosed();
        private onClickItem(itemObject);
        private onClickItem2(index);
        private onRollOver_1();
        private onRollOut_1();
        private onTouchBegin_1(evt);
        private onTouchEnd_1(evt);
    }
}
declare namespace fgui {
    class GGraph extends GObject {
        _content: cc.Graphics;
        private _type;
        private _lineSize;
        private _lineColor;
        private _fillColor;
        private _cornerRadius;
        constructor();
        drawRect(lineSize: number, lineColor: cc.Color, fillColor: cc.Color, corner?: Array<number>): void;
        drawEllipse(lineSize: number, lineColor: cc.Color, fillColor: cc.Color): void;
        clearGraphics(): void;
        readonly type: GraphType;
        color: cc.Color;
        private drawCommon();
        protected handleSizeChanged(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GGroup extends GObject {
        private _layout;
        private _lineGap;
        private _columnGap;
        private _percentReady;
        private _boundsChanged;
        _updating: number;
        constructor();
        layout: number;
        lineGap: number;
        columnGap: number;
        setBoundsChangedFlag(childSizeChanged?: boolean): void;
        private _ensureBoundsCorrect();
        ensureBoundsCorrect(): void;
        private updateBounds();
        private handleLayout();
        private updatePercent();
        moveChildren(dx: number, dy: number): void;
        resizeChildren(dw: number, dh: number): void;
        setChildrenAlpha(): void;
        setChildrenVisible(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GImage extends GObject {
        _content: Image;
        constructor();
        color: cc.Color;
        flip: FlipType;
        fillMethod: FillMethod;
        fillOrigin: FillOrigin;
        fillClockwise: boolean;
        fillAmount: number;
        constructFromResource(): void;
        protected handleGrayedChanged(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GLabel extends GComponent {
        protected _titleObject: GObject;
        protected _iconObject: GObject;
        constructor();
        icon: string;
        title: string;
        text: string;
        titleColor: cc.Color;
        color: cc.Color;
        titleFontSize: number;
        editable: boolean;
        getTextField(): GTextField;
        protected constructExtension(buffer: ByteBuffer): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GList extends GComponent {
        itemRenderer: (index: number, item: GObject) => void;
        itemProvider: (index: number) => string;
        scrollItemToViewOnClick: boolean;
        foldInvisibleItems: boolean;
        private _layout;
        private _lineCount;
        private _columnCount;
        private _lineGap;
        private _columnGap;
        private _defaultItem;
        private _autoResizeItem;
        private _selectionMode;
        private _align;
        private _verticalAlign;
        private _selectionController;
        private _lastSelectedIndex;
        private _pool;
        private _virtual;
        private _loop;
        private _numItems;
        private _realNumItems;
        private _firstIndex;
        private _curLineItemCount;
        private _curLineItemCount2;
        private _itemSize;
        private _virtualListChanged;
        private _virtualItems;
        private _eventLocked;
        private itemInfoVer;
        constructor();
        dispose(): void;
        layout: ListLayoutType;
        lineCount: number;
        columnCount: number;
        lineGap: number;
        columnGap: number;
        align: AlignType;
        verticalAlign: VertAlignType;
        virtualItemSize: cc.Size;
        defaultItem: string;
        autoResizeItem: boolean;
        selectionMode: ListSelectionMode;
        selectionController: Controller;
        readonly itemPool: GObjectPool;
        getFromPool(url?: string): GObject;
        returnToPool(obj: GObject): void;
        addChildAt(child: GObject, index?: number): GObject;
        addItem(url?: string): GObject;
        addItemFromPool(url?: string): GObject;
        removeChildAt(index: number, dispose?: boolean): GObject;
        removeChildToPoolAt(index: number): void;
        removeChildToPool(child: GObject): void;
        removeChildrenToPool(beginIndex?: number, endIndex?: number): void;
        selectedIndex: number;
        getSelection(): Array<number>;
        addSelection(index: number, scrollItToView?: boolean): void;
        removeSelection(index: number): void;
        clearSelection(): void;
        private clearSelectionExcept(g);
        selectAll(): void;
        selectNone(): void;
        selectReverse(): void;
        handleArrowKey(dir: number): void;
        private onClickItem(evt);
        private setSelectionOnEvent(item, evt);
        resizeToFit(itemCount?: number, minSize?: number): void;
        getMaxItemWidth(): number;
        protected handleSizeChanged(): void;
        handleControllerChanged(c: Controller): void;
        private updateSelectionController(index);
        getSnappingPosition(xValue: number, yValue: number, resultPoint?: cc.Vec2): cc.Vec2;
        scrollToView(index: number, ani?: boolean, setFirst?: boolean): void;
        getFirstChildInView(): number;
        childIndexToItemIndex(index: number): number;
        itemIndexToChildIndex(index: number): number;
        setVirtual(): void;
        setVirtualAndLoop(): void;
        private _setVirtual(loop);
        numItems: number;
        refreshVirtualList(): void;
        private checkVirtualList();
        private setVirtualListChangedFlag(layoutChanged);
        private _refreshVirtualList(dt?);
        private __scrolled(evt);
        private getIndexOnPos1(forceUpdate);
        private getIndexOnPos2(forceUpdate);
        private getIndexOnPos3(forceUpdate);
        private handleScroll(forceUpdate);
        private static pos_param;
        private handleScroll1(forceUpdate);
        private handleScroll2(forceUpdate);
        private handleScroll3(forceUpdate);
        private handleArchOrder1();
        private handleArchOrder2();
        private handleAlign(contentWidth, contentHeight);
        protected updateBounds(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GObjectPool {
        private _pool;
        private _count;
        constructor();
        clear(): void;
        readonly count: number;
        getObject(url: string): GObject;
        returnObject(obj: GObject): void;
    }
}
declare namespace fgui {
    class GLoader extends GObject {
        _content: MovieClip;
        private _url;
        private _align;
        private _verticalAlign;
        private _autoSize;
        private _fill;
        private _shrinkOnly;
        private _showErrorSign;
        private _playing;
        private _frame;
        private _color;
        private _contentItem;
        private _contentSourceWidth;
        private _contentSourceHeight;
        private _contentWidth;
        private _contentHeight;
        private _container;
        private _errorSign;
        private _content2;
        private _updatingLayout;
        private static _errorSignPool;
        constructor();
        dispose(): void;
        url: string;
        icon: string;
        align: AlignType;
        verticalAlign: VertAlignType;
        fill: LoaderFillType;
        shrinkOnly: boolean;
        autoSize: boolean;
        playing: boolean;
        frame: number;
        timeScale: number;
        advance(timeInMiniseconds: number): void;
        color: cc.Color;
        fillMethod: FillMethod;
        fillOrigin: FillOrigin;
        fillClockwise: boolean;
        fillAmount: number;
        showErrorSign: boolean;
        readonly component: GComponent;
        texture: cc.SpriteFrame;
        protected loadContent(): void;
        protected loadFromPackage(itemURL: string): void;
        protected loadExternal(): void;
        private onLoaded(err, asset);
        protected freeExternal(texture: cc.SpriteFrame): void;
        protected onExternalLoadSuccess(texture: cc.SpriteFrame): void;
        protected onExternalLoadFailed(): void;
        private setErrorState();
        private clearErrorState();
        private updateLayout();
        private clearContent();
        protected handleSizeChanged(): void;
        protected handleGrayedChanged(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GMovieClip extends GObject {
        _content: MovieClip;
        constructor();
        color: cc.Color;
        playing: boolean;
        frame: number;
        timeScale: number;
        rewind(): void;
        syncStatus(anotherMc: GMovieClip): void;
        advance(timeInMiniseconds: number): void;
        setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: Function, callbackObj?: any): void;
        protected handleGrayedChanged(): void;
        constructFromResource(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GProgressBar extends GComponent {
        private _max;
        private _value;
        private _titleType;
        private _reverse;
        private _titleObject;
        private _aniObject;
        private _barObjectH;
        private _barObjectV;
        private _barMaxWidth;
        private _barMaxHeight;
        private _barMaxWidthDelta;
        private _barMaxHeightDelta;
        private _barStartX;
        private _barStartY;
        private _tweening;
        constructor();
        titleType: ProgressTitleType;
        max: number;
        value: number;
        tweenValue(value: number, duration: number): GTweener;
        update(newValue: number): void;
        protected constructExtension(buffer: ByteBuffer): void;
        protected handleSizeChanged(): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        protected onDestroy(): void;
    }
}
declare namespace fgui {
    class GTextField extends GObject {
        _label: cc.Label;
        protected _font: string;
        protected _fontSize: number;
        protected _color: cc.Color;
        protected _leading: number;
        protected _text: string;
        protected _ubbEnabled: boolean;
        protected _templateVars: any;
        protected _autoSize: AutoSizeType;
        protected _updatingSize: boolean;
        protected _sizeDirty: boolean;
        protected _outline: cc.LabelOutline;
        constructor();
        protected createRenderer(): void;
        text: string;
        font: string;
        fontSize: number;
        color: cc.Color;
        align: cc.Label.HorizontalAlign;
        verticalAlign: cc.Label.VerticalAlign;
        leading: number;
        letterSpacing: number;
        underline: boolean;
        bold: boolean;
        italic: boolean;
        singleLine: boolean;
        stroke: number;
        strokeColor: cc.Color;
        ubbEnabled: boolean;
        autoSize: AutoSizeType;
        protected parseTemplate(template: string): string;
        templateVars: any;
        setVar(name: string, value: string): GTextField;
        flushVars(): void;
        readonly textWidth: number;
        ensureSizeCorrect(): void;
        protected updateText(): void;
        protected updateFont(value: string | cc.Font): void;
        protected updateFontColor(): void;
        protected updateFontSize(): void;
        protected updateOverflow(): void;
        protected markSizeChanged(): void;
        protected onLabelSizeChanged(): void;
        protected handleSizeChanged(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class RichTextImageAtlas extends cc.SpriteAtlas {
        getSpriteFrame(key: string): cc.SpriteFrame;
    }
    class GRichTextField extends GTextField {
        _richText: cc.RichText;
        private _bold;
        private _italics;
        private _underline;
        linkUnderline: boolean;
        linkColor: string;
        static imageAtlas: RichTextImageAtlas;
        constructor();
        protected createRenderer(): void;
        align: cc.Label.HorizontalAlign;
        verticalAlign: cc.Label.VerticalAlign;
        letterSpacing: number;
        underline: boolean;
        bold: boolean;
        italic: boolean;
        singleLine: boolean;
        protected markSizeChanged(): void;
        protected updateText(): void;
        protected updateFont(value: string | cc.Font): void;
        protected updateFontColor(): void;
        protected updateFontSize(): void;
        protected updateOverflow(): void;
        protected handleSizeChanged(): void;
    }
}
declare namespace fgui {
    class GRoot extends GComponent {
        private _modalLayer;
        private _popupStack;
        private _justClosedPopups;
        private _modalWaitPane;
        private _tooltipWin;
        private _defaultTooltipWin;
        private _volumeScale;
        private _inputProcessor;
        private _thisOnResized;
        private static _inst;
        static readonly inst: GRoot;
        static create(): GRoot;
        constructor();
        protected onDestroy(): void;
        getTouchPosition(touchId?: number): cc.Vec2;
        readonly touchTarget: GObject;
        readonly inputProcessor: InputProcessor;
        showWindow(win: Window): void;
        hideWindow(win: Window): void;
        hideWindowImmediately(win: Window): void;
        bringToFront(win: Window): void;
        showModalWait(msg?: string): void;
        closeModalWait(): void;
        closeAllExceptModals(): void;
        closeAllWindows(): void;
        getTopWindow(): Window;
        readonly modalLayer: GGraph;
        readonly hasModalWindow: boolean;
        readonly modalWaiting: boolean;
        getPopupPosition(popup: GObject, target?: GObject, downward?: any, result?: cc.Vec2): cc.Vec2;
        showPopup(popup: GObject, target?: GObject, downward?: any): void;
        togglePopup(popup: GObject, target?: GObject, downward?: any): void;
        hidePopup(popup?: GObject): void;
        readonly hasAnyPopup: boolean;
        private closePopup(target);
        showTooltips(msg: string): void;
        showTooltipsWin(tooltipWin: GObject): void;
        hideTooltips(): void;
        volumeScale: number;
        playOneShotSound(clip: cc.AudioClip, volumeScale?: number): void;
        private adjustModalLayer();
        private onTouchBegin_1(evt);
        private onWinResize();
        handlePositionChanged(): void;
    }
}
declare namespace fgui {
    class GScrollBar extends GComponent {
        private _grip;
        private _arrowButton1;
        private _arrowButton2;
        private _bar;
        private _target;
        private _vertical;
        private _scrollPerc;
        private _fixedGripSize;
        private _dragOffset;
        constructor();
        setScrollPane(target: ScrollPane, vertical: boolean): void;
        displayPerc: number;
        scrollPerc: number;
        readonly minSize: number;
        protected constructExtension(buffer: ByteBuffer): void;
        private onGripTouchDown(evt);
        private static sScrollbarHelperPoint;
        private onGripTouchMove(evt);
        private onClickArrow1(evt);
        private onClickArrow2(evt);
        private onBarTouchBegin(evt);
    }
}
declare namespace fgui {
    class GSlider extends GComponent {
        private _max;
        private _value;
        private _titleType;
        private _reverse;
        private _titleObject;
        private _barObjectH;
        private _barObjectV;
        private _barMaxWidth;
        private _barMaxHeight;
        private _barMaxWidthDelta;
        private _barMaxHeightDelta;
        private _gripObject;
        private _clickPos;
        private _clickPercent;
        private _barStartX;
        private _barStartY;
        changeOnClick: boolean;
        canDrag: boolean;
        constructor();
        titleType: ProgressTitleType;
        max: number;
        value: number;
        update(): void;
        private updateWidthPercent(percent);
        protected constructExtension(buffer: ByteBuffer): void;
        protected handleSizeChanged(): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        private onGripTouchBegin(evt);
        private static sSilderHelperPoint;
        private onGripTouchMove(evt);
        private onBarTouchBegin(evt);
    }
}
declare namespace fgui {
    class GTextInput extends GTextField {
        _editBox: cc.EditBox;
        private _promptText;
        constructor();
        protected createRenderer(): void;
        editable: boolean;
        maxLength: number;
        promptText: string;
        restrict: string;
        password: boolean;
        align: cc.Label.HorizontalAlign;
        verticalAlign: cc.Label.VerticalAlign;
        letterSpacing: number;
        singleLine: boolean;
        requestFocus(): void;
        protected markSizeChanged(): void;
        protected updateText(): void;
        protected updateFont(value: string | cc.Font): void;
        protected updateFontColor(): void;
        protected updateFontSize(): void;
        protected updateOverflow(): void;
        private onTextChanged();
        private onEditingBegan();
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    interface IUISource {
        fileName: string;
        loaded: boolean;
        load(callback: Function, thisObj: any): void;
    }
}
declare namespace fgui {
    class Margin {
        left: number;
        right: number;
        top: number;
        bottom: number;
        constructor();
        copy(source: Margin): void;
        isNone(): boolean;
    }
}
declare namespace fgui {
    class PackageItem {
        owner: UIPackage;
        type: PackageItemType;
        objectType: ObjectType;
        id: string;
        name: string;
        width: number;
        height: number;
        file: string;
        decoded: boolean;
        rawData: ByteBuffer;
        asset: cc.Texture2D | cc.SpriteFrame | cc.AudioClip | cc.LabelAtlas;
        scale9Grid: cc.Rect;
        scaleByTile: boolean;
        tileGridIndice: number;
        smoothing: boolean;
        hitTestData: PixelHitTestData;
        interval: number;
        repeatDelay: number;
        swing: boolean;
        frames: Array<Frame>;
        extensionType: any;
        constructor();
        load(): any;
        toString(): string;
    }
}
declare namespace fgui {
    class PopupMenu {
        protected _contentPane: GComponent;
        protected _list: GList;
        constructor(url?: string);
        dispose(): void;
        addItem(caption: string, callback?: (item?: fgui.GObject, evt?: fgui.Event) => void): GButton;
        addItemAt(caption: string, index: number, callback?: (item?: fgui.GObject, evt?: fgui.Event) => void): GButton;
        addSeperator(): void;
        getItemName(index: number): string;
        setItemText(name: string, caption: string): void;
        setItemVisible(name: string, visible: boolean): void;
        setItemGrayed(name: string, grayed: boolean): void;
        setItemCheckable(name: string, checkable: boolean): void;
        setItemChecked(name: string, checked: boolean): void;
        isItemChecked(name: string): boolean;
        removeItem(name: string): boolean;
        clearItems(): void;
        readonly itemCount: number;
        readonly contentPane: GComponent;
        readonly list: GList;
        show(target?: GObject, downward?: any): void;
        private onClickItem(itemObject, evt);
        private onClickItem2(itemObject, evt);
        private onDisplay();
    }
}
declare namespace fgui {
    class RelationItem {
        private _owner;
        private _target;
        private _defs;
        private _targetX;
        private _targetY;
        private _targetWidth;
        private _targetHeight;
        constructor(owner: GObject);
        readonly owner: GObject;
        target: GObject;
        add(relationType: number, usePercent?: boolean): void;
        internalAdd(relationType: number, usePercent?: boolean): void;
        remove(relationType: number): void;
        copyFrom(source: RelationItem): void;
        dispose(): void;
        readonly isEmpty: boolean;
        applyOnSelfResized(dWidth: number, dHeight: number, applyPivot: boolean): void;
        private applyOnXYChanged(info, dx, dy);
        private applyOnSizeChanged(info);
        private addRefTarget(target);
        private releaseRefTarget(target);
        private __targetXYChanged(evt);
        private __targetSizeChanged(evt);
        private __targetSizeWillChange(evt);
    }
    class RelationDef {
        percent: boolean;
        type: number;
        axis: number;
        constructor();
        copyFrom(source: RelationDef): void;
    }
}
declare namespace fgui {
    class Relations {
        private _owner;
        private _items;
        handling: GObject;
        sizeDirty: boolean;
        constructor(owner: GObject);
        add(target: GObject, relationType: number, usePercent?: boolean): void;
        remove(target: GObject, relationType?: number): void;
        contains(target: GObject): boolean;
        clearFor(target: GObject): void;
        clearAll(): void;
        copyFrom(source: Relations): void;
        dispose(): void;
        onOwnerSizeChanged(dWidth: number, dHeight: number, applyPivot: boolean): void;
        ensureRelationsSizeCorrect(): void;
        readonly empty: boolean;
        setup(buffer: ByteBuffer, parentToChild: boolean): void;
    }
}
declare namespace fgui {
    class ScrollPane extends cc.Component {
        private _owner;
        private _container;
        private _maskContainer;
        private _scrollType;
        private _scrollStep;
        private _mouseWheelStep;
        private _decelerationRate;
        private _scrollBarMargin;
        private _bouncebackEffect;
        private _touchEffect;
        private _scrollBarDisplayAuto;
        private _vScrollNone;
        private _hScrollNone;
        private _needRefresh;
        private _refreshBarAxis;
        private _displayOnLeft;
        private _snapToItem;
        private _displayInDemand;
        private _mouseWheelEnabled;
        private _pageMode;
        private _inertiaDisabled;
        private _xPos;
        private _yPos;
        private _viewSize;
        private _contentSize;
        private _overlapSize;
        private _pageSize;
        private _containerPos;
        private _beginTouchPos;
        private _lastTouchPos;
        private _lastTouchGlobalPos;
        private _velocity;
        private _velocityScale;
        private _lastMoveTime;
        private _isHoldAreaDone;
        private _aniFlag;
        private _scrollBarVisible;
        _loop: number;
        private _headerLockedSize;
        private _footerLockedSize;
        private _refreshEventDispatching;
        private _tweening;
        private _tweenTime;
        private _tweenDuration;
        private _tweenStart;
        private _tweenChange;
        private _pageController;
        private _hzScrollBar;
        private _vtScrollBar;
        private _header;
        private _footer;
        isDragged: boolean;
        static draggingPane: ScrollPane;
        private static _gestureFlag;
        static TWEEN_TIME_GO: number;
        static TWEEN_TIME_DEFAULT: number;
        static PULL_RATIO: number;
        private static sHelperPoint;
        private static sHelperRect;
        private static sEndPos;
        private static sOldChange;
        setup(buffer: ByteBuffer): void;
        protected onDestroy(): void;
        hitTest(globalPt: cc.Vec2): GObject;
        readonly owner: GComponent;
        readonly hzScrollBar: GScrollBar;
        readonly vtScrollBar: GScrollBar;
        readonly header: GComponent;
        readonly footer: GComponent;
        bouncebackEffect: boolean;
        touchEffect: boolean;
        scrollStep: number;
        decelerationRate: number;
        snapToItem: boolean;
        percX: number;
        setPercX(value: number, ani?: boolean): void;
        percY: number;
        setPercY(value: number, ani?: boolean): void;
        posX: number;
        setPosX(value: number, ani?: boolean): void;
        posY: number;
        setPosY(value: number, ani?: boolean): void;
        readonly contentWidth: number;
        readonly contentHeight: number;
        viewWidth: number;
        viewHeight: number;
        currentPageX: number;
        currentPageY: number;
        setCurrentPageX(value: number, ani: boolean): void;
        setCurrentPageY(value: number, ani: boolean): void;
        readonly isBottomMost: boolean;
        readonly isRightMost: boolean;
        pageController: Controller;
        readonly scrollingPosX: number;
        readonly scrollingPosY: number;
        scrollTop(ani?: boolean): void;
        scrollBottom(ani?: boolean): void;
        scrollUp(ratio?: number, ani?: boolean): void;
        scrollDown(ratio?: number, ani?: boolean): void;
        scrollLeft(ratio?: number, ani?: boolean): void;
        scrollRight(ratio?: number, ani?: boolean): void;
        scrollToView(target: any, ani?: boolean, setFirst?: boolean): void;
        isChildInView(obj: GObject): boolean;
        cancelDragging(): void;
        lockHeader(size: number): void;
        lockFooter(size: number): void;
        onOwnerSizeChanged(): void;
        handleControllerChanged(c: Controller): void;
        private updatePageController();
        adjustMaskContainer(): void;
        setSize(aWidth: number, aHeight: number): void;
        setContentSize(aWidth: number, aHeight: number): void;
        changeContentSizeOnScrolling(deltaWidth: number, deltaHeight: number, deltaPosX: number, deltaPosY: number): void;
        private handleSizeChanged(onScrolling?);
        private posChanged(ani);
        private refresh(dt?);
        private refresh2();
        private syncScrollBar(end?);
        private onTouchBegin(evt);
        private onTouchMove(evt);
        private onTouchEnd(evt);
        private onRollOver();
        private onRollOut();
        private onMouseWheel(evt);
        private showScrollBar(val);
        private _showScrollBar(dt);
        private getLoopPartSize(division, axis);
        private loopCheckingCurrent();
        private loopCheckingTarget(endPos);
        private loopCheckingTarget2(endPos, axis);
        private loopCheckingNewPos(value, axis);
        private alignPosition(pos, inertialScrolling);
        private alignByPage(pos, axis, inertialScrolling);
        private updateTargetAndDuration(orignPos, resultPos);
        private updateTargetAndDuration2(pos, axis);
        private fixDuration(axis, oldChange);
        private killTween();
        private checkRefreshBar();
        protected update(dt: number): boolean;
        private runTween(axis, dt);
        private static easeFunc(t, d);
    }
}
declare namespace fgui {
    class Transition {
        name: string;
        private _owner;
        private _ownerBaseX;
        private _ownerBaseY;
        private _items;
        private _totalTimes;
        private _totalTasks;
        private _playing;
        private _paused;
        private _onComplete;
        private _options;
        private _reversed;
        private _totalDuration;
        private _autoPlay;
        private _autoPlayTimes;
        private _autoPlayDelay;
        private _timeScale;
        private _startTime;
        private _endTime;
        static OPTION_IGNORE_DISPLAY_CONTROLLER: number;
        static OPTION_AUTO_STOP_DISABLED: number;
        static OPTION_AUTO_STOP_AT_END: number;
        constructor(owner: GComponent);
        play(onComplete?: () => void, times?: number, delay?: number, startTime?: number, endTime?: number): void;
        playReverse(onComplete?: () => void, times?: number, delay?: number): void;
        changePlayTimes(value: number): void;
        setAutoPlay(value: boolean, times?: number, delay?: number): void;
        private _play(onComplete?, times?, delay?, startTime?, endTime?, reversed?);
        stop(setToComplete?: boolean, processCallback?: boolean): void;
        private stopItem(item, setToComplete);
        setPaused(paused: boolean): void;
        dispose(): void;
        readonly playing: boolean;
        setValue(label: string, ...args: any[]): void;
        setHook(label: string, callback: (label?: string) => void): void;
        clearHooks(): void;
        setTarget(label: string, newTarget: GObject): void;
        setDuration(label: string, value: number): void;
        getLabelTime(label: string): number;
        timeScale: number;
        updateFromRelations(targetId: string, dx: number, dy: number): void;
        onEnable(): void;
        onDisable(): void;
        private onDelayedPlay();
        private internalPlay();
        private playItem(item);
        private skipAnimations();
        private onDelayedPlayItem(tweener);
        private onTweenStart(tweener);
        private onTweenUpdate(tweener);
        private onTweenComplete(tweener);
        private onPlayTransCompleted(item);
        private callHook(item, tweenEnd);
        private checkAllComplete();
        private applyValue(item);
        setup(buffer: ByteBuffer): void;
        private decodeValue(item, buffer, value);
    }
}
declare namespace fgui {
    class TranslationHelper {
        static strings: Object;
        static loadFromXML(source: string): void;
        static translateComponent(item: PackageItem): void;
    }
}
declare namespace fgui {
    class UIConfig {
        constructor();
        static defaultFont: string;
        static windowModalWaiting: string;
        static globalModalWaiting: string;
        static modalLayerColor: cc.Color;
        static buttonSound: string;
        static buttonSoundVolumeScale: number;
        static horizontalScrollBar: string;
        static verticalScrollBar: string;
        static defaultScrollStep: number;
        static defaultScrollDecelerationRate: number;
        static defaultScrollBarDisplay: number;
        static defaultScrollTouchEffect: boolean;
        static defaultScrollBounceEffect: boolean;
        static popupMenu: string;
        static popupMenu_seperator: string;
        static loaderErrorSign: string;
        static tooltipsWin: string;
        static defaultComboBoxVisibleItemCount: number;
        static touchScrollSensitivity: number;
        static touchDragSensitivity: number;
        static clickDragSensitivity: number;
        static bringWindowToFrontOnClick: boolean;
        static frameTimeForAsyncUIConstruction: number;
        static linkUnderline: boolean;
        /** !#en
        Default group name of UI node.<br/>
        !#zh
        UI节点默认的分组。<br/>*/
        static defaultUIGroup: string;
    }
    var addLoadHandler: Function;
    var registerFont: Function;
    var getFontByName: Function;
}
declare namespace fgui {
    class UIObjectFactory {
        static extensions: any;
        private static loaderType;
        constructor();
        static setPackageItemExtension(url: string, type: any): void;
        static setExtension(url: string, type: any): void;
        static setLoaderExtension(type: any): void;
        static resolveExtension(pi: PackageItem): void;
        static newObject(pi: PackageItem): GObject;
        static newObject2(type: ObjectType): GObject;
    }
}
declare namespace fgui {
    class UIPackage {
        private _id;
        private _name;
        private _items;
        private _itemsById;
        private _itemsByName;
        private _url;
        private _sprites;
        dependencies: any;
        static _constructing: number;
        private static _instById;
        private static _instByName;
        constructor();
        static getById(id: string): UIPackage;
        static getByName(name: string): UIPackage;
        static addPackage(url: string): UIPackage;
        static loadPackage(url: string, completeCallback: ((error: any) => void) | null): void;
        static removePackage(packageIdOrName: string): void;
        static createObject(pkgName: string, resName: string, userClass?: any): GObject;
        static createObjectFromURL(url: string, userClass?: any): GObject;
        static getItemURL(pkgName: string, resName: string): string;
        static getItemByURL(url: string): PackageItem;
        static normalizeURL(url: string): string;
        static setStringsSource(source: string): void;
        private loadPackage(buffer, url);
        dispose(): void;
        readonly id: string;
        readonly name: string;
        readonly url: string;
        createObject(resName: string, userClass?: any): GObject;
        internalCreateObject(item: PackageItem, userClass?: any): GObject;
        getItemById(itemId: string): PackageItem;
        getItemByName(resName: string): PackageItem;
        getItemAssetByName(resName: string): any;
        getItemAsset(item: PackageItem): cc.Asset;
        loadAllAssets(): void;
        private loadMovieClip(item);
        private loadFont(item);
    }
}
declare namespace fgui {
    class Window extends GComponent {
        private _contentPane;
        private _modalWaitPane;
        private _closeButton;
        private _dragArea;
        private _contentArea;
        private _frame;
        private _modal;
        private _uiSources;
        private _inited;
        private _loading;
        protected _requestingCmd: number;
        bringToFontOnClick: boolean;
        constructor();
        addUISource(source: IUISource): void;
        contentPane: GComponent;
        readonly frame: GComponent;
        closeButton: GObject;
        dragArea: GObject;
        contentArea: GObject;
        show(): void;
        showOn(root: GRoot): void;
        hide(): void;
        hideImmediately(): void;
        centerOn(r: GRoot, restraint?: boolean): void;
        toggleStatus(): void;
        readonly isShowing: boolean;
        readonly isTop: boolean;
        modal: boolean;
        bringToFront(): void;
        showModalWait(requestingCmd?: number): void;
        protected layoutModalWaitPane(): void;
        closeModalWait(requestingCmd?: number): boolean;
        readonly modalWaiting: boolean;
        init(): void;
        protected onInit(): void;
        protected onShown(): void;
        protected onHide(): void;
        protected doShowAnimation(): void;
        protected doHideAnimation(): void;
        private __uiLoadComplete();
        private _init();
        dispose(): void;
        protected closeEventHandler(evt: cc.Event): void;
        protected onEnable(): void;
        protected onDisable(): void;
        private onTouchBegin_1(evt);
        private onDragStart_1(evt);
    }
}
declare namespace fgui {
    class ControllerAction {
        fromPage: string[];
        toPage: string[];
        static createAction(type: number): ControllerAction;
        constructor();
        run(controller: Controller, prevPage: string, curPage: string): void;
        protected enter(controller: Controller): void;
        protected leave(controller: Controller): void;
        setup(buffer: ByteBuffer): void;
    }
}
declare namespace fgui {
    class ChangePageAction extends ControllerAction {
        objectId: string;
        controllerName: string;
        targetPage: string;
        constructor();
        protected enter(controller: Controller): void;
        setup(buffer: ByteBuffer): void;
    }
}
declare namespace fgui {
    class PlayTransitionAction extends ControllerAction {
        transitionName: string;
        playTimes: number;
        delay: number;
        stopOnExit: boolean;
        private _currentTransition;
        constructor();
        protected enter(controller: Controller): void;
        protected leave(controller: Controller): void;
        setup(buffer: ByteBuffer): void;
    }
}
declare namespace fgui {
    enum BlendMode {
        Normal = 0,
        None = 1,
        Add = 2,
        Multiply = 3,
        Screen = 4,
        Erase = 5,
        Mask = 6,
        Below = 7,
        Off = 8,
        Custom1 = 9,
        Custom2 = 10,
        Custom3 = 11,
    }
    class BlendModeUtils {
        private static factors;
        static apply(node: cc.Node, blendMode: BlendMode): void;
        static override(blendMode: BlendMode, srcFactor: number, dstFactor: number): void;
    }
}
declare namespace fgui {
    class Image extends cc.Sprite {
        private _flip;
        private _fillMethod;
        private _fillOrigin;
        private _fillAmount;
        private _fillClockwise;
        constructor();
        flip: FlipType;
        fillMethod: FillMethod;
        fillOrigin: FillOrigin;
        fillClockwise: boolean;
        fillAmount: number;
        private setupFill();
    }
}
declare namespace fgui {
    class Frame {
        rect: cc.Rect;
        addDelay: number;
        texture: cc.SpriteFrame;
        constructor();
    }
    class MovieClip extends Image {
        interval: number;
        swing: boolean;
        repeatDelay: number;
        timeScale: number;
        private _playing;
        private _frameCount;
        private _frames;
        private _frame;
        private _start;
        private _end;
        private _times;
        private _endAt;
        private _status;
        private _callback;
        private _callbackObj;
        private _smoothing;
        private _frameElapsed;
        private _reversed;
        private _repeatedCount;
        constructor();
        frames: Array<Frame>;
        readonly frameCount: number;
        frame: number;
        playing: boolean;
        smoothing: boolean;
        rewind(): void;
        syncStatus(anotherMc: MovieClip): void;
        advance(timeInMiniseconds: number): void;
        setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: Function, callbackObj?: any): void;
        protected update(dt: number): void;
        private drawFrame();
    }
}
declare namespace fgui {
    class Event extends cc.Event {
        static TOUCH_BEGIN: string;
        static TOUCH_MOVE: string;
        static TOUCH_END: string;
        static CLICK: string;
        static ROLL_OVER: string;
        static ROLL_OUT: string;
        static MOUSE_WHEEL: string;
        static DISPLAY: string;
        static UNDISPLAY: string;
        static GEAR_STOP: string;
        static LINK: string;
        static Submit: string;
        static TEXT_CHANGE: string;
        static STATUS_CHANGED: string;
        static XY_CHANGED: string;
        static SIZE_CHANGED: string;
        static SIZE_DELAY_CHANGE: string;
        static DRAG_START: string;
        static DRAG_MOVE: string;
        static DRAG_END: string;
        static DROP: string;
        static SCROLL: string;
        static SCROLL_END: string;
        static PULL_DOWN_RELEASE: string;
        static PULL_UP_RELEASE: string;
        static CLICK_ITEM: string;
        initiator: GObject;
        pos: cc.Vec2;
        touch: cc.Touch;
        touchId: number;
        clickCount: number;
        button: number;
        keyModifiers: number;
        mouseWheelDelta: number;
        _processor: InputProcessor;
        constructor(type: string, bubbles: boolean);
        readonly isShiftDown: boolean;
        readonly isCtrlDown: boolean;
        captureTouch(): void;
        private static _eventPool;
        static _borrow(type: string, bubbles?: boolean): Event;
        static _return(evt: Event): void;
    }
}
declare namespace fgui {
    interface IHitTest {
        hitTest(obj: GComponent, x: number, y: number): boolean;
    }
    class PixelHitTest implements IHitTest {
        private _data;
        offsetX: number;
        offsetY: number;
        scaleX: number;
        scaleY: number;
        constructor(data: PixelHitTestData, offsetX?: number, offsetY?: number);
        hitTest(obj: GComponent, x: number, y: number): boolean;
    }
    class PixelHitTestData {
        pixelWidth: number;
        scale: number;
        pixels: Uint8Array;
        constructor(ba: ByteBuffer);
    }
}
declare namespace fgui {
    class InputProcessor extends cc.Component {
        private _owner;
        private _touchListener;
        private _touchPos;
        private _touches;
        private _rollOutChain;
        private _rollOverChain;
        _captureCallback: (evt: Event) => void;
        constructor();
        onLoad(): void;
        onEnable(): void;
        onDisable(): void;
        getAllTouches(touchIds?: Array<number>): Array<number>;
        getTouchPosition(touchId?: number): cc.Vec2;
        getTouchTarget(): GObject;
        addTouchMonitor(touchId: number, target: GObject): void;
        removeTouchMonitor(target: GObject): void;
        cancelClick(touchId: number): void;
        simulateClick(target: GObject): void;
        private touchBeginHandler(touch, evt);
        private touchMoveHandler(touch, evt);
        private touchEndHandler(touch, evt);
        private touchCancelHandler(touch, evt);
        private mouseDownHandler(evt);
        private mouseUpHandler(evt);
        private mouseMoveHandler(evt);
        private mouseWheelHandler(evt);
        private updateInfo(touchId, pos, touch?);
        private getInfo(touchId, createIfNotExisits?);
        private setBegin(ti);
        private setEnd(ti);
        private clickTest(ti);
        private handleRollOver(ti, target);
        private getEvent(ti, target, type, bubbles);
    }
}
declare namespace fgui {
    class GearBase {
        static disableAllTweenEffect: boolean;
        protected _tweenConfig: GearTweenConfig;
        protected _owner: GObject;
        protected _controller: Controller;
        constructor(owner: GObject);
        controller: Controller;
        readonly tweenConfig: GearTweenConfig;
        setup(buffer: ByteBuffer): void;
        updateFromRelations(dx: number, dy: number): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        protected init(): void;
        apply(): void;
        updateState(): void;
    }
    class GearTweenConfig {
        tween: boolean;
        easeType: number;
        duration: number;
        delay: number;
        _displayLockToken: number;
        _tweener: GTweener;
        constructor();
    }
}
declare namespace fgui {
    class GearAnimation extends GearBase {
        private _storage;
        private _default;
        constructor(owner: GObject);
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        updateState(): void;
    }
}
declare namespace fgui {
    class GearColor extends GearBase {
        private _storage;
        private _default;
        constructor(owner: GObject);
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        updateState(): void;
    }
}
declare namespace fgui {
    class GearDisplay extends GearBase {
        pages: string[];
        private _visible;
        private _displayLockToken;
        constructor(owner: GObject);
        protected init(): void;
        apply(): void;
        addLock(): number;
        releaseLock(token: number): void;
        readonly connected: boolean;
    }
}
declare namespace fgui {
    class GearIcon extends GearBase {
        private _storage;
        private _default;
        constructor(owner: GObject);
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        updateState(): void;
    }
}
declare namespace fgui {
    class GearLook extends GearBase {
        private _storage;
        private _default;
        constructor(owner: GObject);
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        private __tweenUpdate(tweener);
        private __tweenComplete();
        updateState(): void;
    }
}
declare namespace fgui {
    class GearSize extends GearBase {
        private _storage;
        private _default;
        constructor(owner: GObject);
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        private __tweenUpdate(tweener);
        private __tweenComplete();
        updateState(): void;
        updateFromRelations(dx: number, dy: number): void;
    }
}
declare namespace fgui {
    class GearText extends GearBase {
        private _storage;
        private _default;
        constructor(owner: GObject);
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        updateState(): void;
    }
}
declare namespace fgui {
    class GearXY extends GearBase {
        private _storage;
        private _default;
        constructor(owner: GObject);
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        private __tweenUpdate(tweener);
        private __tweenComplete();
        updateState(): void;
        updateFromRelations(dx: number, dy: number): void;
    }
}
declare namespace fgui {
    class TreeNode {
        private _data;
        private _parent;
        private _children;
        private _expanded;
        private _tree;
        private _cell;
        private _level;
        constructor(hasChild: boolean);
        expanded: boolean;
        readonly isFolder: boolean;
        readonly parent: TreeNode;
        data: any;
        readonly text: String;
        readonly cell: GComponent;
        _setCell(value: GComponent): void;
        readonly level: number;
        _setLevel(value: number): void;
        addChild(child: TreeNode): TreeNode;
        addChildAt(child: TreeNode, index: number): TreeNode;
        removeChild(child: TreeNode): TreeNode;
        removeChildAt(index: number): TreeNode;
        removeChildren(beginIndex?: number, endIndex?: number): void;
        getChildAt(index: number): TreeNode;
        getChildIndex(child: TreeNode): number;
        getPrevSibling(): TreeNode;
        getNextSibling(): TreeNode;
        setChildIndex(child: TreeNode, index: number): void;
        swapChildren(child1: TreeNode, child2: TreeNode): void;
        swapChildrenAt(index1: number, index2: number): void;
        readonly numChildren: number;
        readonly tree: TreeView;
        _setTree(value: TreeView): void;
    }
}
declare namespace fgui {
    class TreeView {
        private _list;
        private _root;
        private _indent;
        /**
         * 当需要为节点创建一个显示对象时调用
         */
        treeNodeCreateCell: (node: TreeNode) => GComponent;
        /**
         * 当节点需要渲染时调用
         */
        treeNodeRender: (node: TreeNode) => void;
        /**
         * 当目录节点展开或者收缩时调用。可以用节点的expanded属性判断目标状态。
         */
        treeNodeWillExpand: (node: TreeNode) => void;
        /**
         * 当节点被点击时调用
         */
        treeNodeClick: (node: TreeNode, evt: Event) => void;
        constructor(list: GList);
        readonly list: GList;
        readonly root: TreeNode;
        indent: number;
        getSelectedNode(): TreeNode;
        getSelection(): Array<TreeNode>;
        addSelection(node: TreeNode, scrollItToView?: boolean): void;
        removeSelection(node: TreeNode): void;
        clearSelection(): void;
        getNodeIndex(node: TreeNode): number;
        updateNode(node: TreeNode): void;
        updateNodes(nodes: Array<TreeNode>): void;
        expandAll(folderNode: TreeNode): void;
        collapseAll(folderNode: TreeNode): void;
        private createCell(node);
        _afterInserted(node: TreeNode): void;
        private getInsertIndexForNode(node);
        _afterRemoved(node: TreeNode): void;
        _afterExpanded(node: TreeNode): void;
        _afterCollapsed(node: TreeNode): void;
        _afterMoved(node: TreeNode): void;
        private checkChildren(folderNode, index);
        private hideFolderNode(folderNode);
        private removeNode(node);
        private onClickExpandButton(evt);
        private onClickItem(item, evt);
    }
}
declare namespace fgui {
    class EaseManager {
        private static _PiOver2;
        private static _TwoPi;
        static evaluate(easeType: number, time: number, duration: number, overshootOrAmplitude: number, period: number): number;
    }
}
declare namespace fgui {
    class EaseType {
        static Linear: number;
        static SineIn: number;
        static SineOut: number;
        static SineInOut: number;
        static QuadIn: number;
        static QuadOut: number;
        static QuadInOut: number;
        static CubicIn: number;
        static CubicOut: number;
        static CubicInOut: number;
        static QuartIn: number;
        static QuartOut: number;
        static QuartInOut: number;
        static QuintIn: number;
        static QuintOut: number;
        static QuintInOut: number;
        static ExpoIn: number;
        static ExpoOut: number;
        static ExpoInOut: number;
        static CircIn: number;
        static CircOut: number;
        static CircInOut: number;
        static ElasticIn: number;
        static ElasticOut: number;
        static ElasticInOut: number;
        static BackIn: number;
        static BackOut: number;
        static BackInOut: number;
        static BounceIn: number;
        static BounceOut: number;
        static BounceInOut: number;
        static Custom: number;
    }
}
declare namespace fgui {
    class GTween {
        static catchCallbackExceptions: boolean;
        static to(start: number, end: number, duration: number): GTweener;
        static to2(start: number, start2: number, end: number, end2: number, duration: number): GTweener;
        static to3(start: number, start2: number, start3: number, end: number, end2: number, end3: number, duration: number): GTweener;
        static to4(start: number, start2: number, start3: number, start4: number, end: number, end2: number, end3: number, end4: number, duration: number): GTweener;
        static toColor(start: number, end: number, duration: number): GTweener;
        static delayedCall(delay: number): GTweener;
        static shake(startX: number, startY: number, amplitude: number, duration: number): GTweener;
        static isTweening(target: Object, propType?: any): Boolean;
        static kill(target: Object, complete?: Boolean, propType?: any): void;
        static getTween(target: Object, propType?: any): GTweener;
    }
}
declare namespace fgui {
    class GTweener {
        _target: any;
        _propType: any;
        _node: cc.Node;
        _killed: boolean;
        _paused: boolean;
        private _delay;
        private _duration;
        private _breakpoint;
        private _easeType;
        private _easeOvershootOrAmplitude;
        private _easePeriod;
        private _repeat;
        private _yoyo;
        private _timeScale;
        private _snapping;
        private _userData;
        private _onUpdate;
        private _onStart;
        private _onComplete;
        private _onUpdateCaller;
        private _onStartCaller;
        private _onCompleteCaller;
        private _startValue;
        private _endValue;
        private _value;
        private _deltaValue;
        private _valueSize;
        private _started;
        private _ended;
        private _elapsedTime;
        private _normalizedTime;
        constructor();
        setDelay(value: number): GTweener;
        readonly delay: number;
        setDuration(value: number): GTweener;
        readonly duration: number;
        setBreakpoint(value: number): GTweener;
        setEase(value: number): GTweener;
        setEasePeriod(value: number): GTweener;
        setEaseOvershootOrAmplitude(value: number): GTweener;
        setRepeat(repeat: number, yoyo?: boolean): GTweener;
        readonly repeat: number;
        setTimeScale(value: number): GTweener;
        setSnapping(value: boolean): GTweener;
        setTarget(value: Object, propType?: Object): GTweener;
        readonly target: Object;
        setUserData(value: any): GTweener;
        readonly userData: any;
        onUpdate(callback: Function, caller: any): GTweener;
        onStart(callback: Function, caller: any): GTweener;
        onComplete(callback: Function, caller: any): GTweener;
        readonly startValue: TweenValue;
        readonly endValue: TweenValue;
        readonly value: TweenValue;
        readonly deltaValue: TweenValue;
        readonly normalizedTime: number;
        readonly completed: boolean;
        readonly allCompleted: boolean;
        setPaused(paused: boolean): GTweener;
        /**
         * seek position of the tween, in seconds.
         */
        seek(time: number): void;
        kill(complete?: boolean): void;
        _to(start: number, end: number, duration: number): GTweener;
        _to2(start: number, start2: number, end: number, end2: number, duration: number): GTweener;
        _to3(start: number, start2: number, start3: number, end: number, end2: number, end3: number, duration: number): GTweener;
        _to4(start: number, start2: number, start3: number, start4: number, end: number, end2: number, end3: number, end4: number, duration: number): GTweener;
        _toColor(start: number, end: number, duration: number): GTweener;
        _shake(startX: number, startY: number, amplitude: number, duration: number): GTweener;
        _init(): void;
        _reset(): void;
        _update(dt: number): void;
        private update();
        private callStartCallback();
        private callUpdateCallback();
        private callCompleteCallback();
    }
}
declare namespace fgui {
    class TweenManager {
        private static _activeTweens;
        private static _tweenerPool;
        private static _totalActiveTweens;
        private static _root;
        static createTween(): GTweener;
        static isTweening(target: any, propType: any): boolean;
        static killTweens(target: any, completed: boolean, propType: any): boolean;
        static getTween(target: any, propType: any): GTweener;
        private static update(dt);
    }
}
declare namespace fgui {
    class TweenValue {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor();
        color: number;
        getField(index: number): number;
        setField(index: number, value: number): void;
        setZero(): void;
    }
}
declare namespace fgui {
    class ByteBuffer {
        stringTable: Array<string>;
        version: number;
        littleEndian: boolean;
        protected _view: DataView;
        protected _bytes: Uint8Array;
        protected _pos: number;
        protected _length: number;
        constructor(buffer: ArrayBuffer, offset?: number, length?: number);
        readonly data: Uint8Array;
        position: number;
        skip(count: number): void;
        private validate(forward);
        readByte(): number;
        readUbyte(): number;
        readBool(): boolean;
        readShort(): number;
        readUshort(): number;
        readInt(): number;
        readUint(): number;
        readFloat(): number;
        readString(len?: number): string;
        readS(): string;
        writeS(value: string): void;
        readColor(hasAlpha?: boolean): cc.Color;
        readChar(): string;
        readBuffer(): ByteBuffer;
        seek(indexTablePos: number, blockIndex: number): boolean;
    }
}
declare namespace fgui {
    class ColorMatrix {
        matrix: Array<number>;
        private static IDENTITY_MATRIX;
        private static LENGTH;
        private static LUMA_R;
        private static LUMA_G;
        private static LUMA_B;
        static create(p_brightness: number, p_contrast: number, p_saturation: number, p_hue: number): ColorMatrix;
        constructor();
        reset(): void;
        invert(): void;
        adjustColor(p_brightness: number, p_contrast: number, p_saturation: number, p_hue: number): void;
        adjustBrightness(p_val: number): void;
        adjustContrast(p_val: number): void;
        adjustSaturation(p_val: number): void;
        adjustHue(p_val: number): void;
        concat(p_matrix: Array<number>): void;
        clone(): ColorMatrix;
        protected copyMatrix(p_matrix: Array<number>): void;
        protected multiplyMatrix(p_matrix: Array<number>): void;
        protected cleanValue(p_val: number, p_limit: number): number;
    }
}
declare namespace fgui {
    class UBBParser {
        private _text;
        private _readPos;
        protected _handlers: any;
        lastColor: string;
        lastSize: string;
        linkUnderline: boolean;
        linkColor: string;
        static inst: UBBParser;
        constructor();
        protected onTag_URL(tagName: string, end: boolean, attr: string): string;
        protected onTag_IMG(tagName: string, end: boolean, attr: string): string;
        protected onTag_Simple(tagName: string, end: boolean, attr: string): string;
        protected onTag_COLOR(tagName: string, end: boolean, attr: string): string;
        protected onTag_FONT(tagName: string, end: boolean, attr: string): string;
        protected onTag_SIZE(tagName: string, end: boolean, attr: string): string;
        protected getTagText(remove?: boolean): string;
        parse(text: string, remove?: boolean): string;
    }
}
declare namespace fgui {
    class ToolSet {
        constructor();
        static startsWith(source: string, str: string, ignoreCase?: boolean): boolean;
        static encodeHTML(str: string): string;
        static clamp(value: number, min: number, max: number): number;
        static clamp01(value: number): number;
        static lerp(start: number, end: number, percent: number): number;
        static getTime(): number;
    }
}
