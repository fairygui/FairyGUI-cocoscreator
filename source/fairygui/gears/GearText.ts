
namespace fgui {

    export class GearText extends GearBase {
        private _storage: any;
        private _default: string;

        public constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this._default = this._owner.text;
            this._storage = {};
        }

        protected addStatus(pageId: string, buffer: ByteBuffer): void {
            if (pageId == null)
                this._default = buffer.readS();
            else
                this._storage[pageId] = buffer.readS();
        }

        public apply(): void {
            this._owner._gearLocked = true;

            var data: any = this._storage[this._controller.selectedPageId];
            if (data !== undefined)
                this._owner.text = data;
            else
                this._owner.text = this._default;

            this._owner._gearLocked = false;
        }

        public updateState(): void {
            this._storage[this._controller.selectedPageId] = this._owner.text;
        }
    }
}