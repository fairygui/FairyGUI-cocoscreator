const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollPaneDemo extends cc.Component {
    private _view: fgui.GComponent;
    private _list: fgui.GList;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/ScrollPane", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("ScrollPane", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._list = this._view.getChild("list").asList;
        this._list.itemRenderer = this.renderListItem.bind(this);
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
            let item: fgui.GButton = this._list.getChildAt(i).asButton;
            if (item.scrollPane.posX != 0) {
                //Check if clicked on the button
                if (item.getChild("b0").asButton.isAncestorOf(fgui.GRoot.inst.touchTarget)
                    || item.getChild("b1").asButton.isAncestorOf(fgui.GRoot.inst.touchTarget)) {
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
        this._view.getChild("txt").text = "Stick " + fgui.GObject.cast(evt.currentTarget).parent.text;
    }

    private onClickDelete(evt: fgui.Event) {
        this._view.getChild("txt").text = "Delete " + fgui.GObject.cast(evt.currentTarget).parent.text;
    }
}
