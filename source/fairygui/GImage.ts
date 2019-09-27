
namespace fgui {

    export class GImage extends GObject {
        public _content: Image;

        public constructor() {
            super();

            this._node.name = "GImage";
            this._touchDisabled = true;
            this._content = this._node.addComponent(Image);
        }

        public get color(): cc.Color {
            return this._node.color;
        }

        public set color(value: cc.Color) {
            if (this._node.color != value) {
                this._node.color = value;

                this.updateGear(4);
            }
        }

        public get flip(): FlipType {
            return this._content.flip;
        }

        public set flip(value: FlipType) {
            this._content.flip = value;
        }

        public get fillMethod(): FillMethod {
            return this._content.fillMethod;
        }

        public set fillMethod(value: FillMethod) {
            this._content.fillMethod = value;
        }

        public get fillOrigin(): FillOrigin {
            return this._content.fillOrigin;
        }

        public set fillOrigin(value: FillOrigin) {
            this._content.fillOrigin = value;
        }

        public get fillClockwise(): boolean {
            return this._content.fillClockwise;
        }

        public set fillClockwise(value: boolean) {
            this._content.fillClockwise = value;
        }

        public get fillAmount(): number {
            return this._content.fillAmount;
        }

        public set fillAmount(value: number) {
            this._content.fillAmount = value;
        }

        public constructFromResource(): void {
            this.sourceWidth = this.packageItem.width;
            this.sourceHeight = this.packageItem.height;
            this.initWidth = this.sourceWidth;
            this.initHeight = this.sourceHeight;
            this.setSize(this.sourceWidth, this.sourceHeight);

            this.packageItem.load();

            if (this.packageItem.scale9Grid)
                this._content.type = cc.Sprite.Type.SLICED;
            else if (this.packageItem.scaleByTile)
                this._content.type = cc.Sprite.Type.TILED;
            this._content.spriteFrame = <cc.SpriteFrame>this.packageItem.asset;
        }

        protected handleGrayedChanged(): void {
            this._content.grayed = this._grayed;
        }

        public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
            super.setup_beforeAdd(buffer, beginPos);

            buffer.seek(beginPos, 5);

            if (buffer.readBool())
                this.color = buffer.readColor();
            this._content.flip = buffer.readByte();
            this._content.fillMethod = buffer.readByte();
            if (this._content.fillMethod != 0) {

                this._content.fillOrigin = buffer.readByte();
                this._content.fillClockwise = buffer.readBool();
                this._content.fillAmount = buffer.readFloat();
            }
        }
    }
}
