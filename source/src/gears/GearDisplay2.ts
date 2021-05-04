import { GearBase } from "./GearBase";

export class GearDisplay2 extends GearBase {
    public pages: string[] = null;
    public condition: number = 0;

    private _visible: number = 0;

    protected init(): void {
        this.pages = null;
    }

    public apply(): void {
        if (this.pages == null || this.pages.length == 0
            || this.pages.indexOf(this._controller.selectedPageId) != -1)
            this._visible = 1;
        else
            this._visible = 0;
    }

    public evaluate(connected: boolean): boolean {
        var v: boolean = this._controller == null || this._visible > 0;
        if (this.condition == 0)
            v = v && connected;
        else
            v = v || connected;
        return v;
    }
}
