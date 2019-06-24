namespace fgui {

    export class ControllerAction {

        public fromPage: string[];
        public toPage: string[];

        public static createAction(type: number): ControllerAction {
            switch (type) {
                case 0:
                    return new PlayTransitionAction();

                case 1:
                    return new ChangePageAction();
            }
            return null;
        }

        public constructor() {
        }

        public run(controller: Controller, prevPage: string, curPage: string): void {
            if ((this.fromPage == null || this.fromPage.length == 0 || this.fromPage.indexOf(prevPage) != -1)
                && (this.toPage == null || this.toPage.length == 0 || this.toPage.indexOf(curPage) != -1))
                this.enter(controller);
            else
                this.leave(controller);
        }

        protected enter(controller: Controller): void {

        }

        protected leave(controller: Controller): void {

        }

        public setup(buffer: ByteBuffer): void {
            var cnt: number;
            var i: number;

            cnt = buffer.readShort();
            this.fromPage = [];
            for (i = 0; i < cnt; i++)
                this.fromPage[i] = buffer.readS();

            cnt = buffer.readShort();
            this.toPage = [];
            for (i = 0; i < cnt; i++)
                this.toPage[i] = buffer.readS();
        }
    }
}