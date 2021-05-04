import { ByteBuffer } from "../utils/ByteBuffer";
import { GearBase } from "./GearBase";
export declare class GearSize extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    private __tweenUpdate;
    private __tweenComplete;
    updateState(): void;
    updateFromRelations(dx: number, dy: number): void;
}
