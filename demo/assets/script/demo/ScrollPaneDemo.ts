import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as fgui from "fairygui-cc";

@ccclass
export default class ScrollPaneDemo extends Component {
    private _view: fgui.GComponent = null!;
    private _list: fgui.GList = null!;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/ScrollPane", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("ScrollPane", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._list = this._view.getChild("list", fgui.GList);
        this._list.itemRenderer = <fgui.ListItemRenderer>this.renderListItem.bind(this);
        this._list.setVirtual();
        this._list.numItems = 1000;
        this._list.on(fgui.Event.TOUCH_BEGIN, this.onClickList, this);
    }

    private renderListItem(index: number, item: fgui.GButton) {
        item.title = "Item " + index;
        item.scrollPane.posX = 0; //reset scroll pos

        item.getChild("b0").onClick(this.onClickStick, this);
        item.getChild("b1").onClick(this.onClickDelete, this);
    }

    private onClickList(evt: fgui.Event) {
        //点击列表时，查找是否有项目处于编辑状态， 如果有就归位
        let cnt = this._list.numChildren;
        for (let i: number = 0; i < cnt; i++) {
            let item: fgui.GButton = this._list.getChildAt(i, fgui.GButton);
            if (item.scrollPane.posX != 0) {
                //Check if clicked on the button
                if (item.getChild("b0", fgui.GButton).isAncestorOf(fgui.GRoot.inst.touchTarget)
                    || item.getChild("b1", fgui.GButton).isAncestorOf(fgui.GRoot.inst.touchTarget)) {
                    return;
                }
                item.scrollPane.setPosX(0, true);

                //取消滚动面板可能发生的拉动。
                item.scrollPane.cancelDragging();
                this._list.scrollPane.cancelDragging();
                break;
            }
        }
    }

    private onClickStick(evt: fgui.Event) {
        this._view.getChild("txt").text = "Stick " + evt.sender!.parent.text;
    }

    private onClickDelete(evt: fgui.Event) {
        this._view.getChild("txt").text = "Delete " + evt.sender!.parent.text;
    }
}
