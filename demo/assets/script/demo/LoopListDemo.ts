import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as fgui from "fairygui-cc";

@ccclass
export default class LoopListDemo extends Component {
    private _view: fgui.GComponent = null!;
    private _list: fgui.GList = null!;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/LoopList", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("LoopList", "Main").asCom;
        this._view.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        fgui.GRoot.inst.addChild(this._view);

        this._list = this._view.getChild("list", fgui.GList);
        this._list.setVirtualAndLoop();

        this._list.itemRenderer = <fgui.ListItemRenderer>this.renderListItem.bind(this);
        this._list.numItems = 5;
        this._list.on(fgui.Event.SCROLL, this.doSpecialEffect, this);
        this.doSpecialEffect();
    }

    private doSpecialEffect(): void {
        //change the scale according to the distance to the middle
        var midX: number = this._list.scrollPane.posX + this._list.viewWidth / 2;
        var cnt: number = this._list.numChildren;
        for (var i: number = 0; i < cnt; i++) {
            var obj: fgui.GObject = this._list.getChildAt(i);
            var dist: number = Math.abs(midX - obj.x - obj.width / 2);
            if (dist > obj.width) //no intersection
                obj.setScale(1, 1);
            else {
                var ss: number = 1 + (1 - dist / obj.width) * 0.24;
                obj.setScale(ss, ss);
            }
        }

        this._view.getChild("n3").text = "" + ((this._list.getFirstChildInView() + 1) % this._list.numItems);
    }

    private renderListItem(index: number, item: fgui.GButton): void {
        item.setPivot(0.5, 0.5);
        item.icon = fgui.UIPackage.getItemURL("LoopList", "n" + (index + 1));
    }
}

