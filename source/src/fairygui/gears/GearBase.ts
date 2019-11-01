namespace fgui {
    export class GearBase {
        public static disableAllTweenEffect: boolean = false;

        protected _owner: GObject;
        protected _controller: Controller;
        protected _tweenConfig: GearTweenConfig;

        private static Classes: Array<typeof GearBase>;

        public static create(owner: GObject, index: number): GearBase {
            if (!GearBase.Classes)
                GearBase.Classes = [
                    GearDisplay, GearXY, GearSize, GearLook, GearColor,
                    GearAnimation, GearText, GearIcon, GearDisplay2, GearFontSize
                ];
            return new (GearBase.Classes[index])(owner);
        }

        constructor(owner: GObject) {
            this._owner = owner;
        }

        public dispose(): void {
            if (this._tweenConfig != null && this._tweenConfig._tweener != null) {
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
            if (this._tweenConfig == null)
                this._tweenConfig = new GearTweenConfig();
            return this._tweenConfig;
        }

        public setup(buffer: ByteBuffer): void {
            this._controller = this._owner.parent.getControllerAt(buffer.readShort());
            this.init();

            var i: number;
            var page: string;
            var cnt: number = buffer.readShort();

            if (this instanceof GearDisplay) {
                (<GearDisplay>this).pages = buffer.readSArray(cnt);
            }
            else if (this instanceof GearDisplay2) {
                (<GearDisplay2>this).pages = buffer.readSArray(cnt);
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
                if (this instanceof GearXY) {
                    if (buffer.readBool()) {
                        (<GearXY>this).positionsInPercent = true;
                        for (i = 0; i < cnt; i++) {
                            page = buffer.readS();
                            if (page == null)
                                continue;

                            (<GearXY>this).addExtStatus(page, buffer);
                        }

                        if (buffer.readBool())
                            (<GearXY>this).addExtStatus(null, buffer);
                    }
                }
                else if (this instanceof GearDisplay2)
                    (<GearDisplay2>this).condition = buffer.readByte();
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
}