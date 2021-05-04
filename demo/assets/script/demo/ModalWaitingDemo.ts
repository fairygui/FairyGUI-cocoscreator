import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as fgui from "fairygui-cc";

import { TestWin } from "./TestWin"

@ccclass
export default class ModalWaitingDemo extends Component {
    private _view: fgui.GComponent = null!;
    private _testWin: TestWin = null!;

    onLoad() {
        fgui.UIConfig.globalModalWaiting = "ui://ModalWaiting/GlobalModalWaiting";
        fgui.UIConfig.windowModalWaiting = "ui://ModalWaiting/WindowModalWaiting";

        fgui.UIPackage.loadPackage("UI/ModalWaiting", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("ModalWaiting", "Main").asCom;
        this._view.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        fgui.GRoot.inst.addChild(this._view);

        this._testWin = new TestWin();
        this._view.getChild("n0").onClick(() => { this._testWin.show(); });

        //这里模拟一个要锁住全屏的等待过程
        fgui.GRoot.inst.showModalWait();
        this.scheduleOnce(() => {
            fgui.GRoot.inst.closeModalWait();
        }, 3);
    }
}