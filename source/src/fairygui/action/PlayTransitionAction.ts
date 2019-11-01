namespace fgui {

    export class PlayTransitionAction extends ControllerAction {

        public transitionName: string;
        public playTimes: number;
        public delay: number;
        public stopOnExit: boolean;

        private _currentTransition: Transition;

        public constructor() {
            super();

            this.playTimes = 1;
            this.delay = 0;
            this.stopOnExit = false;
        }

        protected enter(controller: Controller): void {
            var trans: Transition = controller.parent.getTransition(this.transitionName);
            if (trans) {
                if (this._currentTransition && this._currentTransition.playing)
                    trans.changePlayTimes(this.playTimes);
                else
                    trans.play(null, this.playTimes, this.delay);
                this._currentTransition = trans;
            }
        }

        protected leave(controller: Controller): void {
            if (this.stopOnExit && this._currentTransition) {
                this._currentTransition.stop();
                this._currentTransition = null;
            }
        }

        public setup(buffer: ByteBuffer): void {
            super.setup(buffer);

            this.transitionName = buffer.readS();
            this.playTimes = buffer.readInt();
            this.delay = buffer.readFloat();
            this.stopOnExit = buffer.readBool();
        }
    }
}