import { GComponent } from "./GComponent";
import { GObject } from "./GObject";
import { RelationItem } from "./RelationItem";
import { ByteBuffer } from "./utils/ByteBuffer";

export class Relations {
    private _owner: GObject;
    private _items: Array<RelationItem>;

    public handling: GObject | null;
    public sizeDirty: boolean = false;

    public constructor(owner: GObject) {
        this._owner = owner;
        this._items = new Array<RelationItem>();
    }

    public add(target: GObject, relationType: number, usePercent?: boolean): void {
        var length: number = this._items.length;
        for (var i: number = 0; i < length; i++) {
            var item: RelationItem = this._items[i];
            if (item.target == target) {
                item.add(relationType, usePercent);
                return;
            }
        }
        var newItem: RelationItem = new RelationItem(this._owner);
        newItem.target = target;
        newItem.add(relationType, usePercent);
        this._items.push(newItem);
    }

    public remove(target: GObject, relationType?: number): void {
        relationType = relationType || 0;
        var cnt: number = this._items.length;
        var i: number = 0;
        while (i < cnt) {
            var item: RelationItem = this._items[i];
            if (item.target == target) {
                item.remove(relationType);
                if (item.isEmpty) {
                    item.dispose();
                    this._items.splice(i, 1);
                    cnt--;
                }
                else
                    i++;
            }
            else
                i++;
        }
    }

    public contains(target: GObject): boolean {
        var length: number = this._items.length;
        for (var i: number = 0; i < length; i++) {
            var item: RelationItem = this._items[i];
            if (item.target == target)
                return true;
        }
        return false;
    }

    public clearFor(target: GObject): void {
        var cnt: number = this._items.length;
        var i: number = 0;
        while (i < cnt) {
            var item: RelationItem = this._items[i];
            if (item.target == target) {
                item.dispose();
                this._items.splice(i, 1);
                cnt--;
            }
            else
                i++;
        }
    }

    public clearAll(): void {
        var length: number = this._items.length;
        for (var i: number = 0; i < length; i++) {
            var item: RelationItem = this._items[i];
            item.dispose();
        }
        this._items.length = 0;
    }

    public copyFrom(source: Relations): void {
        this.clearAll();

        var arr: Array<RelationItem> = source._items;
        var length: number = arr.length;
        for (var i: number = 0; i < length; i++) {
            var ri: RelationItem = arr[i];
            var item: RelationItem = new RelationItem(this._owner);
            item.copyFrom(ri);
            this._items.push(item);
        }
    }

    public dispose(): void {
        this.clearAll();
    }

    public onOwnerSizeChanged(dWidth: number, dHeight: number, applyPivot: boolean): void {
        if (this._items.length == 0)
            return;

        var length: number = this._items.length;
        for (var i: number = 0; i < length; i++) {
            var item: RelationItem = this._items[i];
            item.applyOnSelfResized(dWidth, dHeight, applyPivot);
        }
    }

    public ensureRelationsSizeCorrect(): void {
        if (this._items.length == 0)
            return;

        this.sizeDirty = false;
        var length: number = this._items.length;
        for (var i: number = 0; i < length; i++) {
            var item: RelationItem = this._items[i];
            item.target.ensureSizeCorrect();
        }
    }

    public get empty(): boolean {
        return this._items.length == 0;
    }

    public setup(buffer: ByteBuffer, parentToChild: boolean): void {
        var cnt: number = buffer.readByte();
        var target: GObject;
        for (var i: number = 0; i < cnt; i++) {
            var targetIndex: number = buffer.readShort();
            if (targetIndex == -1)
                target = this._owner.parent;
            else if (parentToChild)
                target = (<GComponent>this._owner).getChildAt(targetIndex);
            else
                target = this._owner.parent.getChildAt(targetIndex);

            var newItem: RelationItem = new RelationItem(this._owner);
            newItem.target = target;
            this._items.push(newItem);

            var cnt2: number = buffer.readByte();
            for (var j: number = 0; j < cnt2; j++) {
                var rt: number = buffer.readByte();
                var usePercent: boolean = buffer.readBool();
                newItem.internalAdd(rt, usePercent);
            }
        }
    }
}