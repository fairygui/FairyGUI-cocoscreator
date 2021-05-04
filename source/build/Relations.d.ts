import { GObject } from "./GObject";
import { ByteBuffer } from "./utils/ByteBuffer";
export declare class Relations {
    private _owner;
    private _items;
    handling: GObject | null;
    sizeDirty: boolean;
    constructor(owner: GObject);
    add(target: GObject, relationType: number, usePercent?: boolean): void;
    remove(target: GObject, relationType?: number): void;
    contains(target: GObject): boolean;
    clearFor(target: GObject): void;
    clearAll(): void;
    copyFrom(source: Relations): void;
    dispose(): void;
    onOwnerSizeChanged(dWidth: number, dHeight: number, applyPivot: boolean): void;
    ensureRelationsSizeCorrect(): void;
    get empty(): boolean;
    setup(buffer: ByteBuffer, parentToChild: boolean): void;
}
