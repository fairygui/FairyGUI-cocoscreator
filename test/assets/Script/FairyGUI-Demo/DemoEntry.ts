const { ccclass, property } = cc._decorator;

import MainMenu from "./MainMenu";

@ccclass
export default class DemoEntry extends cc.Component {

    private _closeButton: fgui.GObject;
    private _currentDemo: cc.Component;

    onLoad() {
        fgui.addLoadHandler();
        fgui.GRoot.create();

        this.node.on("start_demo", this.onDemoStart, this);
        this.addComponent(MainMenu);
    }

    onDemoStart(demo) {
        this._currentDemo = demo;
        this._closeButton = fgui.UIPackage.createObject("MainMenu", "CloseButton");
        this._closeButton.setPosition(fgui.GRoot.inst.width - this._closeButton.width - 10, fgui.GRoot.inst.height - this._closeButton.height - 10);
        this._closeButton.addRelation(fgui.GRoot.inst, fgui.RelationType.Right_Right);
        this._closeButton.addRelation(fgui.GRoot.inst, fgui.RelationType.Bottom_Bottom);
        this._closeButton.sortingOrder = 100000;
        this._closeButton.onClick(this.onDemoClosed, this);
        fgui.GRoot.inst.addChild(this._closeButton);
    }

    onDemoClosed() {
        fgui.GRoot.inst.removeChildren(0, -1, true);
        this.node.removeComponent(this._currentDemo);

        this.addComponent(MainMenu);
    }

    start() {

    }
}
