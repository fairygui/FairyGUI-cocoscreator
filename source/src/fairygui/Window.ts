
namespace fgui {

    export class Window extends GComponent {
        private _contentPane: GComponent;
        private _modalWaitPane: GObject;
        private _closeButton: GObject;
        private _dragArea: GObject;
        private _contentArea: GObject;
        private _frame: GComponent;
        private _modal: boolean;

        protected _uiSources: Array<IUISource>;
        protected _inited: boolean;
        protected _loading: boolean;
        protected _requestingCmd: number = 0;

        protected _loadTotal: number;
        protected _loaded: number;

        public bringToFontOnClick: boolean;

        public constructor() {
            super();
            this._uiSources = new Array<IUISource>();
            this.bringToFontOnClick = UIConfig.bringWindowToFrontOnClick;

            this._node.on(Event.TOUCH_BEGIN, this.onTouchBegin_1, this, true);
        }

        public addUISource(source: IUISource): void {
            this._uiSources.push(source);
        }

        public set contentPane(val: GComponent) {
            if (this._contentPane != val) {
                if (this._contentPane != null)
                    this.removeChild(this._contentPane);
                this._contentPane = val;
                if (this._contentPane != null) {
                    this.addChild(this._contentPane);
                    this.setSize(this._contentPane.width, this._contentPane.height);
                    this._contentPane.addRelation(this, RelationType.Size);
                    this._frame = <GComponent><any>(this._contentPane.getChild("frame"));
                    if (this._frame != null) {
                        this.closeButton = this._frame.getChild("closeButton");
                        this.dragArea = this._frame.getChild("dragArea");
                        this.contentArea = this._frame.getChild("contentArea");
                    }
                }
            }
        }

        public get contentPane(): GComponent {
            return this._contentPane;
        }

        public get frame(): GComponent {
            return this._frame;
        }

        public get closeButton(): GObject {
            return this._closeButton;
        }

        public set closeButton(value: GObject) {
            if (this._closeButton != null)
                this._closeButton.offClick(this.closeEventHandler, this);
            this._closeButton = value;
            if (this._closeButton != null)
                this._closeButton.onClick(this.closeEventHandler, this);
        }

        public get dragArea(): GObject {
            return this._dragArea;
        }

        public set dragArea(value: GObject) {
            if (this._dragArea != value) {
                if (this._dragArea != null) {
                    this._dragArea.draggable = false;
                    this._dragArea.off(Event.DRAG_START, this.onDragStart_1, this);
                }

                this._dragArea = value;
                if (this._dragArea != null) {
                    this._dragArea.draggable = true;
                    this._dragArea.on(Event.DRAG_START, this.onDragStart_1, this);
                }
            }
        }

        public get contentArea(): GObject {
            return this._contentArea;
        }

        public set contentArea(value: GObject) {
            this._contentArea = value;
        }

        public show(): void {
            GRoot.inst.showWindow(this);
        }

        public showOn(root: GRoot): void {
            root.showWindow(this);
        }

        public hide(): void {
            if (this.isShowing)
                this.doHideAnimation();
        }

        public hideImmediately(): void {
            var r: GRoot = (this.parent instanceof GRoot) ? <GRoot><any>(this.parent) : null;
            if (!r)
                r = GRoot.inst;
            r.hideWindowImmediately(this);
        }

        public centerOn(r: GRoot, restraint?: boolean) {
            this.setPosition(Math.round((r.width - this.width) / 2), Math.round((r.height - this.height) / 2));
            if (restraint) {
                this.addRelation(r, RelationType.Center_Center);
                this.addRelation(r, RelationType.Middle_Middle);
            }
        }

        public toggleStatus(): void {
            if (this.isTop)
                this.hide();
            else
                this.show();
        }

        public get isShowing(): boolean {
            return this.parent != null;
        }

        public get isTop(): boolean {
            return this.parent != null && this.parent.getChildIndex(this) == this.parent.numChildren - 1;
        }

        public get modal(): boolean {
            return this._modal;
        }

        public set modal(val: boolean) {
            this._modal = val;
        }

        public bringToFront(): void {
            this.root.bringToFront(this);
        }

        public showModalWait(requestingCmd?: number): void {
            if (requestingCmd != undefined)
                this._requestingCmd = requestingCmd;

            if (UIConfig.windowModalWaiting) {
                if (!this._modalWaitPane)
                    this._modalWaitPane = UIPackage.createObjectFromURL(UIConfig.windowModalWaiting);

                this.layoutModalWaitPane();

                this.addChild(this._modalWaitPane);
            }
        }

        protected layoutModalWaitPane(): void {
            if (this._contentArea != null) {
                var pt: cc.Vec2 = this._frame.localToGlobal();
                pt = this.globalToLocal(pt.x, pt.y, pt);
                this._modalWaitPane.setPosition(pt.x + this._contentArea.x, pt.y + this._contentArea.y);
                this._modalWaitPane.setSize(this._contentArea.width, this._contentArea.height);
            }
            else
                this._modalWaitPane.setSize(this.width, this.height);
        }

        public closeModalWait(requestingCmd: number = 0): boolean {
            if (requestingCmd != 0) {
                if (this._requestingCmd != requestingCmd)
                    return false;
            }
            this._requestingCmd = 0;

            if (this.modalWaiting){
                this.removeChild(this._modalWaitPane);
                this._modalWaitPane = null;
            }

            return true;
        }

        public get modalWaiting(): boolean {
            return this._modalWaitPane && this._modalWaitPane.parent != null;
        }


        public init(): void {
            if (this._inited || this._loading)
                return;

            if (this._uiSources.length > 0) {
                this._loading = false;
                var cnt: number = this._uiSources.length;
                this._loadTotal = cnt;
                this._loaded = 0;
                for (var i: number = 0; i < cnt; i++) {
                    var lib: IUISource = this._uiSources[i];
                    if (lib.loaded) {
                        this._loadTotal--;
                    }
                    if (!lib.loaded) {
                        lib.load(this.__uiLoadComplete, this);
                    }
                }
                
                this._loading = this._loadTotal > this._loaded;

                if (!this._loading && !this._inited){
                    this.__uiLoadComplete()
                }
            }
            else
                this._init();
        }

        protected onInit(): void {
        }

        protected onShown(): void {
        }

        protected onHide(): void {
        }

        protected doShowAnimation(): void {
            this.onShown();
        }

        protected doHideAnimation(): void {
            this.hideImmediately();
        }

        private __uiLoadComplete(): void {
            this._loaded++;
            if (this._loaded < this._loadTotal) {
                if (!this.modalWaiting) {
                    this.showModalWait(this._requestingCmd);
                }
                return;
            }
            if (this.modalWaiting) {
                this.closeModalWait(this._requestingCmd);
            }
            this._loaded = this._loadTotal = 0;
            this._loading = false;
            this._init();
        }

        private _init(): void {
            this.onInit();
            this._inited = true;
            
            if (this.isShowing)
                this.doShowAnimation();
        }

        public dispose(): void {
            if (this.parent != null)
                this.hideImmediately();

            super.dispose();
        }

        protected closeEventHandler(evt: cc.Event): void {
            this.hide();
        }

        protected onEnable(): void {
            super.onEnable();

            if (!this._inited)
                this.init();
            else
                this.doShowAnimation();
        }

        protected onDisable(): void {
            super.onDisable();

            this.closeModalWait();
            this.onHide();
        }

        private onTouchBegin_1(evt: cc.Event): void {
            if (this.isShowing && this.bringToFontOnClick)
                this.bringToFront();
        }

        private onDragStart_1(evt: Event): void {
            var original: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
            original.stopDrag();

            this.startDrag(evt.touchId);
        }
    }
}