import { GearBase } from "./GearBase";
export class GearDisplay extends GearBase {
    constructor() {
        super(...arguments);
        this.pages = null;
        this._visible = 0;
        this._displayLockToken = 1;
    }
    init() {
        this.pages = null;
    }
    addLock() {
        this._visible++;
        return this._displayLockToken;
    }
    releaseLock(token) {
        if (token == this._displayLockToken)
            this._visible--;
    }
    get connected() {
        return this._controller == null || this._visible > 0;
    }
    apply() {
        this._displayLockToken++;
        if (this._displayLockToken <= 0)
            this._displayLockToken = 1;
        if (this.pages == null || this.pages.length == 0
            || this.pages.indexOf(this._controller.selectedPageId) != -1)
            this._visible = 1;
        else
            this._visible = 0;
    }
}
