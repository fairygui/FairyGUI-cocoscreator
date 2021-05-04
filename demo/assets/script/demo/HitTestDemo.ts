import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as fgui from "fairygui-cc";

@ccclass
export default class HitTestDemo extends Component {
    private _view: fgui.GComponent = null!;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/HitTest", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("HitTest", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);
    }
}
