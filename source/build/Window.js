import { Event as FUIEvent } from "./event/Event";
import { RelationType } from "./FieldTypes";
import { GComponent } from "./GComponent";
import { GObject } from "./GObject";
import { GRoot } from "./GRoot";
import { UIConfig } from "./UIConfig";
import { UIPackage } from "./UIPackage";
export class Window extends GComponent {
    constructor() {
        super();
        this._requestingCmd = 0;
        this._uiSources = new Array();
        this.bringToFontOnClick = UIConfig.bringWindowToFrontOnClick;
        this._node.on(FUIEvent.TOUCH_BEGIN, this.onTouchBegin_1, this, true);
    }
    addUISource(source) {
        this._uiSources.push(source);
    }
    set contentPane(val) {
        if (this._contentPane != val) {
            if (this._contentPane)
                this.removeChild(this._contentPane);
            this._contentPane = val;
            if (this._contentPane) {
                this.addChild(this._contentPane);
                this.setSize(this._contentPane.width, this._contentPane.height);
                this._contentPane.addRelation(this, RelationType.Size);
                this._frame = (this._contentPane.getChild("frame"));
                if (this._frame) {
                    this.closeButton = this._frame.getChild("closeButton");
                    this.dragArea = this._frame.getChild("dragArea");
                    this.contentArea = this._frame.getChild("contentArea");
                }
            }
        }
    }
    get contentPane() {
        return this._contentPane;
    }
    get frame() {
        return this._frame;
    }
    get closeButton() {
        return this._closeButton;
    }
    set closeButton(value) {
        if (this._closeButton)
            this._closeButton.offClick(this.closeEventHandler, this);
        this._closeButton = value;
        if (this._closeButton)
            this._closeButton.onClick(this.closeEventHandler, this);
    }
    get dragArea() {
        return this._dragArea;
    }
    set dragArea(value) {
        if (this._dragArea != value) {
            if (this._dragArea) {
                this._dragArea.draggable = false;
                this._dragArea.off(FUIEvent.DRAG_START, this.onDragStart_1, this);
            }
            this._dragArea = value;
            if (this._dragArea) {
                this._dragArea.draggable = true;
                this._dragArea.on(FUIEvent.DRAG_START, this.onDragStart_1, this);
            }
        }
    }
    get contentArea() {
        return this._contentArea;
    }
    set contentArea(value) {
        this._contentArea = value;
    }
    show() {
        GRoot.inst.showWindow(this);
    }
    showOn(root) {
        root.showWindow(this);
    }
    hide() {
        if (this.isShowing)
            this.doHideAnimation();
    }
    hideImmediately() {
        var r = (this.parent instanceof GRoot) ? this.parent : null;
        if (!r)
            r = GRoot.inst;
        r.hideWindowImmediately(this);
    }
    centerOn(r, restraint) {
        this.setPosition(Math.round((r.width - this.width) / 2), Math.round((r.height - this.height) / 2));
        if (restraint) {
            this.addRelation(r, RelationType.Center_Center);
            this.addRelation(r, RelationType.Middle_Middle);
        }
    }
    toggleStatus() {
        if (this.isTop)
            this.hide();
        else
            this.show();
    }
    get isShowing() {
        return this.parent != null;
    }
    get isTop() {
        return this.parent && this.parent.getChildIndex(this) == this.parent.numChildren - 1;
    }
    get modal() {
        return this._modal;
    }
    set modal(val) {
        this._modal = val;
    }
    bringToFront() {
        GRoot.inst.bringToFront(this);
    }
    showModalWait(requestingCmd) {
        if (requestingCmd != null)
            this._requestingCmd = requestingCmd;
        if (UIConfig.windowModalWaiting) {
            if (!this._modalWaitPane)
                this._modalWaitPane = UIPackage.createObjectFromURL(UIConfig.windowModalWaiting);
            this.layoutModalWaitPane();
            this.addChild(this._modalWaitPane);
        }
    }
    layoutModalWaitPane() {
        if (this._contentArea) {
            var pt = this._frame.localToGlobal();
            pt = this.globalToLocal(pt.x, pt.y, pt);
            this._modalWaitPane.setPosition(pt.x + this._contentArea.x, pt.y + this._contentArea.y);
            this._modalWaitPane.setSize(this._contentArea.width, this._contentArea.height);
        }
        else
            this._modalWaitPane.setSize(this.width, this.height);
    }
    closeModalWait(requestingCmd) {
        if (requestingCmd != null) {
            if (this._requestingCmd != requestingCmd)
                return false;
        }
        this._requestingCmd = 0;
        if (this._modalWaitPane && this._modalWaitPane.parent)
            this.removeChild(this._modalWaitPane);
        return true;
    }
    get modalWaiting() {
        return this._modalWaitPane && this._modalWaitPane.parent != null;
    }
    init() {
        if (this._inited || this._loading)
            return;
        if (this._uiSources.length > 0) {
            this._loading = false;
            var cnt = this._uiSources.length;
            for (var i = 0; i < cnt; i++) {
                var lib = this._uiSources[i];
                if (!lib.loaded) {
                    lib.load(this.__uiLoadComplete, this);
                    this._loading = true;
                }
            }
            if (!this._loading)
                this._init();
        }
        else
            this._init();
    }
    onInit() {
    }
    onShown() {
    }
    onHide() {
    }
    doShowAnimation() {
        this.onShown();
    }
    doHideAnimation() {
        this.hideImmediately();
    }
    __uiLoadComplete() {
        var cnt = this._uiSources.length;
        for (var i = 0; i < cnt; i++) {
            var lib = this._uiSources[i];
            if (!lib.loaded)
                return;
        }
        this._loading = false;
        this._init();
    }
    _init() {
        this._inited = true;
        this.onInit();
        if (this.isShowing)
            this.doShowAnimation();
    }
    dispose() {
        if (this.parent)
            this.hideImmediately();
        super.dispose();
    }
    closeEventHandler(evt) {
        this.hide();
    }
    onEnable() {
        super.onEnable();
        if (!this._inited)
            this.init();
        else
            this.doShowAnimation();
    }
    onDisable() {
        super.onDisable();
        this.closeModalWait();
        this.onHide();
    }
    onTouchBegin_1(evt) {
        if (this.isShowing && this.bringToFontOnClick)
            this.bringToFront();
    }
    onDragStart_1(evt) {
        var original = GObject.cast(evt.currentTarget);
        original.stopDrag();
        this.startDrag(evt.touchId);
    }
}
