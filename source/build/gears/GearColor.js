import { ObjectPropID } from "../FieldTypes";
import { GearBase } from "./GearBase";
export class GearColor extends GearBase {
    init() {
        this._default = {
            color: this._owner.getProp(ObjectPropID.Color),
            strokeColor: this._owner.getProp(ObjectPropID.OutlineColor)
        };
        this._storage = {};
    }
    addStatus(pageId, buffer) {
        var gv;
        if (!pageId)
            gv = this._default;
        else {
            gv = {};
            this._storage[pageId] = gv;
        }
        gv.color = buffer.readColor();
        gv.strokeColor = buffer.readColor();
    }
    apply() {
        this._owner._gearLocked = true;
        var gv = this._storage[this._controller.selectedPageId] || this._default;
        this._owner.setProp(ObjectPropID.Color, gv.color);
        this._owner.setProp(ObjectPropID.OutlineColor, gv.strokeColor);
        this._owner._gearLocked = false;
    }
    updateState() {
        var gv = this._storage[this._controller.selectedPageId];
        if (!gv) {
            gv = {};
            this._storage[this._controller.selectedPageId] = gv;
        }
        gv.color = this._owner.getProp(ObjectPropID.Color);
        gv.strokeColor = this._owner.getProp(ObjectPropID.OutlineColor);
    }
}
