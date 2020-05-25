import JoystickModule from "./JoystickModule"
import { _decorator, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class JoystickDemo extends Component {
    private _view: fgui.GComponent;
    private _joystick: JoystickModule;
    private _text: fgui.GTextField;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/Joystick", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("Joystick", "Main").asCom;
        this._view.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        fgui.GRoot.inst.addChild(this._view);

        this._text = this._view.getChild("n9").asTextField;

        this._joystick = new JoystickModule(this._view);
        this._joystick.on(JoystickModule.JoystickMoving, this.onJoystickMoving, this);
        this._joystick.on(JoystickModule.JoystickUp, this.onJoystickUp, this);
    }

    private onJoystickMoving(degree: number): void {
        this._text.text = "" + degree;
    }

    private onJoystickUp(): void {
        this._text.text = "";
    }
}