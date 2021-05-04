import { ControllerAction } from "./ControllerAction";
import { Controller } from "../Controller";
import { ByteBuffer } from "../utils/ByteBuffer";
export declare class PlayTransitionAction extends ControllerAction {
    transitionName: string;
    playTimes: number;
    delay: number;
    stopOnExit: boolean;
    private _currentTransition;
    constructor();
    protected enter(controller: Controller): void;
    protected leave(controller: Controller): void;
    setup(buffer: ByteBuffer): void;
}
