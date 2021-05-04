import { Controller } from "../Controller";
import { ByteBuffer } from "../utils/ByteBuffer";
export declare class ControllerAction {
    fromPage: Array<string>;
    toPage: Array<string>;
    constructor();
    run(controller: Controller, prevPage: string, curPage: string): void;
    protected enter(controller: Controller): void;
    protected leave(controller: Controller): void;
    setup(buffer: ByteBuffer): void;
}
