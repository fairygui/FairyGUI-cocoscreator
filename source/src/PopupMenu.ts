import { Controller } from "./Controller";
import { Event as FUIEvent } from "./event/Event";
import { RelationType, PopupDirection } from "./FieldTypes";
import { GButton } from "./GButton";
import { GComponent } from "./GComponent";
import { GList } from "./GList";
import { GObject } from "./GObject";
import { GRoot } from "./GRoot";
import { UIConfig } from "./UIConfig";
import { UIPackage } from "./UIPackage";

export class PopupMenu {

    protected _contentPane: GComponent;
    protected _list: GList;

    public constructor(url?: string) {
        if (!url) {
            url = UIConfig.popupMenu;
            if (!url)
                throw "UIConfig.popupMenu not defined";
        }
        this._contentPane = <GComponent>UIPackage.createObjectFromURL(url);
        this._contentPane.on(FUIEvent.DISPLAY, this.onDisplay, this);
        this._list = <GList>(this._contentPane.getChild("list"));
        this._list.removeChildrenToPool();
        this._list.addRelation(this._contentPane, RelationType.Width);
        this._list.removeRelation(this._contentPane, RelationType.Height);
        this._contentPane.addRelation(this._list, RelationType.Height);
        this._list.on(FUIEvent.CLICK_ITEM, this.onClickItem, this);
    }

    public dispose(): void {
        this._contentPane.dispose();
    }

    public addItem(caption: string, callback?: (item?: GObject, evt?: Event) => void): GButton {
        var item: GButton = <GButton>this._list.addItemFromPool();
        item.title = caption;
        item.data = callback;
        item.grayed = false;
        var c: Controller = item.getController("checked");
        if (c)
            c.selectedIndex = 0;
        return item;
    }

    public addItemAt(caption: string, index: number, callback?: (item?: GObject, evt?: Event) => void): GButton {
        var item: GButton = <GButton>this._list.getFromPool();
        this._list.addChildAt(item, index);
        item.title = caption;
        item.data = callback;
        item.grayed = false;
        var c: Controller = item.getController("checked");
        if (c)
            c.selectedIndex = 0;
        return item;
    }

    public addSeperator() {
        if (UIConfig.popupMenu_seperator == null)
            throw "UIConfig.popupMenu_seperator not defined";
        this.list.addItemFromPool(UIConfig.popupMenu_seperator);
    }

    public getItemName(index: number): string {
        var item: GObject = this._list.getChildAt(index);
        return item.name;
    }

    public setItemText(name: string, caption: string) {
        var item: GButton = <GButton>this._list.getChild(name);
        item.title = caption;
    }

    public setItemVisible(name: string, visible: boolean) {
        var item: GButton = <GButton>this._list.getChild(name);
        if (item.visible != visible) {
            item.visible = visible;
            this._list.setBoundsChangedFlag();
        }
    }

    public setItemGrayed(name: string, grayed: boolean) {
        var item: GButton = <GButton>this._list.getChild(name);
        item.grayed = grayed;
    }

    public setItemCheckable(name: string, checkable: boolean) {
        var item: GButton = <GButton>this._list.getChild(name);
        var c: Controller = item.getController("checked");
        if (c) {
            if (checkable) {
                if (c.selectedIndex == 0)
                    c.selectedIndex = 1;
            }
            else
                c.selectedIndex = 0;
        }
    }

    public setItemChecked(name: string, checked: boolean) {
        var item: GButton = <GButton>this._list.getChild(name);
        var c: Controller = item.getController("checked");
        if (c)
            c.selectedIndex = checked ? 2 : 1;
    }

    public isItemChecked(name: string): boolean {
        var item: GButton = <GButton>this._list.getChild(name);
        var c: Controller = item.getController("checked");
        if (c)
            return c.selectedIndex == 2;
        else
            return false;
    }

    public removeItem(name: string): boolean {
        var item: GObject = this._list.getChild(name);
        if (item) {
            var index: number = this._list.getChildIndex(item);
            this._list.removeChildToPoolAt(index);
            return true;
        }
        else
            return false;
    }

    public clearItems() {
        this._list.removeChildrenToPool();
    }

    public get itemCount(): number {
        return this._list.numChildren;
    }

    public get contentPane(): GComponent {
        return this._contentPane;
    }

    public get list(): GList {
        return this._list;
    }

    public show(target?: GObject | null, dir?: PopupDirection | boolean) {
        GRoot.inst.showPopup(this.contentPane, (target instanceof GRoot) ? null : target, dir);
    }

    private onClickItem(item: GObject, evt: FUIEvent): void {
        this._list._partner.callLater((dt: number) => {
            this.onClickItem2(item, evt);
        }, 0.1);
    }

    private onClickItem2(item: GObject, evt: FUIEvent): void {
        if (!(item instanceof GButton))
            return;

        if (item.grayed) {
            this._list.selectedIndex = -1;
            return;
        }
        var c: Controller = item.getController("checked");
        if (c && c.selectedIndex != 0) {
            if (c.selectedIndex == 1)
                c.selectedIndex = 2;
            else
                c.selectedIndex = 1;
        }
        var r: GRoot = <GRoot>(this._contentPane.parent);
        r.hidePopup(this.contentPane);
        if (item.data instanceof Function)
            item.data(item, evt);
    }

    private onDisplay() {
        this._list.selectedIndex = -1;
        this._list.resizeToFit(100000, 10);
    }

}