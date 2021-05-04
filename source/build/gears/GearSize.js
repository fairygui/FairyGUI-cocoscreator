import { GTween } from "../tween/GTween";
import { GearBase } from "./GearBase";
export class GearSize extends GearBase {
    init() {
        this._default = {
            width: this._owner.width,
            height: this._owner.height,
            scaleX: this._owner.scaleX,
            scaleY: this._owner.scaleY
        };
        this._storage = {};
    }
    addStatus(pageId, buffer) {
        var gv;
        if (!pageId)
            gv = this._default;
        else {
            gv = {};
            this._storage[pageId] = gv;
        }
        gv.width = buffer.readInt();
        gv.height = buffer.readInt();
        gv.scaleX = buffer.readFloat();
        gv.scaleY = buffer.readFloat();
    }
    apply() {
        var gv = this._storage[this._controller.selectedPageId] || this._default;
        if (this.allowTween) {
            if (this._tweenConfig._tweener) {
                if (this._tweenConfig._tweener.endValue.x != gv.width || this._tweenConfig._tweener.endValue.y != gv.height
                    || this._tweenConfig._tweener.endValue.z != gv.scaleX || this._tweenConfig._tweener.endValue.w != gv.scaleY) {
                    this._tweenConfig._tweener.kill(true);
                    this._tweenConfig._tweener = null;
                }
                else
                    return;
            }
            var a = gv.width != this._owner.width || gv.height != this._owner.height;
            var b = gv.scaleX != this._owner.scaleX || gv.scaleY != this._owner.scaleY;
            if (a || b) {
                if (this._owner.checkGearController(0, this._controller))
                    this._tweenConfig._displayLockToken = this._owner.addDisplayLock();
                this._tweenConfig._tweener = GTween.to4(this._owner.width, this._owner.height, this._owner.scaleX, this._owner.scaleY, gv.width, gv.height, gv.scaleX, gv.scaleY, this._tweenConfig.duration)
                    .setDelay(this._tweenConfig.delay)
                    .setEase(this._tweenConfig.easeType)
                    .setUserData((a ? 1 : 0) + (b ? 2 : 0))
                    .setTarget(this)
                    .onUpdate(this.__tweenUpdate, this)
                    .onComplete(this.__tweenComplete, this);
            }
        }
        else {
            this._owner._gearLocked = true;
            this._owner.setSize(gv.width, gv.height, this._owner.checkGearController(1, this._controller));
            this._owner.setScale(gv.scaleX, gv.scaleY);
            this._owner._gearLocked = false;
        }
    }
    __tweenUpdate(tweener) {
        var flag = tweener.userData;
        this._owner._gearLocked = true;
        if ((flag & 1) != 0)
            this._owner.setSize(tweener.value.x, tweener.value.y, this._owner.checkGearController(1, this._controller));
        if ((flag & 2) != 0)
            this._owner.setScale(tweener.value.z, tweener.value.w);
        this._owner._gearLocked = false;
    }
    __tweenComplete() {
        if (this._tweenConfig._displayLockToken != 0) {
            this._owner.releaseDisplayLock(this._tweenConfig._displayLockToken);
            this._tweenConfig._displayLockToken = 0;
        }
        this._tweenConfig._tweener = null;
    }
    updateState() {
        var gv = this._storage[this._controller.selectedPageId];
        if (!gv) {
            gv = {};
            this._storage[this._controller.selectedPageId] = gv;
        }
        gv.width = this._owner.width;
        gv.height = this._owner.height;
        gv.scaleX = this._owner.scaleX;
        gv.scaleY = this._owner.scaleY;
    }
    updateFromRelations(dx, dy) {
        if (this._controller == null || this._storage == null)
            return;
        for (var key in this._storage) {
            var gv = this._storage[key];
            gv.width += dx;
            gv.height += dy;
        }
        this._default.width += dx;
        this._default.height += dy;
        this.updateState();
    }
}
