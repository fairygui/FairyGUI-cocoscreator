import { Color, EventMouse } from "cc";
import { Event as FUIEvent } from "./event/Event";
import { PopupDirection, ObjectPropID, RelationType } from "./FieldTypes";
import { GButton } from "./GButton";
import { GComponent } from "./GComponent";
import { GList } from "./GList";
import { GRoot } from "./GRoot";
import { GTextField } from "./GTextField";
import { GTextInput } from "./GTextInput";
import { UIConfig } from "./UIConfig";
import { UIPackage } from "./UIPackage";
export class GComboBox extends GComponent {
    constructor() {
        super();
        this._visibleItemCount = 0;
        this._selectedIndex = 0;
        this._popupDirection = PopupDirection.Auto;
        this._node.name = "GComboBox";
        this._visibleItemCount = UIConfig.defaultComboBoxVisibleItemCount;
        this._itemsUpdated = true;
        this._selectedIndex = -1;
        this._items = [];
        this._values = [];
    }
    get text() {
        if (this._titleObject)
            return this._titleObject.text;
        else
            return null;
    }
    set text(value) {
        if (this._titleObject)
            this._titleObject.text = value;
        this.updateGear(6);
    }
    get icon() {
        if (this._iconObject)
            return this._iconObject.icon;
        else
            return null;
    }
    set icon(value) {
        if (this._iconObject)
            this._iconObject.icon = value;
        this.updateGear(7);
    }
    get titleColor() {
        var tf = this.getTextField();
        if (tf)
            return tf.color;
        else
            return Color.BLACK;
    }
    set titleColor(value) {
        var tf = this.getTextField();
        if (tf)
            tf.color = value;
    }
    get titleFontSize() {
        var tf = this.getTextField();
        if (tf)
            return tf.fontSize;
        else
            return 0;
    }
    set titleFontSize(value) {
        var tf = this.getTextField();
        if (tf)
            tf.fontSize = value;
    }
    get visibleItemCount() {
        return this._visibleItemCount;
    }
    set visibleItemCount(value) {
        this._visibleItemCount = value;
    }
    get popupDirection() {
        return this._popupDirection;
    }
    set popupDirection(value) {
        this._popupDirection = value;
    }
    get items() {
        return this._items;
    }
    set items(value) {
        if (!value)
            this._items.length = 0;
        else
            this._items = value.concat();
        if (this._items.length > 0) {
            if (this._selectedIndex >= this._items.length)
                this._selectedIndex = this._items.length - 1;
            else if (this._selectedIndex == -1)
                this._selectedIndex = 0;
            this.text = this._items[this._selectedIndex];
            if (this._icons && this._selectedIndex < this._icons.length)
                this.icon = this._icons[this._selectedIndex];
        }
        else {
            this.text = "";
            if (this._icons)
                this.icon = null;
            this._selectedIndex = -1;
        }
        this._itemsUpdated = true;
    }
    get icons() {
        return this._icons;
    }
    set icons(value) {
        this._icons = value;
        if (this._icons && this._selectedIndex != -1 && this._selectedIndex < this._icons.length)
            this.icon = this._icons[this._selectedIndex];
    }
    get values() {
        return this._values;
    }
    set values(value) {
        if (!value)
            this._values.length = 0;
        else
            this._values = value.concat();
    }
    get selectedIndex() {
        return this._selectedIndex;
    }
    set selectedIndex(val) {
        if (this._selectedIndex == val)
            return;
        this._selectedIndex = val;
        if (this._selectedIndex >= 0 && this._selectedIndex < this._items.length) {
            this.text = this._items[this._selectedIndex];
            if (this._icons && this._selectedIndex < this._icons.length)
                this.icon = this._icons[this._selectedIndex];
        }
        else {
            this.text = "";
            if (this._icons)
                this.icon = null;
        }
        this.updateSelectionController();
    }
    get value() {
        return this._values[this._selectedIndex];
    }
    set value(val) {
        var index = this._values.indexOf(val);
        if (index == -1 && val == null)
            index = this._values.indexOf("");
        this.selectedIndex = index;
    }
    get selectionController() {
        return this._selectionController;
    }
    set selectionController(value) {
        this._selectionController = value;
    }
    getTextField() {
        if (this._titleObject instanceof GTextField)
            return this._titleObject;
        else if ('getTextField' in this._titleObject)
            return this._titleObject.getTextField();
        else
            return null;
    }
    setState(val) {
        if (this._buttonController)
            this._buttonController.selectedPage = val;
    }
    getProp(index) {
        switch (index) {
            case ObjectPropID.Color:
                return this.titleColor;
            case ObjectPropID.OutlineColor:
                {
                    var tf = this.getTextField();
                    if (tf)
                        return tf.strokeColor;
                    else
                        return 0;
                }
            case ObjectPropID.FontSize:
                {
                    tf = this.getTextField();
                    if (tf)
                        return tf.fontSize;
                    else
                        return 0;
                }
            default:
                return super.getProp(index);
        }
    }
    setProp(index, value) {
        switch (index) {
            case ObjectPropID.Color:
                this.titleColor = value;
                break;
            case ObjectPropID.OutlineColor:
                {
                    var tf = this.getTextField();
                    if (tf)
                        tf.strokeColor = value;
                }
                break;
            case ObjectPropID.FontSize:
                {
                    tf = this.getTextField();
                    if (tf)
                        tf.fontSize = value;
                }
                break;
            default:
                super.setProp(index, value);
                break;
        }
    }
    constructExtension(buffer) {
        var str;
        this._buttonController = this.getController("button");
        this._titleObject = this.getChild("title");
        this._iconObject = this.getChild("icon");
        str = buffer.readS();
        if (str) {
            let obj = UIPackage.createObjectFromURL(str);
            if (!(obj instanceof GComponent)) {
                console.error("下拉框必须为元件");
                return;
            }
            this.dropdown = obj;
            this.dropdown.name = "this.dropdown";
            this._list = this.dropdown.getChild("list", GList);
            if (this._list == null) {
                console.error(this.resourceURL + ": 下拉框的弹出元件里必须包含名为list的列表");
                return;
            }
            this._list.on(FUIEvent.CLICK_ITEM, this.onClickItem, this);
            this._list.addRelation(this.dropdown, RelationType.Width);
            this._list.removeRelation(this.dropdown, RelationType.Height);
            this.dropdown.addRelation(this._list, RelationType.Height);
            this.dropdown.removeRelation(this._list, RelationType.Width);
            this.dropdown.on(FUIEvent.UNDISPLAY, this.onPopupClosed, this);
        }
        this._node.on(FUIEvent.TOUCH_BEGIN, this.onTouchBegin_1, this);
        this._node.on(FUIEvent.TOUCH_END, this.onTouchEnd_1, this);
        this._node.on(FUIEvent.ROLL_OVER, this.onRollOver_1, this);
        this._node.on(FUIEvent.ROLL_OUT, this.onRollOut_1, this);
    }
    handleControllerChanged(c) {
        super.handleControllerChanged(c);
        if (this._selectionController == c)
            this.selectedIndex = c.selectedIndex;
    }
    updateSelectionController() {
        if (this._selectionController && !this._selectionController.changing
            && this._selectedIndex < this._selectionController.pageCount) {
            var c = this._selectionController;
            this._selectionController = null;
            c.selectedIndex = this._selectedIndex;
            this._selectionController = c;
        }
    }
    dispose() {
        if (this.dropdown) {
            this.dropdown.dispose();
            this.dropdown = null;
        }
        super.dispose();
    }
    setup_afterAdd(buffer, beginPos) {
        super.setup_afterAdd(buffer, beginPos);
        if (!buffer.seek(beginPos, 6))
            return;
        if (buffer.readByte() != this.packageItem.objectType)
            return;
        var i;
        var iv;
        var nextPos;
        var str;
        var itemCount = buffer.readShort();
        for (i = 0; i < itemCount; i++) {
            nextPos = buffer.readShort();
            nextPos += buffer.position;
            this._items[i] = buffer.readS();
            this._values[i] = buffer.readS();
            str = buffer.readS();
            if (str != null) {
                if (this._icons == null)
                    this._icons = new Array();
                this._icons[i] = str;
            }
            buffer.position = nextPos;
        }
        str = buffer.readS();
        if (str != null) {
            this.text = str;
            this._selectedIndex = this._items.indexOf(str);
        }
        else if (this._items.length > 0) {
            this._selectedIndex = 0;
            this.text = this._items[0];
        }
        else
            this._selectedIndex = -1;
        str = buffer.readS();
        if (str != null)
            this.icon = str;
        if (buffer.readBool())
            this.titleColor = buffer.readColor();
        iv = buffer.readInt();
        if (iv > 0)
            this._visibleItemCount = iv;
        this._popupDirection = buffer.readByte();
        iv = buffer.readShort();
        if (iv >= 0)
            this._selectionController = this.parent.getControllerAt(iv);
    }
    showDropdown() {
        if (this._itemsUpdated) {
            this._itemsUpdated = false;
            this._list.removeChildrenToPool();
            var cnt = this._items.length;
            for (var i = 0; i < cnt; i++) {
                var item = this._list.addItemFromPool();
                item.name = i < this._values.length ? this._values[i] : "";
                item.text = this._items[i];
                item.icon = (this._icons && i < this._icons.length) ? this._icons[i] : null;
            }
            this._list.resizeToFit(this._visibleItemCount);
        }
        this._list.selectedIndex = -1;
        this.dropdown.width = this.width;
        this._list.ensureBoundsCorrect();
        GRoot.inst.togglePopup(this.dropdown, this, this._popupDirection);
        if (this.dropdown.parent)
            this.setState(GButton.DOWN);
    }
    onPopupClosed() {
        if (this._over)
            this.setState(GButton.OVER);
        else
            this.setState(GButton.UP);
    }
    onClickItem(itemObject) {
        let _t = this;
        let index = this._list.getChildIndex(itemObject);
        this._partner.callLater((dt) => {
            _t.onClickItem2(index);
        }, 0.1);
    }
    onClickItem2(index) {
        if (this.dropdown.parent instanceof GRoot)
            this.dropdown.parent.hidePopup();
        this._selectedIndex = -1;
        this.selectedIndex = index;
        this._node.emit(FUIEvent.STATUS_CHANGED, this);
    }
    onRollOver_1() {
        this._over = true;
        if (this._down || this.dropdown && this.dropdown.parent)
            return;
        this.setState(GButton.OVER);
    }
    onRollOut_1() {
        this._over = false;
        if (this._down || this.dropdown && this.dropdown.parent)
            return;
        this.setState(GButton.UP);
    }
    onTouchBegin_1(evt) {
        if (evt.button != EventMouse.BUTTON_LEFT)
            return;
        if ((evt.initiator instanceof GTextInput) && evt.initiator.editable)
            return;
        this._down = true;
        evt.captureTouch();
        if (this.dropdown)
            this.showDropdown();
    }
    onTouchEnd_1(evt) {
        if (evt.button != EventMouse.BUTTON_LEFT)
            return;
        if (this._down) {
            this._down = false;
            if (this.dropdown && !this.dropdown.parent) {
                if (this._over)
                    this.setState(GButton.OVER);
                else
                    this.setState(GButton.UP);
            }
        }
    }
}
