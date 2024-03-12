declare namespace fgui {
    class AsyncOperation {
        callback: (obj: GObject) => void;
        private _node;
        createObject(pkgName: string, resName: string): void;
        createObjectFromURL(url: string): void;
        cancel(): void;
        private internalCreateObject;
        private completed;
    }
}
declare namespace fgui {
    class Controller extends cc.EventTarget {
        private _selectedIndex;
        private _previousIndex;
        private _pageIds;
        private _pageNames;
        private _actions?;
        name: string;
        parent: GComponent;
        autoRadioGroupDepth?: boolean;
        changing?: boolean;
        constructor();
        dispose(): void;
        get selectedIndex(): number;
        set selectedIndex(value: number);
        onChanged(callback: Function, target?: any): void;
        offChanged(callback: Function, target?: any): void;
        setSelectedIndex(value: number): void;
        get previsousIndex(): number;
        get selectedPage(): string;
        set selectedPage(val: string);
        setSelectedPage(value: string): void;
        get previousPage(): string;
        get pageCount(): number;
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
        get selectedPageId(): string;
        set selectedPageId(val: string);
        set oppositePageId(val: string);
        get previousPageId(): string;
        runActions(): void;
        setup(buffer: ByteBuffer): void;
    }
}
declare namespace fgui {
    class DragDropManager {
        private _agent;
        private _sourceData;
        private static _inst;
        static get inst(): DragDropManager;
        constructor();
        get dragAgent(): GObject;
        get dragging(): boolean;
        startDrag(source: GObject, icon: string, sourceData?: any, touchId?: number): void;
        cancel(): void;
        private onDragEnd;
    }
}
declare namespace fgui {
    enum ButtonMode {
        Common = 0,
        Check = 1,
        Radio = 2
    }
    enum AutoSizeType {
        None = 0,
        Both = 1,
        Height = 2,
        Shrink = 3
    }
    enum AlignType {
        Left = 0,
        Center = 1,
        Right = 2
    }
    enum VertAlignType {
        Top = 0,
        Middle = 1,
        Bottom = 2
    }
    enum LoaderFillType {
        None = 0,
        Scale = 1,
        ScaleMatchHeight = 2,
        ScaleMatchWidth = 3,
        ScaleFree = 4,
        ScaleNoBorder = 5
    }
    enum ListLayoutType {
        SingleColumn = 0,
        SingleRow = 1,
        FlowHorizontal = 2,
        FlowVertical = 3,
        Pagination = 4
    }
    enum ListSelectionMode {
        Single = 0,
        Multiple = 1,
        Multiple_SingleClick = 2,
        None = 3
    }
    enum OverflowType {
        Visible = 0,
        Hidden = 1,
        Scroll = 2
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
        Spine = 9,
        DragonBones = 10
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
        Tree = 17,
        Loader3D = 18
    }
    enum ProgressTitleType {
        Percent = 0,
        ValueAndMax = 1,
        Value = 2,
        Max = 3
    }
    enum ScrollBarDisplayType {
        Default = 0,
        Visible = 1,
        Auto = 2,
        Hidden = 3
    }
    enum ScrollType {
        Horizontal = 0,
        Vertical = 1,
        Both = 2
    }
    enum FlipType {
        None = 0,
        Horizontal = 1,
        Vertical = 2,
        Both = 3
    }
    enum ChildrenRenderOrder {
        Ascent = 0,
        Descent = 1,
        Arch = 2
    }
    enum GroupLayoutType {
        None = 0,
        Horizontal = 1,
        Vertical = 2
    }
    enum PopupDirection {
        Auto = 0,
        Up = 1,
        Down = 2
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
        Size = 24
    }
    enum FillMethod {
        None = 0,
        Horizontal = 1,
        Vertical = 2,
        Radial90 = 3,
        Radial180 = 4,
        Radial360 = 5
    }
    enum FillOrigin {
        Top = 0,
        Bottom = 1,
        Left = 2,
        Right = 3
    }
    enum ObjectPropID {
        Text = 0,
        Icon = 1,
        Color = 2,
        OutlineColor = 3,
        Playing = 4,
        Frame = 5,
        DeltaTime = 6,
        TimeScale = 7,
        FontSize = 8,
        Selected = 9
    }
}
declare namespace fgui {
    class GObject {
        data?: any;
        packageItem?: PackageItem;
        static draggingObject: GObject;
        protected _x: number;
        protected _y: number;
        protected _alpha: number;
        protected _visible: boolean;
        protected _touchable: boolean;
        protected _grayed?: boolean;
        protected _draggable?: boolean;
        protected _skewX: number;
        protected _skewY: number;
        protected _pivotAsAnchor?: boolean;
        protected _sortingOrder: number;
        protected _internalVisible: boolean;
        protected _handlingController?: boolean;
        protected _tooltips?: string;
        protected _blendMode: BlendMode;
        protected _pixelSnapping?: boolean;
        protected _dragTesting?: boolean;
        protected _dragStartPos?: cc.Vec2;
        protected _relations: Relations;
        protected _group: GGroup;
        protected _gears: GearBase[];
        protected _node: cc.Node;
        protected _dragBounds?: cc.Rect;
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
        _gearLocked?: boolean;
        _sizePercentInGroup: number;
        _touchDisabled?: boolean;
        _partner: GObjectPartner;
        _treeNode?: GTreeNode;
        private _hitTestPt?;
        static _defaultGroupIndex: number;
        constructor();
        get id(): string;
        get name(): string;
        set name(value: string);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        setPosition(xv: number, yv: number): void;
        get xMin(): number;
        set xMin(value: number);
        get yMin(): number;
        set yMin(value: number);
        get pixelSnapping(): boolean;
        set pixelSnapping(value: boolean);
        center(restraint?: boolean): void;
        get width(): number;
        set width(value: number);
        get height(): number;
        set height(value: number);
        setSize(wv: number, hv: number, ignorePivot?: boolean): void;
        makeFullScreen(): void;
        ensureSizeCorrect(): void;
        get actualWidth(): number;
        get actualHeight(): number;
        get scaleX(): number;
        set scaleX(value: number);
        get scaleY(): number;
        set scaleY(value: number);
        setScale(sx: number, sy: number): void;
        get skewX(): number;
        set skewX(value: number);
        get skewY(): number;
        set skewY(value: number);
        setSkew(xv: number, yv: number): void;
        get pivotX(): number;
        set pivotX(value: number);
        get pivotY(): number;
        set pivotY(value: number);
        setPivot(xv: number, yv: number, asAnchor?: boolean): void;
        get pivotAsAnchor(): boolean;
        get touchable(): boolean;
        set touchable(value: boolean);
        get grayed(): boolean;
        set grayed(value: boolean);
        get enabled(): boolean;
        set enabled(value: boolean);
        get rotation(): number;
        set rotation(value: number);
        get alpha(): number;
        set alpha(value: number);
        get visible(): boolean;
        set visible(value: boolean);
        get _finalVisible(): boolean;
        get internalVisible3(): boolean;
        get sortingOrder(): number;
        set sortingOrder(value: number);
        requestFocus(): void;
        get tooltips(): string;
        set tooltips(value: string);
        get blendMode(): BlendMode;
        set blendMode(value: BlendMode);
        get onStage(): boolean;
        get resourceURL(): string;
        set group(value: GGroup);
        get group(): GGroup;
        getGear(index: number): GearBase;
        protected updateGear(index: number): void;
        checkGearController(index: number, c: Controller): boolean;
        updateGearFromRelations(index: number, dx: number, dy: number): void;
        addDisplayLock(): number;
        releaseDisplayLock(token: number): void;
        private checkGearDisplay;
        get gearXY(): GearXY;
        get gearSize(): GearSize;
        get gearLook(): GearLook;
        get relations(): Relations;
        addRelation(target: GObject, relationType: number, usePercent?: boolean): void;
        removeRelation(target: GObject, relationType: number): void;
        get node(): cc.Node;
        get parent(): GComponent;
        removeFromParent(): void;
        findParent(): GObject;
        get root(): GRoot;
        get asCom(): GComponent;
        get asButton(): GButton;
        get asLabel(): GLabel;
        get asProgress(): GProgressBar;
        get asTextField(): GTextField;
        get asRichTextField(): GRichTextField;
        get asTextInput(): GTextInput;
        get asLoader(): GLoader;
        get asList(): GList;
        get asTree(): GTree;
        get asGraph(): GGraph;
        get asGroup(): GGroup;
        get asSlider(): GSlider;
        get asComboBox(): GComboBox;
        get asImage(): GImage;
        get asMovieClip(): GMovieClip;
        static cast(obj: cc.Node): GObject;
        get text(): string;
        set text(value: string);
        get icon(): string;
        set icon(value: string);
        get treeNode(): GTreeNode;
        dispose(): void;
        protected onEnable(): void;
        protected onDisable(): void;
        protected onUpdate(): void;
        protected onDestroy(): void;
        onClick(listener: Function, target?: any): void;
        onceClick(listener: Function, target?: any): void;
        offClick(listener: Function, target?: any): void;
        clearClick(): void;
        hasClickListener(): boolean;
        on(type: string, listener: Function, target?: any): void;
        once(type: string, listener: Function, target?: any): void;
        off(type: string, listener?: Function, target?: any): void;
        get draggable(): boolean;
        set draggable(value: boolean);
        get dragBounds(): cc.Rect;
        set dragBounds(value: cc.Rect);
        startDrag(touchId?: number): void;
        stopDrag(): void;
        get dragging(): boolean;
        localToGlobal(ax?: number, ay?: number, result?: cc.Vec2): cc.Vec2;
        globalToLocal(ax?: number, ay?: number, result?: cc.Vec2): cc.Vec2;
        localToGlobalRect(ax?: number, ay?: number, aw?: number, ah?: number, result?: cc.Rect): cc.Rect;
        globalToLocalRect(ax?: number, ay?: number, aw?: number, ah?: number, result?: cc.Rect): cc.Rect;
        handleControllerChanged(c: Controller): void;
        protected handleAnchorChanged(): void;
        handlePositionChanged(): void;
        protected handleSizeChanged(): void;
        protected handleGrayedChanged(): void;
        handleVisibleChanged(): void;
        hitTest(globalPt: cc.Vec2, forTouch?: boolean): GObject;
        protected _hitTest(pt: cc.Vec2, globalPt: cc.Vec2): GObject;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        constructFromResource(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        private onRollOver;
        private onRollOut;
        private initDrag;
        private dragBegin;
        private dragEnd;
        private onTouchBegin_0;
        private onTouchMove_0;
        private onTouchEnd_0;
    }
    class GObjectPartner extends cc.Component {
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
        hitArea?: IHitTest;
        private _sortingChildCount;
        private _opaque;
        private _applyingController?;
        private _rectMask?;
        private _maskContent?;
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
        _scrollPane?: ScrollPane;
        _alignOffset: cc.Vec2;
        _customMask?: cc.Mask;
        constructor();
        dispose(): void;
        get displayListContainer(): cc.Node;
        addChild(child: GObject): GObject;
        addChildAt(child: GObject, index: number): GObject;
        private getInsertPosForSortingChild;
        removeChild(child: GObject, dispose?: boolean): GObject;
        removeChildAt(index: number, dispose?: boolean): GObject;
        removeChildren(beginIndex?: number, endIndex?: number, dispose?: boolean): void;
        getChildAt(index: number): GObject;
        getChild(name: string): GObject;
        getChildByPath(path: String): GObject;
        getVisibleChild(name: string): GObject;
        getChildInGroup(name: string, group: GGroup): GObject;
        getChildById(id: string): GObject;
        getChildIndex(child: GObject): number;
        setChildIndex(child: GObject, index: number): void;
        setChildIndexBefore(child: GObject, index: number): number;
        private _setChildIndex;
        swapChildren(child1: GObject, child2: GObject): void;
        swapChildrenAt(index1: number, index2: number): void;
        get numChildren(): number;
        isAncestorOf(child: GObject): boolean;
        addController(controller: Controller): void;
        getControllerAt(index: number): Controller;
        getController(name: string): Controller;
        removeController(c: Controller): void;
        get controllers(): Array<Controller>;
        private onChildAdd;
        private buildNativeDisplayList;
        applyController(c: Controller): void;
        applyAllControllers(): void;
        adjustRadioGroupDepth(obj: GObject, c: Controller): void;
        getTransitionAt(index: number): Transition;
        getTransition(transName: string): Transition;
        isChildInView(child: GObject): boolean;
        getFirstChildInView(): number;
        get scrollPane(): ScrollPane;
        get opaque(): boolean;
        set opaque(value: boolean);
        get margin(): Margin;
        set margin(value: Margin);
        get childrenRenderOrder(): ChildrenRenderOrder;
        set childrenRenderOrder(value: ChildrenRenderOrder);
        get apexIndex(): number;
        set apexIndex(value: number);
        get mask(): GObject;
        set mask(value: GObject);
        setMask(value: GObject, inverted: boolean): void;
        private onMaskReady;
        private onMaskContentChanged;
        get _pivotCorrectX(): number;
        get _pivotCorrectY(): number;
        get baseUserData(): string;
        protected setupScroll(buffer: ByteBuffer): void;
        protected setupOverflow(overflow: OverflowType): void;
        protected handleAnchorChanged(): void;
        protected handleSizeChanged(): void;
        protected handleGrayedChanged(): void;
        handleControllerChanged(c: Controller): void;
        protected _hitTest(pt: cc.Vec2, globalPt: cc.Vec2): GObject;
        setBoundsChangedFlag(): void;
        private refresh;
        ensureBoundsCorrect(): void;
        protected updateBounds(): void;
        setBounds(ax: number, ay: number, aw: number, ah?: number): void;
        get viewWidth(): number;
        set viewWidth(value: number);
        get viewHeight(): number;
        set viewHeight(value: number);
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
        protected _titleObject: GObject;
        protected _iconObject: GObject;
        private _mode;
        private _selected;
        private _title;
        private _selectedTitle;
        private _icon;
        private _selectedIcon;
        private _sound;
        private _soundVolumeScale;
        private _buttonController;
        private _relatedController?;
        private _relatedPageId;
        private _changeStateOnClick;
        private _linkedPopup?;
        private _downEffect;
        private _downEffectValue;
        private _downColor?;
        private _downScaled?;
        private _down;
        private _over;
        static UP: string;
        static DOWN: string;
        static OVER: string;
        static SELECTED_OVER: string;
        static DISABLED: string;
        static SELECTED_DISABLED: string;
        constructor();
        get icon(): string;
        set icon(value: string);
        get selectedIcon(): string;
        set selectedIcon(value: string);
        get title(): string;
        set title(value: string);
        get text(): string;
        set text(value: string);
        get selectedTitle(): string;
        set selectedTitle(value: string);
        get titleColor(): cc.Color;
        set titleColor(value: cc.Color);
        get titleFontSize(): number;
        set titleFontSize(value: number);
        get sound(): string;
        set sound(val: string);
        get soundVolumeScale(): number;
        set soundVolumeScale(value: number);
        set selected(val: boolean);
        get selected(): boolean;
        get mode(): ButtonMode;
        set mode(value: ButtonMode);
        get relatedController(): Controller;
        set relatedController(val: Controller);
        get relatedPageId(): string;
        set relatedPageId(val: string);
        get changeStateOnClick(): boolean;
        set changeStateOnClick(value: boolean);
        get linkedPopup(): GObject;
        set linkedPopup(value: GObject);
        getTextField(): GTextField;
        fireClick(): void;
        protected setState(val: string): void;
        protected setCurrentState(): void;
        handleControllerChanged(c: Controller): void;
        protected handleGrayedChanged(): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        protected constructExtension(buffer: ByteBuffer): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        private onRollOver_1;
        private onRollOut_1;
        private onTouchBegin_1;
        private onTouchEnd_1;
        private onClick_1;
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
        private _icons?;
        private _visibleItemCount;
        private _itemsUpdated;
        private _selectedIndex;
        private _buttonController;
        private _popupDirection;
        private _selectionController;
        private _over;
        private _down;
        constructor();
        get text(): string;
        set text(value: string);
        get icon(): string;
        set icon(value: string);
        get titleColor(): cc.Color;
        set titleColor(value: cc.Color);
        get titleFontSize(): number;
        set titleFontSize(value: number);
        get visibleItemCount(): number;
        set visibleItemCount(value: number);
        get popupDirection(): PopupDirection;
        set popupDirection(value: PopupDirection);
        get items(): Array<string>;
        set items(value: Array<string>);
        get icons(): Array<string>;
        set icons(value: Array<string>);
        get values(): Array<string>;
        set values(value: Array<string>);
        get selectedIndex(): number;
        set selectedIndex(val: number);
        get value(): string;
        set value(val: string);
        get selectionController(): Controller;
        set selectionController(value: Controller);
        getTextField(): GTextField;
        protected setState(val: string): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        protected constructExtension(buffer: ByteBuffer): void;
        handleControllerChanged(c: Controller): void;
        private updateSelectionController;
        dispose(): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        protected showDropdown(): void;
        private onPopupClosed;
        private onClickItem;
        private onClickItem2;
        private onRollOver_1;
        private onRollOut_1;
        private onTouchBegin_1;
        private onTouchEnd_1;
    }
}
declare namespace fgui {
    class GGraph extends GObject {
        _content: cc.Graphics;
        private _type;
        private _lineSize;
        private _lineColor;
        private _fillColor;
        private _cornerRadius?;
        private _sides?;
        private _startAngle?;
        private _polygonPoints?;
        private _distances?;
        private _hasContent;
        constructor();
        drawRect(lineSize: number, lineColor: cc.Color, fillColor: cc.Color, corner?: Array<number>): void;
        drawEllipse(lineSize: number, lineColor: cc.Color, fillColor: cc.Color): void;
        drawRegularPolygon(lineSize: number, lineColor: cc.Color, fillColor: cc.Color, sides: number, startAngle?: number, distances?: number[]): void;
        drawPolygon(lineSize: number, lineColor: cc.Color, fillColor: cc.Color, points: Array<number>): void;
        get distances(): number[];
        set distances(value: number[]);
        clearGraphics(): void;
        get type(): number;
        get color(): cc.Color;
        set color(value: cc.Color);
        private updateGraph;
        private drawPath;
        protected handleSizeChanged(): void;
        protected handleAnchorChanged(): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        protected _hitTest(pt: cc.Vec2): GObject;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GGroup extends GObject {
        private _layout;
        private _lineGap;
        private _columnGap;
        private _excludeInvisibles;
        private _autoSizeDisabled;
        private _mainGridIndex;
        private _mainGridMinSize;
        private _boundsChanged;
        private _percentReady;
        private _mainChildIndex;
        private _totalSize;
        private _numChildren;
        _updating: number;
        constructor();
        dispose(): void;
        get layout(): number;
        set layout(value: number);
        get lineGap(): number;
        set lineGap(value: number);
        get columnGap(): number;
        set columnGap(value: number);
        get excludeInvisibles(): boolean;
        set excludeInvisibles(value: boolean);
        get autoSizeDisabled(): boolean;
        set autoSizeDisabled(value: boolean);
        get mainGridMinSize(): number;
        set mainGridMinSize(value: number);
        get mainGridIndex(): number;
        set mainGridIndex(value: number);
        setBoundsChangedFlag(positionChangedOnly?: boolean): void;
        private _ensureBoundsCorrect;
        ensureSizeCorrect(): void;
        ensureBoundsCorrect(): void;
        private updateBounds;
        private handleLayout;
        moveChildren(dx: number, dy: number): void;
        resizeChildren(dw: number, dh: number): void;
        handleAlphaChanged(): void;
        handleVisibleChanged(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GImage extends GObject {
        _content: Image;
        constructor();
        get color(): cc.Color;
        set color(value: cc.Color);
        get flip(): FlipType;
        set flip(value: FlipType);
        get fillMethod(): FillMethod;
        set fillMethod(value: FillMethod);
        get fillOrigin(): FillOrigin;
        set fillOrigin(value: FillOrigin);
        get fillClockwise(): boolean;
        set fillClockwise(value: boolean);
        get fillAmount(): number;
        set fillAmount(value: number);
        constructFromResource(): void;
        protected handleGrayedChanged(): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GLabel extends GComponent {
        protected _titleObject: GObject;
        protected _iconObject: GObject;
        constructor();
        get icon(): string;
        set icon(value: string);
        get title(): string;
        set title(value: string);
        get text(): string;
        set text(value: string);
        get titleColor(): cc.Color;
        set titleColor(value: cc.Color);
        get titleFontSize(): number;
        set titleFontSize(value: number);
        set editable(val: boolean);
        get editable(): boolean;
        getTextField(): GTextField;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
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
        private _selectionController?;
        private _lastSelectedIndex;
        private _pool;
        private _virtual?;
        private _loop?;
        private _numItems;
        private _realNumItems;
        private _firstIndex;
        private _curLineItemCount;
        private _curLineItemCount2;
        private _itemSize?;
        private _virtualListChanged;
        private _virtualItems?;
        private _eventLocked?;
        private itemInfoVer;
        constructor();
        dispose(): void;
        get layout(): ListLayoutType;
        set layout(value: ListLayoutType);
        get lineCount(): number;
        set lineCount(value: number);
        get columnCount(): number;
        set columnCount(value: number);
        get lineGap(): number;
        set lineGap(value: number);
        get columnGap(): number;
        set columnGap(value: number);
        get align(): AlignType;
        set align(value: AlignType);
        get verticalAlign(): VertAlignType;
        set verticalAlign(value: VertAlignType);
        get virtualItemSize(): cc.Size;
        set virtualItemSize(value: cc.Size);
        get defaultItem(): string;
        set defaultItem(val: string);
        get autoResizeItem(): boolean;
        set autoResizeItem(value: boolean);
        get selectionMode(): ListSelectionMode;
        set selectionMode(value: ListSelectionMode);
        get selectionController(): Controller;
        set selectionController(value: Controller);
        get itemPool(): GObjectPool;
        getFromPool(url?: string): GObject;
        returnToPool(obj: GObject): void;
        addChildAt(child: GObject, index: number): GObject;
        addItem(url?: string): GObject;
        addItemFromPool(url?: string): GObject;
        removeChildAt(index: number, dispose?: boolean): GObject;
        removeChildToPoolAt(index: number): void;
        removeChildToPool(child: GObject): void;
        removeChildrenToPool(beginIndex?: number, endIndex?: number): void;
        get selectedIndex(): number;
        set selectedIndex(value: number);
        getSelection(result?: number[]): number[];
        addSelection(index: number, scrollItToView?: boolean): void;
        removeSelection(index: number): void;
        clearSelection(): void;
        private clearSelectionExcept;
        selectAll(): void;
        selectNone(): void;
        selectReverse(): void;
        handleArrowKey(dir: number): void;
        private onClickItem;
        protected dispatchItemEvent(item: GObject, evt: Event): void;
        private setSelectionOnEvent;
        resizeToFit(itemCount?: number, minSize?: number): void;
        getMaxItemWidth(): number;
        protected handleSizeChanged(): void;
        handleControllerChanged(c: Controller): void;
        private updateSelectionController;
        getSnappingPosition(xValue: number, yValue: number, resultPoint?: cc.Vec2): cc.Vec2;
        scrollToView(index: number, ani?: boolean, setFirst?: boolean): void;
        getFirstChildInView(): number;
        childIndexToItemIndex(index: number): number;
        itemIndexToChildIndex(index: number): number;
        setVirtual(): void;
        setVirtualAndLoop(): void;
        private _setVirtual;
        get numItems(): number;
        set numItems(value: number);
        refreshVirtualList(): void;
        private checkVirtualList;
        private setVirtualListChangedFlag;
        private _refreshVirtualList;
        private __scrolled;
        private getIndexOnPos1;
        private getIndexOnPos2;
        private getIndexOnPos3;
        private handleScroll;
        private static pos_param;
        private handleScroll1;
        private handleScroll2;
        private handleScroll3;
        private handleArchOrder1;
        private handleArchOrder2;
        private handleAlign;
        protected updateBounds(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        protected readItems(buffer: ByteBuffer): void;
        protected setupItem(buffer: ByteBuffer, obj: GObject): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GObjectPool {
        private _pool;
        private _count;
        constructor();
        clear(): void;
        get count(): number;
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
        private _container;
        private _errorSign?;
        private _content2?;
        private _updatingLayout;
        private static _errorSignPool;
        constructor();
        dispose(): void;
        get url(): string;
        set url(value: string);
        get icon(): string;
        set icon(value: string);
        get align(): AlignType;
        set align(value: AlignType);
        get verticalAlign(): VertAlignType;
        set verticalAlign(value: VertAlignType);
        get fill(): LoaderFillType;
        set fill(value: LoaderFillType);
        get shrinkOnly(): boolean;
        set shrinkOnly(value: boolean);
        get autoSize(): boolean;
        set autoSize(value: boolean);
        get playing(): boolean;
        set playing(value: boolean);
        get frame(): number;
        set frame(value: number);
        get color(): cc.Color;
        set color(value: cc.Color);
        get fillMethod(): FillMethod;
        set fillMethod(value: FillMethod);
        get fillOrigin(): FillOrigin;
        set fillOrigin(value: FillOrigin);
        get fillClockwise(): boolean;
        set fillClockwise(value: boolean);
        get fillAmount(): number;
        set fillAmount(value: number);
        get showErrorSign(): boolean;
        set showErrorSign(value: boolean);
        get component(): GComponent;
        get texture(): cc.SpriteFrame;
        set texture(value: cc.SpriteFrame);
        protected loadContent(): void;
        protected loadFromPackage(itemURL: string): void;
        protected loadExternal(): void;
        protected freeExternal(texture: cc.SpriteFrame): void;
        protected onExternalLoadSuccess(texture: cc.SpriteFrame): void;
        protected onExternalLoadFailed(): void;
        private setErrorState;
        private clearErrorState;
        private updateLayout;
        private clearContent;
        protected handleSizeChanged(): void;
        protected handleAnchorChanged(): void;
        protected handleGrayedChanged(): void;
        protected _hitTest(pt: cc.Vec2, globalPt: cc.Vec2): GObject;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GLoader3D extends GObject {
        private _url;
        private _align;
        private _verticalAlign;
        private _autoSize;
        private _fill;
        private _shrinkOnly;
        private _playing;
        private _frame;
        private _loop;
        private _animationName;
        private _skinName;
        private _color;
        private _contentItem;
        private _container;
        private _content;
        private _updatingLayout;
        constructor();
        dispose(): void;
        get url(): string;
        set url(value: string);
        get icon(): string;
        set icon(value: string);
        get align(): AlignType;
        set align(value: AlignType);
        get verticalAlign(): VertAlignType;
        set verticalAlign(value: VertAlignType);
        get fill(): LoaderFillType;
        set fill(value: LoaderFillType);
        get shrinkOnly(): boolean;
        set shrinkOnly(value: boolean);
        get autoSize(): boolean;
        set autoSize(value: boolean);
        get playing(): boolean;
        set playing(value: boolean);
        get frame(): number;
        set frame(value: number);
        get animationName(): string;
        set animationName(value: string);
        get skinName(): string;
        set skinName(value: string);
        get loop(): boolean;
        set loop(value: boolean);
        get color(): cc.Color;
        set color(value: cc.Color);
        get content(): sp.Skeleton | dragonBones.ArmatureDisplay;
        protected loadContent(): void;
        protected loadFromPackage(itemURL: string): void;
        private onLoaded;
        setSpine(asset: sp.SkeletonData, anchor: cc.Vec2, pma?: boolean): void;
        setDragonBones(asset: dragonBones.DragonBonesAsset, atlasAsset: dragonBones.DragonBonesAtlasAsset, anchor: cc.Vec2, pma?: boolean): void;
        private onChange;
        private onChangeSpine;
        private onChangeDragonBones;
        protected loadExternal(): void;
        private onLoaded2;
        private updateLayout;
        private clearContent;
        protected handleSizeChanged(): void;
        protected handleAnchorChanged(): void;
        protected handleGrayedChanged(): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GMovieClip extends GObject {
        _content: MovieClip;
        constructor();
        get color(): cc.Color;
        set color(value: cc.Color);
        get playing(): boolean;
        set playing(value: boolean);
        get frame(): number;
        set frame(value: number);
        get timeScale(): number;
        set timeScale(value: number);
        rewind(): void;
        syncStatus(anotherMc: GMovieClip): void;
        advance(timeInSeconds: number): void;
        setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: Function, callbackObj?: any): void;
        protected handleGrayedChanged(): void;
        protected handleSizeChanged(): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        constructFromResource(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GProgressBar extends GComponent {
        private _min;
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
        constructor();
        get titleType(): ProgressTitleType;
        set titleType(value: ProgressTitleType);
        get min(): number;
        set min(value: number);
        get max(): number;
        set max(value: number);
        get value(): number;
        set value(value: number);
        tweenValue(value: number, duration: number): GTweener;
        update(newValue: number): void;
        private setFillAmount;
        protected constructExtension(buffer: ByteBuffer): void;
        protected handleSizeChanged(): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GTextField extends GObject {
        _label: cc.Label;
        protected _font: string;
        protected _realFont: string | cc.Font;
        protected _fontSize: number;
        protected _color: cc.Color;
        protected _strokeColor?: cc.Color;
        protected _shadowOffset?: cc.Vec2;
        protected _shadowColor?: cc.Color;
        protected _leading: number;
        protected _text: string;
        protected _ubbEnabled: boolean;
        protected _templateVars?: {
            [index: string]: string;
        };
        protected _autoSize: AutoSizeType;
        protected _updatingSize: boolean;
        protected _sizeDirty: boolean;
        protected _outline?: cc.LabelOutline;
        protected _shadow?: cc.LabelShadow;
        constructor();
        protected createRenderer(): void;
        set text(value: string);
        get text(): string;
        get font(): string;
        set font(value: string);
        get fontSize(): number;
        set fontSize(value: number);
        get color(): cc.Color;
        set color(value: cc.Color);
        get align(): cc.Label.HorizontalAlign;
        set align(value: cc.Label.HorizontalAlign);
        get verticalAlign(): cc.Label.VerticalAlign;
        set verticalAlign(value: cc.Label.VerticalAlign);
        get leading(): number;
        set leading(value: number);
        get letterSpacing(): number;
        set letterSpacing(value: number);
        get underline(): boolean;
        set underline(value: boolean);
        get bold(): boolean;
        set bold(value: boolean);
        get italic(): boolean;
        set italic(value: boolean);
        get singleLine(): boolean;
        set singleLine(value: boolean);
        get stroke(): number;
        set stroke(value: number);
        get strokeColor(): cc.Color;
        set strokeColor(value: cc.Color);
        get shadowOffset(): cc.Vec2;
        set shadowOffset(value: cc.Vec2);
        get shadowColor(): cc.Color;
        set shadowColor(value: cc.Color);
        set ubbEnabled(value: boolean);
        get ubbEnabled(): boolean;
        set autoSize(value: AutoSizeType);
        get autoSize(): AutoSizeType;
        protected parseTemplate(template: string): string;
        get templateVars(): {
            [index: string]: string;
        };
        set templateVars(value: {
            [index: string]: string;
        });
        setVar(name: string, value: string): GTextField;
        flushVars(): void;
        get textWidth(): number;
        ensureSizeCorrect(): void;
        protected updateText(): void;
        protected assignFont(label: any, value: string | cc.Font): void;
        protected assignFontColor(label: any, value: cc.Color): void;
        protected updateFont(): void;
        protected updateFontColor(): void;
        protected updateStrokeColor(): void;
        protected updateShadowColor(): void;
        protected updateFontSize(): void;
        protected updateOverflow(): void;
        protected markSizeChanged(): void;
        protected onLabelSizeChanged(): void;
        protected handleSizeChanged(): void;
        protected handleGrayedChanged(): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
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
        constructor();
        protected createRenderer(): void;
        get align(): cc.Label.HorizontalAlign;
        set align(value: cc.Label.HorizontalAlign);
        get underline(): boolean;
        set underline(value: boolean);
        get bold(): boolean;
        set bold(value: boolean);
        get italic(): boolean;
        set italic(value: boolean);
        protected markSizeChanged(): void;
        protected updateText(): void;
        protected updateFont(): void;
        protected updateFontColor(): void;
        protected updateFontSize(): void;
        protected updateOverflow(): void;
        protected handleSizeChanged(): void;
    }
}
declare namespace fgui {
    class GRoot extends GComponent {
        static contentScaleLevel: number;
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
        static get inst(): GRoot;
        static create(): GRoot;
        createModalLayer(): GComponent;
        constructor();
        protected onDestroy(): void;
        getTouchPosition(touchId?: number): cc.Vec2;
        get touchTarget(): GObject;
        get inputProcessor(): InputProcessor;
        showWindow(win: Window): void;
        hideWindow(win: Window): void;
        hideWindowImmediately(win: Window): void;
        bringToFront(win: Window): void;
        showModalWait(msg?: string): void;
        closeModalWait(): void;
        closeAllExceptModals(): void;
        closeAllWindows(): void;
        getTopWindow(): Window;
        get modalLayer(): GComponent;
        get hasModalWindow(): boolean;
        get modalWaiting(): boolean;
        getPopupPosition(popup: GObject, target?: GObject, dir?: PopupDirection | boolean, result?: cc.Vec2): cc.Vec2;
        showPopup(popup: GObject, target?: GObject, dir?: PopupDirection | boolean): void;
        togglePopup(popup: GObject, target?: GObject, dir?: PopupDirection | boolean): void;
        hidePopup(popup?: GObject): void;
        get hasAnyPopup(): boolean;
        private closePopup;
        showTooltips(msg: string): void;
        showTooltipsWin(tooltipWin: GObject): void;
        hideTooltips(): void;
        get volumeScale(): number;
        set volumeScale(value: number);
        playOneShotSound(clip: cc.AudioClip, volumeScale?: number): void;
        private adjustModalLayer;
        private onTouchBegin_1;
        private onWinResize;
        handlePositionChanged(): void;
        private updateContentScaleLevel;
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
        private _gripDragging;
        constructor();
        setScrollPane(target: ScrollPane, vertical: boolean): void;
        setDisplayPerc(value: number): void;
        setScrollPerc(val: number): void;
        get minSize(): number;
        get gripDragging(): boolean;
        protected constructExtension(buffer: ByteBuffer): void;
        private onGripTouchDown;
        private onGripTouchMove;
        private onGripTouchEnd;
        private onClickArrow1;
        private onClickArrow2;
        private onBarTouchBegin;
    }
}
declare namespace fgui {
    class GSlider extends GComponent {
        private _min;
        private _max;
        private _value;
        private _titleType;
        private _reverse;
        private _wholeNumbers;
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
        get titleType(): ProgressTitleType;
        set titleType(value: ProgressTitleType);
        get wholeNumbers(): boolean;
        set wholeNumbers(value: boolean);
        get min(): number;
        set min(value: number);
        get max(): number;
        set max(value: number);
        get value(): number;
        set value(value: number);
        update(): void;
        private updateWithPercent;
        protected constructExtension(buffer: ByteBuffer): void;
        protected handleSizeChanged(): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        private onGripTouchBegin;
        private onGripTouchMove;
        private onBarTouchBegin;
    }
}
declare namespace fgui {
    class GTextInput extends GTextField {
        _editBox: cc.EditBox;
        private _promptText;
        constructor();
        protected createRenderer(): void;
        set editable(val: boolean);
        get editable(): boolean;
        set maxLength(val: number);
        get maxLength(): number;
        set promptText(val: string);
        get promptText(): string;
        set restrict(value: string);
        get restrict(): string;
        get password(): boolean;
        set password(val: boolean);
        get align(): cc.Label.HorizontalAlign;
        set align(value: cc.Label.HorizontalAlign);
        get verticalAlign(): cc.Label.VerticalAlign;
        set verticalAlign(value: cc.Label.VerticalAlign);
        get singleLine(): boolean;
        set singleLine(value: boolean);
        requestFocus(): void;
        protected markSizeChanged(): void;
        protected updateText(): void;
        protected updateFont(): void;
        protected updateFontColor(): void;
        protected updateFontSize(): void;
        protected updateOverflow(): void;
        private onTextChanged;
        private onTouchEnd1;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }
}
declare namespace fgui {
    class GTree extends GList {
        treeNodeRender: (node: GTreeNode, obj: GComponent) => void;
        treeNodeWillExpand: (node: GTreeNode, expanded: boolean) => void;
        private _indent;
        private _clickToExpand;
        private _rootNode;
        private _expandedStatusInEvt;
        constructor();
        get rootNode(): GTreeNode;
        get indent(): number;
        set indent(value: number);
        get clickToExpand(): number;
        set clickToExpand(value: number);
        getSelectedNode(): GTreeNode;
        getSelectedNodes(result?: Array<GTreeNode>): Array<GTreeNode>;
        selectNode(node: GTreeNode, scrollItToView?: boolean): void;
        unselectNode(node: GTreeNode): void;
        expandAll(folderNode?: GTreeNode): void;
        collapseAll(folderNode?: GTreeNode): void;
        private createCell;
        _afterInserted(node: GTreeNode): void;
        private getInsertIndexForNode;
        _afterRemoved(node: GTreeNode): void;
        _afterExpanded(node: GTreeNode): void;
        _afterCollapsed(node: GTreeNode): void;
        _afterMoved(node: GTreeNode): void;
        private getFolderEndIndex;
        private checkChildren;
        private hideFolderNode;
        private removeNode;
        private __cellMouseDown;
        private __expandedStateChanged;
        protected dispatchItemEvent(item: GObject, evt: Event): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        protected readItems(buffer: ByteBuffer): void;
    }
}
declare namespace fgui {
    class GTreeNode {
        data?: any;
        private _parent;
        private _children;
        private _expanded;
        private _level;
        private _tree;
        _cell: GComponent;
        _resURL?: string;
        constructor(hasChild: boolean, resURL?: string);
        set expanded(value: boolean);
        get expanded(): boolean;
        get isFolder(): boolean;
        get parent(): GTreeNode;
        get text(): string;
        set text(value: string);
        get icon(): string;
        set icon(value: string);
        get cell(): GComponent;
        get level(): number;
        _setLevel(value: number): void;
        addChild(child: GTreeNode): GTreeNode;
        addChildAt(child: GTreeNode, index: number): GTreeNode;
        removeChild(child: GTreeNode): GTreeNode;
        removeChildAt(index: number): GTreeNode;
        removeChildren(beginIndex?: number, endIndex?: number): void;
        getChildAt(index: number): GTreeNode;
        getChildIndex(child: GTreeNode): number;
        getPrevSibling(): GTreeNode;
        getNextSibling(): GTreeNode;
        setChildIndex(child: GTreeNode, index: number): void;
        swapChildren(child1: GTreeNode, child2: GTreeNode): void;
        swapChildrenAt(index1: number, index2: number): void;
        get numChildren(): number;
        expandToRoot(): void;
        get tree(): GTree;
        _setTree(value: GTree): void;
    }
}
declare namespace fgui {
    interface IUISource {
        fileName: string;
        loaded: boolean;
        load(callback: Function, target: any): void;
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
        objectType?: ObjectType;
        id: string;
        name: string;
        width: number;
        height: number;
        file: string;
        decoded?: boolean;
        loading?: Array<Function>;
        rawData?: ByteBuffer;
        asset?: cc.Asset;
        highResolution?: Array<string>;
        branches?: Array<string>;
        scale9Grid?: cc.Rect;
        scaleByTile?: boolean;
        tileGridIndice?: number;
        smoothing?: boolean;
        hitTestData?: PixelHitTestData;
        interval?: number;
        repeatDelay?: number;
        swing?: boolean;
        frames?: Array<Frame>;
        extensionType?: any;
        skeletonAnchor?: cc.Vec2;
        atlasAsset?: dragonBones.DragonBonesAtlasAsset;
        constructor();
        load(): cc.Asset;
        getBranch(): PackageItem;
        getHighResolution(): PackageItem;
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
        get itemCount(): number;
        get contentPane(): GComponent;
        get list(): GList;
        show(target?: GObject, dir?: PopupDirection | boolean): void;
        private onClickItem;
        private onClickItem2;
        private onDisplay;
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
        get owner(): GObject;
        set target(value: GObject);
        get target(): GObject;
        add(relationType: number, usePercent?: boolean): void;
        internalAdd(relationType: number, usePercent?: boolean): void;
        remove(relationType: number): void;
        copyFrom(source: RelationItem): void;
        dispose(): void;
        get isEmpty(): boolean;
        applyOnSelfResized(dWidth: number, dHeight: number, applyPivot: boolean): void;
        private applyOnXYChanged;
        private applyOnSizeChanged;
        private addRefTarget;
        private releaseRefTarget;
        private __targetXYChanged;
        private __targetSizeChanged;
        private __targetSizeWillChange;
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
        get empty(): boolean;
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
        private _scrollBarDisplayAuto?;
        private _vScrollNone;
        private _hScrollNone;
        private _needRefresh;
        private _refreshBarAxis;
        private _displayOnLeft?;
        private _snapToItem?;
        private _snappingPolicy?;
        _displayInDemand?: boolean;
        private _mouseWheelEnabled;
        private _pageMode?;
        private _inertiaDisabled?;
        private _floating?;
        private _dontClipMargin?;
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
        _loop: number;
        private _headerLockedSize;
        private _footerLockedSize;
        private _refreshEventDispatching;
        private _dragged;
        private _hover;
        private _tweening;
        private _tweenTime;
        private _tweenDuration;
        private _tweenStart;
        private _tweenChange;
        private _pageController?;
        private _hzScrollBar?;
        private _vtScrollBar?;
        private _header?;
        private _footer?;
        static draggingPane: ScrollPane;
        setup(buffer: ByteBuffer): void;
        protected onDestroy(): void;
        hitTest(pt: cc.Vec2, globalPt: cc.Vec2): GObject;
        get owner(): GComponent;
        get hzScrollBar(): GScrollBar;
        get vtScrollBar(): GScrollBar;
        get header(): GComponent;
        get footer(): GComponent;
        get bouncebackEffect(): boolean;
        set bouncebackEffect(sc: boolean);
        get touchEffect(): boolean;
        set touchEffect(sc: boolean);
        set scrollStep(val: number);
        get decelerationRate(): number;
        set decelerationRate(val: number);
        get scrollStep(): number;
        get snapToItem(): boolean;
        set snapToItem(value: boolean);
        get snappingPolicy(): number;
        set snappingPolicy(value: number);
        get mouseWheelEnabled(): boolean;
        set mouseWheelEnabled(value: boolean);
        get isDragged(): boolean;
        get percX(): number;
        set percX(value: number);
        setPercX(value: number, ani?: boolean): void;
        get percY(): number;
        set percY(value: number);
        setPercY(value: number, ani?: boolean): void;
        get posX(): number;
        set posX(value: number);
        setPosX(value: number, ani?: boolean): void;
        get posY(): number;
        set posY(value: number);
        setPosY(value: number, ani?: boolean): void;
        get contentWidth(): number;
        get contentHeight(): number;
        get viewWidth(): number;
        set viewWidth(value: number);
        get viewHeight(): number;
        set viewHeight(value: number);
        get currentPageX(): number;
        set currentPageX(value: number);
        get currentPageY(): number;
        set currentPageY(value: number);
        setCurrentPageX(value: number, ani?: boolean): void;
        setCurrentPageY(value: number, ani?: boolean): void;
        get isBottomMost(): boolean;
        get isRightMost(): boolean;
        get pageController(): Controller;
        set pageController(value: Controller);
        get scrollingPosX(): number;
        get scrollingPosY(): number;
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
        private updatePageController;
        adjustMaskContainer(): void;
        setSize(aWidth: number, aHeight: number): void;
        setContentSize(aWidth: number, aHeight: number): void;
        changeContentSizeOnScrolling(deltaWidth: number, deltaHeight: number, deltaPosX: number, deltaPosY: number): void;
        private handleSizeChanged;
        private posChanged;
        private refresh;
        private refresh2;
        private onTouchBegin;
        private onTouchMove;
        private onTouchEnd;
        private onRollOver;
        private onRollOut;
        private onMouseWheel;
        private updateScrollBarPos;
        updateScrollBarVisible(): void;
        private updateScrollBarVisible2;
        private __barTweenComplete;
        private getLoopPartSize;
        private loopCheckingCurrent;
        private loopCheckingTarget;
        private loopCheckingTarget2;
        private loopCheckingNewPos;
        private alignPosition;
        private alignByPage;
        private updateTargetAndDuration;
        private updateTargetAndDuration2;
        private fixDuration;
        private startTween;
        private killTween;
        private checkRefreshBar;
        protected update(dt: number): boolean;
        private runTween;
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
        private _paused?;
        private _onComplete?;
        private _options;
        private _reversed?;
        private _totalDuration;
        private _autoPlay?;
        private _autoPlayTimes;
        private _autoPlayDelay;
        private _timeScale;
        private _startTime;
        private _endTime;
        constructor(owner: GComponent);
        play(onComplete?: () => void, times?: number, delay?: number, startTime?: number, endTime?: number): void;
        playReverse(onComplete?: () => void, times?: number, delay?: number): void;
        changePlayTimes(value: number): void;
        setAutoPlay(value: boolean, times?: number, delay?: number): void;
        private _play;
        stop(setToComplete?: boolean, processCallback?: boolean): void;
        private stopItem;
        setPaused(paused: boolean): void;
        dispose(): void;
        get playing(): boolean;
        setValue(label: string, ...args: any[]): void;
        setHook(label: string, callback: (label?: string) => void): void;
        clearHooks(): void;
        setTarget(label: string, newTarget: GObject): void;
        setDuration(label: string, value: number): void;
        getLabelTime(label: string): number;
        get timeScale(): number;
        set timeScale(value: number);
        updateFromRelations(targetId: string, dx: number, dy: number): void;
        onEnable(): void;
        onDisable(): void;
        private onDelayedPlay;
        private internalPlay;
        private playItem;
        private skipAnimations;
        private onDelayedPlayItem;
        private onTweenStart;
        private onTweenUpdate;
        private onTweenComplete;
        private onPlayTransCompleted;
        private callHook;
        private checkAllComplete;
        private applyValue;
        setup(buffer: ByteBuffer): void;
        private decodeValue;
    }
}
declare namespace fgui {
    class TranslationHelper {
        static strings: {
            [index: string]: {
                [index: string]: string;
            };
        };
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
        static defaultUIGroup: string;
    }
    function addLoadHandler(ext?: string): void;
    function registerFont(name: string, font: cc.Font | string): void;
    function getFontByName(name: string): cc.Font;
}
declare namespace fgui {
    class UIObjectFactory {
        static counter: number;
        static extensions: {
            [index: string]: new () => GComponent;
        };
        static loaderType: new () => GLoader;
        constructor();
        static setExtension(url: string, type: new () => GComponent): void;
        static setLoaderExtension(type: new () => GLoader): void;
        static resolveExtension(pi: PackageItem): void;
        static newObject(type: number | PackageItem, userClass?: new () => GObject): GObject;
    }
}
declare namespace fgui {
    type PackageDependency = {
        id: string;
        name: string;
    };
    export class UIPackage {
        private _id;
        private _name;
        private _path;
        private _items;
        private _itemsById;
        private _itemsByName;
        private _sprites;
        private _dependencies;
        private _branches;
        _branchIndex: number;
        private _bundle;
        static _constructing: number;
        private static _instById;
        private static _instByName;
        private static _branch;
        private static _vars;
        constructor();
        static get branch(): string;
        static set branch(value: string);
        static getVar(key: string): string;
        static setVar(key: string, value: string): void;
        static getById(id: string): UIPackage;
        static getByName(name: string): UIPackage;
        static addPackage(path: string): UIPackage;
        static loadPackage(bundle: cc.AssetManager.Bundle, path: string, onComplete?: (error: any, pkg: UIPackage) => void): void;
        static loadPackage(bundle: cc.AssetManager.Bundle, path: string, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: any, pkg: UIPackage) => void): void;
        static loadPackage(path: string, onComplete?: (error: any, pkg: UIPackage) => void): void;
        static loadPackage(path: string, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: any, pkg: UIPackage) => void): void;
        static removePackage(packageIdOrName: string): void;
        static createObject(pkgName: string, resName: string, userClass?: new () => GObject): GObject;
        static createObjectFromURL(url: string, userClass?: new () => GObject): GObject;
        static getItemURL(pkgName: string, resName: string): string;
        static getItemByURL(url: string): PackageItem;
        static normalizeURL(url: string): string;
        static setStringsSource(source: string): void;
        private loadPackage;
        dispose(): void;
        get id(): string;
        get name(): string;
        get path(): string;
        get dependencies(): Array<PackageDependency>;
        createObject(resName: string, userClass?: new () => GObject): GObject;
        internalCreateObject(item: PackageItem, userClass?: new () => GObject): GObject;
        getItemById(itemId: string): PackageItem;
        getItemByName(resName: string): PackageItem;
        getItemAssetByName(resName: string): cc.Asset;
        getItemAsset(item: PackageItem): cc.Asset;
        getItemAssetAsync(item: PackageItem, onComplete?: (err: Error, item: PackageItem) => void): void;
        loadAllAssets(): void;
        private loadMovieClip;
        private loadFont;
        private loadSpine;
        private loadDragonBones;
    }
    export {};
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
        private _uiSources?;
        private _inited?;
        private _loading?;
        protected _requestingCmd: number;
        bringToFontOnClick: boolean;
        constructor();
        addUISource(source: IUISource): void;
        set contentPane(val: GComponent);
        get contentPane(): GComponent;
        get frame(): GComponent;
        get closeButton(): GObject;
        set closeButton(value: GObject);
        get dragArea(): GObject;
        set dragArea(value: GObject);
        get contentArea(): GObject;
        set contentArea(value: GObject);
        show(): void;
        showOn(root: GRoot): void;
        hide(): void;
        hideImmediately(): void;
        centerOn(r: GRoot, restraint?: boolean): void;
        toggleStatus(): void;
        get isShowing(): boolean;
        get isTop(): boolean;
        get modal(): boolean;
        set modal(val: boolean);
        bringToFront(): void;
        showModalWait(requestingCmd?: number): void;
        protected layoutModalWaitPane(): void;
        closeModalWait(requestingCmd?: number): boolean;
        get modalWaiting(): boolean;
        init(): void;
        protected onInit(): void;
        protected onShown(): void;
        protected onHide(): void;
        protected doShowAnimation(): void;
        protected doHideAnimation(): void;
        private __uiLoadComplete;
        private _init;
        dispose(): void;
        protected closeEventHandler(evt: cc.Event): void;
        protected onEnable(): void;
        protected onDisable(): void;
        private onTouchBegin_1;
        private onDragStart_1;
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
        Custom3 = 11
    }
    class BlendModeUtils {
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
        private _grayed?;
        private _graySpriteMaterial?;
        private _spriteMaterial?;
        constructor();
        get flip(): FlipType;
        set flip(value: FlipType);
        get fillMethod(): FillMethod;
        set fillMethod(value: FillMethod);
        get fillOrigin(): FillOrigin;
        set fillOrigin(value: FillOrigin);
        get fillClockwise(): boolean;
        set fillClockwise(value: boolean);
        get fillAmount(): number;
        set fillAmount(value: number);
        private setupFill;
        get grayed(): boolean;
        set grayed(value: boolean);
    }
}
declare namespace fgui {
    interface Frame {
        rect: cc.Rect;
        addDelay: number;
        texture?: cc.SpriteFrame;
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
        get frames(): Array<Frame>;
        set frames(value: Array<Frame>);
        get frameCount(): number;
        get frame(): number;
        set frame(value: number);
        get playing(): boolean;
        set playing(value: boolean);
        get smoothing(): boolean;
        set smoothing(value: boolean);
        rewind(): void;
        syncStatus(anotherMc: MovieClip): void;
        advance(timeInSeconds: number): void;
        setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: Function, callbackObj?: any): void;
        protected update(dt: number): void;
        private drawFrame;
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
        get isShiftDown(): boolean;
        get isCtrlDown(): boolean;
        captureTouch(): void;
        static _borrow(type: string, bubbles?: boolean): Event;
        static _return(evt: Event): void;
    }
}
declare namespace fgui {
    interface IHitTest {
        hitTest(pt: cc.Vec2, globalPt: cc.Vec2): boolean;
    }
    class PixelHitTest implements IHitTest {
        private _data;
        offsetX: number;
        offsetY: number;
        scaleX: number;
        scaleY: number;
        constructor(data: PixelHitTestData, offsetX?: number, offsetY?: number);
        hitTest(pt: cc.Vec2): boolean;
    }
    class PixelHitTestData {
        pixelWidth: number;
        scale: number;
        pixels: Uint8Array;
        constructor(ba: ByteBuffer);
    }
    class ChildHitArea implements IHitTest {
        private _child;
        constructor(child: GObject);
        hitTest(pt: cc.Vec2, globalPt: cc.Vec2): boolean;
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
        private touchBeginHandler;
        private touchMoveHandler;
        private touchEndHandler;
        private touchCancelHandler;
        private mouseDownHandler;
        private mouseUpHandler;
        private mouseMoveHandler;
        private mouseWheelHandler;
        private updateInfo;
        private getInfo;
        private setBegin;
        private setEnd;
        private clickTest;
        private handleRollOver;
        private getEvent;
    }
}
declare namespace fgui {
    class GearBase {
        static disableAllTweenEffect: boolean;
        protected _owner: GObject;
        protected _controller: Controller;
        protected _tweenConfig?: GearTweenConfig;
        static create(owner: GObject, index: number): GearBase;
        constructor(owner: GObject);
        dispose(): void;
        get controller(): Controller;
        set controller(val: Controller);
        get tweenConfig(): GearTweenConfig;
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
        get connected(): boolean;
    }
}
declare namespace fgui {
    class GearDisplay2 extends GearBase {
        pages: string[];
        condition: number;
        private _visible;
        constructor(owner: GObject);
        protected init(): void;
        apply(): void;
        evaluate(connected: boolean): boolean;
    }
}
declare namespace fgui {
    class GearFontSize extends GearBase {
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
        private __tweenUpdate;
        private __tweenComplete;
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
        private __tweenUpdate;
        private __tweenComplete;
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
        positionsInPercent: boolean;
        private _storage;
        private _default;
        constructor(owner: GObject);
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        addExtStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        private __tweenUpdate;
        private __tweenComplete;
        updateState(): void;
        updateFromRelations(dx: number, dy: number): void;
    }
}
declare namespace fgui {
    function evaluateEase(easeType: number, time: number, duration: number, overshootOrAmplitude: number, period: number): number;
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
    class GPath {
        private _segments;
        private _points;
        private _fullLength;
        constructor();
        get length(): number;
        create(pt1: Array<GPathPoint> | GPathPoint, pt2?: GPathPoint, pt3?: GPathPoint, pt4?: GPathPoint): void;
        private createSplineSegment;
        clear(): void;
        getPointAt(t: number, result?: cc.Vec2): cc.Vec2;
        get segmentCount(): number;
        getAnchorsInSegment(segmentIndex: number, points?: Array<cc.Vec2>): Array<cc.Vec2>;
        getPointsInSegment(segmentIndex: number, t0: number, t1: number, points?: Array<cc.Vec2>, ts?: Array<number>, pointDensity?: number): Array<cc.Vec2>;
        getAllPoints(points?: Array<cc.Vec2>, ts?: Array<number>, pointDensity?: number): Array<cc.Vec2>;
        private onCRSplineCurve;
        private onBezierCurve;
    }
}
declare namespace fgui {
    enum CurveType {
        CRSpline = 0,
        Bezier = 1,
        CubicBezier = 2,
        Straight = 3
    }
    class GPathPoint {
        x: number;
        y: number;
        control1_x: number;
        control1_y: number;
        control2_x: number;
        control2_y: number;
        curveType: number;
        constructor();
        static newPoint(x?: number, y?: number, curveType?: number): GPathPoint;
        static newBezierPoint(x?: number, y?: number, control1_x?: number, control1_y?: number): GPathPoint;
        static newCubicBezierPoint(x?: number, y?: number, control1_x?: number, control1_y?: number, control2_x?: number, control2_y?: number): GPathPoint;
        clone(): GPathPoint;
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
        static isTweening(target: any, propType?: any): Boolean;
        static kill(target: any, complete?: boolean, propType?: any): void;
        static getTween(target: any, propType?: any): GTweener;
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
        private _path;
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
        get delay(): number;
        setDuration(value: number): GTweener;
        get duration(): number;
        setBreakpoint(value: number): GTweener;
        setEase(value: number): GTweener;
        setEasePeriod(value: number): GTweener;
        setEaseOvershootOrAmplitude(value: number): GTweener;
        setRepeat(repeat: number, yoyo?: boolean): GTweener;
        get repeat(): number;
        setTimeScale(value: number): GTweener;
        setSnapping(value: boolean): GTweener;
        setTarget(value: any, propType?: any): GTweener;
        get target(): any;
        setPath(value: GPath): GTweener;
        setUserData(value: any): GTweener;
        get userData(): any;
        onUpdate(callback: Function, target?: any): GTweener;
        onStart(callback: Function, target?: any): GTweener;
        onComplete(callback: Function, target?: any): GTweener;
        get startValue(): TweenValue;
        get endValue(): TweenValue;
        get value(): TweenValue;
        get deltaValue(): TweenValue;
        get normalizedTime(): number;
        get completed(): boolean;
        get allCompleted(): boolean;
        setPaused(paused: boolean): GTweener;
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
        private update;
        private callStartCallback;
        private callUpdateCallback;
        private callCompleteCallback;
    }
}
declare namespace fgui {
    class TweenManager {
        static createTween(): GTweener;
        static isTweening(target: any, propType?: any): boolean;
        static killTweens(target: any, completed: boolean, propType?: any): boolean;
        static getTween(target: any, propType?: any): GTweener;
        private static update;
    }
}
declare namespace fgui {
    class TweenValue {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor();
        get color(): number;
        set color(value: number);
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
        get data(): Uint8Array;
        get position(): number;
        set position(value: number);
        skip(count: number): void;
        private validate;
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
        readSArray(cnt: number): Array<string>;
        writeS(value: string): void;
        readColor(hasAlpha?: boolean): cc.Color;
        readChar(): string;
        readBuffer(): ByteBuffer;
        seek(indexTablePos: number, blockIndex: number): boolean;
    }
}
declare namespace fgui {
    class ColorMatrix {
        readonly matrix: Array<number>;
        constructor(p_brightness?: number, p_contrast?: number, p_saturation?: number, p_hue?: number);
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
        protected _handlers: {
            [index: string]: (tagName: string, end: boolean, attr: string) => string;
        };
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
        static startsWith(source: string, str: string, ignoreCase?: boolean): boolean;
        static encodeHTML(str: string): string;
        static clamp(value: number, min: number, max: number): number;
        static clamp01(value: number): number;
        static lerp(start: number, end: number, percent: number): number;
        static getTime(): number;
        static toGrayed(c: cc.Color): cc.Color;
        static repeat(t: number, length: number): number;
        static distance(x1: number, y1: number, x2: number, y2: number): number;
    }
}
import fairygui = fgui;