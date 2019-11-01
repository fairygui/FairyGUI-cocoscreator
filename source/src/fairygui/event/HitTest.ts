namespace fgui {

    export interface IHitTest {
        hitTest(obj: GComponent, x: number, y: number): boolean;
    }

    export class PixelHitTest implements IHitTest {
        private _data: PixelHitTestData;

        public offsetX: number;
        public offsetY: number;
        public scaleX: number;
        public scaleY: number;

        constructor(data: PixelHitTestData, offsetX?: number, offsetY?: number) {
            this._data = data;
            this.offsetX = offsetX == undefined ? 0 : offsetX;
            this.offsetY = offsetY == undefined ? 0 : offsetY;

            this.scaleX = 1;
            this.scaleY = 1;
        }

        public hitTest(obj: GComponent, x: number, y: number): boolean {
            x = Math.floor((x / this.scaleX - this.offsetX) * this._data.scale);
            y = Math.floor((y / this.scaleY - this.offsetY) * this._data.scale);
            if (x < 0 || y < 0 || x >= this._data.pixelWidth)
                return false;

            var pos: number = y * this._data.pixelWidth + x;
            var pos2: number = Math.floor(pos / 8);
            var pos3: number = pos % 8;

            if (pos2 >= 0 && pos2 < this._data.pixels.length)
                return ((this._data.pixels[pos2] >> pos3) & 0x1) == 1;
            else
                return false;
        }
    }

    export class PixelHitTestData {
        public pixelWidth: number;
        public scale: number;
        public pixels: Uint8Array;

        constructor(ba: ByteBuffer) {
            ba.readInt();
            this.pixelWidth = ba.readInt();
            this.scale = 1 / ba.readByte();
            this.pixels = ba.readBuffer().data;
        }
    }

    export class ChildHitArea implements IHitTest {

        private _child: GObject;
        private _reversed: boolean;

        constructor(child: GObject, reversed?: boolean) {
            this._child = child;
            this._reversed = reversed;
        }

        public hitTest(obj: GComponent, x: number, y: number): boolean {
            //TODO
            return false;
        }
    }
}