import { constructingDepth } from "../GObject";
import { EaseType } from "../tween/EaseType";
export class GearBase {
    dispose() {
        if (this._tweenConfig && this._tweenConfig._tweener) {
            this._tweenConfig._tweener.kill();
            this._tweenConfig._tweener = null;
        }
    }
    get controller() {
        return this._controller;
    }
    set controller(val) {
        if (val != this._controller) {
            this._controller = val;
            if (this._controller)
                this.init();
        }
    }
    get tweenConfig() {
        if (!this._tweenConfig)
            this._tweenConfig = new GearTweenConfig();
        return this._tweenConfig;
    }
    get allowTween() {
        return this._tweenConfig && this._tweenConfig.tween && constructingDepth.n == 0 && !GearBase.disableAllTweenEffect;
    }
    setup(buffer) {
        this._controller = this._owner.parent.getControllerAt(buffer.readShort());
        this.init();
        var i;
        var page;
        var cnt = buffer.readShort();
        if ("pages" in this) {
            this.pages = buffer.readSArray(cnt);
        }
        else {
            for (i = 0; i < cnt; i++) {
                page = buffer.readS();
                if (page == null)
                    continue;
                this.addStatus(page, buffer);
            }
            if (buffer.readBool())
                this.addStatus(null, buffer);
        }
        if (buffer.readBool()) {
            this._tweenConfig = new GearTweenConfig();
            this._tweenConfig.easeType = buffer.readByte();
            this._tweenConfig.duration = buffer.readFloat();
            this._tweenConfig.delay = buffer.readFloat();
        }
        if (buffer.version >= 2) {
            if ("positionsInPercent" in this) {
                if (buffer.readBool()) {
                    this.positionsInPercent = true;
                    for (i = 0; i < cnt; i++) {
                        page = buffer.readS();
                        if (page == null)
                            continue;
                        this.addExtStatus(page, buffer);
                    }
                    if (buffer.readBool())
                        this.addExtStatus(null, buffer);
                }
            }
            else if ("condition" in this)
                this.condition = buffer.readByte();
        }
    }
    updateFromRelations(dx, dy) {
    }
    addStatus(pageId, buffer) {
    }
    init() {
    }
    apply() {
    }
    updateState() {
    }
}
export class GearTweenConfig {
    constructor() {
        this.tween = true;
        this.easeType = EaseType.QuadOut;
        this.duration = 0.3;
        this.delay = 0;
    }
}
