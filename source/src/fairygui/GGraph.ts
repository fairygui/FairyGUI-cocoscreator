
namespace fgui {

    export class GGraph extends GObject {
        public _content: cc.Graphics;

        private _type: GraphType = 0;
        private _lineSize: number = 0;
        private _lineColor: cc.Color;
        private _fillColor: cc.Color;
        private _cornerRadius: Array<number>;
        private _sides: number;
        private _startAngle: number;
        private _polygonPoints: any[];
        private _distances: number[];
        private _hasContent: boolean;

        public constructor() {
            super();

            this._node.name = "GGraph";
            this._lineSize = 1;
            this._lineColor = cc.Color.BLACK;
            this._fillColor = cc.Color.WHITE;
            this._cornerRadius = null;
            this._sides = 3;
            this._startAngle = 0;

            this._content = this._node.addComponent(cc.Graphics);
        }

        public drawRect(lineSize: number, lineColor: cc.Color, fillColor: cc.Color, corner?: Array<number>): void {
            this._type = GraphType.Rect;
            this._lineSize = lineSize;
            this._lineColor = lineColor;
            this._fillColor = fillColor;
            this._cornerRadius = corner;
            this.updateGraph();
        }

        public drawEllipse(lineSize: number, lineColor: cc.Color, fillColor: cc.Color): void {
            this._type = GraphType.Ellipse;
            this._lineSize = lineSize;
            this._lineColor = lineColor;
            this._fillColor = fillColor;
            this._cornerRadius = null;
            this.updateGraph();
        }

        public drawRegularPolygon(lineSize: number, lineColor: cc.Color, fillColor: cc.Color, sides: number, startAngle: number = 0, distances: number[] = null): void {
            this._type = 4;
            this._lineSize = lineSize;
            this._lineColor = lineColor;
            this._fillColor = fillColor;
            this._sides = sides;
            this._startAngle = startAngle;
            this._distances = distances;
            this.updateGraph();
        }

        public drawPolygon(lineSize: number, lineColor: cc.Color, fillColor: cc.Color, points: any[]): void {
            this._type = 3;
            this._lineSize = lineSize;
            this._lineColor = lineColor;
            this._fillColor = fillColor;
            this._polygonPoints = points;
            this.updateGraph();
        }

        public get distances(): number[] {
            return this._distances;
        }

        public set distances(value: number[]) {
            this._distances = value;
            if (this._type == 3)
                this.updateGraph();
        }

        public clearGraphics(): void {
            this._type = GraphType.PlaceHolder;
            if (this._hasContent) {
                this._content.clear();
                this._hasContent = false;
            }
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
                this.updateGraph();
        }

        private updateGraph(): void {
            let ctx = this._content;
            if (this._hasContent) {
                this._hasContent = false;
                ctx.clear();
            }

            var w: number = this._width;
            var h: number = this._height;
            if (w == 0 || h == 0)
                return;

            var px: number = -this.pivotX * this._width;
            var py: number = this.pivotY * this._height;

            ctx.lineWidth = this._lineSize;
            ctx.strokeColor = this._lineColor;
            ctx.fillColor = this._fillColor;

            if (this._type == 1) {
                if (this._cornerRadius) {
                    ctx.roundRect(0 + px, -h + py, w, h, this._cornerRadius[0] * 2);
                }
                else
                    ctx.rect(0 + px, -h + py, w, h);
            }
            else if (this._type == 2) {
                ctx.ellipse(w / 2 + px, -h / 2 + py, w / 2, h / 2);
            }
            else if (this._type == 3) {
                this.drawPath(ctx, this._polygonPoints, px, py);
            }
            else if (this._type == 4) {
                if (!this._polygonPoints)
                    this._polygonPoints = [];
                var radius: number = Math.min(this._width, this._height) / 2;
                this._polygonPoints.length = 0;
                var angle: number = cc.misc.degreesToRadians(this._startAngle);
                var deltaAngle: number = 2 * Math.PI / this._sides;
                var dist: number;
                for (var i: number = 0; i < this._sides; i++) {
                    if (this._distances) {
                        dist = this._distances[i];
                        if (isNaN(dist))
                            dist = 1;
                    }
                    else
                        dist = 1;

                    var xv: number = radius + radius * dist * Math.cos(angle);
                    var yv: number = radius + radius * dist * Math.sin(angle);
                    this._polygonPoints.push(xv, yv);

                    angle += deltaAngle;
                }

                this.drawPath(ctx, this._polygonPoints, px, py);
            }

            if (this._lineSize != 0)
                ctx.stroke();
            ctx.fill();

            this._hasContent = true;
        }

        private drawPath(ctx: cc.Graphics, points: number[], px: number, py: number): void {

            var cnt: number = points.length;
            ctx.moveTo(points[0] + px, -points[1] + py);
            for (var i: number = 2; i < cnt; i += 2)
                ctx.lineTo(points[i] + px, -points[i + 1] + py);
            ctx.lineTo(points[0] + px, -points[1] + py);
        }

        protected handleSizeChanged(): void {
            super.handleSizeChanged();

            if (this._type != 0)
                this.updateGraph();
        }

        protected handleAnchorChanged(): void {
            super.handleSizeChanged();

            if (this._type != 0)
                this.updateGraph();
        }

        public getProp(index: number): any {
            if (index == ObjectPropID.Color)
                return this.color;
            else
                return super.getProp(index);
        }

        public setProp(index: number, value: any): void {
            if (index == ObjectPropID.Color)
                this.color = value;
            else
                super.setProp(index, value);
        }
        
        public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
            super.setup_beforeAdd(buffer, beginPos);

            buffer.seek(beginPos, 5);

            this._type = buffer.readByte();
            if (this._type != 0) {
                var i: number;
                var cnt: number;

                this._lineSize = buffer.readInt();
                this._lineColor = buffer.readColor(true);
                this._fillColor = buffer.readColor(true);
                if (buffer.readBool()) {
                    this._cornerRadius = new Array<number>(4);
                    for (i = 0; i < 4; i++)
                        this._cornerRadius[i] = buffer.readFloat();
                }

                if (this._type == 3) {
                    cnt = buffer.readShort();
                    this._polygonPoints = [];
                    this._polygonPoints.length = cnt;
                    for (i = 0; i < cnt; i++)
                        this._polygonPoints[i] = buffer.readFloat();
                }
                else if (this._type == 4) {
                    this._sides = buffer.readShort();
                    this._startAngle = buffer.readFloat();
                    cnt = buffer.readShort();
                    if (cnt > 0) {
                        this._distances = [];
                        for (i = 0; i < cnt; i++)
                            this._distances[i] = buffer.readFloat();
                    }
                }

                this.updateGraph();
            }
        }
    }
}