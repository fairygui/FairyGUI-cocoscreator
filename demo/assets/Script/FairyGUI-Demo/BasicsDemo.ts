import { WindowA, WindowB } from "./TestWin";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BasicDemo extends cc.Component {
    private _view: fgui.GComponent;
    private _backBtn: fgui.GObject;
    private _demoContainer: fgui.GComponent;
    private _cc: fgui.Controller;

    private _demoObjects: any;

    onLoad() {
        fgui.UIConfig.verticalScrollBar = "ui://Basics/ScrollBar_VT";
        fgui.UIConfig.horizontalScrollBar = "ui://Basics/ScrollBar_HZ";
        fgui.UIConfig.popupMenu = "ui://Basics/PopupMenu";
        fgui.UIConfig.buttonSound = "ui://Basics/click";

        fgui.UIPackage.loadPackage("UI/Basics", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("Basics", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._backBtn = this._view.getChild("btn_Back");
        this._backBtn.visible = false;
        this._backBtn.onClick(this.onClickBack, this);

        this._demoContainer = this._view.getChild("container").asCom;
        this._cc = this._view.getController("c1");

        var cnt: number = this._view.numChildren;
        for (var i: number = 0; i < cnt; i++) {
            var obj: fgui.GObject = this._view.getChildAt(i);
            if (obj.group && obj.group.name == "btns")
                obj.onClick(this.runDemo, this);
        }

        this._demoObjects = {};
    }

    onDestroy() {
        fgui.UIConfig.verticalScrollBar = "";
        fgui.UIConfig.horizontalScrollBar = "";
        fgui.UIConfig.popupMenu = "";
        fgui.UIConfig.buttonSound = "";
        fgui.UIPackage.removePackage("Basics");
    }

    private runDemo(evt: fgui.Event): void {
        var type: string = fgui.GObject.cast(evt.currentTarget).name.substr(4);
        var obj: fgui.GComponent = this._demoObjects[type];
        if (obj == null) {
            obj = fgui.UIPackage.createObject("Basics", "Demo_" + type).asCom;
            this._demoObjects[type] = obj;
        }

        this._demoContainer.removeChildren();
        this._demoContainer.addChild(obj);
        this._cc.selectedIndex = 1;
        this._backBtn.visible = true;

        switch (type) {
            case "Button":
                this.playButton();
                break;

            case "Text":
                this.playText();
                break;

            case "Window":
                this.playWindow();
                break;

            case "Popup":
                this.playPopup();
                break;

            case "Drag&Drop":
                this.playDragDrop();
                break;

            case "Depth":
                this.playDepth();
                break;

            case "Grid":
                this.playGrid();
                break;

            case "ProgressBar":
                this.playProgressBar();
                break;
        }
    }

    private onClickBack(evt: Event): void {
        this._cc.selectedIndex = 0;
        this._backBtn.visible = false;
    }

    //------------------------------
    private playButton(): void {
        var obj: fgui.GComponent = this._demoObjects["Button"];
        obj.getChild("n34").onClick(this.__clickButton, this);
    }

    private onDragStart(evt: fgui.Event): void {
        var btn: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        //btn.stopDrag();//取消对原目标的拖动，换成一个替代品
    }

    private __clickButton(): void {
        console.log("click button");
    }

    //------------------------------
    private playText(): void {
        var obj: fgui.GComponent = this._demoObjects["Text"];
        obj.getChild("n12").on(fgui.Event.LINK, this.__clickLink, this);

        obj.getChild("n25").onClick(this.__clickGetInput, this);
    }

    private __clickLink(link: string): void {
        var obj: fgui.GComponent = this._demoObjects["Text"];
        obj.getChild("n12").text = "[img]ui://9leh0eyft9fj5f[/img][color=#FF0000]你点击了链接[/color]：" + link;
    }

    private __clickGetInput(): void {
        var obj: fgui.GComponent = this._demoObjects["Text"];
        obj.getChild("n24").text = obj.getChild("n22").text;
    }

    //------------------------------
    private _winA: fgui.Window;
    private _winB: fgui.Window;
    private playWindow(): void {
        var obj: fgui.GComponent = this._demoObjects["Window"];
        obj.getChild("n0").onClick(this.__clickWindowA, this);
        obj.getChild("n1").onClick(this.__clickWindowB, this);
    }

    private __clickWindowA(): void {
        if (this._winA == null)
            this._winA = new WindowA();
        this._winA.show();
    }

    private __clickWindowB(): void {
        if (this._winB == null)
            this._winB = new WindowB();
        this._winB.show();
    }

    //------------------------------
    private _pm: fgui.PopupMenu;
    private _popupCom: fgui.GComponent;
    private playPopup(): void {
        if (this._pm == null) {
            this._pm = new fgui.PopupMenu();
            this._pm.addItem("Item 1");
            this._pm.addItem("Item 2");
            this._pm.addItem("Item 3");
            this._pm.addItem("Item 4");

            if (this._popupCom == null) {
                this._popupCom = fgui.UIPackage.createObject("Basics", "Component12").asCom;
                this._popupCom.center();
            }
        }

        var obj: fgui.GComponent = this._demoObjects["Popup"];
        var btn: fgui.GObject = obj.getChild("n0");
        btn.onClick(this.__clickPopup1, this);

        var btn2: fgui.GObject = obj.getChild("n1");
        btn2.onClick(this.__clickPopup2, this);
    }

    private __clickPopup1(evt: fgui.Event): void {
        var btn: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        this._pm.show(btn);
    }

    private __clickPopup2(): void {
        fgui.GRoot.inst.showPopup(this._popupCom);
    }

    //------------------------------
    private playDragDrop(): void {
        var obj: fgui.GComponent = this._demoObjects["Drag&Drop"];
        var btnA: fgui.GObject = obj.getChild("a");
        btnA.draggable = true;

        var btnB: fgui.GButton = obj.getChild("b").asButton;
        btnB.draggable = true;
        btnB.on(fgui.Event.DRAG_START, this.__onDragStart, this);

        var btnC: fgui.GButton = obj.getChild("c").asButton;
        btnC.icon = null;
        btnC.on(fgui.Event.DROP, this.__onDrop, this);

        var btnD: fgui.GObject = obj.getChild("d");
        btnD.draggable = true;
        var bounds: fgui.GObject = obj.getChild("bounds");
        var rect: cc.Rect = bounds.localToGlobalRect(0, 0, bounds.width, bounds.height);
        rect = fgui.GRoot.inst.globalToLocalRect(rect.x, rect.y, rect.width, rect.height, rect);

        //因为这时候面板还在从右往左动，所以rect不准确，需要用相对位置算出最终停下来的范围
        rect.x -= obj.parent.x;

        btnD.dragBounds = rect;
    }

    private __onDragStart(evt: fgui.Event): void {
        var btn: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        btn.stopDrag();//取消对原目标的拖动，换成一个替代品
        fgui.DragDropManager.inst.startDrag(btn, btn.icon, btn.icon);
    }

    private __onDrop(target: fgui.GObject, data: any): void {
        target.icon = data;
    }

    //------------------------------
    private startPos: cc.Vec2 = new cc.Vec2();
    private playDepth(): void {
        var obj: fgui.GComponent = this._demoObjects["Depth"];
        var testContainer: fgui.GComponent = obj.getChild("n22").asCom;
        var fixedObj: fgui.GObject = testContainer.getChild("n0");
        fixedObj.sortingOrder = 100;
        fixedObj.draggable = true;

        var numChildren: number = testContainer.numChildren;
        var i: number = 0;
        while (i < numChildren) {
            var child: fgui.GObject = testContainer.getChildAt(i);
            if (child != fixedObj) {
                testContainer.removeChildAt(i);
                numChildren--;
            }
            else
                i++;
        }
        this.startPos.x = fixedObj.x;
        this.startPos.y = fixedObj.y;

        obj.getChild("btn0").onClick(this.__click1, this);
        obj.getChild("btn1").onClick(this.__click2, this);
    }

    private __click1() {
        var graph: fgui.GGraph = new fgui.GGraph();
        this.startPos.x += 10;
        this.startPos.y += 10;
        graph.setPosition(this.startPos.x, this.startPos.y);
        graph.setSize(150, 150);
        graph.drawRect(1, cc.Color.BLACK, cc.Color.RED);

        var obj: fgui.GComponent = this._demoObjects["Depth"];
        obj.getChild("n22").asCom.addChild(graph);
    }

    private __click2() {
        var graph: fgui.GGraph = new fgui.GGraph();
        this.startPos.x += 10;
        this.startPos.y += 10;
        graph.setPosition(this.startPos.x, this.startPos.y);
        graph.setSize(150, 150);
        graph.drawRect(1, cc.Color.BLACK, cc.Color.GREEN);
        graph.sortingOrder = 200;

        var obj: fgui.GComponent = this._demoObjects["Depth"];
        obj.getChild("n22").asCom.addChild(graph);
    }

    //------------------------------
    private playGrid(): void {
        var obj: fgui.GComponent = this._demoObjects["Grid"];
        var list1: fgui.GList = obj.getChild("list1").asList;
        list1.removeChildrenToPool();
        var testNames: Array<string> = ["苹果手机操作系统", "安卓手机操作系统", "微软手机操作系统", "微软桌面操作系统", "苹果桌面操作系统", "未知操作系统"];
        var testColors: Array<cc.Color> = [cc.Color.YELLOW, cc.Color.RED, cc.Color.WHITE, cc.Color.BLUE];
        var cnt: number = testNames.length;
        for (var i: number = 0; i < cnt; i++) {
            var item: fgui.GButton = list1.addItemFromPool().asButton;
            item.getChild("t0").text = "" + (i + 1);
            item.getChild("t1").text = testNames[i];
            item.getChild("t2").asTextField.color = testColors[Math.floor(Math.random() * 4)];
            item.getChild("star").asProgress.value = (Math.floor(Math.random() * 3) + 1) / 3 * 100;
        }

        var list2: fgui.GList = obj.getChild("list2").asList;
        list2.removeChildrenToPool();
        for (var i: number = 0; i < cnt; i++) {
            var item: fgui.GButton = list2.addItemFromPool().asButton;
            item.getChild("cb").asButton.selected = false;
            item.getChild("t1").text = testNames[i];
            item.getChild("mc").asMovieClip.playing = i % 2 == 0;
            item.getChild("t3").text = "" + Math.floor(Math.random() * 10000)
        }
    }

    //---------------------------------------------
    private playProgressBar(): void {
        var obj: fgui.GComponent = this._demoObjects["ProgressBar"];
        this.schedule(this.__playProgress, 0.01);
    }

    private __playProgress(): void {
        var obj: fgui.GComponent = this._demoObjects["ProgressBar"];
        var cnt: number = obj.numChildren;
        for (var i: number = 0; i < cnt; i++) {
            var child: fgui.GObject = obj.getChildAt(i);
            if (child instanceof fgui.GProgressBar) {
                child.value += 1;
                if (child.value > child.max)
                    child.value = 0;
            }
        }
    }
}
