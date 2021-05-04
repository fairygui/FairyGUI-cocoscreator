import { Vec2 } from "cc";
import { Event as FUIEvent } from "./event/Event";
import { AlignType, VertAlignType } from "./FieldTypes";
import { GLoader } from "./GLoader";
import { GObject } from "./GObject";
import { GRoot } from "./GRoot";

export class DragDropManager {

    private _agent: GLoader;
    private _sourceData: any;

    private static _inst: DragDropManager;
    public static get inst(): DragDropManager {
        if (!DragDropManager._inst)
            DragDropManager._inst = new DragDropManager();
        return DragDropManager._inst;
    }

    public constructor() {
        this._agent = new GLoader();
        this._agent.draggable = true;
        this._agent.touchable = false;//important
        this._agent.setSize(100, 100);
        this._agent.setPivot(0.5, 0.5, true);
        this._agent.align = AlignType.Center;
        this._agent.verticalAlign = VertAlignType.Middle;
        this._agent.sortingOrder = 1000000;
        this._agent.on(FUIEvent.DRAG_END, this.onDragEnd, this);
    }

    public get dragAgent(): GObject {
        return this._agent;
    }

    public get dragging(): boolean {
        return this._agent.parent != null;
    }

    public startDrag(source: GObject, icon: string | null, sourceData?: any, touchId?: number): void {
        if (this._agent.parent)
            return;

        this._sourceData = sourceData;
        this._agent.url = icon;
        GRoot.inst.addChild(this._agent);
        let pt: Vec2 = GRoot.inst.getTouchPosition(touchId);
        pt = GRoot.inst.globalToLocal(pt.x, pt.y);
        this._agent.setPosition(pt.x, pt.y);
        this._agent.startDrag(touchId);
    }

    public cancel(): void {
        if (this._agent.parent) {
            this._agent.stopDrag();
            GRoot.inst.removeChild(this._agent);
            this._sourceData = null;
        }
    }

    private onDragEnd(): void {
        if (!this._agent.parent) //cancelled
            return;

        GRoot.inst.removeChild(this._agent);

        var sourceData: any = this._sourceData;
        this._sourceData = null;

        var obj: GObject = GRoot.inst.touchTarget;
        while (obj) {
            if (obj.node.hasEventListener(FUIEvent.DROP)) {
                obj.requestFocus();
                obj.node.emit(FUIEvent.DROP, obj, sourceData);
                return;
            }

            obj = obj.parent;
        }
    }
}