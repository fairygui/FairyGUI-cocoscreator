import { GearBase } from "./GearBase";
export class GearText extends GearBase {
    init() {
        this._default = this._owner.text;
        this._storage = {};
    }
    addStatus(pageId, buffer) {
        if (pageId == null)
            this._default = buffer.readS();
        else
            this._storage[pageId] = buffer.readS();
    }
    apply() {
        this._owner._gearLocked = true;
        var data = this._storage[this._controller.selectedPageId];
        if (data !== undefined)
            this._owner.text = data;
        else
            this._owner.text = this._default;
        this._owner._gearLocked = false;
    }
    updateState() {
        this._storage[this._controller.selectedPageId] = this._owner.text;
    }
}
