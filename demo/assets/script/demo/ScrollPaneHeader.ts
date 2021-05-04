import * as fgui from "fairygui-cc";

export default class ScrollPaneHeader extends fgui.GComponent {

    private _c1: fgui.Controller = null!;

    public constructor() {
        super();
    }

    protected onConstruct(): void {
        this._c1 = this.getController("c1");
        this.on(fgui.Event.SIZE_CHANGED, this.onSizeChanged, this);
    }

    private onSizeChanged(): void {
        if (this._c1.selectedIndex == 2 || this._c1.selectedIndex == 3)
            return;

        if (this.height > this.sourceHeight)
            this._c1.selectedIndex = 1;
        else
            this._c1.selectedIndex = 0;
    }

    public get readyToRefresh(): boolean {
        return this._c1.selectedIndex == 1;
    }

    public setRefreshStatus(value: number): void {
        this._c1.selectedIndex = value;
    }
}
