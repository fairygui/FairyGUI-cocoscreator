import { Mask, Vec2, Size, Node, UITransform, Constructor } from "cc";
import { Controller } from "./Controller";
import { Event as FUIEvent } from "./event/Event";
import { IHitTest, PixelHitTest, ChildHitArea } from "./event/HitTest";
import { ChildrenRenderOrder, OverflowType, ObjectType } from "./FieldTypes";
import { GGraph } from "./GGraph";
import { GGroup } from "./GGroup";
import { GImage } from "./GImage";
import { GObject } from "./GObject";
import { Margin } from "./Margin";
import { PackageItem } from "./PackageItem";
import { ScrollPane } from "./ScrollPane";
import { Transition } from "./Transition";
import { TranslationHelper } from "./TranslationHelper";
import { UIConfig } from "./UIConfig";
import { UIContentScaler } from "./UIContentScaler";
import { Decls, UIPackage } from "./UIPackage";
import { ByteBuffer } from "./utils/ByteBuffer";

export class GComponent extends GObject {
    public hitArea?: IHitTest;

    private _sortingChildCount: number = 0;
    private _opaque: boolean;
    private _applyingController?: Controller;
    private _rectMask?: Mask;
    private _maskContent?: GObject;
    private _invertedMask?: boolean = false;
    private _containerUITrans: UITransform;

    protected _margin: Margin;
    protected _trackBounds: boolean;
    protected _boundsChanged: boolean;
    protected _childrenRenderOrder: ChildrenRenderOrder = ChildrenRenderOrder.Ascent;
    protected _apexIndex: number = 0;

    public _buildingDisplayList: boolean;
    public _children: Array<GObject>;
    public _controllers: Array<Controller>;
    public _transitions: Array<Transition>;
    public _container: Node;
    public _scrollPane?: ScrollPane;
    public _alignOffset: Vec2;
    public _customMask?: Mask;

    public constructor() {
        super();

        this._node.name = "GComponent";
        this._children = new Array<GObject>();
        this._controllers = new Array<Controller>();
        this._transitions = new Array<Transition>();
        this._margin = new Margin();
        this._alignOffset = new Vec2();

        this._container = new Node("Container");
        this._container.layer = UIConfig.defaultUILayer;
        this._containerUITrans = this._container.addComponent(UITransform);
        this._containerUITrans.setAnchorPoint(0, 1);
        this._node.addChild(this._container);
    }

    public dispose(): void {
        var i: number;
        var cnt: number;

        cnt = this._transitions.length;
        for (i = 0; i < cnt; ++i) {
            var trans: Transition = this._transitions[i];
            trans.dispose();
        }

        cnt = this._controllers.length;
        for (i = 0; i < cnt; ++i) {
            var cc: Controller = this._controllers[i];
            cc.dispose();
        }

        if (this._scrollPane)
            this._scrollPane.destroy();

        cnt = this._children.length;
        for (i = cnt - 1; i >= 0; --i) {
            var obj: GObject = this._children[i];
            obj._parent = null;//avoid removeFromParent call
            obj.dispose();
        }

        this._boundsChanged = false;
        super.dispose();
    }

    public get displayListContainer(): Node {
        return this._container;
    }

    public addChild(child: GObject): GObject {
        this.addChildAt(child, this._children.length);
        return child;
    }

    public addChildAt(child: GObject, index: number): GObject {
        if (!child)
            throw new Error("child is null");

        var numChildren: number = this._children.length;

        if (index >= 0 && index <= numChildren) {
            if (child.parent == this) {
                this.setChildIndex(child, index);
            }
            else {
                child.removeFromParent();
                child._parent = this;

                var cnt: number = this._children.length;
                if (child.sortingOrder != 0) {
                    this._sortingChildCount++;
                    index = this.getInsertPosForSortingChild(child);
                }
                else if (this._sortingChildCount > 0) {
                    if (index > (cnt - this._sortingChildCount))
                        index = cnt - this._sortingChildCount;
                }

                if (index == cnt)
                    this._children.push(child);
                else
                    this._children.splice(index, 0, child);

                this.onChildAdd(child, index);
                this.setBoundsChangedFlag();
            }

            return child;
        }
        else {
            throw new Error("Invalid child index");
        }
    }

    private getInsertPosForSortingChild(target: GObject): number {
        var cnt: number = this._children.length;
        var i: number = 0;
        for (i = 0; i < cnt; i++) {
            var child: GObject = this._children[i];
            if (child == target)
                continue;

            if (target.sortingOrder < child.sortingOrder)
                break;
        }
        return i;
    }

    public removeChild(child: GObject, dispose?: boolean): GObject {
        var childIndex: number = this._children.indexOf(child);
        if (childIndex != -1) {
            this.removeChildAt(childIndex, dispose);
        }
        return child;
    }

    public removeChildAt(index: number, dispose?: boolean): GObject {
        if (index >= 0 && index < this.numChildren) {
            var child: GObject = this._children[index];
            child._parent = null;

            if (child.sortingOrder != 0)
                this._sortingChildCount--;

            this._children.splice(index, 1);
            child.group = null;
            this._container.removeChild(child.node);
            if (this._childrenRenderOrder == ChildrenRenderOrder.Arch)
                this._partner.callLater(this.buildNativeDisplayList);

            if (dispose)
                child.dispose();
            else
                child.node.parent = null;

            this.setBoundsChangedFlag();

            return child;
        }
        else {
            throw new Error("Invalid child index");
        }
    }

    public removeChildren(beginIndex?: number, endIndex?: number, dispose?: boolean): void {
        if (beginIndex == undefined) beginIndex = 0;
        if (endIndex == undefined) endIndex = -1;

        if (endIndex < 0 || endIndex >= this.numChildren)
            endIndex = this.numChildren - 1;

        for (var i: number = beginIndex; i <= endIndex; ++i)
            this.removeChildAt(beginIndex, dispose);
    }

    public getChildAt<T extends GObject>(index: number, classType?: Constructor<T>): T {
        if (index >= 0 && index < this.numChildren)
            return this._children[index] as T;
        else
            throw new Error("Invalid child index");
    }

    public getChild<T extends GObject>(name: string, classType?: Constructor<T>): T {
        var cnt: number = this._children.length;
        for (var i: number = 0; i < cnt; ++i) {
            if (this._children[i].name == name)
                return this._children[i] as T;
        }

        return null;
    }

    public getChildByPath<T extends GObject>(path: String, classType?: Constructor<T>): T {
        var arr: string[] = path.split(".");
        var cnt: number = arr.length;
        var gcom: GComponent = this;
        var obj: GObject;
        for (var i: number = 0; i < cnt; ++i) {
            obj = gcom.getChild(arr[i]);
            if (!obj)
                break;

            if (i != cnt - 1) {
                if (!(obj instanceof GComponent)) {
                    obj = null;
                    break;
                }
                else
                    gcom = obj;
            }
        }

        return obj as T;
    }

    public getVisibleChild(name: string): GObject {
        var cnt: number = this._children.length;
        for (var i: number = 0; i < cnt; ++i) {
            var child: GObject = this._children[i];
            if (child._finalVisible && child.name == name)
                return child;
        }

        return null;
    }

    public getChildInGroup(name: string, group: GGroup): GObject {
        var cnt: number = this._children.length;
        for (var i: number = 0; i < cnt; ++i) {
            var child: GObject = this._children[i];
            if (child.group == group && child.name == name)
                return child;
        }

        return null;
    }

    public getChildById(id: string): GObject {
        var cnt: number = this._children.length;
        for (var i: number = 0; i < cnt; ++i) {
            if (this._children[i]._id == id)
                return this._children[i];
        }

        return null;
    }

    public getChildIndex(child: GObject): number {
        return this._children.indexOf(child);
    }

    public setChildIndex(child: GObject, index: number): void {
        var oldIndex: number = this._children.indexOf(child);
        if (oldIndex == -1)
            throw new Error("Not a child of this container");

        if (child.sortingOrder != 0) //no effect
            return;

        var cnt: number = this._children.length;
        if (this._sortingChildCount > 0) {
            if (index > (cnt - this._sortingChildCount - 1))
                index = cnt - this._sortingChildCount - 1;
        }

        this._setChildIndex(child, oldIndex, index);
    }

    public setChildIndexBefore(child: GObject, index: number): number {
        var oldIndex: number = this._children.indexOf(child);
        if (oldIndex == -1)
            throw new Error("Not a child of this container");

        if (child.sortingOrder != 0) //no effect
            return oldIndex;

        var cnt: number = this._children.length;
        if (this._sortingChildCount > 0) {
            if (index > (cnt - this._sortingChildCount - 1))
                index = cnt - this._sortingChildCount - 1;
        }

        if (oldIndex < index)
            return this._setChildIndex(child, oldIndex, index - 1);
        else
            return this._setChildIndex(child, oldIndex, index);
    }

    private _setChildIndex(child: GObject, oldIndex: number, index: number): number {
        var cnt: number = this._children.length;
        if (index > cnt)
            index = cnt;

        if (oldIndex == index)
            return oldIndex;

        this._children.splice(oldIndex, 1);
        this._children.splice(index, 0, child);

        if (this._childrenRenderOrder == ChildrenRenderOrder.Ascent)
            child.node.setSiblingIndex(index);
        else if (this._childrenRenderOrder == ChildrenRenderOrder.Descent)
            child.node.setSiblingIndex(cnt - index);
        else
            this._partner.callLater(this.buildNativeDisplayList);

        this.setBoundsChangedFlag();

        return index;
    }

    public swapChildren(child1: GObject, child2: GObject): void {
        var index1: number = this._children.indexOf(child1);
        var index2: number = this._children.indexOf(child2);
        if (index1 == -1 || index2 == -1)
            throw new Error("Not a child of this container");
        this.swapChildrenAt(index1, index2);
    }

    public swapChildrenAt(index1: number, index2: number): void {
        var child1: GObject = this._children[index1];
        var child2: GObject = this._children[index2];

        this.setChildIndex(child1, index2);
        this.setChildIndex(child2, index1);
    }

    public get numChildren(): number {
        return this._children.length;
    }

    public isAncestorOf(child: GObject): boolean {
        if (child == null)
            return false;

        var p: GComponent = child.parent;
        while (p) {
            if (p == this)
                return true;

            p = p.parent;
        }
        return false;
    }

    public addController(controller: Controller): void {
        this._controllers.push(controller);
        controller.parent = this;
        this.applyController(controller);
    }

    public getControllerAt(index: number): Controller {
        return this._controllers[index];
    }

    public getController(name: string): Controller {
        var cnt: number = this._controllers.length;
        for (var i: number = 0; i < cnt; ++i) {
            var c: Controller = this._controllers[i];
            if (c.name == name)
                return c;
        }

        return null;
    }

    public removeController(c: Controller): void {
        var index: number = this._controllers.indexOf(c);
        if (index == -1)
            throw new Error("controller not exists");

        c.parent = null;
        this._controllers.splice(index, 1);

        var length: number = this._children.length;
        for (var i: number = 0; i < length; i++) {
            var child: GObject = this._children[i];
            child.handleControllerChanged(c);
        }
    }

    public get controllers(): Array<Controller> {
        return this._controllers;
    }

    private onChildAdd(child: GObject, index: number): void {
        child.node.parent = this._container;
        child.node.active = child._finalVisible;

        if (this._buildingDisplayList)
            return;

        let cnt: number = this._children.length;
        if (this._childrenRenderOrder == ChildrenRenderOrder.Ascent)
            child.node.setSiblingIndex(index);
        else if (this._childrenRenderOrder == ChildrenRenderOrder.Descent)
            child.node.setSiblingIndex(cnt - index);
        else
            this._partner.callLater(this.buildNativeDisplayList);
    }

    private buildNativeDisplayList(dt?: number): void {
        if (!isNaN(dt)) {
            let _t = <GComponent>GObject.cast(this.node);
            _t.buildNativeDisplayList();
            return;
        }

        let cnt: number = this._children.length;
        if (cnt == 0)
            return;

        let child: GObject;
        switch (this._childrenRenderOrder) {
            case ChildrenRenderOrder.Ascent:
                {
                    let j = 0;
                    for (let i = 0; i < cnt; i++) {
                        child = this._children[i];
                        child.node.setSiblingIndex(j++);
                    }
                }
                break;
            case ChildrenRenderOrder.Descent:
                {
                    let j = 0;
                    for (let i = cnt - 1; i >= 0; i--) {
                        child = this._children[i];
                        child.node.setSiblingIndex(j++);
                    }
                }
                break;

            case ChildrenRenderOrder.Arch:
                {
                    let j = 0;
                    for (let i = 0; i < this._apexIndex; i++) {
                        child = this._children[i];
                        child.node.setSiblingIndex(j++);
                    }
                    for (let i = cnt - 1; i >= this._apexIndex; i--) {
                        child = this._children[i];
                        child.node.setSiblingIndex(j++);
                    }
                }
                break;
        }
    }

    public applyController(c: Controller): void {
        this._applyingController = c;
        var child: GObject;
        var length: number = this._children.length;
        for (var i: number = 0; i < length; i++) {
            child = this._children[i];
            child.handleControllerChanged(c);
        }
        this._applyingController = null;

        c.runActions();
    }

    public applyAllControllers(): void {
        var cnt: number = this._controllers.length;
        for (var i: number = 0; i < cnt; ++i) {
            this.applyController(this._controllers[i]);
        }
    }

    public adjustRadioGroupDepth(obj: GObject, c: Controller): void {
        var cnt: number = this._children.length;
        var i: number;
        var child: GObject;
        var myIndex: number = -1, maxIndex: number = -1;
        for (i = 0; i < cnt; i++) {
            child = this._children[i];
            if (child == obj) {
                myIndex = i;
            }
            else if (("relatedController" in child)/*is button*/ && (<any>child).relatedController == c) {
                if (i > maxIndex)
                    maxIndex = i;
            }
        }
        if (myIndex < maxIndex) {
            if (this._applyingController)
                this._children[maxIndex].handleControllerChanged(this._applyingController);
            this.swapChildrenAt(myIndex, maxIndex);
        }
    }

    public getTransitionAt(index: number): Transition {
        return this._transitions[index];
    }

    public getTransition(transName: string): Transition {
        var cnt: number = this._transitions.length;
        for (var i: number = 0; i < cnt; ++i) {
            var trans: Transition = this._transitions[i];
            if (trans.name == transName)
                return trans;
        }

        return null;
    }

    public isChildInView(child: GObject): boolean {
        if (this._rectMask) {
            return child.x + child.width >= 0 && child.x <= this.width
                && child.y + child.height >= 0 && child.y <= this.height;
        }
        else if (this._scrollPane) {
            return this._scrollPane.isChildInView(child);
        }
        else
            return true;
    }

    public getFirstChildInView(): number {
        var cnt: number = this._children.length;
        for (var i: number = 0; i < cnt; ++i) {
            var child: GObject = this._children[i];
            if (this.isChildInView(child))
                return i;
        }
        return -1;
    }

    public get scrollPane(): ScrollPane {
        return this._scrollPane;
    }

    public get opaque(): boolean {
        return this._opaque;
    }

    public set opaque(value: boolean) {
        this._opaque = value;
    }

    public get margin(): Margin {
        return this._margin;
    }

    public set margin(value: Margin) {
        this._margin.copy(value);
        this.handleSizeChanged();
    }

    public get childrenRenderOrder(): ChildrenRenderOrder {
        return this._childrenRenderOrder;
    }

    public set childrenRenderOrder(value: ChildrenRenderOrder) {
        if (this._childrenRenderOrder != value) {
            this._childrenRenderOrder = value;
            this.buildNativeDisplayList();
        }
    }

    public get apexIndex(): number {
        return this._apexIndex;
    }

    public set apexIndex(value: number) {
        if (this._apexIndex != value) {
            this._apexIndex = value;

            if (this._childrenRenderOrder == ChildrenRenderOrder.Arch)
                this.buildNativeDisplayList();
        }
    }

    public get mask(): GObject {
        return this._maskContent;
    }

    public set mask(value: GObject) {
        this.setMask(value, false);
    }

    public setMask(value: GObject, inverted: boolean): void {
        if (this._maskContent) {
            this._maskContent.node.off(Node.EventType.TRANSFORM_CHANGED, this.onMaskContentChanged, this);
            this._maskContent.node.off(Node.EventType.SIZE_CHANGED, this.onMaskContentChanged, this);
            this._maskContent.node.off(Node.EventType.ANCHOR_CHANGED, this.onMaskContentChanged, this);
            this._maskContent.visible = true;
        }

        this._maskContent = value;
        if (this._maskContent) {
            if (!(value instanceof GImage) && !(value instanceof GGraph))
                return;

            if (!this._customMask) {
                let maskNode: Node = new Node("Mask");
                maskNode.layer = UIConfig.defaultUILayer;
                maskNode.addComponent(UITransform);
                maskNode.parent = this._node;
                if (this._scrollPane)
                    this._container.parent.parent = maskNode;
                else
                    this._container.parent = maskNode;
                this._customMask = maskNode.addComponent(Mask);
            }

            value.visible = false;
            value.node.on(Node.EventType.TRANSFORM_CHANGED, this.onMaskContentChanged, this);
            value.node.on(Node.EventType.SIZE_CHANGED, this.onMaskContentChanged, this);
            value.node.on(Node.EventType.ANCHOR_CHANGED, this.onMaskContentChanged, this);

            this._invertedMask = inverted;
            if (this._node.activeInHierarchy)
                this.onMaskReady();
            else
                this.on(FUIEvent.DISPLAY, this.onMaskReady, this);

            this.onMaskContentChanged();
            if (this._scrollPane)
                this._scrollPane.adjustMaskContainer();
            else
                this._container.setPosition(0, 0);
        }
        else if (this._customMask) {
            if (this._scrollPane)
                this._container.parent.parent = this._node;
            else
                this._container.parent = this._node;
            this._customMask.node.destroy();
            this._customMask = null;

            if (this._scrollPane)
                this._scrollPane.adjustMaskContainer();
            else
                this._container.setPosition(this._pivotCorrectX, this._pivotCorrectY);
        }
    }

    private onMaskReady() {
        this.off(FUIEvent.DISPLAY, this.onMaskReady, this);

        if (this._maskContent instanceof GImage) {
            this._customMask.type = Mask.Type.SPRITE_STENCIL;
            this._customMask.alphaThreshold = 0.0001;
            this._customMask.spriteFrame = this._maskContent._content.spriteFrame;
        }
        else if (this._maskContent instanceof GGraph) {
            if (this._maskContent.type == 2)
                this._customMask.type = Mask.Type.GRAPHICS_ELLIPSE;
            else
                this._customMask.type = Mask.Type.GRAPHICS_RECT;
        }

        this._customMask.inverted = this._invertedMask;
    }

    private onMaskContentChanged() {
        let maskNode: Node = this._customMask.node;
        let maskUITrans: UITransform = maskNode.getComponent(UITransform);

        let contentNode: Node = this._maskContent.node;
        let contentUITrans: UITransform = this._maskContent._uiTrans;

        let w: number = this._maskContent.width * this._maskContent.scaleX;
        let h: number = this._maskContent.height * this._maskContent.scaleY;

        maskUITrans.setContentSize(w, h);

        let left: number = contentNode.position.x - contentUITrans.anchorX * w;
        let top: number = contentNode.position.y - contentUITrans.anchorY * h;
        maskUITrans.setAnchorPoint(-left / maskUITrans.width, -top / maskUITrans.height);

        maskNode.setPosition(this._pivotCorrectX, this._pivotCorrectY);
    }

    public get _pivotCorrectX(): number {
        return -this.pivotX * this._width + this._margin.left;
    }

    public get _pivotCorrectY(): number {
        return this.pivotY * this._height - this._margin.top;
    }

    public get baseUserData(): string {
        var buffer: ByteBuffer = this.packageItem.rawData;
        buffer.seek(0, 4);
        return buffer.readS();
    }

    protected setupScroll(buffer: ByteBuffer): void {
        this._scrollPane = this._node.addComponent(ScrollPane);
        this._scrollPane.setup(buffer);
    }

    protected setupOverflow(overflow: OverflowType): void {
        if (overflow == OverflowType.Hidden)
            this._rectMask = this._container.addComponent(Mask);

        if (!this._margin.isNone)
            this.handleSizeChanged();
    }

    protected handleAnchorChanged(): void {
        super.handleAnchorChanged();

        if (this._customMask)
            this._customMask.node.setPosition(this._pivotCorrectX, this._pivotCorrectY);
        else if (this._scrollPane)
            this._scrollPane.adjustMaskContainer();
        else
            this._container.setPosition(this._pivotCorrectX + this._alignOffset.x, this._pivotCorrectY - this._alignOffset.y);
    }

    protected handleSizeChanged(): void {
        super.handleSizeChanged();

        if (this._customMask)
            this._customMask.node.setPosition(this._pivotCorrectX, this._pivotCorrectY);
        else if (!this._scrollPane)
            this._container.setPosition(this._pivotCorrectX, this._pivotCorrectY);

        if (this._scrollPane)
            this._scrollPane.onOwnerSizeChanged();
        else
            this._containerUITrans.setContentSize(this.viewWidth, this.viewHeight);
    }

    protected handleGrayedChanged(): void {
        var c: Controller = this.getController("grayed");
        if (c) {
            c.selectedIndex = this.grayed ? 1 : 0;
            return;
        }

        var v: boolean = this.grayed;
        var cnt: number = this._children.length;
        for (var i: number = 0; i < cnt; ++i) {
            this._children[i].grayed = v;
        }
    }

    public handleControllerChanged(c: Controller): void {
        super.handleControllerChanged(c);

        if (this._scrollPane)
            this._scrollPane.handleControllerChanged(c);
    }

    protected _hitTest(pt: Vec2, globalPt: Vec2): GObject {
        if (this._customMask) {
            s_vec2.set(globalPt);
            s_vec2.y = UIContentScaler.rootSize.height - globalPt.y;
            let b = this._customMask.isHit(s_vec2) || false;
            if (!b)
                return null;
        }

        if (this.hitArea) {
            if (!this.hitArea.hitTest(pt, globalPt))
                return null;
        }
        else if (this._rectMask) {
            s_vec2.set(pt);
            s_vec2.x += this._container.position.x;
            s_vec2.y += this._container.position.y;

            let clippingSize: Size = this._containerUITrans.contentSize;
            if (s_vec2.x < 0 || s_vec2.y < 0 || s_vec2.x >= clippingSize.width || s_vec2.y >= clippingSize.height)
                return null;
        }

        if (this._scrollPane) {
            let target = this._scrollPane.hitTest(pt, globalPt);
            if (!target)
                return null;

            if (target != this)
                return target;
        }

        let target: GObject = null;

        let cnt = this._children.length;
        for (let i = cnt - 1; i >= 0; i--) {
            let child = this._children[i];
            if (this._maskContent == child || child._touchDisabled)
                continue;

            target = child.hitTest(globalPt);
            if (target)
                break;
        }

        if (!target && this._opaque && (this.hitArea || pt.x >= 0 && pt.y >= 0 && pt.x < this._width && pt.y < this._height))
            target = this;

        return target;
    }

    public setBoundsChangedFlag(): void {
        if (!this._scrollPane && !this._trackBounds)
            return;

        if (!this._boundsChanged) {
            this._boundsChanged = true;

            this._partner.callLater(this.refresh);
        }
    }

    private refresh(dt?: number): void {
        if (!isNaN(dt)) {
            let _t = <GComponent>GObject.cast(this.node);
            _t.refresh();
            return;
        }

        if (this._boundsChanged) {
            var len: number = this._children.length;
            if (len > 0) {
                for (var i: number = 0; i < len; i++) {
                    var child: GObject = this._children[i];
                    child.ensureSizeCorrect();
                }
            }

            this.updateBounds();
        }
    }

    public ensureBoundsCorrect(): void {
        var len: number = this._children.length;
        if (len > 0) {
            for (var i: number = 0; i < len; i++) {
                var child: GObject = this._children[i];
                child.ensureSizeCorrect();
            }
        }

        if (this._boundsChanged)
            this.updateBounds();
    }

    protected updateBounds(): void {
        var ax: number = 0, ay: number = 0, aw: number = 0, ah: number = 0;
        var len: number = this._children.length;
        if (len > 0) {
            ax = Number.POSITIVE_INFINITY, ay = Number.POSITIVE_INFINITY;
            var ar: number = Number.NEGATIVE_INFINITY, ab: number = Number.NEGATIVE_INFINITY;
            var tmp: number = 0;
            var i: number = 0;

            for (var i: number = 0; i < len; i++) {
                var child: GObject = this._children[i];
                tmp = child.x;
                if (tmp < ax)
                    ax = tmp;
                tmp = child.y;
                if (tmp < ay)
                    ay = tmp;
                tmp = child.x + child.actualWidth;
                if (tmp > ar)
                    ar = tmp;
                tmp = child.y + child.actualHeight;
                if (tmp > ab)
                    ab = tmp;
            }
            aw = ar - ax;
            ah = ab - ay;
        }

        this.setBounds(ax, ay, aw, ah);
    }

    public setBounds(ax: number, ay: number, aw: number, ah: number = 0): void {
        this._boundsChanged = false;

        if (this._scrollPane)
            this._scrollPane.setContentSize(Math.round(ax + aw), Math.round(ay + ah));
    }

    public get viewWidth(): number {
        if (this._scrollPane)
            return this._scrollPane.viewWidth;
        else
            return this.width - this._margin.left - this._margin.right;
    }

    public set viewWidth(value: number) {
        if (this._scrollPane)
            this._scrollPane.viewWidth = value;
        else
            this.width = value + this._margin.left + this._margin.right;
    }

    public get viewHeight(): number {
        if (this._scrollPane)
            return this._scrollPane.viewHeight;
        else
            return this.height - this._margin.top - this._margin.bottom;
    }

    public set viewHeight(value: number) {
        if (this._scrollPane)
            this._scrollPane.viewHeight = value;
        else
            this.height = value + this._margin.top + this._margin.bottom;
    }

    public getSnappingPosition(xValue: number, yValue: number, resultPoint?: Vec2): Vec2 {
        if (!resultPoint)
            resultPoint = new Vec2();

        var cnt: number = this._children.length;
        if (cnt == 0) {
            resultPoint.x = 0;
            resultPoint.y = 0;
            return resultPoint;
        }

        this.ensureBoundsCorrect();

        var obj: GObject = null;
        var prev: GObject = null;
        var i: number = 0;
        if (yValue != 0) {
            for (; i < cnt; i++) {
                obj = this._children[i];
                if (yValue < obj.y) {
                    if (i == 0) {
                        yValue = 0;
                        break;
                    }
                    else {
                        prev = this._children[i - 1];
                        if (yValue < prev.y + prev.actualHeight / 2) //top half part
                            yValue = prev.y;
                        else //bottom half part
                            yValue = obj.y;
                        break;
                    }
                }
            }

            if (i == cnt)
                yValue = obj.y;
        }

        if (xValue != 0) {
            if (i > 0)
                i--;
            for (; i < cnt; i++) {
                obj = this._children[i];
                if (xValue < obj.x) {
                    if (i == 0) {
                        xValue = 0;
                        break;
                    }
                    else {
                        prev = this._children[i - 1];
                        if (xValue < prev.x + prev.actualWidth / 2) //top half part
                            xValue = prev.x;
                        else //bottom half part
                            xValue = obj.x;
                        break;
                    }
                }
            }

            if (i == cnt)
                xValue = obj.x;
        }

        resultPoint.x = xValue;
        resultPoint.y = yValue;
        return resultPoint;
    }

    public childSortingOrderChanged(child: GObject, oldValue: number, newValue: number = 0): void {
        if (newValue == 0) {
            this._sortingChildCount--;
            this.setChildIndex(child, this._children.length);
        }
        else {
            if (oldValue == 0)
                this._sortingChildCount++;

            var oldIndex: number = this._children.indexOf(child);
            var index: number = this.getInsertPosForSortingChild(child);
            if (oldIndex < index)
                this._setChildIndex(child, oldIndex, index - 1);
            else
                this._setChildIndex(child, oldIndex, index);
        }
    }

    public constructFromResource(): void {
        this.constructFromResource2(null, 0);
    }

    public constructFromResource2(objectPool: Array<GObject>, poolIndex: number): void {
        var contentItem: PackageItem = this.packageItem.getBranch();

        if (!contentItem.decoded) {
            contentItem.decoded = true;
            TranslationHelper.translateComponent(contentItem);
        }

        var i: number;
        var dataLen: number;
        var curPos: number;
        var nextPos: number;
        var f1: number;
        var f2: number;
        var i1: number;
        var i2: number;

        var buffer: ByteBuffer = contentItem.rawData;
        buffer.seek(0, 0);

        this._underConstruct = true;

        this.sourceWidth = buffer.readInt();
        this.sourceHeight = buffer.readInt();
        this.initWidth = this.sourceWidth;
        this.initHeight = this.sourceHeight;

        this.setSize(this.sourceWidth, this.sourceHeight);

        if (buffer.readBool()) {
            this.minWidth = buffer.readInt();
            this.maxWidth = buffer.readInt();
            this.minHeight = buffer.readInt();
            this.maxHeight = buffer.readInt();
        }

        if (buffer.readBool()) {
            f1 = buffer.readFloat();
            f2 = buffer.readFloat();
            this.setPivot(f1, f2, buffer.readBool());
        }

        if (buffer.readBool()) {
            this._margin.top = buffer.readInt();
            this._margin.bottom = buffer.readInt();
            this._margin.left = buffer.readInt();
            this._margin.right = buffer.readInt();
        }

        var overflow: number = buffer.readByte();
        if (overflow == OverflowType.Scroll) {
            var savedPos: number = buffer.position;
            buffer.seek(0, 7);
            this.setupScroll(buffer);
            buffer.position = savedPos;
        }
        else
            this.setupOverflow(overflow);

        if (buffer.readBool())
            buffer.skip(8);

        this._buildingDisplayList = true;

        buffer.seek(0, 1);

        var controllerCount: number = buffer.readShort();
        for (i = 0; i < controllerCount; i++) {
            nextPos = buffer.readShort();
            nextPos += buffer.position;

            var controller: Controller = new Controller();
            this._controllers.push(controller);
            controller.parent = this;
            controller.setup(buffer);

            buffer.position = nextPos;
        }

        buffer.seek(0, 2);

        var child: GObject;
        var childCount: number = buffer.readShort();
        for (i = 0; i < childCount; i++) {
            dataLen = buffer.readShort();
            curPos = buffer.position;

            if (objectPool)
                child = objectPool[poolIndex + i];
            else {
                buffer.seek(curPos, 0);

                var type: ObjectType = buffer.readByte();
                var src: string = buffer.readS();
                var pkgId: string = buffer.readS();

                var pi: PackageItem = null;
                if (src != null) {
                    var pkg: UIPackage;
                    if (pkgId != null)
                        pkg = UIPackage.getById(pkgId);
                    else
                        pkg = contentItem.owner;

                    pi = pkg ? pkg.getItemById(src) : null;
                }

                if (pi) {
                    child = Decls.UIObjectFactory.newObject(pi);
                    child.constructFromResource();
                }
                else
                    child = Decls.UIObjectFactory.newObject(type);
            }

            child._underConstruct = true;
            child.setup_beforeAdd(buffer, curPos);
            child._parent = this;
            child.node.parent = this._container;
            this._children.push(child);

            buffer.position = curPos + dataLen;
        }

        buffer.seek(0, 3);
        this.relations.setup(buffer, true);

        buffer.seek(0, 2);
        buffer.skip(2);

        for (i = 0; i < childCount; i++) {
            nextPos = buffer.readShort();
            nextPos += buffer.position;

            buffer.seek(buffer.position, 3);
            this._children[i].relations.setup(buffer, false);

            buffer.position = nextPos;
        }

        buffer.seek(0, 2);
        buffer.skip(2);

        for (i = 0; i < childCount; i++) {
            nextPos = buffer.readShort();
            nextPos += buffer.position;

            child = this._children[i];
            child.setup_afterAdd(buffer, buffer.position);
            child._underConstruct = false;

            buffer.position = nextPos;
        }

        buffer.seek(0, 4);

        buffer.skip(2); //customData
        this.opaque = buffer.readBool();
        var maskId: number = buffer.readShort();
        if (maskId != -1) {
            this.setMask(this.getChildAt(maskId), buffer.readBool());
        }

        var hitTestId: string = buffer.readS();
        i1 = buffer.readInt();
        i2 = buffer.readInt();

        if (hitTestId != null) {
            pi = contentItem.owner.getItemById(hitTestId);
            if (pi && pi.hitTestData)
                this.hitArea = new PixelHitTest(pi.hitTestData, i1, i2);
        }
        else if (i1 != 0 && i2 != -1) {
            this.hitArea = new ChildHitArea(this.getChildAt(i2));
        }

        buffer.seek(0, 5);

        var transitionCount: number = buffer.readShort();
        for (i = 0; i < transitionCount; i++) {
            nextPos = buffer.readShort();
            nextPos += buffer.position;

            var trans: Transition = new Transition(this);
            trans.setup(buffer);
            this._transitions.push(trans);

            buffer.position = nextPos;
        }

        this.applyAllControllers();

        this._buildingDisplayList = false;
        this._underConstruct = false;

        this.buildNativeDisplayList();
        this.setBoundsChangedFlag();

        if (contentItem.objectType != ObjectType.Component)
            this.constructExtension(buffer);

        this.onConstruct();
    }

    protected constructExtension(buffer: ByteBuffer): void {
    }

    protected onConstruct(): void {
    }

    public setup_afterAdd(buffer: ByteBuffer, beginPos: number): void {
        super.setup_afterAdd(buffer, beginPos);

        buffer.seek(beginPos, 4);

        var pageController: number = buffer.readShort();
        if (pageController != -1 && this._scrollPane)
            this._scrollPane.pageController = this._parent.getControllerAt(pageController);

        var cnt: number = buffer.readShort();
        for (var i: number = 0; i < cnt; i++) {
            var cc: Controller = this.getController(buffer.readS());
            var pageId: string = buffer.readS();
            if (cc)
                cc.selectedPageId = pageId;
        }

        if (buffer.version >= 2) {
            cnt = buffer.readShort();
            for (i = 0; i < cnt; i++) {
                var target: string = buffer.readS();
                var propertyId: number = buffer.readShort();
                var value: String = buffer.readS();
                var obj: GObject = this.getChildByPath(target);
                if (obj)
                    obj.setProp(propertyId, value);
            }
        }
    }

    protected onEnable(): void {
        let cnt: number = this._transitions.length;
        for (let i: number = 0; i < cnt; ++i)
            this._transitions[i].onEnable();
    }

    protected onDisable(): void {
        let cnt: number = this._transitions.length;
        for (let i: number = 0; i < cnt; ++i)
            this._transitions[i].onDisable();
    }
}

var s_vec2: Vec2 = new Vec2();