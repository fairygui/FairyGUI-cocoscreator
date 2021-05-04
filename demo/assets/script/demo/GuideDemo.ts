import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as fgui from "fairygui-cc";

@ccclass
export default class GuideDemo extends Component {
    private _view: fgui.GComponent = null!;
    private _guideLayer: fgui.GComponent = null!;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/Guide", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("Guide", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._guideLayer = fgui.UIPackage.createObject("Guide", "GuideLayer").asCom;
        this._guideLayer.makeFullScreen();
        this._guideLayer.addRelation(fgui.GRoot.inst, fgui.RelationType.Size);

        let bagBtn = this._view.getChild("bagBtn");
        bagBtn.onClick(() => {
            this._guideLayer.removeFromParent();
        }, this);

        this._view.getChild("n2").onClick(() => {
            fgui.GRoot.inst.addChild(this._guideLayer);
            let rect = bagBtn.localToGlobalRect(0, 0, bagBtn.width, bagBtn.height);
            rect = this._guideLayer.globalToLocalRect(rect.x, rect.y, rect.width, rect.height);

            let window = this._guideLayer.getChild("window");
            window.setSize(rect.width, rect.height);
            fgui.GTween.to2(window.x, window.y, rect.x, rect.y, 0.5).setTarget(window, window.setPosition);
        }, this);
    }
}
