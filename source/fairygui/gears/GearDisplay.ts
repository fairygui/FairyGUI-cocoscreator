
namespace fgui {

    export class GearDisplay extends GearBase {
        public pages: string[];
        private _visible: number;
        private _displayLockToken: number;

        public constructor(owner: GObject) {
            super(owner);

            this._displayLockToken = 1;
            this._visible = 0;
        }

        protected init(): void {
            this.pages = null;
        }

        public apply(): void {
            this._displayLockToken++;
            if (this._displayLockToken == 0)
                this._displayLockToken = 1;

            if (this.pages == null || this.pages.length == 0
                || this.pages.indexOf(this._controller.selectedPageId) != -1)
                this._visible = 1;
            else
                this._visible = 0;
        }


        public addLock(): number {
            this._visible++;
            return this._displayLockToken;
        }

        public releaseLock(token: number): void {
            if (token == this._displayLockToken)
                this._visible--;
        }

        public get connected(): boolean {
            return this._controller == null || this._visible > 0;
        }
    }
}