import { Controller } from "../Controller";
import { ByteBuffer } from "../utils/ByteBuffer";
import { ControllerAction } from "./ControllerAction";
export declare class ChangePageAction extends ControllerAction {
    objectId: string;
    controllerName: string;
    targetPage: string;
    constructor();
    protected enter(controller: Controller): void;
    setup(buffer: ByteBuffer): void;
}
