export class PixelHitTest {
    constructor(data, offsetX, offsetY) {
        this._data = data;
        this.offsetX = offsetX == undefined ? 0 : offsetX;
        this.offsetY = offsetY == undefined ? 0 : offsetY;
        this.scaleX = 1;
        this.scaleY = 1;
    }
    hitTest(pt) {
        let x = Math.floor((pt.x / this.scaleX - this.offsetX) * this._data.scale);
        let y = Math.floor((pt.y / this.scaleY - this.offsetY) * this._data.scale);
        if (x < 0 || y < 0 || x >= this._data.pixelWidth)
            return false;
        var pos = y * this._data.pixelWidth + x;
        var pos2 = Math.floor(pos / 8);
        var pos3 = pos % 8;
        if (pos2 >= 0 && pos2 < this._data.pixels.length)
            return ((this._data.pixels[pos2] >> pos3) & 0x1) == 1;
        else
            return false;
    }
}
export class PixelHitTestData {
    constructor(ba) {
        ba.readInt();
        this.pixelWidth = ba.readInt();
        this.scale = 1 / ba.readByte();
        this.pixels = ba.readBuffer().data;
    }
}
export class ChildHitArea {
    constructor(child) {
        this._child = child;
    }
    hitTest(pt, globalPt) {
        return this._child.hitTest(globalPt, false) != null;
    }
}
