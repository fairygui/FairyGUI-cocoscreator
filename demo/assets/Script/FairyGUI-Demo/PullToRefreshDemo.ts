import ScrollPaneHeader from "./ScrollPaneHeader"

const { ccclass, property } = cc._decorator;

@ccclass
export default class PullToRefreshDemo extends cc.Component {
    private _view: fgui.GComponent;
    private _list1: fgui.GList;
    private _list2: fgui.GList;

    onLoad() {
        fgui.UIObjectFactory.setExtension("ui://PullToRefresh/Header", ScrollPaneHeader);
        
        fgui.UIPackage.loadPackage("UI/PullToRefresh", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("PullToRefresh", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._list1 = this._view.getChild("list1").asList;
        this._list1.itemRenderer = this.renderListItem1.bind(this);
        this._list1.setVirtual();
        this._list1.numItems = 1;
        this._list1.on(fgui.Event.PULL_DOWN_RELEASE, this.onPullDownToRefresh, this);

        this._list2 = this._view.getChild("list2").asList;
        this._list2.itemRenderer = this.renderListItem2.bind(this);
        this._list2.setVirtual();
        this._list2.numItems = 1;
        this._list2.on(fgui.Event.PULL_UP_RELEASE, this.onPullUpToRefresh, this);
    }

    private renderListItem1(index: number, item: fgui.GObject): void {
        item.text = "Item " + (this._list1.numItems - index - 1);
    }

    private renderListItem2(index: number, item: fgui.GObject): void {
        item.text = "Item " + index;
    }

    private onPullDownToRefresh(): void {
        let header: ScrollPaneHeader = <ScrollPaneHeader>(this._list1.scrollPane.header);
        if (header.readyToRefresh) {
            header.setRefreshStatus(2);
            this._list1.scrollPane.lockHeader(header.sourceHeight);

            //Simulate a async resquest
            this.scheduleOnce(this.simulateAsynWorkFinished, 2);
        }
    }

    private onPullUpToRefresh(): void {
        let footer: fgui.GComponent = this._list2.scrollPane.footer.asCom;

        footer.getController("c1").selectedIndex = 1;
        this._list2.scrollPane.lockFooter(footer.sourceHeight);

        //Simulate a async resquest
        this.scheduleOnce(this.simulateAsynWorkFinished2, 2);
    }

    private simulateAsynWorkFinished() {
        this._list1.numItems += 5;

        //Refresh completed
        let header: ScrollPaneHeader = <ScrollPaneHeader>(this._list1.scrollPane.header);
        header.setRefreshStatus(3);
        this._list1.scrollPane.lockHeader(35);

        this.scheduleOnce(this.simulateHintFinished, 2);
    }

    private simulateHintFinished() {
        let header: ScrollPaneHeader = <ScrollPaneHeader>(this._list1.scrollPane.header);
        header.setRefreshStatus(0);
        this._list1.scrollPane.lockHeader(0);
    }

    private simulateAsynWorkFinished2() {
        this._list2.numItems += 5;

        //Refresh completed
        let footer: fgui.GComponent = this._list2.scrollPane.footer.asCom;
        footer.getController("c1").selectedIndex = 0;
        this._list2.scrollPane.lockFooter(0);
    }
}

