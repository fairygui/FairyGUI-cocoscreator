import { GearBase } from "./GearBase";
import { ObjectPropID } from "../FieldTypes";
export class GearAnimation extends GearBase {
    init() {
        this._default = {
            playing: this._owner.getProp(ObjectPropID.Playing),
            frame: this._owner.getProp(ObjectPropID.Frame)
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
        gv.playing = buffer.readBool();
        gv.frame = buffer.readInt();
    }
    apply() {
        this._owner._gearLocked = true;
        var gv = this._storage[this._controller.selectedPageId] || this._default;
        this._owner.setProp(ObjectPropID.Playing, gv.playing);
        this._owner.setProp(ObjectPropID.Frame, gv.frame);
        this._owner._gearLocked = false;
    }
    updateState() {
        var gv = this._storage[this._controller.selectedPageId];
        if (!gv) {
            gv = {};
            this._storage[this._controller.selectedPageId] = gv;
        }
        gv.playing = this._owner.getProp(ObjectPropID.Playing);
        gv.frame = this._owner.getProp(ObjectPropID.Frame);
    }
}
