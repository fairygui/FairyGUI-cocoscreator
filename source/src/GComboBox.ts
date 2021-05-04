import { Color, EventMouse } from "cc";
import { Controller } from "./Controller";
import { Event as FUIEvent } from "./event/Event";
import { PopupDirection, ObjectPropID, RelationType } from "./FieldTypes";
import { GButton } from "./GButton";
import { GComponent } from "./GComponent";
import { GList } from "./GList";
import { GObject } from "./GObject";
import { GRoot } from "./GRoot";
import { GTextField } from "./GTextField";
import { GTextInput } from "./GTextInput";
import { UIConfig } from "./UIConfig";
import { UIPackage } from "./UIPackage";
import { ByteBuffer } from "./utils/ByteBuffer";

export class GComboBox extends GComponent {
    public dropdown: GComponent;

    protected _titleObject: GObject;
    protected _iconObject: GObject;
    protected _list: GList;

    private _items: Array<string>;
    private _values: Array<string>;
    private _icons?: Array<string>;

    private _visibleItemCount: number = 0;
    private _itemsUpdated: boolean;
    private _selectedIndex: number = 0;
    private _buttonController: Controller;
    private _popupDirection: number = PopupDirection.Auto;
    private _selectionController: Controller;

    private _over: boolean;
    private _down: boolean;

    public constructor() {
        super();

        this._node.name = "GComboBox";
        this._visibleItemCount = UIConfig.defaultComboBoxVisibleItemCount;
        this._itemsUpdated = true;
        this._selectedIndex = -1;
        this._items = [];
        this._values = [];
    }

    public get text(): string | null {
        if (this._titleObject)
            return this._titleObject.text;
        else
            return null;
    }

    public set text(value: string | null) {
        if (this._titleObject)
            this._titleObject.text = value;
        this.updateGear(6);
    }

    public get icon(): string | null {
        if (this._iconObject)
            return this._iconObject.icon;
        else
            return null;
    }

    public set icon(value: string | null) {
        if (this._iconObject)
            this._iconObject.icon = value;
        this.updateGear(7);
    }

    public get titleColor(): Color {
        var tf: GTextField = this.getTextField();
        if (tf)
            return tf.color;
        else
            return Color.BLACK;
    }

    public set titleColor(value: Color) {
        var tf: GTextField = this.getTextField();
        if (tf)
            tf.color = value;
    }

    public get titleFontSize(): number {
        var tf: GTextField = this.getTextField();
        if (tf)
            return tf.fontSize;
        else
            return 0;
    }

    public set titleFontSize(value: number) {
        var tf: GTextField = this.getTextField();
        if (tf)
            tf.fontSize = value;
    }

    public get visibleItemCount(): number {
        return this._visibleItemCount;
    }

    public set visibleItemCount(value: number) {
        this._visibleItemCount = value;
    }

    public get popupDirection(): PopupDirection {
        return this._popupDirection;
    }

    public set popupDirection(value: PopupDirection) {
        this._popupDirection = value;
    }

    public get items(): Array<string> {
        return this._items;
    }

    public set items(value: Array<string>) {
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

    public get icons(): Array<string> {
        return this._icons;
    }

    public set icons(value: Array<string>) {
        this._icons = value;
        if (this._icons && this._selectedIndex != -1 && this._selectedIndex < this._icons.length)
            this.icon = this._icons[this._selectedIndex];
    }

    public get values(): Array<string> {
        return this._values;
    }

    public set values(value: Array<string>) {
        if (!value)
            this._values.length = 0;
        else
            this._values = value.concat();
    }

    public get selectedIndex(): number {
        return this._selectedIndex;
    }

    public set selectedIndex(val: number) {
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

    public get value(): string | null {
        return this._values[this._selectedIndex];
    }

    public set value(val: string | null) {
        var index: number = this._values.indexOf(val);
        if (index == -1 && val == null)
            index = this._values.indexOf("");
        this.selectedIndex = index;
    }

    public get selectionController(): Controller {
        return this._selectionController;
    }

    public set selectionController(value: Controller) {
        this._selectionController = value;
    }

    public getTextField(): GTextField {
        if (this._titleObject instanceof GTextField)
            return this._titleObject;
        else if ('getTextField' in this._titleObject)
            return (<any>this._titleObject).getTextField();
        else
            return null;
    }

    protected setState(val: string): void {
        if (this._buttonController)
            this._buttonController.selectedPage = val;
    }

    public getProp(index: number): any {
        switch (index) {
            case ObjectPropID.Color:
                return this.titleColor;
            case ObjectPropID.OutlineColor:
                {
                    var tf: GTextField = this.getTextField();
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

    public setProp(index: number, value: any): void {
        switch (index) {
            case ObjectPropID.Color:
                this.titleColor = value;
                break;
            case ObjectPropID.OutlineColor:
                {
                    var tf: GTextField = this.getTextField();
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

    protected constructExtension(buffer: ByteBuffer): void {
        var str: string;

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

    public handleControllerChanged(c: Controller): void {
        super.handleControllerChanged(c);

        if (this._selectionController == c)
            this.selectedIndex = c.selectedIndex;
    }

    private updateSelectionController(): void {
        if (this._selectionController && !this._selectionController.changing
            && this._selectedIndex < this._selectionController.pageCount) {
            var c: Controller = this._selectionController;
            this._selectionController = null;
            c.selectedIndex = this._selectedIndex;
            this._selectionController = c;
        }
    }

    public dispose(): void {
        if (this.dropdown) {
            this.dropdown.dispose();
            this.dropdown = null;
        }

        super.dispose();
    }

    public setup_afterAdd(buffer: ByteBuffer, beginPos: number): void {
        super.setup_afterAdd(buffer, beginPos);

        if (!buffer.seek(beginPos, 6))
            return;

        if (buffer.readByte() != this.packageItem.objectType)
            return;

        var i: number;
        var iv: number;
        var nextPos: number;
        var str: string;
        var itemCount: number = buffer.readShort();
        for (i = 0; i < itemCount; i++) {
            nextPos = buffer.readShort();
            nextPos += buffer.position;

            this._items[i] = buffer.readS();
            this._values[i] = buffer.readS();
            str = buffer.readS();
            if (str != null) {
                if (this._icons == null)
                    this._icons = new Array<string>();
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

    protected showDropdown(): void {
        if (this._itemsUpdated) {
            this._itemsUpdated = false;

            this._list.removeChildrenToPool();
            var cnt: number = this._items.length;
            for (var i: number = 0; i < cnt; i++) {
                var item: GObject = this._list.addItemFromPool();
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

    private onPopupClosed(): void {
        if (this._over)
            this.setState(GButton.OVER);
        else
            this.setState(GButton.UP);
    }

    private onClickItem(itemObject: GObject): void {
        let _t = this;
        let index = this._list.getChildIndex(itemObject);
        this._partner.callLater((dt: number) => {
            _t.onClickItem2(index);
        }, 0.1);
    }

    private onClickItem2(index: number): void {
        if (this.dropdown.parent instanceof GRoot)
            this.dropdown.parent.hidePopup();

        this._selectedIndex = -1;
        this.selectedIndex = index;
        this._node.emit(FUIEvent.STATUS_CHANGED, this);
    }

    private onRollOver_1(): void {
        this._over = true;
        if (this._down || this.dropdown && this.dropdown.parent)
            return;

        this.setState(GButton.OVER);
    }

    private onRollOut_1(): void {
        this._over = false;
        if (this._down || this.dropdown && this.dropdown.parent)
            return;

        this.setState(GButton.UP);
    }

    private onTouchBegin_1(evt: FUIEvent): void {
        if (evt.button != EventMouse.BUTTON_LEFT)
            return;

        if ((evt.initiator instanceof GTextInput) && evt.initiator.editable)
            return;

        this._down = true;
        evt.captureTouch();

        if (this.dropdown)
            this.showDropdown();
    }

    private onTouchEnd_1(evt: FUIEvent): void {
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