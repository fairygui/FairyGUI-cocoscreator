const { ccclass, property } = cc._decorator;

@ccclass
export default class HitTestDemo extends cc.Component {
    private _view: fgui.GComponent;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/HitTest", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("HitTest", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);
    }
}
