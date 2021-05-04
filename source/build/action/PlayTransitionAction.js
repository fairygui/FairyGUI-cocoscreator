import { ControllerAction } from "./ControllerAction";
export class PlayTransitionAction extends ControllerAction {
    constructor() {
        super();
        this.playTimes = 1;
        this.delay = 0;
    }
    enter(controller) {
        var trans = controller.parent.getTransition(this.transitionName);
        if (trans) {
            if (this._currentTransition && this._currentTransition.playing)
                trans.changePlayTimes(this.playTimes);
            else
                trans.play(null, this.playTimes, this.delay);
            this._currentTransition = trans;
        }
    }
    leave(controller) {
        if (this.stopOnExit && this._currentTransition) {
            this._currentTransition.stop();
            this._currentTransition = null;
        }
    }
    setup(buffer) {
        super.setup(buffer);
        this.transitionName = buffer.readS();
        this.playTimes = buffer.readInt();
        this.delay = buffer.readFloat();
        this.stopOnExit = buffer.readBool();
    }
}
