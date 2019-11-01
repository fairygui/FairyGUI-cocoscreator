export class TestWin extends fgui.Window {

    public constructor() {
        super();
    }

    protected onInit(): void {
        this.contentPane = fgui.UIPackage.createObject("ModalWaiting", "TestWin").asCom;
        this.contentPane.getChild("n1").onClick(this.onClickStart, this);
    }

    private onClickStart(): void {
        //这里模拟一个要锁住当前窗口的过程，在锁定过程中，窗口仍然是可以移动和关闭的
        this.showModalWait();
        fgui.GTween.delayedCall(3).onComplete(function (): void { this.closeModalWait(); }, this);
    }
}


export class WindowA extends fgui.Window {
    public constructor() {
        super();
    }

    protected onInit(): void {
        this.contentPane = fgui.UIPackage.createObject("Basics", "WindowA").asCom;
        this.center();
    }

    protected onShown(): void {
        var list: fgui.GList = this.contentPane.getChild("n6").asList;
        list.removeChildrenToPool();

        for (var i: number = 0; i < 6; i++) {
            var item: fgui.GButton = list.addItemFromPool().asButton;
            item.title = "" + i;
            item.icon = fgui.UIPackage.getItemURL("Basics", "r4");
        }
    }
}

export class WindowB extends fgui.Window {
    public constructor() {
        super();
    }

    protected onInit(): void {
        this.contentPane = fgui.UIPackage.createObject("Basics", "WindowB").asCom;
        this.center();

        //弹出窗口的动效已中心为轴心
        this.setPivot(0.5, 0.5);
    }

    protected doShowAnimation(): void {
        this.setScale(0.1, 0.1);
        fgui.GTween.to2(0.1, 0.1, 1, 1, 0.3)
            .setTarget(this, this.setScale)
            .setEase(fgui.EaseType.QuadOut)
            .onComplete(this.onShown, this);
    }

    protected doHideAnimation(): void {
        fgui.GTween.to2(1, 1, 0.1, 0.1, 0.3)
            .setTarget(this, this.setScale)
            .setEase(fgui.EaseType.QuadOut)
            .onComplete(this.hideImmediately, this);
    }

    protected onShown(): void {
        this.contentPane.getTransition("t1").play();
    }

    protected onHide(): void {
        this.contentPane.getTransition("t1").stop();
    }
}
