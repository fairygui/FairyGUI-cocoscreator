///<reference path="GearBase.ts"/>

namespace fgui {
    interface Value {
        playing?: boolean;
        frame?: number;
    }

    export class GearAnimation extends GearBase {
        private _storage: { [index: string]: Value };
        private _default: Value;

        constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this._default = {
                playing: this._owner.getProp(ObjectPropID.Playing),
                frame: this._owner.getProp(ObjectPropID.Frame)
            };
            this._storage = {};
        }

        protected addStatus(pageId: string, buffer: ByteBuffer): void {
            var gv: Value;
            if (pageId == null)
                gv = this._default;
            else
                this._storage[pageId] = gv = {};
            gv.playing = buffer.readBool();
            gv.frame = buffer.readInt();
        }

        public apply(): void {
            this._owner._gearLocked = true;

            var gv: Value = this._storage[this._controller.selectedPageId];
            if (!gv)
                gv = this._default;

            this._owner.setProp(ObjectPropID.Playing, gv.playing);
            this._owner.setProp(ObjectPropID.Frame, gv.frame);

            this._owner._gearLocked = false;
        }

        public updateState(): void {
            var gv: Value = this._storage[this._controller.selectedPageId];
            if (!gv)
                this._storage[this._controller.selectedPageId] = gv = {};

            gv.playing = this._owner.getProp(ObjectPropID.Playing);
            gv.frame = this._owner.getProp(ObjectPropID.Frame);
        }
    }
}