namespace fgui {
    interface Value {
        x?: number;
        y?: number;
        px?: number;
        py?: number;
    }

    export class GearXY extends GearBase {
        public positionsInPercent: boolean;

        private _storage: { [index: string]: Value };
        private _default: Value;

        constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this._default = {
                x: this._owner.x,
                y: this._owner.y,
                px: this._owner.x / this._owner.parent.width,
                py: this._owner.y / this._owner.parent.height
            };
            this._storage = {};
        }

        protected addStatus(pageId: string, buffer: ByteBuffer): void {
            var gv: Value;
            if (pageId == null)
                gv = this._default;
            else
                this._storage[pageId] = gv = {};
            gv.x = buffer.readInt();
            gv.y = buffer.readInt();
        }

        public addExtStatus(pageId: string, buffer: ByteBuffer): void {
            var gv: Value;
            if (pageId == null)
                gv = this._default;
            else
                gv = this._storage[pageId];
            gv.px = buffer.readFloat();
            gv.py = buffer.readFloat();
        }

        public apply(): void {
            var gv: Value = this._storage[this._controller.selectedPageId];
            if (!gv)
                gv = this._default;

            var ex: number;
            var ey: number;

            if (this.positionsInPercent && this._owner.parent) {
                ex = gv.px * this._owner.parent.width;
                ey = gv.py * this._owner.parent.height;
            }
            else {
                ex = gv.x;
                ey = gv.y;
            }

            if (this._tweenConfig && this._tweenConfig.tween && !UIPackage._constructing && !GearBase.disableAllTweenEffect) {
                if (this._tweenConfig._tweener) {
                    if (this._tweenConfig._tweener.endValue.x != ex || this._tweenConfig._tweener.endValue.y != ey) {
                        this._tweenConfig._tweener.kill(true);
                        this._tweenConfig._tweener = null;
                    }
                    else
                        return;
                }

                var ox: number = this._owner.x;
                var oy: number = this._owner.y;

                if (ox != ex || oy != ey) {
                    if (this._owner.checkGearController(0, this._controller))
                        this._tweenConfig._displayLockToken = this._owner.addDisplayLock();

                    this._tweenConfig._tweener = GTween.to2(ox, oy, ex, ey, this._tweenConfig.duration)
                        .setDelay(this._tweenConfig.delay)
                        .setEase(this._tweenConfig.easeType)
                        .setTarget(this)
                        .onUpdate(this.__tweenUpdate, this)
                        .onComplete(this.__tweenComplete, this);
                }
            }
            else {
                this._owner._gearLocked = true;
                this._owner.setPosition(ex, ey);
                this._owner._gearLocked = false;
            }
        }

        private __tweenUpdate(tweener: GTweener): void {
            this._owner._gearLocked = true;
            this._owner.setPosition(tweener.value.x, tweener.value.y);
            this._owner._gearLocked = false;
        }

        private __tweenComplete(): void {
            if (this._tweenConfig._displayLockToken != 0) {
                this._owner.releaseDisplayLock(this._tweenConfig._displayLockToken);
                this._tweenConfig._displayLockToken = 0;
            }
            this._tweenConfig._tweener = null;
        }

        public updateState(): void {
            var gv: Value = this._storage[this._controller.selectedPageId];
            if (!gv)
                this._storage[this._controller.selectedPageId] = gv = {};

            gv.x = this._owner.x;
            gv.y = this._owner.y;
            gv.px = this._owner.x / this._owner.parent.width;
            gv.py = this._owner.y / this._owner.parent.height;
        }

        public updateFromRelations(dx: number, dy: number): void {
            if (this._controller == null || this._storage == null || this.positionsInPercent)
                return;

            for (var key in this._storage) {
                var pt: Value = this._storage[key];
                pt.x += dx;
                pt.y += dy;
            }
            this._default.x += dx;
            this._default.y += dy;

            this.updateState();
        }
    }
}