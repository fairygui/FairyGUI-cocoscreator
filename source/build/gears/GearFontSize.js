import { ObjectPropID } from "../FieldTypes";
import { GearBase } from "./GearBase";
export class GearFontSize extends GearBase {
    constructor() {
        super(...arguments);
        this._default = 0;
    }
    init() {
        this._default = this._owner.getProp(ObjectPropID.FontSize);
        this._storage = {};
    }
    addStatus(pageId, buffer) {
        if (!pageId)
            this._default = buffer.readInt();
        else
            this._storage[pageId] = buffer.readInt();
    }
    apply() {
        this._owner._gearLocked = true;
        var data = this._storage[this._controller.selectedPageId];
        if (data !== undefined)
            this._owner.setProp(ObjectPropID.FontSize, data);
        else
            this._owner.setProp(ObjectPropID.FontSize, this._default);
        this._owner._gearLocked = false;
    }
    updateState() {
        this._storage[this._controller.selectedPageId] = this._owner.getProp(ObjectPropID.FontSize);
    }
}
