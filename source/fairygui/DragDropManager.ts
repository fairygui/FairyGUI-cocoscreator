namespace fgui {
    export class DragDropManager {

        private _agent: GLoader;
        private _sourceData: any;

        private static _inst: DragDropManager;
        public static get inst(): DragDropManager {
            if (DragDropManager._inst == null)
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
            this._agent.on(Event.DRAG_END, this.onDragEnd, this);
        }

        public get dragAgent(): GObject {
            return this._agent;
        }

        public get dragging(): boolean {
            return this._agent.parent != null;
        }

        public startDrag(source: GObject, icon: string, sourceData?: any, touchId?: number): void {
            if (this._agent.parent != null)
                return;

            this._sourceData = sourceData;
            this._agent.url = icon;
            GRoot.inst.addChild(this._agent);
            let pt: cc.Vec2 = GRoot.inst.getTouchPosition(touchId);
            pt = GRoot.inst.globalToLocal(pt.x, pt.y);
            this._agent.setPosition(pt.x, pt.y);
            this._agent.startDrag(touchId);
        }

        public cancel(): void {
            if (this._agent.parent != null) {
                this._agent.stopDrag();
                GRoot.inst.removeChild(this._agent);
                this._sourceData = null;
            }
        }

        private onDragEnd(): void {
            if (this._agent.parent == null) //cancelled
                return;

            GRoot.inst.removeChild(this._agent);

            var sourceData: any = this._sourceData;
            this._sourceData = null;

            var obj: GObject = GRoot.inst.touchTarget;
            while (obj != null) {
                if (obj.node.hasEventListener(Event.DROP)) {
                    obj.requestFocus();
                    obj.node.emit(Event.DROP, obj, sourceData);
                    return;
                }

                obj = obj.parent;
            }
        }
    }
}
