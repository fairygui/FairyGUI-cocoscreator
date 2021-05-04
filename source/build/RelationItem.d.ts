import { GObject } from "./GObject";
export declare class RelationItem {
    private _owner;
    private _target;
    private _defs;
    private _targetX;
    private _targetY;
    private _targetWidth;
    private _targetHeight;
    constructor(owner: GObject);
    get owner(): GObject;
    set target(value: GObject);
    get target(): GObject;
    add(relationType: number, usePercent?: boolean): void;
    internalAdd(relationType: number, usePercent?: boolean): void;
    remove(relationType: number): void;
    copyFrom(source: RelationItem): void;
    dispose(): void;
    get isEmpty(): boolean;
    applyOnSelfResized(dWidth: number, dHeight: number, applyPivot: boolean): void;
    private applyOnXYChanged;
    private applyOnSizeChanged;
    private addRefTarget;
    private releaseRefTarget;
    private __targetXYChanged;
    private __targetSizeChanged;
    private __targetSizeWillChange;
}
export declare class RelationDef {
    percent: boolean;
    type: number;
    axis: number;
    constructor();
    copyFrom(source: RelationDef): void;
}
