import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as fgui from "fairygui-cc";

@ccclass
export default class BagDemo extends Component {
    private _view: fgui.GComponent = null!;
    private _bagWindow: fgui.Window = null!;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/Bag", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("Bag", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._bagWindow = new BagWindow();
        this._view.getChild("bagBtn").onClick(() => { this._bagWindow.show(); }, this);
    }

    onDestroy() {
        fgui.UIPackage.removePackage("Bag");
    }
}

class BagWindow extends fgui.Window {
    public constructor() {
        super();
    }

    protected onInit(): void {
        this.contentPane = fgui.UIPackage.createObject("Bag", "BagWin").asCom;
        this.center();
    }

    protected onShown(): void {
        var list: fgui.GList = <fgui.GList>this.contentPane.getChild("list");
        list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
        list.itemRenderer = this.renderListItem.bind(this);
        list.setVirtual();
        list.numItems = 45;
    }

    private renderListItem(index: number, obj: fgui.GObject): void {
        obj.icon = "Icons/i" + Math.floor(Math.random() * 10);
        obj.text = "" + Math.floor(Math.random() * 100);
    }

    private onClickItem(item: fgui.GObject): void {
        this.contentPane.getChild("n11").icon = item.icon;
        this.contentPane.getChild("n13").text = item.icon;
    }
}