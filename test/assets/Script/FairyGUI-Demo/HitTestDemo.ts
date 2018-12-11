const { ccclass, property } = cc._decorator;

@ccclass
export default class HitTestDemo extends cc.Component {
    private _view: fgui.GComponent;

    private _testNode: cc.Node;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/HitTest", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("HitTest", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        let _t = this;
        cc.loader.loadRes("TestButton", function (err, prefab) {
            _t.addTestNode(prefab);
        });
    }

    addTestNode(prefab) {
        this._testNode = cc.instantiate(prefab);
        this._testNode.parent = cc.director.getScene();
        this._testNode.setSiblingIndex(0);
        let pt: cc.Vec2 = this._view.getChild("n33").localToGlobal();
        this._testNode.setPosition(pt.x, fgui.GRoot.inst.height - pt.y - 100);
    }

    onDestroy() {
        this._testNode.destroy();
    }
}
