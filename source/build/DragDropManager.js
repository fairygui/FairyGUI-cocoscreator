import { Event as FUIEvent } from "./event/Event";
import { AlignType, VertAlignType } from "./FieldTypes";
import { GLoader } from "./GLoader";
import { GRoot } from "./GRoot";
export class DragDropManager {
    constructor() {
        this._agent = new GLoader();
        this._agent.draggable = true;
        this._agent.touchable = false; //important
        this._agent.setSize(100, 100);
        this._agent.setPivot(0.5, 0.5, true);
        this._agent.align = AlignType.Center;
        this._agent.verticalAlign = VertAlignType.Middle;
        this._agent.sortingOrder = 1000000;
        this._agent.on(FUIEvent.DRAG_END, this.onDragEnd, this);
    }
    static get inst() {
        if (!DragDropManager._inst)
            DragDropManager._inst = new DragDropManager();
        return DragDropManager._inst;
    }
    get dragAgent() {
        return this._agent;
    }
    get dragging() {
        return this._agent.parent != null;
    }
    startDrag(source, icon, sourceData, touchId) {
        if (this._agent.parent)
            return;
        this._sourceData = sourceData;
        this._agent.url = icon;
        GRoot.inst.addChild(this._agent);
        let pt = GRoot.inst.getTouchPosition(touchId);
        pt = GRoot.inst.globalToLocal(pt.x, pt.y);
        this._agent.setPosition(pt.x, pt.y);
        this._agent.startDrag(touchId);
    }
    cancel() {
        if (this._agent.parent) {
            this._agent.stopDrag();
            GRoot.inst.removeChild(this._agent);
            this._sourceData = null;
        }
    }
    onDragEnd() {
        if (!this._agent.parent) //cancelled
            return;
        GRoot.inst.removeChild(this._agent);
        var sourceData = this._sourceData;
        this._sourceData = null;
        var obj = GRoot.inst.touchTarget;
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
