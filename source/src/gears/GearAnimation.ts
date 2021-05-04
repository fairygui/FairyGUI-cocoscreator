import { GearBase } from "./GearBase";
import { ByteBuffer } from "../utils/ByteBuffer";
import { ObjectPropID } from "../FieldTypes";

export class GearAnimation extends GearBase {
    private _storage: { [index: string]: GearAnimationValue };
    private _default: GearAnimationValue;

    protected init(): void {
        this._default = {
            playing: this._owner.getProp(ObjectPropID.Playing),
            frame: this._owner.getProp(ObjectPropID.Frame)
        };
        this._storage = {};
    }

    protected addStatus(pageId: string, buffer: ByteBuffer): void {
        var gv: GearAnimationValue;
        if (!pageId)
            gv = this._default;
        else {
            gv = {};
            this._storage[pageId] = gv;
        }
        gv.playing = buffer.readBool();
        gv.frame = buffer.readInt();
    }

    public apply(): void {
        this._owner._gearLocked = true;

        var gv: GearAnimationValue = this._storage[this._controller.selectedPageId] || this._default;
        this._owner.setProp(ObjectPropID.Playing, gv.playing);
        this._owner.setProp(ObjectPropID.Frame, gv.frame);

        this._owner._gearLocked = false;
    }

    public updateState(): void {
        var gv: GearAnimationValue = this._storage[this._controller.selectedPageId];
        if (!gv) {
            gv = {};
            this._storage[this._controller.selectedPageId] = gv;
        }

        gv.playing = this._owner.getProp(ObjectPropID.Playing);
        gv.frame = this._owner.getProp(ObjectPropID.Frame);
    }
}

interface GearAnimationValue {
    playing?: boolean;
    frame?: number;
}

