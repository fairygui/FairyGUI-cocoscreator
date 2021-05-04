import { Color } from "cc";
import { ObjectPropID } from "../FieldTypes";
import { ByteBuffer } from "../utils/ByteBuffer";
import { GearBase } from "./GearBase";

export class GearColor extends GearBase {
    private _storage: { [index: string]: GearColorValue };
    private _default: GearColorValue;

    protected init(): void {
        this._default = {
            color: this._owner.getProp(ObjectPropID.Color),
            strokeColor: this._owner.getProp(ObjectPropID.OutlineColor)
        };
        this._storage = {};
    }

    protected addStatus(pageId: string, buffer: ByteBuffer): void {
        var gv: GearColorValue;
        if (!pageId)
            gv = this._default;
        else {
            gv = {};
            this._storage[pageId] = gv;
        }

        gv.color = buffer.readColor();
        gv.strokeColor = buffer.readColor();
    }

    public apply(): void {
        this._owner._gearLocked = true;

        var gv: GearColorValue = this._storage[this._controller.selectedPageId] || this._default;
        this._owner.setProp(ObjectPropID.Color, gv.color);
        this._owner.setProp(ObjectPropID.OutlineColor, gv.strokeColor);

        this._owner._gearLocked = false;
    }

    public updateState(): void {
        var gv: GearColorValue = this._storage[this._controller.selectedPageId];
        if (!gv) {
            gv = {};
            this._storage[this._controller.selectedPageId] = gv;
        }

        gv.color = this._owner.getProp(ObjectPropID.Color);
        gv.strokeColor = this._owner.getProp(ObjectPropID.OutlineColor);
    }
}

interface GearColorValue {
    color?: Color;
    strokeColor?: Color;
}
