const { ccclass, property } = cc._decorator;

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
export default class MainMenu extends cc.Component {
    private _view: fgui.GComponent;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/MainMenu", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        fgui.UIPackage.addPackage("UI/MainMenu");

        this._view = fgui.UIPackage.createObject("MainMenu", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._view.getChild("n1").onClick(function () {
            this.startDemo(BasicDemo);
        }, this);
        this._view.getChild("n2").onClick(function () {
            this.startDemo(TransitionDemo);
        }, this);
        this._view.getChild("n4").onClick(function () {
            this.startDemo(VirtualListDemo);
        }, this);
        this._view.getChild("n5").onClick(function () {
            this.startDemo(LoopListDemo);
        }, this);
        this._view.getChild("n6").onClick(function () {
            this.startDemo(HitTestDemo);
        }, this);
        this._view.getChild("n7").onClick(function () {
            this.startDemo(PullToRefreshDemo);
        }, this);
        this._view.getChild("n8").onClick(function () {
            this.startDemo(ModalWaitingDemo);
        }, this);
        this._view.getChild("n9").onClick(function () {
            this.startDemo(JoystickDemo);
        }, this);
        this._view.getChild("n10").onClick(function () {
            this.startDemo(BagDemo);
        }, this);
        this._view.getChild("n11").onClick(function () {
            this.startDemo(ChatDemo);
        }, this);
        this._view.getChild("n12").onClick(function () {
            this.startDemo(ListEffectDemo);
        }, this);
        this._view.getChild("n13").onClick(function () {
            this.startDemo(ScrollPaneDemo);
        }, this);
        this._view.getChild("n14").onClick(function () {
            this.startDemo(TreeViewDemo);
        }, this);
        this._view.getChild("n15").onClick(function () {
            this.startDemo(GuideDemo);
        }, this);
        this._view.getChild("n16").onClick(function () {
            this.startDemo(CooldownDemo);
        }, this);
    }

    onDestroy() {
        this._view.dispose();
    }

    startDemo(demoClass: typeof cc.Component): void {
        let demo: cc.Component = this.addComponent(demoClass);
        this.node.emit("start_demo", demo);
        this.destroy();
    }

}