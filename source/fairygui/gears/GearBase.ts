
namespace fgui {

    export class GearBase {
        public static disableAllTweenEffect: boolean = false;

        protected _tweenConfig: GearTweenConfig;
        protected _owner: GObject;
        protected _controller: Controller;

        public constructor(owner: GObject) {
            this._owner = owner;
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
            if (this._tweenConfig == null)
                this._tweenConfig = new GearTweenConfig();
            return this._tweenConfig;
        }

        public setup(buffer: ByteBuffer): void {
            this._controller = this._owner.parent.getControllerAt(buffer.readShort());
            this.init();

            var cnt: number;
            var i: number;
            var page: string;

            if (this instanceof GearDisplay) {
                cnt = buffer.readShort();
                var pages: string[] = [];
                for (i = 0; i < cnt; i++)
                    pages[i] = buffer.readS();
                (<GearDisplay><any>this).pages = pages;
            }
            else {
                cnt = buffer.readShort();
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

        public constructor() {
            this.tween = true;
            this.easeType = EaseType.QuadOut;
            this.duration = 0.3;
            this.delay = 0;
        }
    }
}
