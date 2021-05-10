
namespace fgui {

    export class GObject {
        public data?: any;
        public packageItem?: PackageItem;
        public static draggingObject: GObject;

        protected _x: number = 0;
        protected _y: number = 0;
        protected _alpha: number = 1;
        protected _visible: boolean = true;
        protected _touchable: boolean = true;
        protected _grayed?: boolean;
        protected _draggable?: boolean;
        protected _skewX: number = 0;
        protected _skewY: number = 0;
        protected _pivotAsAnchor?: boolean;
        protected _sortingOrder: number = 0;
        protected _internalVisible: boolean = true;
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

        public sourceWidth: number = 0;
        public sourceHeight: number = 0;
        public initWidth: number = 0;
        public initHeight: number = 0;
        public minWidth: number = 0;
        public minHeight: number = 0;
        public maxWidth: number = 0;
        public maxHeight: number = 0;

        public _parent: GComponent;
        public _width: number = 0;
        public _height: number = 0;
        public _rawWidth: number = 0;
        public _rawHeight: number = 0;
        public _id: string;
        public _name: string;
        public _underConstruct: boolean;
        public _gearLocked?: boolean;
        public _sizePercentInGroup: number = 0;
        public _touchDisabled?: boolean;
        public _partner: GObjectPartner;
        public _treeNode?: GTreeNode;

        private _hitTestPt?: cc.Vec2;

        public static _defaultGroupIndex: number = -1;

        public constructor() {
            this._node = new cc.Node();
            if (GObject._defaultGroupIndex == -1) {
                GObject._defaultGroupIndex = 0;
                let groups: Array<string> = (<any>cc.game).groupList;
                let cnt = groups.length;
                for (let i = 0; i < cnt; i++) {
                    if (groups[i].toLowerCase() == UIConfig.defaultUIGroup.toLowerCase()) {
                        GObject._defaultGroupIndex = i;
                        break;
                    }
                }
            }
            this._node["$gobj"] = this;
            this._node.groupIndex = GObject._defaultGroupIndex;
            this._node.setAnchorPoint(0, 1);
            this._node.on(cc.Node.EventType.ANCHOR_CHANGED, this.handleAnchorChanged, this);

            this._id = this._node.uuid;
            this._name = "";

            this._relations = new Relations(this);
            this._gears = new Array<GearBase>(10);
            this._blendMode = BlendMode.Normal;

            this._partner = this._node.addComponent(GObjectPartner);
        }

        public get id(): string {
            return this._id;
        }

        public get name(): string {
            return this._name;
        }

        public set name(value: string) {
            this._name = value;
        }

        public get x(): number {
            return this._x;
        }

        public set x(value: number) {
            this.setPosition(value, this._y);
        }

        public get y(): number {
            return this._y;
        }

        public set y(value: number) {
            this.setPosition(this._x, value);
        }

        public setPosition(xv: number, yv: number): void {
            if (this._x != xv || this._y != yv) {
                var dx: number = xv - this._x;
                var dy: number = yv - this._y;
                this._x = xv;
                this._y = yv;

                this.handlePositionChanged();
                if (this instanceof GGroup)
                    this.moveChildren(dx, dy);

                this.updateGear(1);

                if (this._parent && !(this._parent instanceof GList)) {
                    this._parent.setBoundsChangedFlag();
                    if (this._group)
                        this._group.setBoundsChangedFlag(true);
                    this._node.emit(Event.XY_CHANGED, this);
                }

                if (GObject.draggingObject == this && !sUpdateInDragging)
                    this.localToGlobalRect(0, 0, this._width, this._height, sGlobalRect);
            }
        }

        public get xMin(): number {
            return this._pivotAsAnchor ? (this._x - this._width * this.node.anchorX) : this._x;
        }

        public set xMin(value: number) {
            if (this._pivotAsAnchor)
                this.setPosition(value + this._width * this.node.anchorX, this._y);
            else
                this.setPosition(value, this._y);
        }

        public get yMin(): number {
            return this._pivotAsAnchor ? (this._y - this._height * (1 - this.node.anchorY)) : this._y;
        }

        public set yMin(value: number) {
            if (this._pivotAsAnchor)
                this.setPosition(this._x, value + this._height * (1 - this.node.anchorY));
            else
                this.setPosition(this._x, value);
        }

        public get pixelSnapping(): boolean {
            return this._pixelSnapping;
        }

        public set pixelSnapping(value: boolean) {
            if (this._pixelSnapping != value) {
                this._pixelSnapping = value;
                this.handlePositionChanged();
            }
        }

        public center(restraint?: boolean): void {
            var r: GComponent;
            if (this._parent)
                r = this.parent;
            else
                r = this.root;

            this.setPosition((r.width - this._width) / 2, (r.height - this._height) / 2);
            if (restraint) {
                this.addRelation(r, RelationType.Center_Center);
                this.addRelation(r, RelationType.Middle_Middle);
            }
        }

        public get width(): number {
            this.ensureSizeCorrect();
            if (this._relations.sizeDirty)
                this._relations.ensureRelationsSizeCorrect();
            return this._width;
        }

        public set width(value: number) {
            this.setSize(value, this._rawHeight);
        }

        public get height(): number {
            this.ensureSizeCorrect();
            if (this._relations.sizeDirty)
                this._relations.ensureRelationsSizeCorrect();
            return this._height;
        }

        public set height(value: number) {
            this.setSize(this._rawWidth, value);
        }

        public setSize(wv: number, hv: number, ignorePivot?: boolean): void {
            if (this._rawWidth != wv || this._rawHeight != hv) {
                this._rawWidth = wv;
                this._rawHeight = hv;
                if (wv < this.minWidth)
                    wv = this.minWidth;
                if (hv < this.minHeight)
                    hv = this.minHeight;
                if (this.maxWidth > 0 && wv > this.maxWidth)
                    wv = this.maxWidth;
                if (this.maxHeight > 0 && hv > this.maxHeight)
                    hv = this.maxHeight;
                var dWidth: number = wv - this._width;
                var dHeight: number = hv - this._height;
                this._width = wv;
                this._height = hv;

                this.handleSizeChanged();
                if ((this.node.anchorX != 0 || this.node.anchorY != 1) && !this._pivotAsAnchor && !ignorePivot)
                    this.setPosition(this.x - this.node.anchorX * dWidth, this.y - (1 - this.node.anchorY) * dHeight);
                else
                    this.handlePositionChanged();

                if (this instanceof GGroup)
                    this.resizeChildren(dWidth, dHeight);

                this.updateGear(2);

                if (this._parent) {
                    this._relations.onOwnerSizeChanged(dWidth, dHeight, this._pivotAsAnchor || !ignorePivot);
                    this._parent.setBoundsChangedFlag();
                    if (this._group)
                        this._group.setBoundsChangedFlag();
                }

                this._node.emit(Event.SIZE_CHANGED, this);
            }
        }

        public makeFullScreen(): void {
            this.setSize(GRoot.inst.width, GRoot.inst.height);
        }

        public ensureSizeCorrect(): void {
        }

        public get actualWidth(): number {
            return this.width * Math.abs(this._node.scaleX);
        }

        public get actualHeight(): number {
            return this.height * Math.abs(this._node.scaleY);
        }

        public get scaleX(): number {
            return this._node.scaleX;
        }

        public set scaleX(value: number) {
            this.setScale(value, this._node.scaleY);
        }

        public get scaleY(): number {
            return this._node.scaleY;
        }

        public set scaleY(value: number) {
            this.setScale(this._node.scaleX, value);
        }

        public setScale(sx: number, sy: number) {
            if (this._node.scaleX != sx || this._node.scaleY != sy) {
                this._node.setScale(sx, sy);

                this.updateGear(2);
            }
        }

        public get skewX(): number {
            return this._skewX;
        }

        public set skewX(value: number) {
            this.setSkew(value, this._skewY);
        }

        public get skewY(): number {
            return this._skewY;
        }

        public set skewY(value: number) {
            this.setSkew(this._skewX, value);
        }

        public setSkew(xv: number, yv: number) {
            if (this._skewX != xv || this._skewY != yv) {
                this._skewX = xv;
                this._skewY = yv;
                this._node.skewX = xv;
                this._node.skewY = yv;
            }
        }

        public get pivotX(): number {
            return this.node.anchorX;
        }

        public set pivotX(value: number) {
            this.node.anchorX = value;
        }

        public get pivotY(): number {
            return 1 - this.node.anchorY;
        }

        public set pivotY(value: number) {
            this.node.anchorY = 1 - value;
        }

        public setPivot(xv: number, yv: number, asAnchor?: boolean): void {
            if (this.node.anchorX != xv || this.node.anchorY != 1 - yv) {
                this._pivotAsAnchor = asAnchor;
                this.node.setAnchorPoint(xv, 1 - yv);
            }
            else if (this._pivotAsAnchor != asAnchor) {
                this._pivotAsAnchor = asAnchor;
                this.handlePositionChanged();
            }
        }

        public get pivotAsAnchor(): boolean {
            return this._pivotAsAnchor;
        }

        public get touchable(): boolean {
            return this._touchable;
        }

        public set touchable(value: boolean) {
            if (this._touchable != value) {
                this._touchable = value;
                this.updateGear(3);
            }
        }

        public get grayed(): boolean {
            return this._grayed;
        }

        public set grayed(value: boolean) {
            if (this._grayed != value) {
                this._grayed = value;
                this.handleGrayedChanged();
                this.updateGear(3);
            }
        }

        public get enabled(): boolean {
            return !this._grayed && this._touchable;
        }

        public set enabled(value: boolean) {
            this.grayed = !value;
            this.touchable = value;
        }

        public get rotation(): number {
            return -this._node.angle;
        }

        public set rotation(value: number) {
            value = -value;
            if (this._node.angle != value) {
                this._node.angle = value;
                this.updateGear(3);
            }
        }

        public get alpha(): number {
            return this._alpha;
        }

        public set alpha(value: number) {
            if (this._alpha != value) {
                this._alpha = value;

                this._node.opacity = this._alpha * 255;

                if (this instanceof GGroup)
                    this.handleAlphaChanged();

                this.updateGear(3);
            }
        }

        public get visible(): boolean {
            return this._visible;
        }

        public set visible(value: boolean) {
            if (this._visible != value) {
                this._visible = value;

                this.handleVisibleChanged();

                if (this._group && this._group.excludeInvisibles)
                    this._group.setBoundsChangedFlag();
            }
        }

        public get _finalVisible(): boolean {
            return this._visible && this._internalVisible && (!this._group || this._group._finalVisible);
        }

        public get internalVisible3(): boolean {
            return this._visible && this._internalVisible;
        }

        public get sortingOrder(): number {
            return this._sortingOrder;
        }

        public set sortingOrder(value: number) {
            if (value < 0)
                value = 0;
            if (this._sortingOrder != value) {
                var old: number = this._sortingOrder;
                this._sortingOrder = value;
                if (this._parent)
                    this._parent.childSortingOrderChanged(this, old, this._sortingOrder);
            }
        }

        public requestFocus(): void {
        }

        public get tooltips(): string {
            return this._tooltips;
        }

        public set tooltips(value: string) {
            if (this._tooltips) {
                this._node.off(fgui.Event.ROLL_OVER, this.onRollOver, this);
                this._node.off(fgui.Event.ROLL_OUT, this.onRollOut, this);
            }

            this._tooltips = value;

            if (this._tooltips) {
                this._node.on(fgui.Event.ROLL_OVER, this.onRollOver, this);
                this._node.on(fgui.Event.ROLL_OUT, this.onRollOut, this);
            }
        }

        public get blendMode(): BlendMode {
            return this._blendMode;
        }

        public set blendMode(value: BlendMode) {
            if (this._blendMode != value) {
                this._blendMode = value;
                BlendModeUtils.apply(this._node, value);
            }
        }

        public get onStage(): boolean {
            return this._node && this._node.activeInHierarchy;
        }

        public get resourceURL(): string {
            if (this.packageItem)
                return "ui://" + this.packageItem.owner.id + this.packageItem.id;
            else
                return null;
        }

        public set group(value: GGroup) {
            if (this._group != value) {
                if (this._group)
                    this._group.setBoundsChangedFlag();
                this._group = value;
                if (this._group)
                    this._group.setBoundsChangedFlag();
            }
        }

        public get group(): GGroup {
            return this._group;
        }

        public getGear(index: number): GearBase {
            var gear: GearBase = this._gears[index];
            if (!gear)
                this._gears[index] = gear = GearBase.create(this, index);
            return gear;
        }

        protected updateGear(index: number): void {
            if (this._underConstruct || this._gearLocked)
                return;

            var gear: GearBase = this._gears[index];
            if (gear && gear.controller)
                gear.updateState();
        }

        public checkGearController(index: number, c: Controller): boolean {
            return this._gears[index] && this._gears[index].controller == c;
        }

        public updateGearFromRelations(index: number, dx: number, dy: number): void {
            if (this._gears[index])
                this._gears[index].updateFromRelations(dx, dy);
        }

        public addDisplayLock(): number {
            var gearDisplay: GearDisplay = <GearDisplay>this._gears[0];
            if (gearDisplay && gearDisplay.controller) {
                var ret: number = gearDisplay.addLock();
                this.checkGearDisplay();

                return ret;
            }
            else
                return 0;
        }

        public releaseDisplayLock(token: number): void {
            var gearDisplay: GearDisplay = <GearDisplay>this._gears[0];
            if (gearDisplay && gearDisplay.controller) {
                gearDisplay.releaseLock(token);
                this.checkGearDisplay();
            }
        }

        private checkGearDisplay(): void {
            if (this._handlingController)
                return;

            var connected: boolean = this._gears[0] == null || (<GearDisplay>this._gears[0]).connected;
            if (this._gears[8])
                connected = (<GearDisplay2>this._gears[8]).evaluate(connected);

            if (connected != this._internalVisible) {
                this._internalVisible = connected;
                this.handleVisibleChanged();

                if (this._group && this._group.excludeInvisibles)
                    this._group.setBoundsChangedFlag();
            }
        }

        public get gearXY(): GearXY {
            return <GearXY>this.getGear(1);
        }

        public get gearSize(): GearSize {
            return <GearSize>this.getGear(2);
        }

        public get gearLook(): GearLook {
            return <GearLook>this.getGear(3);
        }

        public get relations(): Relations {
            return this._relations;
        }

        public addRelation(target: GObject, relationType: number, usePercent?: boolean): void {
            this._relations.add(target, relationType, usePercent);
        }

        public removeRelation(target: GObject, relationType: number): void {
            this._relations.remove(target, relationType);
        }

        public get node(): cc.Node {
            return this._node;
        }

        public get parent(): GComponent {
            return this._parent;
        }

        public removeFromParent(): void {
            if (this._parent)
                this._parent.removeChild(this);
        }

        public removeFromParentStayGroup(): void {
            if (this._parent)
                this._parent.removeChildStayGroup(this);
        }

        public findParent(): GObject {
            if (this._parent)
                return this._parent;

            //可能有些不直接在children里，但node挂着的
            let pn: cc.Node = this._node.parent;
            while (pn) {
                let gobj = pn["$gobj"];
                if (gobj)
                    return gobj;

                pn = pn.parent;
            }

            return null;
        }

        public get root(): GRoot {
            if (this instanceof GRoot)
                return this;

            var p: GObject = this._parent;
            while (p) {
                if (p instanceof GRoot)
                    return p;
                p = p.parent;
            }
            return GRoot.inst;
        }

        public get asCom(): GComponent {
            return <GComponent><any>this;
        }

        public get asButton(): GButton {
            return <GButton><any>this;
        }

        public get asLabel(): GLabel {
            return <GLabel><any>this;
        }

        public get asProgress(): GProgressBar {
            return <GProgressBar><any>this;
        }

        public get asTextField(): GTextField {
            return <GTextField><any>this;
        }

        public get asRichTextField(): GRichTextField {
            return <GRichTextField><any>this;
        }

        public get asTextInput(): GTextInput {
            return <GTextInput><any>this;
        }

        public get asLoader(): GLoader {
            return <GLoader><any>this;
        }

        public get asList(): GList {
            return <GList><any>this;
        }

        public get asTree(): GTree {
            return <GTree><any>this;
        }

        public get asGraph(): GGraph {
            return <GGraph><any>this;
        }

        public get asGroup(): GGroup {
            return <GGroup><any>this;
        }

        public get asSlider(): GSlider {
            return <GSlider><any>this;
        }

        public get asComboBox(): GComboBox {
            return <GComboBox><any>this;
        }

        public get asImage(): GImage {
            return <GImage><any>this;
        }

        public get asMovieClip(): GMovieClip {
            return <GMovieClip><any>this;
        }

        public static cast(obj: cc.Node): GObject {
            return obj["$gobj"];
        }

        public get text(): string {
            return null;
        }

        public set text(value: string) {
        }

        public get icon(): string {
            return null;
        }

        public set icon(value: string) {
        }

        public get treeNode(): GTreeNode {
            return this._treeNode;
        }

        public dispose(): void {
            let n = this._node;
            if (!n)
                return;

            this.removeFromParent();
            this._relations.dispose();

            this._node = null;
            n.destroy();

            for (var i: number = 0; i < 10; i++) {
                var gear: GearBase = this._gears[i];
                if (gear)
                    gear.dispose();
            }
        }

        protected onEnable() {
        }

        protected onDisable() {
        }

        protected onUpdate(dt) {
        }

        protected onDestroy() {
        }

        public onClick(listener: Function, target?: any): void {
            this._node.on(Event.CLICK, listener, target);
        }

        public onceClick(listener: Function, target?: any): void {
            this._node.once(Event.CLICK, listener, target);
        }

        public offClick(listener: Function, target?: any): void {
            this._node.off(Event.CLICK, listener, target);
        }

        public clearClick(): void {
            this._node.off(Event.CLICK);
        }

        public hasClickListener(): boolean {
            return this._node.hasEventListener(Event.CLICK);
        }

        public on(type: string, listener: Function, target?: any): void {
            if (type == Event.DISPLAY || type == Event.UNDISPLAY)
                this._partner._emitDisplayEvents = true;

            this._node.on(type, listener, target);
        }

        public once(type: string, listener: Function, target?: any): void {
            if (type == Event.DISPLAY || type == Event.UNDISPLAY)
                this._partner._emitDisplayEvents = true;

            this._node.once(type, listener, target);
        }

        public off(type: string, listener?: Function, target?: any): void {
            this._node.off(type, listener, target);
        }

        public get draggable(): boolean {
            return this._draggable;
        }

        public set draggable(value: boolean) {
            if (this._draggable != value) {
                this._draggable = value;
                this.initDrag();
            }
        }

        public get dragBounds(): cc.Rect {
            return this._dragBounds;
        }

        public set dragBounds(value: cc.Rect) {
            this._dragBounds = value;
        }

        public startDrag(touchId?: number): void {
            if (!this._node.activeInHierarchy)
                return;

            this.dragBegin(touchId);
        }

        public stopDrag(): void {
            this.dragEnd();
        }

        public get dragging(): boolean {
            return GObject.draggingObject == this;
        }

        public localToGlobal(ax?: number, ay?: number, result?: cc.Vec2): cc.Vec2 {
            ax = ax || 0;
            ay = ay || 0;
            result = result || new cc.Vec2();
            result.x = ax;
            result.y = ay;
            result.y = -result.y;
            if (!this._pivotAsAnchor) {
                result.x -= this.node.anchorX * this._width;
                result.y += (1 - this.node.anchorY) * this._height;
            }
            this._node.convertToWorldSpaceAR(result, result);
            result.y = GRoot.inst.height - result.y;
            return result;
        }

        public globalToLocal(ax?: number, ay?: number, result?: cc.Vec2): cc.Vec2 {
            ax = ax || 0;
            ay = ay || 0;
            result = result || new cc.Vec2();
            result.x = ax;
            result.y = GRoot.inst.height - ay;
            this._node.convertToNodeSpaceAR(result, result);
            if (!this._pivotAsAnchor) {
                result.x += this._node.anchorX * this._width;
                result.y -= (1 - this._node.anchorY) * this._height;
            }
            result.y = -result.y;
            return result;
        }

        public localToGlobalRect(ax?: number, ay?: number, aw?: number, ah?: number, result?: cc.Rect): cc.Rect {
            ax = ax || 0;
            ay = ay || 0;
            aw = aw || 0;
            ah = ah || 0;
            result = result || new cc.Rect();
            var pt: cc.Vec2 = this.localToGlobal(ax, ay);
            result.x = pt.x;
            result.y = pt.y;
            pt = this.localToGlobal(ax + aw, ay + ah, pt);
            result.xMax = pt.x;
            result.yMax = pt.y;
            return result;
        }

        public globalToLocalRect(ax?: number, ay?: number, aw?: number, ah?: number, result?: cc.Rect): cc.Rect {
            ax = ax || 0;
            ay = ay || 0;
            aw = aw || 0;
            ah = ah || 0;
            result = result || new cc.Rect();
            var pt: cc.Vec2 = this.globalToLocal(ax, ay);
            result.x = pt.x;
            result.y = pt.y;
            pt = this.globalToLocal(ax + aw, ay + ah, pt);
            result.xMax = pt.x;
            result.yMax = pt.y;
            return result;
        }

        public handleControllerChanged(c: Controller): void {
            this._handlingController = true;
            for (var i: number = 0; i < 10; i++) {
                var gear: GearBase = this._gears[i];
                if (gear && gear.controller == c)
                    gear.apply();
            }
            this._handlingController = false;

            this.checkGearDisplay();
        }

        protected handleAnchorChanged(): void {
            this.handlePositionChanged();
        }

        public handlePositionChanged(): void {
            var xv: number = this._x;
            var yv: number = -this._y;
            if (!this._pivotAsAnchor) {
                xv += this.node.anchorX * this._width;
                yv -= (1 - this.node.anchorY) * this._height;
            }
            if (this._pixelSnapping) {
                xv = Math.round(xv);
                yv = Math.round(yv);
            }
            this._node.setPosition(xv, yv);
        }

        protected handleSizeChanged(): void {
            this._node.setContentSize(this._width, this._height);
        }

        protected handleGrayedChanged(): void {
            //nothing is base
        }

        public handleVisibleChanged(): void {
            this._node.active = this._finalVisible;

            if (this instanceof GGroup)
                this.handleVisibleChanged();

            if (this._parent)
                this._parent.setBoundsChangedFlag();
        }

        public hitTest(globalPt: cc.Vec2, forTouch?: boolean): GObject {
            if (forTouch == null) forTouch = true;
            if (forTouch && (this._touchDisabled || !this._touchable || !this._node.activeInHierarchy))
                return null;

            if (!this._hitTestPt)
                this._hitTestPt = new cc.Vec2();
            this.globalToLocal(globalPt.x, globalPt.y, this._hitTestPt);
            if (this._pivotAsAnchor) {
                this._hitTestPt.x += this.node.anchorX * this._width;
                this._hitTestPt.y += (1 - this.node.anchorY) * this._height;
            }
            return this._hitTest(this._hitTestPt, globalPt);
        }

        protected _hitTest(pt: cc.Vec2, globalPt: cc.Vec2): GObject {
            if (pt.x >= 0 && pt.y >= 0 && pt.x < this._width && pt.y < this._height)
                return this;
            else
                return null;
        }

        public getProp(index: number): any {
            switch (index) {
                case ObjectPropID.Text:
                    return this.text;
                case ObjectPropID.Icon:
                    return this.icon;
                case ObjectPropID.Color:
                    return null;
                case ObjectPropID.OutlineColor:
                    return null;
                case ObjectPropID.Playing:
                    return false;
                case ObjectPropID.Frame:
                    return 0;
                case ObjectPropID.DeltaTime:
                    return 0;
                case ObjectPropID.TimeScale:
                    return 1;
                case ObjectPropID.FontSize:
                    return 0;
                case ObjectPropID.Selected:
                    return false;
                default:
                    return undefined;
            }
        }

        public setProp(index: number, value: any): void {
            switch (index) {
                case ObjectPropID.Text:
                    this.text = value;
                    break;

                case ObjectPropID.Icon:
                    this.icon = value;
                    break;
            }
        }

        public constructFromResource(): void {
        }

        public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
            buffer.seek(beginPos, 0);
            buffer.skip(5);

            var f1: number;
            var f2: number;

            this._id = buffer.readS();
            this._name = buffer.readS();
            f1 = buffer.readInt();
            f2 = buffer.readInt();
            this.setPosition(f1, f2);

            if (buffer.readBool()) {
                this.initWidth = buffer.readInt();
                this.initHeight = buffer.readInt();
                this.setSize(this.initWidth, this.initHeight, true);
            }

            if (buffer.readBool()) {
                this.minWidth = buffer.readInt();
                this.maxWidth = buffer.readInt();
                this.minHeight = buffer.readInt();
                this.maxHeight = buffer.readInt();
            }

            if (buffer.readBool()) {
                f1 = buffer.readFloat();
                f2 = buffer.readFloat();
                this.setScale(f1, f2);
            }

            if (buffer.readBool()) {
                f1 = buffer.readFloat();
                f2 = buffer.readFloat();
                this.setSkew(f1, f2);
            }

            if (buffer.readBool()) {
                f1 = buffer.readFloat();
                f2 = buffer.readFloat();
                this.setPivot(f1, f2, buffer.readBool());
            }

            f1 = buffer.readFloat();
            if (f1 != 1)
                this.alpha = f1;

            f1 = buffer.readFloat();
            if (f1 != 0)
                this.rotation = f1;

            if (!buffer.readBool())
                this.visible = false;
            if (!buffer.readBool())
                this.touchable = false;
            if (buffer.readBool())
                this.grayed = true;
            this.blendMode = buffer.readByte();

            var filter: number = buffer.readByte();
            if (filter == 1) {
                //TODO: filter support
            }

            var str: string = buffer.readS();
            if (str != null)
                this.data = str;
        }

        public setup_afterAdd(buffer: ByteBuffer, beginPos: number): void {
            buffer.seek(beginPos, 1);

            var str: string = buffer.readS();
            if (str != null)
                this.tooltips = str;

            var groupId: number = buffer.readShort();
            if (groupId >= 0)
                this.group = <GGroup>this.parent.getChildAt(groupId);

            buffer.seek(beginPos, 2);

            var cnt: number = buffer.readShort();
            for (var i: number = 0; i < cnt; i++) {
                var nextPos: number = buffer.readShort();
                nextPos += buffer.position;

                var gear: GearBase = this.getGear(buffer.readByte());
                gear.setup(buffer);

                buffer.position = nextPos;
            }
        }

        //toolTips support
        private onRollOver(): void {
            this.root.showTooltips(this.tooltips);
        };
        private onRollOut(): void {
            this.root.hideTooltips();
        };

        //drag support
        //-------------------------------------------------------------------
        private initDrag(): void {
            if (this._draggable) {
                this.on(Event.TOUCH_BEGIN, this.onTouchBegin_0, this);
                this.on(Event.TOUCH_MOVE, this.onTouchMove_0, this);
                this.on(Event.TOUCH_END, this.onTouchEnd_0, this);
            }
            else {
                this.off(Event.TOUCH_BEGIN, this.onTouchBegin_0, this);
                this.off(Event.TOUCH_MOVE, this.onTouchMove_0, this);
                this.off(Event.TOUCH_END, this.onTouchEnd_0, this);
            }
        }

        private dragBegin(touchId: number): void {
            if (GObject.draggingObject) {
                let tmp: GObject = GObject.draggingObject;
                tmp.stopDrag();
                GObject.draggingObject = null;

                tmp._node.emit(Event.DRAG_END);
            }

            if (touchId == undefined)
                touchId = GRoot.inst.inputProcessor.getAllTouches()[0];

            sGlobalDragStart.set(GRoot.inst.getTouchPosition(touchId));
            this.localToGlobalRect(0, 0, this._width, this._height, sGlobalRect);

            GObject.draggingObject = this;
            this._dragTesting = true;
            GRoot.inst.inputProcessor.addTouchMonitor(touchId, this);

            this.on(Event.TOUCH_MOVE, this.onTouchMove_0, this);
            this.on(Event.TOUCH_END, this.onTouchEnd_0, this);
        }

        private dragEnd(): void {
            if (GObject.draggingObject == this) {
                this._dragTesting = false;
                GObject.draggingObject = null;
            }
            sDragQuery = false;
        }

        private onTouchBegin_0(evt: Event): void {
            if (this._dragStartPos == null)
                this._dragStartPos = new cc.Vec2();

            this._dragStartPos.set(evt.pos);
            this._dragTesting = true;
            evt.captureTouch();
        }

        private onTouchMove_0(evt: Event): void {
            if (GObject.draggingObject != this && this._draggable && this._dragTesting) {
                var sensitivity: number = UIConfig.touchDragSensitivity;
                if (this._dragStartPos
                    && Math.abs(this._dragStartPos.x - evt.pos.x) < sensitivity
                    && Math.abs(this._dragStartPos.y - evt.pos.y) < sensitivity)
                    return;

                this._dragTesting = false;

                sDragQuery = true;
                this._node.emit(Event.DRAG_START, evt);
                if (sDragQuery)
                    this.dragBegin(evt.touchId);
            }

            if (GObject.draggingObject == this) {

                var xx: number = evt.pos.x - sGlobalDragStart.x + sGlobalRect.x;
                var yy: number = evt.pos.y - sGlobalDragStart.y + sGlobalRect.y;

                if (this._dragBounds) {
                    var rect: cc.Rect = GRoot.inst.localToGlobalRect(this._dragBounds.x, this._dragBounds.y,
                        this._dragBounds.width, this._dragBounds.height, sDragHelperRect);
                    if (xx < rect.x)
                        xx = rect.x;
                    else if (xx + sGlobalRect.width > rect.xMax) {
                        xx = rect.xMax - sGlobalRect.width;
                        if (xx < rect.x)
                            xx = rect.x;
                    }

                    if (yy < rect.y)
                        yy = rect.y;
                    else if (yy + sGlobalRect.height > rect.yMax) {
                        yy = rect.yMax - sGlobalRect.height;
                        if (yy < rect.y)
                            yy = rect.y;
                    }
                }

                sUpdateInDragging = true;
                var pt: cc.Vec2 = this.parent.globalToLocal(xx, yy, sHelperPoint);
                this.setPosition(Math.round(pt.x), Math.round(pt.y));
                sUpdateInDragging = false;

                this._node.emit(Event.DRAG_MOVE, evt);
            }
        }

        private onTouchEnd_0(evt: Event): void {
            if (GObject.draggingObject == this) {
                GObject.draggingObject = null;

                this._node.emit(Event.DRAG_END, evt);
            }
        }
        //-------------------------------------------------------------------
    }

    var sGlobalDragStart: cc.Vec2 = new cc.Vec2();
    var sGlobalRect: cc.Rect = new cc.Rect();
    var sHelperPoint: cc.Vec2 = new cc.Vec2();
    var sDragHelperRect: cc.Rect = new cc.Rect();
    var sUpdateInDragging: boolean;
    var sDragQuery: boolean = false;

    //-------------------------------------------------------------------

    export class GObjectPartner extends cc.Component {
        public _emitDisplayEvents: boolean = false;

        public callLater(callback: Function, delay?: number): void {
            if (!cc.director.getScheduler().isScheduled(callback, this))
                this.scheduleOnce(callback, delay);
        }

        public onClickLink(evt: Event, text: string) {
            this.node.emit(Event.LINK, text, evt);
        }

        protected onEnable() {
            this.node["$gobj"].onEnable();

            if (this._emitDisplayEvents)
                this.node.emit(Event.DISPLAY);
        }

        protected onDisable() {
            this.node["$gobj"].onDisable();

            if (this._emitDisplayEvents)
                this.node.emit(Event.UNDISPLAY);
        }

        protected update(dt) {
            this.node["$gobj"].onUpdate(dt);
        }

        protected onDestroy() {
            this.node["$gobj"].onDestroy();
        }
    }
}
