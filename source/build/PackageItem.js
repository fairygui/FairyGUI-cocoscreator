import { UIContentScaler } from "./UIContentScaler";
export class PackageItem {
    constructor() {
        this.width = 0;
        this.height = 0;
    }
    load() {
        return this.owner.getItemAsset(this);
    }
    getBranch() {
        if (this.branches && this.owner._branchIndex != -1) {
            var itemId = this.branches[this.owner._branchIndex];
            if (itemId)
                return this.owner.getItemById(itemId);
        }
        return this;
    }
    getHighResolution() {
        if (this.highResolution && UIContentScaler.scaleLevel > 0) {
            var itemId = this.highResolution[UIContentScaler.scaleLevel - 1];
            if (itemId)
                return this.owner.getItemById(itemId);
        }
        return this;
    }
    toString() {
        return this.name;
    }
}
