import { GearBase } from "./GearBase";
export class GearDisplay2 extends GearBase {
    constructor() {
        super(...arguments);
        this.pages = null;
        this.condition = 0;
        this._visible = 0;
    }
    init() {
        this.pages = null;
    }
    apply() {
        if (this.pages == null || this.pages.length == 0
            || this.pages.indexOf(this._controller.selectedPageId) != -1)
            this._visible = 1;
        else
            this._visible = 0;
    }
    evaluate(connected) {
        var v = this._controller == null || this._visible > 0;
        if (this.condition == 0)
            v = v && connected;
        else
            v = v || connected;
        return v;
    }
}
