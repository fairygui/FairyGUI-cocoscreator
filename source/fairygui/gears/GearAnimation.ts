///<reference path="GearBase.ts"/>

namespace fgui {
    export class GearAnimation extends GearBase {
        private _storage: Object;
        private _default: GearAnimationValue;

        constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this._default = new GearAnimationValue(this._owner.getProp(ObjectPropID.Playing),
                this._owner.getProp(ObjectPropID.Frame));
            this._storage = {};
        }

        protected addStatus(pageId: string, buffer: ByteBuffer): void {
            var gv: GearAnimationValue;
            if (pageId == null)
                gv = this._default;
            else {
                gv = new GearAnimationValue();
                this._storage[pageId] = gv;
            }
            gv.playing = buffer.readBool();
            gv.frame = buffer.readInt();
        }

        public apply(): void {
            this._owner._gearLocked = true;

            var gv: GearAnimationValue = this._storage[this._controller.selectedPageId];
            if (!gv)
                gv = this._default;

            this._owner.setProp(ObjectPropID.Playing, gv.playing);
            this._owner.setProp(ObjectPropID.Frame, gv.frame);

            this._owner._gearLocked = false;
        }

        public updateState(): void {
            var gv: GearAnimationValue = this._storage[this._controller.selectedPageId];
            if (!gv) {
                gv = new GearAnimationValue();
                this._storage[this._controller.selectedPageId] = gv;
            }

            gv.playing = this._owner.getProp(ObjectPropID.Playing);
            gv.frame = this._owner.getProp(ObjectPropID.Frame);
        }
    }

    class GearAnimationValue {
        public playing: boolean;
        public frame: number;

        constructor(playing: boolean = true, frame: number = 0) {
            this.playing = playing;
            this.frame = frame;
        }
    }

}