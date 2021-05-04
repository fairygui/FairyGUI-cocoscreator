import { RelationItem } from "./RelationItem";
export class Relations {
    constructor(owner) {
        this.sizeDirty = false;
        this._owner = owner;
        this._items = new Array();
    }
    add(target, relationType, usePercent) {
        var length = this._items.length;
        for (var i = 0; i < length; i++) {
            var item = this._items[i];
            if (item.target == target) {
                item.add(relationType, usePercent);
                return;
            }
        }
        var newItem = new RelationItem(this._owner);
        newItem.target = target;
        newItem.add(relationType, usePercent);
        this._items.push(newItem);
    }
    remove(target, relationType) {
        relationType = relationType || 0;
        var cnt = this._items.length;
        var i = 0;
        while (i < cnt) {
            var item = this._items[i];
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
    contains(target) {
        var length = this._items.length;
        for (var i = 0; i < length; i++) {
            var item = this._items[i];
            if (item.target == target)
                return true;
        }
        return false;
    }
    clearFor(target) {
        var cnt = this._items.length;
        var i = 0;
        while (i < cnt) {
            var item = this._items[i];
            if (item.target == target) {
                item.dispose();
                this._items.splice(i, 1);
                cnt--;
            }
            else
                i++;
        }
    }
    clearAll() {
        var length = this._items.length;
        for (var i = 0; i < length; i++) {
            var item = this._items[i];
            item.dispose();
        }
        this._items.length = 0;
    }
    copyFrom(source) {
        this.clearAll();
        var arr = source._items;
        var length = arr.length;
        for (var i = 0; i < length; i++) {
            var ri = arr[i];
            var item = new RelationItem(this._owner);
            item.copyFrom(ri);
            this._items.push(item);
        }
    }
    dispose() {
        this.clearAll();
    }
    onOwnerSizeChanged(dWidth, dHeight, applyPivot) {
        if (this._items.length == 0)
            return;
        var length = this._items.length;
        for (var i = 0; i < length; i++) {
            var item = this._items[i];
            item.applyOnSelfResized(dWidth, dHeight, applyPivot);
        }
    }
    ensureRelationsSizeCorrect() {
        if (this._items.length == 0)
            return;
        this.sizeDirty = false;
        var length = this._items.length;
        for (var i = 0; i < length; i++) {
            var item = this._items[i];
            item.target.ensureSizeCorrect();
        }
    }
    get empty() {
        return this._items.length == 0;
    }
    setup(buffer, parentToChild) {
        var cnt = buffer.readByte();
        var target;
        for (var i = 0; i < cnt; i++) {
            var targetIndex = buffer.readShort();
            if (targetIndex == -1)
                target = this._owner.parent;
            else if (parentToChild)
                target = this._owner.getChildAt(targetIndex);
            else
                target = this._owner.parent.getChildAt(targetIndex);
            var newItem = new RelationItem(this._owner);
            newItem.target = target;
            this._items.push(newItem);
            var cnt2 = buffer.readByte();
            for (var j = 0; j < cnt2; j++) {
                var rt = buffer.readByte();
                var usePercent = buffer.readBool();
                newItem.internalAdd(rt, usePercent);
            }
        }
    }
}
