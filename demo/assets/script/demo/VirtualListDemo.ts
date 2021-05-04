import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as fgui from "fairygui-cc";

import MailItem from "./MailItem"

@ccclass
export default class VirtualListDemo extends Component {
    private _view: fgui.GComponent = null!;
    private _list: fgui.GList = null!;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/VirtualList", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        fgui.UIObjectFactory.setExtension("ui://VirtualList/mailItem", MailItem);

        this._view = fgui.UIPackage.createObject("VirtualList", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._view.getChild("n6").onClick(() => { this._list.addSelection(500, true); });
        this._view.getChild("n7").onClick(() => { this._list.scrollPane.scrollTop(); });
        this._view.getChild("n8").onClick(() => { this._list.scrollPane.scrollBottom(); });

        this._list = this._view.getChild("mailList", fgui.GList);
        this._list.setVirtual();

        this._list.itemRenderer = <fgui.ListItemRenderer>this.renderListItem.bind(this);
        this._list.numItems = 1000;
    }

    private renderListItem(index: number, item: MailItem): void {
        item.setFetched(index % 3 == 0);
        item.setRead(index % 2 == 0);
        item.setTime("5 Nov 2015 16:24:33");
        item.title = index + " Mail title here";
    }
}

