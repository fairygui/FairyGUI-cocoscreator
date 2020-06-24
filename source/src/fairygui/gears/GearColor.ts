
namespace fgui {
    interface Value {
        color?: cc.Color;
        strokeColor?: cc.Color;
    }

    export class GearColor extends GearBase {
        private _storage: { [index: string]: Value };
        private _default: Value;

        public constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this._default = {
                color: this._owner.getProp(ObjectPropID.Color),
                strokeColor: this._owner.getProp(ObjectPropID.OutlineColor)
            };
            this._storage = {};
        }

        protected addStatus(pageId: string, buffer: ByteBuffer): void {
            var gv: Value;
            if (pageId == null)
                gv = this._default;
            else
                this._storage[pageId] = gv = {};
            gv.color = buffer.readColor();
            gv.strokeColor = buffer.readColor();
        }

        public apply(): void {
            this._owner._gearLocked = true;

            var gv: Value = this._storage[this._controller.selectedPageId];
            if (!gv)
                gv = this._default;

            this._owner.setProp(ObjectPropID.Color, gv.color);
            this._owner.setProp(ObjectPropID.OutlineColor, gv.strokeColor);

            this._owner._gearLocked = false;
        }

        public updateState(): void {
            var gv: Value = this._storage[this._controller.selectedPageId];
            if (!gv)
                this._storage[this._controller.selectedPageId] = gv = {};

            gv.color = this._owner.getProp(ObjectPropID.Color);
            gv.strokeColor = this._owner.getProp(ObjectPropID.OutlineColor);
        }
    }
}