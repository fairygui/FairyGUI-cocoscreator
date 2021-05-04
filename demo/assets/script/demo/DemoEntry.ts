import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as fgui from "fairygui-cc";

import MainMenu from "./MainMenu";

@ccclass
export default class DemoEntry extends Component {

    private _closeButton: fgui.GObject = null!;
    private _currentDemo: Component = null!;

    onLoad() {
        fgui.GRoot.create();

        this.node.on("start_demo", this.onDemoStart, this);
        this.addComponent(MainMenu);
    }

    onDemoStart(demo: Component) {
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
        this._currentDemo.destroy();

        this.addComponent(MainMenu);
    }

    start() {

    }
}
