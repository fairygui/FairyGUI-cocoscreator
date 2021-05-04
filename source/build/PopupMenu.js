import { Event as FUIEvent } from "./event/Event";
import { RelationType } from "./FieldTypes";
import { GButton } from "./GButton";
import { GRoot } from "./GRoot";
import { UIConfig } from "./UIConfig";
import { UIPackage } from "./UIPackage";
export class PopupMenu {
    constructor(url) {
        if (!url) {
            url = UIConfig.popupMenu;
            if (!url)
                throw "UIConfig.popupMenu not defined";
        }
        this._contentPane = UIPackage.createObjectFromURL(url);
        this._contentPane.on(FUIEvent.DISPLAY, this.onDisplay, this);
        this._list = (this._contentPane.getChild("list"));
        this._list.removeChildrenToPool();
        this._list.addRelation(this._contentPane, RelationType.Width);
        this._list.removeRelation(this._contentPane, RelationType.Height);
        this._contentPane.addRelation(this._list, RelationType.Height);
        this._list.on(FUIEvent.CLICK_ITEM, this.onClickItem, this);
    }
    dispose() {
        this._contentPane.dispose();
    }
    addItem(caption, callback) {
        var item = this._list.addItemFromPool();
        item.title = caption;
        item.data = callback;
        item.grayed = false;
        var c = item.getController("checked");
        if (c)
            c.selectedIndex = 0;
        return item;
    }
    addItemAt(caption, index, callback) {
        var item = this._list.getFromPool();
        this._list.addChildAt(item, index);
        item.title = caption;
        item.data = callback;
        item.grayed = false;
        var c = item.getController("checked");
        if (c)
            c.selectedIndex = 0;
        return item;
    }
    addSeperator() {
        if (UIConfig.popupMenu_seperator == null)
            throw "UIConfig.popupMenu_seperator not defined";
        this.list.addItemFromPool(UIConfig.popupMenu_seperator);
    }
    getItemName(index) {
        var item = this._list.getChildAt(index);
        return item.name;
    }
    setItemText(name, caption) {
        var item = this._list.getChild(name);
        item.title = caption;
    }
    setItemVisible(name, visible) {
        var item = this._list.getChild(name);
        if (item.visible != visible) {
            item.visible = visible;
            this._list.setBoundsChangedFlag();
        }
    }
    setItemGrayed(name, grayed) {
        var item = this._list.getChild(name);
        item.grayed = grayed;
    }
    setItemCheckable(name, checkable) {
        var item = this._list.getChild(name);
        var c = item.getController("checked");
        if (c) {
            if (checkable) {
                if (c.selectedIndex == 0)
                    c.selectedIndex = 1;
            }
            else
                c.selectedIndex = 0;
        }
    }
    setItemChecked(name, checked) {
        var item = this._list.getChild(name);
        var c = item.getController("checked");
        if (c)
            c.selectedIndex = checked ? 2 : 1;
    }
    isItemChecked(name) {
        var item = this._list.getChild(name);
        var c = item.getController("checked");
        if (c)
            return c.selectedIndex == 2;
        else
            return false;
    }
    removeItem(name) {
        var item = this._list.getChild(name);
        if (item) {
            var index = this._list.getChildIndex(item);
            this._list.removeChildToPoolAt(index);
            return true;
        }
        else
            return false;
    }
    clearItems() {
        this._list.removeChildrenToPool();
    }
    get itemCount() {
        return this._list.numChildren;
    }
    get contentPane() {
        return this._contentPane;
    }
    get list() {
        return this._list;
    }
    show(target, dir) {
        GRoot.inst.showPopup(this.contentPane, (target instanceof GRoot) ? null : target, dir);
    }
    onClickItem(item, evt) {
        this._list._partner.callLater((dt) => {
            this.onClickItem2(item, evt);
        }, 0.1);
    }
    onClickItem2(item, evt) {
        if (!(item instanceof GButton))
            return;
        if (item.grayed) {
            this._list.selectedIndex = -1;
            return;
        }
        var c = item.getController("checked");
        if (c && c.selectedIndex != 0) {
            if (c.selectedIndex == 1)
                c.selectedIndex = 2;
            else
                c.selectedIndex = 1;
        }
        var r = (this._contentPane.parent);
        r.hidePopup(this.contentPane);
        if (item.data instanceof Function)
            item.data(item, evt);
    }
    onDisplay() {
        this._list.selectedIndex = -1;
        this._list.resizeToFit(100000, 10);
    }
}
