import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as fgui from "fairygui-cc";

import BasicDemo from "./BasicsDemo";
import TransitionDemo from "./TransitionDemo";
import VirtualListDemo from "./VirtualListDemo";
import LoopListDemo from "./LoopListDemo";
import PullToRefreshDemo from "./PullToRefreshDemo";
import ModalWaitingDemo from "./ModalWaitingDemo";
import JoystickDemo from "./JoystickDemo";
import BagDemo from "./BagDemo";
import ListEffectDemo from "./ListEffectDemo";
import GuideDemo from "./GuideDemo";
import CooldownDemo from "./CooldownDemo";
import HitTestDemo from "./HitTestDemo";
import ChatDemo from "./ChatDemo";
import ScrollPaneDemo from "./ScrollPaneDemo";
import TreeViewDemo from "./TreeViewDemo";

@ccclass
export default class MainMenu extends Component {
    private _view: fgui.GComponent = null!;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/MainMenu", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("MainMenu", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._view.getChild("n1").onClick(() => {
            this.startDemo(BasicDemo);
        });
        this._view.getChild("n2").onClick(() => {
            this.startDemo(TransitionDemo);
        });
        this._view.getChild("n4").onClick(() => {
            this.startDemo(VirtualListDemo);
        });
        this._view.getChild("n5").onClick(() => {
            this.startDemo(LoopListDemo);
        });
        this._view.getChild("n6").onClick(() => {
            this.startDemo(HitTestDemo);
        });
        this._view.getChild("n7").onClick(() => {
            this.startDemo(PullToRefreshDemo);
        });
        this._view.getChild("n8").onClick(() => {
            this.startDemo(ModalWaitingDemo);
        });
        this._view.getChild("n9").onClick(() => {
            this.startDemo(JoystickDemo);
        });
        this._view.getChild("n10").onClick(() => {
            this.startDemo(BagDemo);
        });
        this._view.getChild("n11").onClick(() => {
            this.startDemo(ChatDemo);
        });
        this._view.getChild("n12").onClick(() => {
            this.startDemo(ListEffectDemo);
        });
        this._view.getChild("n13").onClick(() => {
            this.startDemo(ScrollPaneDemo);
        });
        this._view.getChild("n14").onClick(() => {
            this.startDemo(TreeViewDemo);
        });
        this._view.getChild("n15").onClick(() => {
            this.startDemo(GuideDemo);
        });
        this._view.getChild("n16").onClick(() => {
            this.startDemo(CooldownDemo);
        });
    }

    onDestroy() {
        this._view.dispose();
    }

    startDemo(demoClass: typeof Component): void {
        let demo: Component = this.addComponent(demoClass)!;
        this.node.emit("start_demo", demo);
        this.destroy();
    }

}