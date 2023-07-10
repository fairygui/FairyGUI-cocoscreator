import { director, Color, Vec2, View, AudioSourceComponent } from "cc";
import { EDITOR } from "cc/env";
import { InputProcessor } from "./event/InputProcessor";
import { RelationType, PopupDirection } from "./FieldTypes";
import { GComponent } from "./GComponent";
import { GGraph } from "./GGraph";
import { Decls } from "./GObject";
import { UIConfig } from "./UIConfig";
import { UIContentScaler, updateScaler } from "./UIContentScaler";
import { UIPackage } from "./UIPackage";
import { Window } from "./Window";
export class GRoot extends GComponent {
    static get inst() {
        if (!GRoot._inst)
            throw 'Call GRoot.create first!';
        return GRoot._inst;
    }
    static create() {
        GRoot._inst = new GRoot();
        director.getScene().getChildByName('Canvas').addChild(GRoot._inst.node);
        GRoot._inst.onWinResize();
        return GRoot._inst;
    }
    constructor() {
        super();
        this._node.name = "GRoot";
        this.opaque = false;
        this._volumeScale = 1;
        this._popupStack = new Array();
        this._justClosedPopups = new Array();
        this._modalLayer = new GGraph();
        this._modalLayer.setSize(this.width, this.height);
        this._modalLayer.drawRect(0, Color.TRANSPARENT, UIConfig.modalLayerColor);
        this._modalLayer.addRelation(this, RelationType.Size);
        this._thisOnResized = this.onWinResize.bind(this);
        this._inputProcessor = this.node.addComponent(InputProcessor);
        this._inputProcessor._captureCallback = this.onTouchBegin_1;
        View.instance.on('design-resolution-changed', this.onWinResize, this);
        if (!EDITOR) {
            View.instance.on('canvas-resize', this._thisOnResized);
            window.addEventListener('orientationchange', this._thisOnResized);
        }
    }
    onDestroy() {
        View.instance.off('design-resolution-changed', this.onWinResize, this);
        if (!EDITOR) {
            View.instance.off('canvas-resize', this._thisOnResized);
            window.removeEventListener('orientationchange', this._thisOnResized);
        }
        if (this == GRoot._inst)
            GRoot._inst = null;
    }
    getTouchPosition(touchId) {
        return this._inputProcessor.getTouchPosition(touchId);
    }
    get touchTarget() {
        return this._inputProcessor.getTouchTarget();
    }
    get inputProcessor() {
        return this._inputProcessor;
    }
    showWindow(win) {
        this.addChild(win);
        win.requestFocus();
        if (win.x > this.width)
            win.x = this.width - win.width;
        else if (win.x + win.width < 0)
            win.x = 0;
        if (win.y > this.height)
            win.y = this.height - win.height;
        else if (win.y + win.height < 0)
            win.y = 0;
        this.adjustModalLayer();
    }
    hideWindow(win) {
        win.hide();
    }
    hideWindowImmediately(win) {
        if (win.parent == this)
            this.removeChild(win);
        this.adjustModalLayer();
    }
    bringToFront(win) {
        var cnt = this.numChildren;
        var i;
        if (this._modalLayer.parent && !win.modal)
            i = this.getChildIndex(this._modalLayer) - 1;
        else
            i = cnt - 1;
        for (; i >= 0; i--) {
            var g = this.getChildAt(i);
            if (g == win)
                return;
            if (g instanceof Window)
                break;
        }
        if (i >= 0)
            this.setChildIndex(win, i);
    }
    showModalWait(msg) {
        if (UIConfig.globalModalWaiting != null) {
            if (this._modalWaitPane == null)
                this._modalWaitPane = UIPackage.createObjectFromURL(UIConfig.globalModalWaiting);
            this._modalWaitPane.setSize(this.width, this.height);
            this._modalWaitPane.addRelation(this, RelationType.Size);
            this.addChild(this._modalWaitPane);
            this._modalWaitPane.text = msg;
        }
    }
    closeModalWait() {
        if (this._modalWaitPane && this._modalWaitPane.parent)
            this.removeChild(this._modalWaitPane);
    }
    closeAllExceptModals() {
        var arr = this._children.slice();
        var cnt = arr.length;
        for (var i = 0; i < cnt; i++) {
            var g = arr[i];
            if ((g instanceof Window) && !g.modal)
                g.hide();
        }
    }
    closeAllWindows() {
        var arr = this._children.slice();
        var cnt = arr.length;
        for (var i = 0; i < cnt; i++) {
            var g = arr[i];
            if (g instanceof Window)
                g.hide();
        }
    }
    getTopWindow() {
        var cnt = this.numChildren;
        for (var i = cnt - 1; i >= 0; i--) {
            var g = this.getChildAt(i);
            if (g instanceof Window) {
                return g;
            }
        }
        return null;
    }
    get modalLayer() {
        return this._modalLayer;
    }
    get hasModalWindow() {
        return this._modalLayer.parent != null;
    }
    get modalWaiting() {
        return this._modalWaitPane && this._modalWaitPane.node.activeInHierarchy;
    }
    getPopupPosition(popup, target, dir, result) {
        let pos = result || new Vec2();
        var sizeW = 0, sizeH = 0;
        if (target) {
            pos = target.localToGlobal();
            let pos2 = target.localToGlobal(target.width, target.height);
            sizeW = pos2.x - pos.x;
            sizeH = pos2.y - pos.y;
        }
        else {
            pos = this.getTouchPosition();
            pos = this.globalToLocal(pos.x, pos.y);
        }
        if (pos.x + popup.width > this.width)
            pos.x = pos.x + sizeW - popup.width;
        pos.y += sizeH;
        if (((dir === undefined || dir === PopupDirection.Auto) && pos.y + popup.height > this.height)
            || dir === false || dir === PopupDirection.Up) {
            pos.y = pos.y - sizeH - popup.height - 1;
            if (pos.y < 0) {
                pos.y = 0;
                pos.x += sizeW / 2;
            }
        }
        return pos;
    }
    showPopup(popup, target, dir) {
        if (this._popupStack.length > 0) {
            var k = this._popupStack.indexOf(popup);
            if (k != -1) {
                for (var i = this._popupStack.length - 1; i >= k; i--)
                    this.removeChild(this._popupStack.pop());
            }
        }
        this._popupStack.push(popup);
        if (target) {
            var p = target;
            while (p) {
                if (p.parent == this) {
                    if (popup.sortingOrder < p.sortingOrder) {
                        popup.sortingOrder = p.sortingOrder;
                    }
                    break;
                }
                p = p.parent;
            }
        }
        this.addChild(popup);
        this.adjustModalLayer();
        let pt = this.getPopupPosition(popup, target, dir);
        popup.setPosition(pt.x, pt.y);
    }
    togglePopup(popup, target, dir) {
        if (this._justClosedPopups.indexOf(popup) != -1)
            return;
        this.showPopup(popup, target, dir);
    }
    hidePopup(popup) {
        if (popup) {
            var k = this._popupStack.indexOf(popup);
            if (k != -1) {
                for (var i = this._popupStack.length - 1; i >= k; i--)
                    this.closePopup(this._popupStack.pop());
            }
        }
        else {
            var cnt = this._popupStack.length;
            for (i = cnt - 1; i >= 0; i--)
                this.closePopup(this._popupStack[i]);
            this._popupStack.length = 0;
        }
    }
    get hasAnyPopup() {
        return this._popupStack.length != 0;
    }
    closePopup(target) {
        if (target.parent) {
            if (target instanceof Window)
                target.hide();
            else
                this.removeChild(target);
        }
    }
    showTooltips(msg) {
        if (this._defaultTooltipWin == null) {
            var resourceURL = UIConfig.tooltipsWin;
            if (!resourceURL) {
                console.error("UIConfig.tooltipsWin not defined");
                return;
            }
            this._defaultTooltipWin = UIPackage.createObjectFromURL(resourceURL);
        }
        this._defaultTooltipWin.text = msg;
        this.showTooltipsWin(this._defaultTooltipWin);
    }
    showTooltipsWin(tooltipWin) {
        this.hideTooltips();
        this._tooltipWin = tooltipWin;
        let pt = this.getTouchPosition();
        pt.x += 10;
        pt.y += 20;
        this.globalToLocal(pt.x, pt.y, pt);
        if (pt.x + this._tooltipWin.width > this.width) {
            pt.x = pt.x - this._tooltipWin.width - 1;
            if (pt.x < 0)
                pt.x = 10;
        }
        if (pt.y + this._tooltipWin.height > this.height) {
            pt.y = pt.y - this._tooltipWin.height - 1;
            if (pt.y < 0)
                pt.y = 10;
        }
        this._tooltipWin.setPosition(pt.x, pt.y);
        this.addChild(this._tooltipWin);
    }
    hideTooltips() {
        if (this._tooltipWin) {
            if (this._tooltipWin.parent)
                this.removeChild(this._tooltipWin);
            this._tooltipWin = null;
        }
    }
    get volumeScale() {
        return this._volumeScale;
    }
    set volumeScale(value) {
        this._volumeScale = value;
    }
    playOneShotSound(clip, volumeScale) {
        if (!this.audioEngine) {
            this.audioEngine = this.node.addComponent(AudioSourceComponent);
        }
        if (volumeScale === undefined)
            volumeScale = 1;
        if (this.audioEngine.isValid) {
            this.audioEngine.clip = clip;
            this.audioEngine.volume = this._volumeScale * volumeScale;
            this.audioEngine.loop = false;
            this.audioEngine.play();
        }
    }
    adjustModalLayer() {
        var cnt = this.numChildren;
        if (this._modalWaitPane && this._modalWaitPane.parent)
            this.setChildIndex(this._modalWaitPane, cnt - 1);
        for (var i = cnt - 1; i >= 0; i--) {
            var g = this.getChildAt(i);
            if ((g instanceof Window) && g.modal) {
                if (this._modalLayer.parent == null)
                    this.addChildAt(this._modalLayer, i);
                else
                    this.setChildIndexBefore(this._modalLayer, i);
                return;
            }
        }
        if (this._modalLayer.parent)
            this.removeChild(this._modalLayer);
    }
    onTouchBegin_1(evt) {
        if (this._tooltipWin)
            this.hideTooltips();
        this._justClosedPopups.length = 0;
        if (this._popupStack.length > 0) {
            let mc = evt.initiator;
            while (mc && mc != this) {
                let pindex = this._popupStack.indexOf(mc);
                if (pindex != -1) {
                    for (let i = this._popupStack.length - 1; i > pindex; i--) {
                        var popup = this._popupStack.pop();
                        this.closePopup(popup);
                        this._justClosedPopups.push(popup);
                    }
                    return;
                }
                mc = mc.findParent();
            }
            let cnt = this._popupStack.length;
            for (let i = cnt - 1; i >= 0; i--) {
                popup = this._popupStack[i];
                this.closePopup(popup);
                this._justClosedPopups.push(popup);
            }
            this._popupStack.length = 0;
        }
    }
    onWinResize() {
        updateScaler();
        this.setSize(UIContentScaler.rootSize.width, UIContentScaler.rootSize.height);
        let anchorPoint = this.node.getParent()._uiProps.uiTransformComp.anchorPoint;
        this.node.setPosition(-this._width * anchorPoint.x, this._height * (1 - anchorPoint.y));
    }
    handlePositionChanged() {
        //nothing here
    }
}
Decls.GRoot = GRoot;
