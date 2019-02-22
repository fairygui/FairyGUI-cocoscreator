
namespace fgui {

    export class GGraph extends GObject {
        public _content: cc.Graphics;

        private _type: GraphType = 0;
        private _lineSize: number = 0;
        private _lineColor: cc.Color;
        private _fillColor: cc.Color;
        private _cornerRadius: Array<number>;

        public constructor() {
            super();

            this._node.name = "GGraph";
            this._lineSize = 1;
            this._lineColor = cc.Color.BLACK;
            this._fillColor = cc.Color.WHITE;
            this._cornerRadius = null;

            this._content = this._node.addComponent(cc.Graphics);
        }

        public drawRect(lineSize: number, lineColor: cc.Color, fillColor: cc.Color, corner?: Array<number>): void {
            this._type = GraphType.Rect;
            this._lineSize = lineSize;
            this._lineColor = lineColor;
            this._fillColor = fillColor;
            this._cornerRadius = corner;
            this.drawCommon();
        }

        public drawEllipse(lineSize: number, lineColor: cc.Color, fillColor: cc.Color): void {
            this._type = GraphType.Ellipse;
            this._lineSize = lineSize;
            this._lineColor = lineColor;
            this._fillColor = fillColor;
            this._cornerRadius = null;
            this.drawCommon();
        }

        public clearGraphics(): void {
            this._type = GraphType.PlaceHolder;
            this._content.clear();
        }

        public get type(): GraphType {
            return this._type;
        }

        public get color(): cc.Color {
            return this._fillColor;
        }

        public set color(value: cc.Color) {
            this._fillColor = value;
            if (this._type != 0)
                this.drawCommon();
        }

        public set alpha(value : number){
            if (this._alpha != value) {
                this._alpha = value;
                this._node.opacity = this._alpha * 255;
                this.updateGear(3);
                if (this._type != 0)
                    this.drawCommon();
            }
        }

        public get fillColor(){
            return new cc.Color(this._fillColor.getR(),
                                this._fillColor.getG(),
                                this._fillColor.getB(),
                                this._fillColor.getA() * this.alpha);
        }

        private drawCommon(): void {
            let ctx = this._content;
            ctx.clear();

            var w: number = this._width;
            var h: number = this._height;
            if (w == 0 || h == 0)
                return;

            ctx.lineWidth = this._lineSize;
            ctx.strokeColor = this._lineColor;
            ctx.fillColor = this.fillColor;

            if (this._type == 1) {
                if (this._cornerRadius) {
                    ctx.roundRect(0, -h, w, h, this._cornerRadius[0] * 2);
                }
                else
                    ctx.rect(0, -h, w, h);
            }
            else
                ctx.ellipse(w / 2, -h / 2, w / 2, h / 2);

            if (this._lineSize != 0)
                ctx.stroke();
            ctx.fill();
        }

        protected handleSizeChanged(): void {
            super.handleSizeChanged();

            if (this._type != 0)
                this.drawCommon();
        }

        public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
            super.setup_beforeAdd(buffer, beginPos);

            buffer.seek(beginPos, 5);

            this._type = buffer.readByte();
            if (this._type != 0) {
                this._lineSize = buffer.readInt();
                this._lineColor = buffer.readColor(true);
                this._fillColor = buffer.readColor(true);
                if (buffer.readBool()) {
                    this._cornerRadius = new Array<number>(4);
                    for (var i: number = 0; i < 4; i++)
                        this._cornerRadius[i] = buffer.readFloat();
                }

                this.drawCommon();
            }
        }
    }
}