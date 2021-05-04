import { GearBase } from "./GearBase";
import { ByteBuffer } from "../utils/ByteBuffer";
export declare class GearAnimation extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}
