namespace fgui {
    export class GearDisplay2 extends GearBase {
        public pages: string[];
        public condition: number;

        private _visible: number = 0;

        constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this.pages = null;
        }

        public apply(): void {
            if (this.pages == null || this.pages.length == 0
                || this.pages.indexOf(this._controller.selectedPageId) != -1)
                this._visible = 1;
            else
                this._visible = 0;
        }

        public evaluate(connected: boolean): boolean {
            var v: boolean = this._controller == null || this._visible > 0;
            if (this.condition == 0)
                v = v && connected;
            else
                v = v || connected;
            return v;
        }
    }
}