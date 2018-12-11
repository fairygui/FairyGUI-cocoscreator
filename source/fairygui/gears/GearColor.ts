
namespace fgui {

    export class GearColor extends GearBase {
        private _storage: any;
        private _default: GearColorValue;

        public constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            if (this._owner["strokeColor"] != undefined)
                this._default = new GearColorValue((<any>this._owner).color, (<any>this._owner).strokeColor);
            else
                this._default = new GearColorValue((<any>this._owner).color);
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

            (<any>this._owner).color = gv.color;
            if (this._owner["strokeColor"] != undefined && gv.strokeColor.getA() != 0)
                (<any>this._owner).strokeColor = gv.strokeColor;

            this._owner._gearLocked = false;
        }

        public updateState(): void {
            var gv: GearColorValue = this._storage[this._controller.selectedPageId];
            if (!gv) {
                gv = new GearColorValue(null, null);
                this._storage[this._controller.selectedPageId] = gv;
            }

            gv.color = (<any>this._owner).color;
            if (this._owner["strokeColor"] != undefined)
                gv.strokeColor = (<any>this._owner).strokeColor;
        }
    }

    class GearColorValue {
        public color: cc.Color;
        public strokeColor: cc.Color;

        public constructor(color: cc.Color = cc.Color.TRANSPARENT, strokeColor: cc.Color = cc.Color.TRANSPARENT) {
            this.color = color;
            this.strokeColor = strokeColor;
        }
    }
}