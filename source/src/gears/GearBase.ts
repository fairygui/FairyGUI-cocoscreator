import { Controller } from "../Controller";
import { constructingDepth, GObject } from "../GObject";
import { EaseType } from "../tween/EaseType";
import { GTweener } from "../tween/GTweener";
import { ByteBuffer } from "../utils/ByteBuffer";

export class GearBase {
    public static disableAllTweenEffect?: boolean;

    public _owner: GObject;
    protected _controller: Controller;
    protected _tweenConfig: GearTweenConfig;

    public dispose(): void {
        if (this._tweenConfig && this._tweenConfig._tweener) {
            this._tweenConfig._tweener.kill();
            this._tweenConfig._tweener = null;
        }
    }

    public get controller(): Controller {
        return this._controller;
    }

    public set controller(val: Controller) {
        if (val != this._controller) {
            this._controller = val;
            if (this._controller)
                this.init();
        }
    }

    public get tweenConfig(): GearTweenConfig {
        if (!this._tweenConfig)
            this._tweenConfig = new GearTweenConfig();
        return this._tweenConfig;
    }

    protected get allowTween(): boolean {
        return this._tweenConfig && this._tweenConfig.tween && constructingDepth.n == 0 && !GearBase.disableAllTweenEffect;
    }

    public setup(buffer: ByteBuffer): void {
        this._controller = this._owner.parent.getControllerAt(buffer.readShort());
        this.init();

        var i: number;
        var page: string;
        var cnt: number = buffer.readShort();

        if ("pages" in this) {
            (<any>this).pages = buffer.readSArray(cnt);
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
                    (<any>this).positionsInPercent = true;
                    for (i = 0; i < cnt; i++) {
                        page = buffer.readS();
                        if (page == null)
                            continue;

                        (<any>this).addExtStatus(page, buffer);
                    }

                    if (buffer.readBool())
                        (<any>this).addExtStatus(null, buffer);
                }
            }
            else if ("condition" in this)
                (<any>this).condition = buffer.readByte();
        }
    }

    public updateFromRelations(dx: number, dy: number): void {

    }

    protected addStatus(pageId: string, buffer: ByteBuffer): void {

    }

    protected init(): void {

    }

    public apply(): void {
    }

    public updateState(): void {
    }
}

export class GearTweenConfig {
    public tween: boolean;
    public easeType: number;
    public duration: number;
    public delay: number;

    public _displayLockToken: number;
    public _tweener: GTweener;

    constructor() {
        this.tween = true;
        this.easeType = EaseType.QuadOut;
        this.duration = 0.3;
        this.delay = 0;
    }
}

export interface IGearXY {

}