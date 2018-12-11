
export default class MailItem extends fgui.GButton {

    private _timeText: fgui.GTextField;
    private _readController: fgui.Controller;
    private _fetchController: fgui.Controller;
    private _trans: fgui.Transition;

    public constructor() {
        super();
    }

    protected onConstruct(): void {
        this._timeText = this.getChild("timeText").asTextField;
        this._readController = this.getController("IsRead");
        this._fetchController = this.getController("c1");
        this._trans = this.getTransition("t0");
    }

    public setTime(value: string): void {
        this._timeText.text = value;
    }

    public setRead(value: boolean): void {
        this._readController.selectedIndex = value ? 1 : 0;
    }

    public setFetched(value: boolean): void {
        this._fetchController.selectedIndex = value ? 1 : 0;
    }

    public playEffect(delay: number): void {
        this.visible = false;
        this._trans.play(null, 1, delay);
    }
}
