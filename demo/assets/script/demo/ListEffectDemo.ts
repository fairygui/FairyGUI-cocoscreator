import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as fgui from "fairygui-cc";

import MailItem from "./MailItem"

@ccclass
export default class ListEffectDemo extends Component {
    private _view: fgui.GComponent = null!;
    private _list: fgui.GList = null!;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/ListEffect", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        fgui.UIObjectFactory.setExtension("ui://ListEffect/mailItem", MailItem);

        this._view = fgui.UIPackage.createObject("ListEffect", "Main").asCom;
        this._view.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        fgui.GRoot.inst.addChild(this._view);

        this._list = this._view.getChild("mailList", fgui.GList);
        for (var i: number = 0; i < 10; i++) {
            var item: MailItem = <MailItem>this._list.addItemFromPool();
            item.setFetched(i % 3 == 0);
            item.setRead(i % 2 == 0);
            item.setTime("5 Nov 2015 16:24:33");
            item.title = "Mail title here";
        }

        this._list.ensureBoundsCorrect();
        var delay: number = 0;
        for (var i: number = 0; i < 10; i++) {
            var item: MailItem = <MailItem>this._list.getChildAt(i);
            if (this._list.isChildInView(item)) {
                item.playEffect(delay);
                delay += 0.2;
            }
            else
                break;
        }
    }
}
