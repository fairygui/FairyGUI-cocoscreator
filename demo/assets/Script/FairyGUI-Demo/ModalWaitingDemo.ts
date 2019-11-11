import {TestWin} from "./TestWin"

const {ccclass, property} = cc._decorator;

@ccclass
export default class ModalWaitingDemo extends cc.Component {
    private _view: fgui.GComponent;
    private _testWin: TestWin;

    onLoad() {
        fgui.UIConfig.globalModalWaiting = "ui://ModalWaiting/GlobalModalWaiting";
        fgui.UIConfig.windowModalWaiting = "ui://ModalWaiting/WindowModalWaiting";

        fgui.UIPackage.loadPackage("UI/ModalWaiting", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("ModalWaiting","Main").asCom;
        this._view.setSize(fgui.GRoot.inst.width,fgui.GRoot.inst.height);
        fgui.GRoot.inst.addChild(this._view);

        this._testWin = new TestWin();
        this._testWin.center();
        this._view.getChild("n0").onClick( function(): void { this._testWin.show(); }, this);
        
        //这里模拟一个要锁住全屏的等待过程
        fgui.GRoot.inst.showModalWait();
        this.scheduleOnce(function(): void {
            fgui.GRoot.inst.closeModalWait();
        }, 3);
    }
}