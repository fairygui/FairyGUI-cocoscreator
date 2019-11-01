const {ccclass, property} = cc._decorator;

@ccclass
export default class CooldownDemo extends cc.Component {
    private _view: fgui.GComponent;
	private _btn0: fgui.GProgressBar;
	private _btn1:fgui.GProgressBar;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/Cooldown", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("Cooldown", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._btn0 = this._view.getChild("b0").asProgress;
		this._btn1 = this._view.getChild("b1").asProgress;
        this._btn0.getChild("icon").icon = "Icons/k0";
		this._btn1.getChild("icon").icon = "Icons/k1";

        fgui.GTween.to(0, 100, 5).setTarget(this._btn0, "value").setRepeat(-1);
        fgui.GTween.to(10, 0, 10).setTarget(this._btn1, "value").setRepeat(-1);
    }
}
