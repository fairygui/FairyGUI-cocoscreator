
namespace fgui {

    export class GearColor extends GearBase {
        private _storage: any;
        private _default: GearColorValue;

        public constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this._default = new GearColorValue(this._owner.getProp(ObjectPropID.Color),
                this._owner.getProp(ObjectPropID.OutlineColor));
            this._storage = {};
        }

        protected addStatus(pageId: string, buffer: ByteBuffer): void {
            var gv: GearColorValue;
            if (pageId == null)
                gv = this._default;
            else {
                gv = new GearColorValue();
                this._storage[pageId] = gv;
            }

            gv.color = buffer.readColor();
            gv.strokeColor = buffer.readColor();
        }

        public apply(): void {
            this._owner._gearLocked = true;

            var gv: GearColorValue = this._storage[this._controller.selectedPageId];
            if (!gv)
                gv = this._default;

            this._owner.setProp(ObjectPropID.Color, gv.color);
            if (gv.strokeColor != null)
                this._owner.setProp(ObjectPropID.OutlineColor, gv.strokeColor);

            this._owner._gearLocked = false;
        }

        public updateState(): void {
            var gv: GearColorValue = this._storage[this._controller.selectedPageId];
            if (!gv)
                this._storage[this._controller.selectedPageId] = gv = new GearColorValue();

            gv.color = this._owner.getProp(ObjectPropID.Color);
            gv.strokeColor = this._owner.getProp(ObjectPropID.OutlineColor);
        }
    }

    class GearColorValue {
        public color: cc.Color;
        public strokeColor: cc.Color;

        public constructor(color: cc.Color = null, strokeColor: cc.Color = null) {
            this.color = color;
            this.strokeColor = strokeColor;
        }
    }
}