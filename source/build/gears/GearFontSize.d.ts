import { ByteBuffer } from "../utils/ByteBuffer";
import { GearBase } from "./GearBase";
export declare class GearFontSize extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}
